import { NextRequest, NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, DocumentData } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { mockRoiData, devFlags } from '@/lib/config/development';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Use mock data in development if Firebase is not configured
    if ((!isFirebaseConfigured() && process.env.NODE_ENV === 'development') || devFlags.useMockData) {
      console.log('Using mock data for ROI calculation submission');
      
      // Simulate API delay
      if (devFlags.simulateNetworkDelay) {
        await new Promise(resolve => setTimeout(resolve, devFlags.networkDelayMs));
      }
      
      // Generate a random ROI ID
      const mockRoiId = `mock-roi-${Date.now()}`;
      
      return NextResponse.json({ 
        success: true, 
        roiId: mockRoiId,
        isMock: true
      });
    }
    
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Check if db is initialized
    if (!db) {
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }

    // Add the ROI calculation to Firestore
    const roiRef = await addDoc(collection(db, 'roi_calculations'), {
      userId: user.uid,
      ...data,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ 
      success: true, 
      roiId: roiRef.id 
    });

  } catch (error) {
    console.error('Error saving ROI calculation:', error);
    return NextResponse.json(
      { error: 'Failed to save ROI calculation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Use mock data in development if Firebase is not configured
    if ((!isFirebaseConfigured() && process.env.NODE_ENV === 'development') || devFlags.useMockData) {
      console.log('Using mock data for ROI calculations');
      
      // Simulate API delay
      if (devFlags.simulateNetworkDelay) {
        await new Promise(resolve => setTimeout(resolve, devFlags.networkDelayMs));
      }
      
      return NextResponse.json({ 
        results: mockRoiData,
        isMock: true
      });
    }
    
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Check if db is initialized
    if (!db) {
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }

    // Get the ROI calculations for the user
    const roiRef = collection(db, 'roi_calculations');
    const roiQuery = query(
      roiRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const roiSnapshot = await getDocs(roiQuery);
    const results = roiSnapshot.docs.map((doc): DocumentData => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Error fetching ROI calculations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ROI calculations' },
      { status: 500 }
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

  // Calculate ROI (assuming implementation cost is 20% of revenue)
  const implementationCost = inputs.revenue * 0.2;
  const roi = ((totalBenefit - implementationCost) / implementationCost) * 100;

  return {
    automationSavings,
    productivityGain,
    customerRetention,
    totalBenefit,
    roi
  };
} 