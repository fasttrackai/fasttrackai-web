import { NextRequest, NextResponse } from 'next/server';
// Comment out admin imports for testing
// import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';
import { mockAssessments, mockRoiData, devFlags } from '@/lib/config/development';

// Helper function for type checking environment
const isDevEnvironment = () => (process.env.NODE_ENV as string) === 'development';

// Helper function to check if Firebase Admin is properly initialized
const isFirebaseAdminAvailable = () => {
  // Comment out admin imports for testing
  // return !!adminAuth && !!adminDb;
  return false; // Placeholder return, actual implementation needed
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

export async function GET(request: NextRequest) {
  console.log("[API/dashboard] Received GET request (DEBUG MODE - Admin SDK Disabled).");

  // 1. Verify Firebase Admin SDK Initialization - TEMPORARILY BYPASSED
  /*
  if (!adminAuth || !adminDb) {
    // ... return 503 ...
  }
  */
  console.log("[API/dashboard] Skipping Admin SDK check for debugging.");

  // 2. Verify User Authentication - TEMPORARILY BYPASSED (Return mock)
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
     console.warn('[API/dashboard] Debug: No token found, returning mock.');
     return NextResponse.json({ message: 'Debug: No auth token', usedMockData: true, ...getMockDashboardData() }, { status: 200 }); 
  }
  // Skip token verification for now
  console.log("[API/dashboard] Debug: Bypassing token verification, returning mock.");
  return NextResponse.json({ message: 'Debug: Bypassed token check', usedMockData: true, ...getMockDashboardData() }, { status: 200 });

  /* --- Original Logic (Commented Out) ---
  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(idToken);
  } catch (error) {      
     return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
  const uid = decodedToken.uid;
  // ... rest of checks ...

  try {
    const db = adminDb;
    // ... Firestore fetching logic ...
    return NextResponse.json({ usedMockData: false, ...data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', usedMockData: true, ...getMockDashboardData() }, { status: 500 });
  }
  */
} 