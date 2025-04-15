import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase/firebaseAdmin';
import { devFlags } from '@/lib/config/development';

// Helper function for type checking environment
const isDevEnvironment = () => (process.env.NODE_ENV as string) === 'development';

// Get Firebase admin instance for firestore and auth
const { db, auth } = getFirebaseAdmin();

// Mock data for automation potential
const mockAutomationPotential = {
  potentialScore: 75,
  category: 'High',
  recommendedNextSteps: [
    'Deploy machine learning for demand forecasting',
    'Implement intelligent document processing',
    'Automate inventory management'
  ],
  lastAssessment: new Date().toISOString().split('T')[0] // Today's date
};

/**
 * Fetches automation potential data for a client
 * GET /api/client/automation-potential
 */
export async function GET(request: NextRequest) {
  console.log("[API/automation-potential] Received GET request");
  
  // Check if Firebase Admin is properly initialized
  if (!auth || !db) {
    console.error("[API/automation-potential] Firebase Admin SDK not initialized");
    return NextResponse.json(
      { 
        error: 'Service Unavailable', 
        message: 'Backend services currently unavailable', 
        success: false,
        usedMockData: true,
        automationData: mockAutomationPotential
      }, 
      { status: 503 }
    );
  }
  
  // 1. Extract authorization token
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('[API/automation-potential] No valid Authorization header');
    
    // If in development mode and flag set, return mock data
    if (isDevEnvironment() && devFlags.useMockData) {
      console.log('[API/automation-potential] Development mode: returning mock data without auth');
      return NextResponse.json(
        { 
          message: 'Using mock data (development mode without auth)',
          success: true,
          usedMockData: true,
          automationData: mockAutomationPotential
        }, 
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: 'Unauthorized', success: false }, 
      { status: 401 }
    );
  }
  
  // 2. Extract token
  const idToken = authHeader.split('Bearer ')[1];
  
  if (!idToken) {
    console.warn('[API/automation-potential] Empty token provided');
    return NextResponse.json(
      { error: 'Invalid token', success: false }, 
      { status: 401 }
    );
  }
  
  try {
    // 3. Authenticate the token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    console.log(`[API/automation-potential] Authenticated user: ${uid}`);
    
    // 4. Fetch automation potential data from Firestore
    try {
      // If still in development mode and flag is set, return mock data even with auth
      if (isDevEnvironment() && devFlags.useMockData) {
        console.log('[API/automation-potential] Development mode: returning mock data with auth');
        return NextResponse.json(
          { 
            message: 'Using mock data (development mode)',
            success: true,
            usedMockData: true,
            automationData: mockAutomationPotential
          }, 
          { status: 200 }
        );
      }
      
      // Fetch actual user data from Firestore to verify user exists
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        console.warn(`[API/automation-potential] User ${uid} not found in database`);
        return NextResponse.json(
          { 
            error: 'User not found', 
            success: false,
            usedMockData: true, 
            automationData: mockAutomationPotential
          }, 
          { status: 404 }
        );
      }
      
      // Fetch automation potential data
      const automationDoc = await db.collection('clientData').doc(uid).collection('assessments').doc('automationPotential').get();
      
      if (!automationDoc.exists) {
        console.log(`[API/automation-potential] No automation data for user ${uid}, returning mock data`);
        return NextResponse.json(
          { 
            message: 'No automation data found',
            success: true,
            usedMockData: true,
            automationData: mockAutomationPotential
          }, 
          { status: 200 }
        );
      }
      
      // Return the actual data from Firestore
      const automationData = automationDoc.data();
      
      return NextResponse.json(
        {
          success: true,
          usedMockData: false,
          automationData
        },
        { status: 200 }
      );
      
    } catch (dbError: any) {
      console.error(`[API/automation-potential] Database error: ${dbError.message}`);
      return NextResponse.json(
        { 
          error: 'Database error', 
          success: false,
          usedMockData: true,
          automationData: mockAutomationPotential
        }, 
        { status: 500 }
      );
    }
    
  } catch (authError: any) {
    console.error(`[API/automation-potential] Auth error: ${authError.message}`);
    
    // For development purposes without proper auth setup
    if (isDevEnvironment()) {
      console.log('[API/automation-potential] Development mode: returning mock data after auth error');
      return NextResponse.json(
        { 
          message: 'Using mock data (auth error in development)',
          success: true,
          usedMockData: true,
          automationData: mockAutomationPotential
        }, 
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: 'Authentication failed', success: false }, 
      { status: 403 }
    );
  }
} 