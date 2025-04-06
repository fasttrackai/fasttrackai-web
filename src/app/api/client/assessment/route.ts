import { NextRequest, NextResponse } from 'next/server';
import { db, isFirebaseConfigured } from '@/lib/firebase/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, DocumentData } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { mockAssessments } from '@/lib/config/development';
import { devFlags } from '@/lib/config/development';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Use mock data in development if Firebase is not configured
    if ((!isFirebaseConfigured() && process.env.NODE_ENV === 'development') || devFlags.useMockData) {
      console.log('Using mock data for assessment submission');
      
      // Simulate API delay
      if (devFlags.simulateNetworkDelay) {
        await new Promise(resolve => setTimeout(resolve, devFlags.networkDelayMs));
      }
      
      // Generate a random assessment ID
      const mockAssessmentId = `mock-assessment-${Date.now()}`;
      
      return NextResponse.json({ 
        success: true, 
        assessmentId: mockAssessmentId,
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

    // Add the assessment result to Firestore
    const assessmentRef = await addDoc(collection(db, 'assessments'), {
      userId: user.uid,
      ...data,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ 
      success: true, 
      assessmentId: assessmentRef.id 
    });

  } catch (error) {
    console.error('Error saving assessment:', error);
    return NextResponse.json(
      { error: 'Failed to save assessment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Use mock data in development if Firebase is not configured
    if ((!isFirebaseConfigured() && process.env.NODE_ENV === 'development') || devFlags.useMockData) {
      console.log('Using mock data for assessment results');
      
      // Simulate API delay
      if (devFlags.simulateNetworkDelay) {
        await new Promise(resolve => setTimeout(resolve, devFlags.networkDelayMs));
      }
      
      return NextResponse.json({ 
        results: mockAssessments,
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

    // Get the assessment results for the user
    const assessmentsRef = collection(db, 'assessments');
    const assessmentsQuery = query(
      assessmentsRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const assessmentsSnapshot = await getDocs(assessmentsQuery);
    const results = assessmentsSnapshot.docs.map((doc): DocumentData => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}

function calculateScore(questions: any[]): number {
  // Implement your scoring logic here
  return Math.floor(Math.random() * 100); // Mock implementation
}

function generateRecommendations(scores: any) {
  // Implement recommendation logic based on scores
  return [
    {
      category: "Data Readiness",
      items: [
        "Implement data warehousing",
        "Establish data governance",
        "Enhance data quality processes"
      ]
    },
    // Add more recommendations...
  ];
} 