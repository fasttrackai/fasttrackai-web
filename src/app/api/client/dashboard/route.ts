import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';
import { mockAssessments, mockRoiData, devFlags } from '@/lib/config/development';

// Helper function for type checking environment
const isDevEnvironment = () => (process.env.NODE_ENV as string) === 'development';

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
    assessments: mockAssessments.length > 0 ? [
      {
        id: 'a123',
        date: '2023-10-15',
        score: 64,
        nextSteps: ['Improve data collection', 'Train team on AI concepts']
      }
    ] : [],
    roiCalculations: mockRoiData.length > 0 ? [
      {
        id: 'r456',
        date: '2023-10-18',
        package: 'Enterprise',
        annualBenefit: 256000,
        roi: 184
      }
    ] : []
  };
}

export async function GET(request: NextRequest) {
  try {
    // Check if we're in development mode
    const isDevelopment = isDevEnvironment();
    
    // Get the authorization header if needed
    const authHeader = request.headers.get('authorization');
    const hasValidAuth = authHeader?.startsWith('Bearer ');
    
    // If in development or using mock data flag, return mock data
    if (isDevelopment || (devFlags && devFlags.useMockData)) {
      console.log('Using mock data for client dashboard (development mode)');
      
      // Simulate network delay if configured
      if (devFlags && devFlags.simulateNetworkDelay) {
        await new Promise(resolve => setTimeout(resolve, devFlags.networkDelayMs || 1000));
      }
      
      // Return mock data with an indication that it's mock data
      return NextResponse.json({
        ...getMockDashboardData(),
        usedMockData: true,
        message: 'Using sample data in development mode'
      });
    }
    
    // For production, check auth
    if (!hasValidAuth) {
      return NextResponse.json(
        { 
          error: 'Missing or invalid authorization header',
          usedMockData: isDevelopment,
          ...(isDevelopment ? getMockDashboardData() : {})
        },
        { status: isDevelopment ? 200 : 401 }
      );
    }

    // Try to verify the token and get real data
    try {
      // Get the ID token
      const idToken = authHeader!.split('Bearer ')[1];
      
      // Verify the token and get the user
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      const userId = decodedToken.uid;
      
      let assessmentData = null;
      let roiData = null;

      try {
        // Get the latest assessment
        const assessmentsRef = adminDb.collection('assessments');
        const assessmentsQuery = assessmentsRef
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .limit(1);
        
        const assessmentsSnapshot = await assessmentsQuery.get();
        assessmentData = assessmentsSnapshot.docs[0]?.data() || null;

        // Get the latest ROI calculation
        const roiRef = adminDb.collection('roi_calculations');
        const roiQuery = roiRef
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .limit(1);
        
        const roiSnapshot = await roiQuery.get();
        roiData = roiSnapshot.docs[0]?.data() || null;
      } catch (error) {
        console.warn('Error fetching Firestore data:', error);
        // Continue with mock data
      }

      // Mock data for maturity scores and growth metrics
      const mockMaturityScores = [
        {
          category: "Data Readiness",
          score: 65,
          maxScore: 100,
          recommendations: [
            "Implement data warehousing",
            "Establish data governance",
            "Enhance data quality processes"
          ]
        },
        {
          category: "AI Implementation",
          score: 45,
          maxScore: 100,
          recommendations: [
            "Deploy customer service AI",
            "Implement predictive analytics",
            "Automate routine processes"
          ]
        },
        {
          category: "Process Automation",
          score: 55,
          maxScore: 100,
          recommendations: [
            "Map automation opportunities",
            "Implement RPA solutions",
            "Develop API integrations"
          ]
        },
        {
          category: "M&A Readiness",
          score: 40,
          maxScore: 100,
          recommendations: [
            "Document AI implementations",
            "Standardize processes",
            "Prepare growth metrics"
          ]
        }
      ];

      const mockGrowthMetrics = [
        {
          name: "Process Efficiency",
          current: 45,
          target: 80,
          unit: "%"
        },
        {
          name: "Cost Reduction",
          current: 120000,
          target: 500000,
          unit: "$"
        },
        {
          name: "Revenue Impact",
          current: 250000,
          target: 1000000,
          unit: "$"
        }
      ];

      // Mock implementation progress data
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
              },
              {
                id: "task-3-3",
                name: "Integration & Testing",
                description: "Integrate AI solutions with existing systems and test",
                status: "pending",
                estimatedTime: "2 weeks",
                dependencies: ["task-3-2"]
              }
            ]
          },
          {
            id: "phase-4",
            name: "Optimization & Scale",
            description: "Refine AI solutions and expand implementation",
            completion: 0,
            tasks: [
              {
                id: "task-4-1",
                name: "Performance Monitoring",
                description: "Set up monitoring and analytics for AI solutions",
                status: "pending",
                estimatedTime: "1 week",
                dependencies: ["task-3-3"]
              },
              {
                id: "task-4-2",
                name: "Model Refinement",
                description: "Optimize AI models based on real-world performance",
                status: "pending",
                estimatedTime: "Ongoing",
                dependencies: ["task-4-1"]
              },
              {
                id: "task-4-3",
                name: "Expansion Planning",
                description: "Identify additional implementation opportunities",
                status: "pending",
                estimatedTime: "2 weeks",
                dependencies: ["task-4-1"]
              }
            ]
          }
        ]
      };

      // Compile dashboard data
      const dashboardData = {
        assessment: assessmentData ? {
          id: "mock-assessment-id",
          ...assessmentData
        } : null,
        roi: roiData ? {
          id: "mock-roi-id",
          ...roiData
        } : null,
        maturityScores: mockMaturityScores,
        growthMetrics: mockGrowthMetrics,
        implementationProgress: mockImplementationProgress
      };

      return NextResponse.json({ 
        success: true,
        data: dashboardData
      });

    } catch (authError) {
      console.error('Error in authentication:', authError);
      
      // In development, return mock data even on auth failure
      if (isDevelopment) {
        return NextResponse.json({
          ...getMockDashboardData(),
          usedMockData: true,
          message: 'Auth error in development mode, using sample data'
        });
      }
      
      // In production, return the auth error
      return NextResponse.json(
        { 
          error: 'Authentication failed',
          details: isDevelopment ? String(authError) : undefined
        },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Error in dashboard API:', error);
    
    // In development, return mock data even on errors
    if (isDevEnvironment()) {
      return NextResponse.json({
        ...getMockDashboardData(),
        usedMockData: true,
        message: 'Server error in development mode, using sample data'
      });
    }
    
    // In production, return the error
    return NextResponse.json(
      { 
        error: 'Server error',
        details: isDevEnvironment() ? String(error) : undefined
      },
      { status: 500 }
    );
  }
} 