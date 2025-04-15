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

export async function GET(request: NextRequest) {
  console.log("[API/dashboard] Received GET request");

  // 1. Verify Firebase Admin SDK Initialization
  if (!isFirebaseAdminAvailable()) {
    console.error("[API/dashboard] Firebase Admin SDK not initialized");
    return NextResponse.json(
      { 
        error: 'Service Unavailable', 
        message: 'Backend services currently unavailable', 
        usedMockData: true,
        ...getMockDashboardData()
      }, 
      { status: 503 }
    );
  }

  // Since we've checked that adminAuth and adminDb are not null above, we can safely assert they are non-null
  const auth = adminAuth!;
  const db = adminDb!;

  // 2. Verify User Authentication
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    console.warn('[API/dashboard] No auth token provided');
    
    // In development, we can return mock data even without authentication
    if (isDevEnvironment() && devFlags.useMockData) {
      console.log('[API/dashboard] Development mode: returning mock data without authentication');
      return NextResponse.json(
        { 
          message: 'Debug: No auth token', 
          usedMockData: true, 
          ...getMockDashboardData() 
        }, 
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: 'Unauthorized: No token provided' }, 
      { status: 401 }
    );
  }

  const idToken = authorization.split('Bearer ')[1];
  
  try {
    // 3. Authenticate the token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    console.log(`[API/dashboard] Authenticated user: ${uid}`);
    
    // 4. Fetch real data from Firestore
    try {
      // If still in development mode and flag is set, return mock data even with auth
      if (isDevEnvironment() && devFlags.useMockData) {
        console.log('[API/dashboard] Development mode: returning mock data with auth');
        return NextResponse.json(
          { 
            message: 'Using mock data (development mode)',
            usedMockData: true,
            ...getMockDashboardData()
          }, 
          { status: 200 }
        );
      }
      
      // Fetch actual user data from Firestore
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        console.warn(`[API/dashboard] User ${uid} not found in database`);
        return NextResponse.json(
          { error: 'User not found', usedMockData: true, ...getMockDashboardData() }, 
          { status: 404 }
        );
      }
      
      const userData = userDoc.data();
      
      // 5. Fetch all dashboard data
      const [
        maturityScoresDoc,
        growthMetricsDoc,
        projectsDoc,
        assessmentsDoc,
        roiCalculationsDoc
      ] = await Promise.all([
        db.collection('maturityScores').where('userId', '==', uid).orderBy('createdAt', 'desc').limit(4).get(),
        db.collection('growthMetrics').where('userId', '==', uid).orderBy('date', 'desc').limit(4).get(),
        db.collection('projects').where('userId', '==', uid).orderBy('updatedAt', 'desc').limit(4).get(),
        db.collection('assessments').where('userId', '==', uid).orderBy('completedAt', 'desc').limit(1).get(),
        db.collection('roiCalculations').where('userId', '==', uid).orderBy('calculatedAt', 'desc').limit(1).get()
      ]);
      
      // Process query results
      const maturityScores = maturityScoresDoc.docs.map(doc => doc.data());
      const growthMetrics = growthMetricsDoc.docs.map(doc => doc.data());
      const projects = projectsDoc.docs.map(doc => doc.data());
      const assessments = assessmentsDoc.docs.map(doc => doc.data());
      const roiCalculations = roiCalculationsDoc.docs.map(doc => doc.data());
      
      // If any data is missing, fall back to mock data for that section
      const realData = {
        maturityScores: maturityScores.length > 0 ? maturityScores : getMockDashboardData().maturityScores,
        growthMetrics: growthMetrics.length > 0 ? growthMetrics : getMockDashboardData().growthMetrics,
        projects: projects.length > 0 ? projects : getMockDashboardData().projects,
        assessments: assessments.length > 0 ? assessments : getMockDashboardData().assessments,
        roiCalculations: roiCalculations.length > 0 ? roiCalculations : getMockDashboardData().roiCalculations
      };
      
      // Track if we're using any mock data
      const usedMockData = (
        maturityScores.length === 0 || 
        growthMetrics.length === 0 || 
        projects.length === 0 || 
        assessments.length === 0 || 
        roiCalculations.length === 0
      );
      
      return NextResponse.json(
        { 
          usedMockData, 
          ...realData 
        }, 
        { status: 200 }
      );
      
    } catch (error) {
      console.error('[API/dashboard] Error fetching data:', error);
      return NextResponse.json(
        { 
          error: 'Internal Server Error', 
          message: 'Failed to fetch dashboard data',
          usedMockData: true, 
          ...getMockDashboardData() 
        }, 
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[API/dashboard] Token verification failed:', error);
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token' }, 
      { status: 401 }
    );
  }
} 