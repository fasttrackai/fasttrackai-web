import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';
import { devFlags } from '@/lib/config/development';

// Helper function for type checking environment
const isDevEnvironment = () => (process.env.NODE_ENV as string) === 'development';

// Helper function to check if Firebase Admin is properly initialized
const isFirebaseAdminAvailable = () => {
  return !!adminAuth && !!adminDb;
};

// Mock data for AI opportunities
const mockOpportunities = [
  { 
    id: "opp1",
    description: "Enhance customer support responsiveness through AI chat capabilities.",
    impact: "high",
    category: "customer-service"
  },
  { 
    id: "opp2",
    description: "Automate repetitive data entry tasks using intelligent form processing.",
    impact: "medium",
    category: "process-automation"
  },
  { 
    id: "opp3",
    description: "Leverage predictive analytics for inventory management.",
    impact: "high",
    category: "business-analytics"
  },
  { 
    id: "opp4",
    description: "Deploy automated document classification and routing.",
    impact: "medium",
    category: "process-automation"
  },
  { 
    id: "opp5",
    description: "Implement sentiment analysis on customer feedback channels.",
    impact: "low",
    category: "customer-service"
  }
];

export async function GET(request: NextRequest) {
  console.log("[API/opportunities] Received GET request");

  // 1. Verify Firebase Admin SDK Initialization
  if (!isFirebaseAdminAvailable()) {
    console.error("[API/opportunities] Firebase Admin SDK not initialized");
    return NextResponse.json(
      { 
        error: 'Service Unavailable', 
        message: 'Backend services currently unavailable', 
        success: false,
        usedMockData: true,
        opportunities: mockOpportunities.slice(0, 2) // Send only first 2 mock opportunities
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
    console.warn('[API/opportunities] No auth token provided');
    
    // In development, we can return mock data even without authentication
    if (isDevEnvironment() && devFlags.useMockData) {
      console.log('[API/opportunities] Development mode: returning mock data without authentication');
      return NextResponse.json(
        { 
          message: 'Debug: No auth token', 
          success: true,
          usedMockData: true,
          opportunities: mockOpportunities.slice(0, 2) 
        }, 
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: 'Unauthorized: No token provided', success: false }, 
      { status: 401 }
    );
  }

  const idToken = authorization.split('Bearer ')[1];
  
  try {
    // 3. Authenticate the token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    console.log(`[API/opportunities] Authenticated user: ${uid}`);
    
    // 4. Fetch opportunities from Firestore
    try {
      // If still in development mode and flag is set, return mock data even with auth
      if (isDevEnvironment() && devFlags.useMockData) {
        console.log('[API/opportunities] Development mode: returning mock data with auth');
        return NextResponse.json(
          { 
            message: 'Using mock data (development mode)',
            success: true,
            usedMockData: true,
            opportunities: mockOpportunities
          }, 
          { status: 200 }
        );
      }
      
      // Fetch actual user data from Firestore to verify user exists
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        console.warn(`[API/opportunities] User ${uid} not found in database`);
        return NextResponse.json(
          { 
            error: 'User not found', 
            success: false,
            usedMockData: true, 
            opportunities: mockOpportunities.slice(0, 2)
          }, 
          { status: 404 }
        );
      }
      
      // Fetch opportunities data
      const opportunitiesQuery = await db.collection('opportunities')
        .where('userId', '==', uid)
        .orderBy('impact', 'desc')
        .limit(10)
        .get();
      
      if (opportunitiesQuery.empty) {
        console.log(`[API/opportunities] No opportunities for user ${uid}, returning mock data`);
        return NextResponse.json(
          { 
            message: 'No opportunities found',
            success: true,
            usedMockData: true,
            opportunities: mockOpportunities.slice(0, 2)
          }, 
          { status: 200 }
        );
      }
      
      // Process the query results
      const opportunities = opportunitiesQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return NextResponse.json(
        { 
          success: true,
          usedMockData: false,
          opportunities
        }, 
        { status: 200 }
      );
      
    } catch (error) {
      console.error('[API/opportunities] Error fetching data:', error);
      return NextResponse.json(
        { 
          error: 'Internal Server Error', 
          message: 'Failed to fetch opportunities',
          success: false,
          usedMockData: true, 
          opportunities: mockOpportunities.slice(0, 2)
        }, 
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[API/opportunities] Token verification failed:', error);
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token', success: false }, 
      { status: 401 }
    );
  }
} 