import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';
import { devFlags } from '@/lib/config/development';

// Helper function for type checking environment
const isDevEnvironment = () => (process.env.NODE_ENV as string) === 'development';

// Helper function to check if Firebase Admin is properly initialized
const isFirebaseAdminAvailable = () => {
  return !!adminAuth && !!adminDb;
};

// Types
type Saving = {
  category: string;
  amount: number;
  percentChange: number;
  trend: 'up' | 'down';
  timeframe: string;
};

// Create a consistent response format for mock data
function getMockSavingsData() {
  return {
    savings: [
      {
        category: 'Labor Hours',
        amount: 240,
        percentChange: 15,
        trend: 'down',
        timeframe: 'Monthly'
      },
      {
        category: 'Process Costs',
        amount: 18500,
        percentChange: 22,
        trend: 'down',
        timeframe: 'Quarterly'
      },
      {
        category: 'Error Reduction',
        amount: 85,
        percentChange: 35,
        trend: 'down',
        timeframe: 'Quarterly'
      }
    ],
    totalProjected: 235000 // Annual projected savings in USD
  };
}

export async function GET(request: NextRequest) {
  console.log("[API/client/savings] Received GET request");

  // 1. Verify Firebase Admin SDK Initialization
  if (!isFirebaseAdminAvailable()) {
    console.error("[API/client/savings] Firebase Admin SDK not initialized");
    return NextResponse.json(
      { 
        error: 'Service Unavailable', 
        message: 'Backend services currently unavailable', 
        usedMockData: true,
        ...getMockSavingsData()
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
    console.warn('[API/client/savings] No auth token provided');
    
    // In development, we can return mock data even without authentication
    if (isDevEnvironment() && devFlags.useMockData) {
      console.log('[API/client/savings] Development mode: returning mock data without authentication');
      return NextResponse.json(
        { 
          message: 'Debug: No auth token', 
          usedMockData: true, 
          ...getMockSavingsData() 
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
    
    console.log(`[API/client/savings] Authenticated user: ${uid}`);
    
    // 4. Fetch real data from Firestore
    try {
      // If still in development mode and flag is set, return mock data even with auth
      if (isDevEnvironment() && devFlags.useMockData) {
        console.log('[API/client/savings] Development mode: returning mock data with auth');
        return NextResponse.json(
          { 
            message: 'Using mock data (development mode)',
            usedMockData: true,
            ...getMockSavingsData()
          }, 
          { status: 200 }
        );
      }
      
      // Fetch actual user data from Firestore
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        console.warn(`[API/client/savings] User ${uid} not found in database`);
        return NextResponse.json(
          { error: 'User not found', usedMockData: true, ...getMockSavingsData() }, 
          { status: 404 }
        );
      }
      
      // Fetch savings data from Firestore
      const savingsSnapshot = await db.collection('savings')
        .where('userId', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(3)
        .get();
      
      // Process query results
      if (savingsSnapshot.empty) {
        console.log(`[API/client/savings] No savings data found for user ${uid}, using mock data`);
        return NextResponse.json(
          { 
            message: 'No savings data found',
            usedMockData: true,
            ...getMockSavingsData()
          }, 
          { status: 200 }
        );
      }
      
      const savings = savingsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          category: data.category,
          amount: data.amount,
          percentChange: data.percentChange,
          trend: data.trend,
          timeframe: data.timeframe
        };
      });
      
      // Get total projected savings from a separate document
      const projectionDoc = await db.collection('projections').doc(uid).get();
      const totalProjected = projectionDoc.exists ? 
        projectionDoc.data()?.annualSavings || 0 : 
        getMockSavingsData().totalProjected;
      
      return NextResponse.json(
        { 
          usedMockData: !projectionDoc.exists, 
          savings,
          totalProjected
        }, 
        { status: 200 }
      );
      
    } catch (error) {
      console.error('[API/client/savings] Error fetching data:', error);
      return NextResponse.json(
        { 
          error: 'Internal Server Error', 
          message: 'Failed to fetch savings data',
          usedMockData: true, 
          ...getMockSavingsData() 
        }, 
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[API/client/savings] Token verification failed:', error);
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token' }, 
      { status: 401 }
    );
  }
} 