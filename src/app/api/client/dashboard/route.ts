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

// Assuming MOCK_DATA or individual mock arrays are available via other imports or context if needed for fallback
// If not, define a minimal fallback structure here
const FALLBACK_DATA = { 
    maturityScores: [], 
    growthMetrics: [], 
    projects: [], 
    assessments: [], 
    roiCalculations: [] 
};

export async function GET(request: NextRequest) {
  // 1. Verify User Authentication via Authorization header
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    console.warn('[API/dashboard] Unauthorized: Missing token. Returning empty fallback data.');
    // For security, don't return mock data if unauthenticated in production
    // You might want a specific error or redirect logic on the frontend
    return NextResponse.json({ message: 'Auth token missing', usedMockData: true, ...FALLBACK_DATA }, { status: 401 }); // Return 401
  }
  const idToken = authorization.split('Bearer ')[1];
  
  let decodedToken;
  try {
    if (!adminAuth) throw new Error("Firebase Admin Auth is not initialized.");
    decodedToken = await adminAuth.verifyIdToken(idToken);
  } catch (error) {
    console.error('[API/dashboard] Error verifying auth token:', error);
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
  
  const uid = decodedToken.uid;
  if (!uid) {
    console.error('[API/dashboard] Auth token decoded but UID is missing.');
    return NextResponse.json({ error: 'Unauthorized: Could not resolve user' }, { status: 401 });
  }

  // --- User is Authenticated ---
  console.log(`[API/dashboard] Authenticated user: ${uid}`);

  try {
    if (!adminDb) throw new Error("Firebase Admin DB is not initialized.");
    const db = adminDb;

    // 2. Find Client ID from 'users' collection
    const userDocRef = db.collection('users').doc(uid);
    const userDocSnap = await userDocRef.get();

    if (!userDocSnap.exists) {
      console.warn(`[API/dashboard] User document not found for UID: ${uid}. Returning empty fallback.`);
      return NextResponse.json({ message: 'User data link not found', usedMockData: true, ...FALLBACK_DATA }, { status: 200 }); // 200 but indicate fallback
    }

    const clientId = userDocSnap.data()?.clientId;
    if (!clientId) {
      console.warn(`[API/dashboard] Client ID not found in user doc UID: ${uid}. Returning empty fallback.`);
      return NextResponse.json({ message: 'Client ID link not found', usedMockData: true, ...FALLBACK_DATA }, { status: 200 });
    }

    // 3. Fetch Dashboard Data from 'clients/{clientId}'
    const clientDocRef = db.collection('clients').doc(clientId);
    const clientDocSnap = await clientDocRef.get();

    if (!clientDocSnap.exists) {
      console.warn(`[API/dashboard] Client document not found: ${clientId}. Returning empty fallback.`);
      return NextResponse.json({ message: 'Client data not found', usedMockData: true, ...FALLBACK_DATA }, { status: 200 });
    }

    const dashboardData = clientDocSnap.data()?.dashboardData;
    if (!dashboardData) {
      console.warn(`[API/dashboard] dashboardData field missing: ${clientId}. Returning empty fallback.`);
      return NextResponse.json({ message: 'Dashboard data structure missing', usedMockData: true, ...FALLBACK_DATA }, { status: 200 });
    }

    // 4. Return Real Data
    console.log(`[API/dashboard] Successfully fetched data for UID: ${uid}, ClientID: ${clientId}`);
    return NextResponse.json({ 
        usedMockData: false,
        maturityScores: dashboardData.maturityScores || [],
        growthMetrics: dashboardData.growthMetrics || [],
        projects: dashboardData.implementationProjects || [], // Ensure this field name matches Firestore
        assessments: dashboardData.assessments || [],
        roiCalculations: dashboardData.roiCalculations || []
     }, { status: 200 });

  } catch (error) {
    console.error('[API/dashboard] Server Error fetching client dashboard data:', error);
    return NextResponse.json({ 
        message: 'Server error fetching data.',
        error: 'Internal Server Error', 
        usedMockData: true, // Indicate fallback even on server error
        ...FALLBACK_DATA
    }, { status: 500 });
  }
} 