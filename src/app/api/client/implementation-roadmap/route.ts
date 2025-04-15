import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';
import { devFlags } from '@/lib/config/development';

// Helper function for type checking environment
const isDevEnvironment = () => (process.env.NODE_ENV as string) === 'development';

// Helper function to check if Firebase Admin is properly initialized
const isFirebaseAdminAvailable = () => {
  return !!adminAuth && !!adminDb;
};

// Mock implementation progress data for development and fallback
const mockImplementationProgress = {
  phases: [
    {
      id: "phase-1",
      name: "Discovery & Assessment",
      description: "Initial assessment of AI readiness and opportunity identification",
      completion: 100,
      tasks: [
        {
          id: "task-1-1",
          name: "Business Process Analysis",
          description: "Analyze current business processes to identify automation opportunities",
          status: "completed",
          estimatedTime: "2 weeks",
          dependencies: []
        },
        {
          id: "task-1-2",
          name: "Data Readiness Assessment",
          description: "Evaluate data quality, accessibility, and governance",
          status: "completed",
          estimatedTime: "1 week",
          dependencies: ["task-1-1"]
        },
        {
          id: "task-1-3",
          name: "Opportunity Prioritization",
          description: "Rank AI implementation opportunities by ROI and feasibility",
          status: "completed",
          estimatedTime: "3 days",
          dependencies: ["task-1-1", "task-1-2"]
        }
      ]
    },
    {
      id: "phase-2",
      name: "Planning & Design",
      description: "Detailed planning and solution architecture",
      completion: 75,
      tasks: [
        {
          id: "task-2-1",
          name: "Solution Architecture",
          description: "Design technical architecture for AI implementations",
          status: "completed",
          estimatedTime: "2 weeks",
          dependencies: ["task-1-3"]
        },
        {
          id: "task-2-2",
          name: "Data Pipeline Design",
          description: "Design data flows and integration points",
          status: "in-progress",
          estimatedTime: "1 week",
          dependencies: ["task-2-1"]
        },
        {
          id: "task-2-3",
          name: "Implementation Roadmap",
          description: "Create detailed implementation timeline and resource plan",
          status: "pending",
          estimatedTime: "1 week",
          dependencies: ["task-2-1", "task-2-2"]
        }
      ]
    },
    {
      id: "phase-3",
      name: "Implementation",
      description: "Development and deployment of AI solutions",
      completion: 10,
      tasks: [
        {
          id: "task-3-1",
          name: "Data Infrastructure Setup",
          description: "Set up data warehousing and processing infrastructure",
          status: "in-progress",
          estimatedTime: "3 weeks",
          dependencies: ["task-2-2"]
        },
        {
          id: "task-3-2",
          name: "AI Model Development",
          description: "Develop and train AI models",
          status: "pending",
          estimatedTime: "4 weeks",
          dependencies: ["task-3-1"]
        }
      ]
    }
  ]
};

export async function GET(request: NextRequest) {
  console.log("[API/implementation-roadmap] Received GET request");

  // 1. Verify Firebase Admin SDK Initialization
  if (!isFirebaseAdminAvailable()) {
    console.error("[API/implementation-roadmap] Firebase Admin SDK not initialized");
    return NextResponse.json(
      { 
        error: 'Service Unavailable', 
        message: 'Backend services currently unavailable', 
        success: false,
        usedMockData: true,
        data: { implementationProgress: mockImplementationProgress }
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
    console.warn('[API/implementation-roadmap] No auth token provided');
    
    // In development, we can return mock data even without authentication
    if (isDevEnvironment() && devFlags.useMockData) {
      console.log('[API/implementation-roadmap] Development mode: returning mock data without authentication');
      return NextResponse.json(
        { 
          message: 'Debug: No auth token', 
          success: true,
          usedMockData: true,
          data: { implementationProgress: mockImplementationProgress }
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
    
    console.log(`[API/implementation-roadmap] Authenticated user: ${uid}`);
    
    // 4. Fetch roadmap data from Firestore
    try {
      // If still in development mode and flag is set, return mock data even with auth
      if (isDevEnvironment() && devFlags.useMockData) {
        console.log('[API/implementation-roadmap] Development mode: returning mock data with auth');
        return NextResponse.json(
          { 
            message: 'Using mock data (development mode)',
            success: true,
            usedMockData: true,
            data: { implementationProgress: mockImplementationProgress }
          }, 
          { status: 200 }
        );
      }
      
      // Fetch actual user data from Firestore to verify user exists
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        console.warn(`[API/implementation-roadmap] User ${uid} not found in database`);
        return NextResponse.json(
          { 
            error: 'User not found', 
            success: false,
            usedMockData: true, 
            data: { implementationProgress: mockImplementationProgress }
          }, 
          { status: 404 }
        );
      }
      
      // Fetch implementation roadmap data
      const implementationDoc = await db.collection('implementation').doc(uid).get();
      
      if (!implementationDoc.exists) {
        console.log(`[API/implementation-roadmap] No implementation data for user ${uid}, returning mock data`);
        return NextResponse.json(
          { 
            message: 'No implementation data found',
            success: true,
            usedMockData: true,
            data: { implementationProgress: mockImplementationProgress }
          }, 
          { status: 200 }
        );
      }
      
      const implementationData = implementationDoc.data();
      
      // Check if the implementation data contains the expected structure
      if (!implementationData || !implementationData.progress || !implementationData.progress.phases) {
        console.warn(`[API/implementation-roadmap] Invalid implementation data structure for user ${uid}`);
        return NextResponse.json(
          { 
            message: 'Invalid implementation data structure',
            success: true,
            usedMockData: true,
            data: { implementationProgress: mockImplementationProgress }
          }, 
          { status: 200 }
        );
      }
      
      // Return the actual implementation data
      return NextResponse.json(
        { 
          success: true,
          usedMockData: false,
          data: { 
            implementationProgress: implementationData.progress 
          }
        }, 
        { status: 200 }
      );
      
    } catch (error) {
      console.error('[API/implementation-roadmap] Error fetching data:', error);
      return NextResponse.json(
        { 
          error: 'Internal Server Error', 
          message: 'Failed to fetch implementation roadmap data',
          success: false,
          usedMockData: true, 
          data: { implementationProgress: mockImplementationProgress }
        }, 
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[API/implementation-roadmap] Token verification failed:', error);
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token', success: false }, 
      { status: 401 }
    );
  }
} 