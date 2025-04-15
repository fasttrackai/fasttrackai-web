import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/firebase-admin';
import { mockRoiData, devFlags } from '@/lib/config/development';

// Helper function for type checking environment
const isDevEnvironment = () => (process.env.NODE_ENV as string) === 'development';

// Helper function to check if Firebase Admin is properly initialized
const isFirebaseAdminAvailable = () => {
  return !!adminAuth && !!adminDb;
};

// Define interfaces for ROI data
interface SavingsData {
  annualSavings: number;
  roiPercentage: number;
  paybackPeriodMonths: number;
  implementationCost: number;
  fiveYearBenefit: number;
}

interface RoiCalculation {
  id?: string;
  userId: string;
  annualBenefit?: number;
  totalBenefit?: number;
  roi?: number;
  roiPercentage?: number;
  paybackPeriodMonths?: number;
  implementationCost?: number;
  initialInvestment?: number;
  fiveYearBenefit?: number;
  fiveYearRoi?: number;
  calculatedAt: string;
  [key: string]: any; // For other potential fields
}

// Mock data for ROI savings
const mockSavingsData: SavingsData = {
  annualSavings: 85000,
  roiPercentage: 140,
  paybackPeriodMonths: 8,
  implementationCost: 60000,
  fiveYearBenefit: 425000
};

