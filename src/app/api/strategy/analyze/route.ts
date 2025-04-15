import { NextResponse, NextRequest } from 'next/server';
// import { adminDb } from '@/lib/firebase/firebase-admin'; // Comment out for debugging
// Assuming OpenAI or Anthropic client is setup elsewhere and accessible
// e.g., import { openai } from '@/lib/openaiClient'; 

// Remove placeholder function
// async function getAiAnalysis(prompt: string): Promise<Partial<AnalysisResult>> { ... }

interface ApiPayload {
  industry: string;
  companySize: string;
  topChallenges: string;
  budget: string;
}

interface AnalysisResult {
  reportId: string; // Firestore document ID
  aiOpportunities?: string[]; 
  suggestedSteps?: string[]; 
  opportunityScore?: number; 
}

// --- Helper Function to Parse AI Text --- 
function extractAnalysisFromText(text: string): Partial<AnalysisResult> {
    const result: Partial<AnalysisResult> = {
        aiOpportunities: [],
        suggestedSteps: [],
        opportunityScore: undefined,
    };

    try {
        // Extract Opportunities: Looks for Opportunities: ["item1", "item2"]
        const opportunitiesMatch = text.match(/Opportunities:\s*\[([^\]]*)\]/i);
        if (opportunitiesMatch && opportunitiesMatch[1]) {
            // Split by comma, remove quotes and extra spaces
            result.aiOpportunities = opportunitiesMatch[1].split(',').map(s => s.replace(/["\s]/g, '').trim()).filter(s => s);
        }

        // Extract Steps: Looks for Steps: ["item1", "item2"]
        const stepsMatch = text.match(/Steps:\s*\[([^\]]*)\]/i);
        if (stepsMatch && stepsMatch[1]) {
             // Split by comma, remove quotes and extra spaces
            result.suggestedSteps = stepsMatch[1].split(',').map(s => s.replace(/["\s]/g, '').trim()).filter(s => s);
        }

         // Extract Score: Looks for Score: [NUMBER] or Score: NUMBER
        const scoreMatch = text.match(/Score:\s*\[?(\d+)\]?/i); 
         if (scoreMatch && scoreMatch[1]) {
            result.opportunityScore = parseInt(scoreMatch[1], 10);
         }
     } catch (e) {
         console.error("[API/analyze] Error parsing AI text:", e, "Raw text:", text);
     }
    
     // Basic validation / fallback
     if (!result.aiOpportunities || result.aiOpportunities.length === 0) {
        result.aiOpportunities = ["General AI strategy review recommended"];
     }
     if (!result.suggestedSteps || result.suggestedSteps.length === 0) {
        result.suggestedSteps = ["Assess data readiness in more detail"];
     }
     if (result.opportunityScore === undefined || isNaN(result.opportunityScore)) {
        result.opportunityScore = 50; // Default score
     }

    return result;
}
// --- End Helper Function ---

export async function POST(request: NextRequest) {
  // 1. Verify Initialization - TEMPORARILY BYPASSED
  /* 
  if (!adminDb) {
    console.error('[API/analyze] Firebase Admin DB not initialized.');
    return NextResponse.json({ error: 'Server configuration error - DB Failed' }, { status: 500 });
  }
  */
  console.log("[API/analyze] Skipping Admin DB check for debugging.");

  try {
    const payload = (await request.json()) as ApiPayload;

    if (!payload.industry || !payload.topChallenges) {
        return NextResponse.json({ error: 'Missing required fields (industry, topChallenges)' }, { status: 400 });
    }
    console.log("[API/analyze] Received payload:", payload);

    const prompt = `
      Analyze the following business profile for high-level AI opportunities.
      Provide a brief, general analysis suitable for a preliminary report.
      DO NOT provide specific implementation steps or detailed technical solutions.
      Focus on potential areas and general first considerations.
      
      Business Profile:
      - Industry: ${payload.industry}
      - Company Size: ${payload.companySize || 'Not specified'}
      - Top Challenges/Goals: ${payload.topChallenges}
      - Budget Range: ${payload.budget || 'Not specified'}
      
      Output format should be EXACTLY:
      Opportunities: ["Opportunity 1", "Opportunity 2"]
      Steps: ["General Step 1", "General Step 2"]
      Score: [A number between 0 and 100 representing illustrative potential]
      
      Example Opportunities: Optimize inventory management, Enhance customer support with chatbots, Automate data entry.
      Example Steps: Assess current data infrastructure, Identify key processes for automation review, Evaluate off-the-shelf AI tools.
      
      Keep descriptions concise (max 10 words per item). Provide 2 opportunities and 2 steps. Generate a score.
    `;

    // --- Call AI Service --- 
    console.log("[API/analyze] Sending request to OpenAI API route (DEBUG - DB Disabled)...");
    let analysis: Partial<AnalysisResult> = {};
    try {
      // Construct the absolute URL for the API route
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; 
      const apiUrl = new URL('/api/openai/chat', baseUrl).toString();

      const aiResponse = await fetch(apiUrl, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }]
        }),
      });

      if (!aiResponse.ok) {
        const errorBody = await aiResponse.text();
        console.error(`[API/analyze] OpenAI API route failed with status ${aiResponse.status}: ${errorBody}`);
        throw new Error(`AI analysis failed (status ${aiResponse.status}).`);
      }

      const aiData = await aiResponse.json();
      
      // Updated to match the OpenAI chat route's actual response structure
      const aiText = aiData.content || aiData.text || aiData.choices?.[0]?.message?.content; 

      if (!aiText) {
         console.error("[API/analyze] OpenAI API route returned empty or unexpected response structure:", aiData);
         throw new Error("AI analysis returned empty response.");
      }
      console.log("[API/analyze] Raw AI Response Text:", aiText);

      analysis = extractAnalysisFromText(aiText);
      console.log("[API/analyze] Parsed Analysis:", analysis);

    } catch (error) {
        console.error("[API/analyze] Error calling or processing AI response:", error);
        // Fallback to basic analysis if AI fails
        analysis = {
            aiOpportunities: ["Review AI strategy options", "Explore process automation opportunities"],
            suggestedSteps: ["Schedule consultation for detailed analysis", "Assess current business processes"],
            opportunityScore: 65
        };
    }

    // --- Save to Firestore - TEMPORARILY BYPASSED ---
    console.log("[API/analyze] Skipping Firestore save for debugging.");
    const fakeReportId = `debug_${Date.now()}`;
    /*
    if (!adminDb) throw new Error("Firestore Admin DB is not initialized.");
    const db = adminDb; 
    const reportData = { ... };
    const reportRef = await db.collection('strategyReports').add(reportData);
    const reportId = reportRef.id;
    */

    // --- Return Result --- 
    const resultWithId: AnalysisResult = {
        reportId: fakeReportId, // Return a fake ID
        aiOpportunities: analysis.aiOpportunities || [],
        suggestedSteps: analysis.suggestedSteps || [],
        opportunityScore: analysis.opportunityScore
    };
    return NextResponse.json(resultWithId, { status: 200 });

  } catch (error: any) {
     console.error('[API/analyze] Error:', error);
     return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
} 