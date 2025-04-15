import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';
import { devFlags } from '@/lib/config/development';

// Helper function for type checking environment
const isDevEnvironment = () => (process.env.NODE_ENV as string) === 'development';

// Helper function to check if Firebase Admin is properly initialized
const isFirebaseAdminAvailable = () => {
  return !!adminAuth && !!adminDb;
};

// Mock data for data sources
const mockDataSources = [
  { 
    name: 'CRM Connection', 
    status: 'connected',
    lastChecked: new Date().toISOString()
  },
  { 
    name: 'Analytics Platform', 
    status: 'pending',
    lastChecked: new Date().toISOString()
  },
  { 
    name: 'ERP System', 
    status: 'connected',
    lastChecked: new Date().toISOString()
  },
  { 
    name: 'Marketing Automation', 
    status: 'failed',
    lastChecked: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  console.log("[API/data-sources] Received GET request");

  // 1. Verify Firebase Admin SDK Initialization
  if (!isFirebaseAdminAvailable()) {
    console.error("[API/data-sources] Firebase Admin SDK not initialized");
    return NextResponse.json(
      { 
        error: 'Service Unavailable', 
        message: 'Backend services currently unavailable', 
        success: false,
        usedMockData: true,
        dataSources: mockDataSources.slice(0, 3) // Send only first 3 mock sources
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
    console.warn('[API/data-sources] No auth token provided');
    
    // In development, we can return mock data even without authentication
    if (isDevEnvironment() && devFlags.useMockData) {
      console.log('[API/data-sources] Development mode: returning mock data without authentication');
      return NextResponse.json(
        { 
          message: 'Debug: No auth token', 
          success: true,
          usedMockData: true,
          dataSources: mockDataSources.slice(0, 3) 
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
    
    console.log(`[API/data-sources] Authenticated user: ${uid}`);
    
    // 4. Fetch data source status from Firestore
    try {
      // If still in development mode and flag is set, return mock data even with auth
      if (isDevEnvironment() && devFlags.useMockData) {
        console.log('[API/data-sources] Development mode: returning mock data with auth');
        return NextResponse.json(
          { 
            message: 'Using mock data (development mode)',
            success: true,
            usedMockData: true,
            dataSources: mockDataSources
          }, 
          { status: 200 }
        );
      }
      
      // Fetch actual user data from Firestore to verify user exists
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        console.warn(`[API/data-sources] User ${uid} not found in database`);
        return NextResponse.json(
          { 
            error: 'User not found', 
            success: false,
            usedMockData: true, 
            dataSources: mockDataSources.slice(0, 3)
          }, 
          { status: 404 }
        );
      }
      
      // Fetch data sources
      const dataSourcesDoc = await db.collection('dataSources').where('userId', '==', uid).orderBy('lastChecked', 'desc').get();
      
      if (dataSourcesDoc.empty) {
        console.log(`[API/data-sources] No data sources for user ${uid}, returning mock data`);
        return NextResponse.json(
          { 
            message: 'No data sources found',
            success: true,
            usedMockData: true,
            dataSources: mockDataSources.slice(0, 3)
          }, 
          { status: 200 }
        );
      }
      
      // Process the query results
      const dataSources = dataSourcesDoc.docs.map(doc => doc.data());
      
      return NextResponse.json(
        { 
          success: true,
          usedMockData: false,
          dataSources
        }, 
        { status: 200 }
      );
      
    } catch (error) {
      console.error('[API/data-sources] Error fetching data:', error);
      return NextResponse.json(
        { 
          error: 'Internal Server Error', 
          message: 'Failed to fetch data sources',
          success: false,
          usedMockData: true, 
          dataSources: mockDataSources.slice(0, 3)
        }, 
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[API/data-sources] Token verification failed:', error);
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token', success: false }, 
      { status: 401 }
    );
  }
} 