export async function GET(request: NextRequest) {
  console.log("[API/roi] Received GET request");

  // 1. Verify Firebase Admin SDK Initialization
  if (!isFirebaseAdminAvailable()) {
    console.error("[API/roi] Firebase Admin SDK not initialized");
    return NextResponse.json(
      { 
        error: 'Service Unavailable', 
        message: 'Backend services currently unavailable', 
        success: false,
        usedMockData: true,
        savingsData: mockSavingsData,
        roiCalculations: mockRoiData
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
    console.warn('[API/roi] No auth token provided');
    
    // In development, we can return mock data even without authentication
    if (isDevEnvironment() && devFlags.useMockData) {
      console.log('[API/roi] Development mode: returning mock data without authentication');
      return NextResponse.json(
        { 
          message: 'Debug: No auth token', 
          success: true,
          usedMockData: true,
          savingsData: mockSavingsData,
          roiCalculations: mockRoiData 
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
    
    console.log(`[API/roi] Authenticated user: ${uid}`);
    
    // 4. Fetch ROI data from Firestore
    try {
      // If still in development mode and flag is set, return mock data even with auth
      if (isDevEnvironment() && devFlags.useMockData) {
        console.log('[API/roi] Development mode: returning mock data with auth');
        return NextResponse.json(
          { 
            message: 'Using mock data (development mode)',
            success: true,
            usedMockData: true,
            savingsData: mockSavingsData,
            roiCalculations: mockRoiData
          }, 
          { status: 200 }
        );
      }
      
      // Fetch actual user data from Firestore to verify user exists
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        console.warn(`[API/roi] User ${uid} not found in database`);
        return NextResponse.json(
          { 
            error: 'User not found', 
            success: false,
            usedMockData: true, 
            savingsData: mockSavingsData,
            roiCalculations: mockRoiData
          }, 
          { status: 404 }
        );
      }
      
      // Fetch latest ROI calculation for the user
      const roiCalculationsQuery = await db.collection('roiCalculations')
        .where('userId', '==', uid)
        .orderBy('calculatedAt', 'desc')
        .limit(1)
        .get();
      
      if (roiCalculationsQuery.empty) {
        console.log(`[API/roi] No ROI calculations for user ${uid}, returning mock data`);
        return NextResponse.json(
          { 
            message: 'No ROI calculations found',
            success: true,
            usedMockData: true,
            savingsData: mockSavingsData,
            roiCalculations: []
          }, 
          { status: 200 }
        );
      }
      
      // Process the query results
      const roiCalculations: RoiCalculation[] = roiCalculationsQuery.docs.map(doc => {
        const data = doc.data() as RoiCalculation;
        return {
          ...data,
          id: doc.id
        };
      });
      
      // Extract the latest ROI data and format for the SavingsEstimator component
      const latestROI = roiCalculations[0];
      const savingsData: SavingsData = {
        annualSavings: latestROI.annualBenefit || latestROI.totalBenefit || mockSavingsData.annualSavings,
        roiPercentage: latestROI.roi || latestROI.roiPercentage || mockSavingsData.roiPercentage,
        paybackPeriodMonths: latestROI.paybackPeriodMonths || mockSavingsData.paybackPeriodMonths,
        implementationCost: latestROI.implementationCost || latestROI.initialInvestment || mockSavingsData.implementationCost,
        fiveYearBenefit: latestROI.fiveYearBenefit || latestROI.fiveYearRoi || mockSavingsData.fiveYearBenefit
      };
      
      return NextResponse.json(
        { 
          success: true,
          usedMockData: false,
          savingsData,
          roiCalculations
        }, 
        { status: 200 }
      );
      
    } catch (error) {
      console.error('[API/roi] Error fetching data:', error);
      return NextResponse.json(
        { 
          error: 'Internal Server Error', 
          message: 'Failed to fetch ROI data',
          success: false,
          usedMockData: true, 
          savingsData: mockSavingsData,
          roiCalculations: mockRoiData
        }, 
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[API/roi] Token verification failed:', error);
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token', success: false }, 
      { status: 401 }
    );
  }
}

// POST endpoint for creating new ROI calculations
export async function POST(request: NextRequest) {
  console.log("[API/roi] Received POST request");

  // 1. Verify Firebase Admin SDK Initialization
  if (!isFirebaseAdminAvailable()) {
    console.error("[API/roi] Firebase Admin SDK not initialized");
    return NextResponse.json(
      { 
        error: 'Service Unavailable', 
        message: 'Backend services currently unavailable', 
        success: false
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
    console.warn('[API/roi] No auth token provided');
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
    
    console.log(`[API/roi] Authenticated user for ROI calculation: ${uid}`);
    
    // 4. Process and save ROI calculation
    try {
      // Parse request body for ROI inputs
      const roiInputs = await request.json();
      
      // Fetch user data to verify user exists
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        console.warn(`[API/roi] User ${uid} not found in database`);
        return NextResponse.json(
          { error: 'User not found', success: false }, 
          { status: 404 }
        );
      }
      
      // Calculate ROI if inputs are provided, or use default values
      let roiData;
      if (roiInputs.revenue && roiInputs.employees) {
        roiData = calculateROI(roiInputs as ROIInputs);
      } else {
        // If no inputs, just save the provided data
        roiData = {
          ...roiInputs,
          calculatedAt: new Date().toISOString()
        };
      }
      
      // Save the ROI calculation to Firestore
      const roiRef = await db.collection('roiCalculations').add({
        userId: uid,
        ...roiData,
        calculatedAt: new Date().toISOString()
      });
      
      return NextResponse.json(
        { 
          success: true,
          roiId: roiRef.id,
          savingsData: {
            annualSavings: roiData.annualBenefit || roiData.totalBenefit || 0,
            roiPercentage: roiData.roi || 0,
            paybackPeriodMonths: roiData.paybackPeriodMonths || 12
          }
        }, 
        { status: 201 }
      );
      
    } catch (error) {
      console.error('[API/roi] Error creating ROI calculation:', error);
      return NextResponse.json(
        { 
          error: 'Internal Server Error', 
          message: 'Failed to create ROI calculation',
          success: false
        }, 
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[API/roi] Token verification failed:', error);
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token', success: false }, 
      { status: 401 }
    );
  }
}

interface ROIInputs {
  revenue: number;
  employees: number;
  customerServiceHours: number;
  dataProcessingHours: number;
  averageHourlyRate: number;
}

interface ROIResults {
  automationSavings: number;
  productivityGain: number;
  customerRetention: number;
  totalBenefit: number;
  roi: number;
  paybackPeriodMonths: number;
}

function calculateROI(inputs: ROIInputs): ROIResults {
  // Calculate automation savings
  const automationSavings = 
    (inputs.customerServiceHours + inputs.dataProcessingHours) * 
    inputs.averageHourlyRate * 0.6; // Assume 60% reduction in manual hours

  // Calculate productivity gain
  const productivityGain = 
    inputs.revenue * 0.15; // Assume 15% productivity improvement

  // Calculate customer retention benefit
  const customerRetention = 
    inputs.revenue * 0.1; // Assume 10% improvement in customer retention

  // Calculate total benefit
  const totalBenefit = 
    automationSavings + productivityGain + customerRetention;

  // Calculate implementation cost (assuming 20% of revenue)
  const implementationCost = inputs.revenue * 0.2;
  
  // Calculate ROI percentage
  const roi = ((totalBenefit - implementationCost) / implementationCost) * 100;
  
  // Calculate payback period in months
  const paybackPeriodMonths = (implementationCost / (totalBenefit / 12));

  return {
    automationSavings,
    productivityGain,
    customerRetention,
    totalBenefit,
    roi,
    paybackPeriodMonths
  };
} 