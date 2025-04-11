import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';
import { mockAssessments, mockRoiData, devFlags } from '@/lib/config/development';

// Helper function for type checking environment
const isDevEnvironment = () => (process.env.NODE_ENV as string) === 'development';

// Helper function to check if Firebase Admin is properly initialized
const isFirebaseAdminAvailable = () => {
  return !!adminAuth && !!adminDb;
};

// Create a consistent response format for mock data
function getMockDashboardData() {
  return {
    maturityScores: [
      { category: 'Data Readiness', score: 68, improvement: 12, lastUpdated: '2023-11-15' },
      { category: 'Technology Stack', score: 73, improvement: 8, lastUpdated: '2023-11-15' },
      { category: 'Process Integration', score: 62, improvement: 15, lastUpdated: '2023-11-15' },
      { category: 'Team Capabilities', score: 57, improvement: 10, lastUpdated: '2023-11-15' }
    ],
    growthMetrics: [
      { label: 'Customer Satisfaction', current: 92, previous: 86, unit: '%', trend: 'up', percentChange: 7 },
      { label: 'Response Time', current: 2.8, previous: 4.5, unit: 'hours', trend: 'down', percentChange: 38 },
      { label: 'Process Efficiency', current: 78, previous: 65, unit: '%', trend: 'up', percentChange: 20 },
      { label: 'Cost Reduction', current: 22, previous: 15, unit: '%', trend: 'up', percentChange: 47 }
    ],
    projects: [
      { name: 'Data Integration', status: 'in-progress', progress: 65, daysRemaining: 12 },
      { name: 'Model Training', status: 'planning', progress: 25, daysRemaining: 30 },
      { name: 'Dashboard Setup', status: 'review', progress: 90, daysRemaining: 3 },
      { name: 'Process Automation', status: 'completed', progress: 100, daysRemaining: 0 }
    ],
    assessments: mockAssessments.length > 0 ? mockAssessments : [],
    roiCalculations: mockRoiData.length > 0 ? mockRoiData : []
  };
}

// Define a minimal structure for fallback data
const FALLBACK_DATA = { 
    maturityScores: [], 
    growthMetrics: [], 
    projects: [], 
    assessments: [], 
    roiCalculations: [] 
};

export async function GET(request: NextRequest) {
  console.log("[API/dashboard] Received GET request.");

  // 1. Verify Firebase Admin SDK Initialization
  if (!adminAuth || !adminDb) {
    console.error('[API/dashboard] FATAL: Firebase Admin SDK not initialized.');
    // Return 503 Service Unavailable if the server itself is misconfigured
    return NextResponse.json({ 
        error: 'Server configuration error.', 
        message: 'Firebase Admin SDK failed to initialize.',
        usedMockData: true, // Indicate fallback
        ...FALLBACK_DATA 
    }, { status: 503 });
  }
  console.log("[API/dashboard] Firebase Admin SDK seems initialized.");

  // 2. Verify User Authentication via Authorization header
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    console.warn('[API/dashboard] Unauthorized: Missing token.');
    // If no token, return 401 - frontend should handle this (e.g., show login)
    return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
  }
  const idToken = authorization.split('Bearer ')[1];
  
  let decodedToken;
  try {
    console.log("[API/dashboard] Verifying ID token...");
    decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log(`[API/dashboard] Token verified successfully for UID: ${decodedToken.uid}`);
  } catch (error) {
    console.error('[API/dashboard] Error verifying auth token:', error);
    // If token is invalid (expired, wrong signature, etc.), return 401
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
  
  const uid = decodedToken.uid;
  if (!uid) {
    // This case is unlikely if verifyIdToken succeeded, but good to check.
    console.error('[API/dashboard] Auth token valid but UID is missing.');
    return NextResponse.json({ error: 'Unauthorized: Cannot identify user from token' }, { status: 401 });
  }

  // --- User is Authenticated --- 
  console.log(`[API/dashboard] Proceeding to fetch data for authenticated user: ${uid}`);

  try {
    const db = adminDb;

    // 3. Find Client ID from 'users' collection
    console.log(`[API/dashboard] Looking up user document: users/${uid}`);
    const userDocRef = db.collection('users').doc(uid);
    const userDocSnap = await userDocRef.get();

    if (!userDocSnap.exists) {
      console.warn(`[API/dashboard] User document not found for UID: ${uid}. Cannot link to client data.`);
      // Return an error or specific status if user-client link is mandatory
      return NextResponse.json({ 
          error: 'User-Client link not found.', 
          message: 'Could not find client association for this user.',
          usedMockData: true, // Indicate fallback state
          ...FALLBACK_DATA 
      }, { status: 404 }); // 404 might be appropriate here
    }

    const clientId = userDocSnap.data()?.clientId;
    if (!clientId) {
      console.warn(`[API/dashboard] Client ID field missing in user doc for UID: ${uid}.`);
      return NextResponse.json({ 
          error: 'Client ID missing in user profile.',
          message: 'Could not find client association for this user.',
          usedMockData: true, 
          ...FALLBACK_DATA 
      }, { status: 404 }); 
    }
    console.log(`[API/dashboard] Found ClientID: ${clientId} for UID: ${uid}`);

    // 4. Fetch Dashboard Data from 'clients/{clientId}'
    console.log(`[API/dashboard] Fetching client document: clients/${clientId}`);
    const clientDocRef = db.collection('clients').doc(clientId);
    const clientDocSnap = await clientDocRef.get();

    if (!clientDocSnap.exists) {
      console.warn(`[API/dashboard] Client document not found: ${clientId}.`);
      return NextResponse.json({ 
          error: 'Client data not found.',
          message: 'No dashboard data found for this client.',
          usedMockData: true, 
          ...FALLBACK_DATA 
      }, { status: 404 });
    }

    const dashboardData = clientDocSnap.data()?.dashboardData;
    if (!dashboardData) {
      console.warn(`[API/dashboard] dashboardData field missing in client doc: ${clientId}.`);
       return NextResponse.json({ 
          error: 'Dashboard data format error.',
          message: 'Client data exists but dashboard structure is missing.',
          usedMockData: true, 
          ...FALLBACK_DATA 
      }, { status: 404 }); // Or 500 if this is considered a server config error
    }

    // 5. Return Real Data
    console.log(`[API/dashboard] Successfully fetched real data for ClientID: ${clientId}`);
    return NextResponse.json({ 
        usedMockData: false, // Explicitly false
        // Ensure field names match what the frontend expects
        maturityScores: dashboardData.maturityScores || [],
        growthMetrics: dashboardData.growthMetrics || [],
        projects: dashboardData.implementationProjects || [], // Sending as 'projects'
        assessments: dashboardData.assessments || [],
        roiCalculations: dashboardData.roiCalculations || []
     }, { status: 200 });

  } catch (error) {
    console.error('[API/dashboard] Server Error during Firestore fetch:', error);
    return NextResponse.json({ 
        error: 'Internal Server Error', 
        message: 'Failed to retrieve dashboard data due to a server issue.',
        usedMockData: true, // Fallback indicator
        ...FALLBACK_DATA 
    }, { status: 500 });
  }
} 