'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Download, Mail, ArrowRight, Check, Clock, Zap, BarChart, Target, Activity, Users, AlertCircle, RefreshCw, Info, MessageCircle, Send } from 'lucide-react';
import jsPDF from 'jspdf'; // Keep for potential future use

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Type definitions
interface FormData {
  businessName: string;
  industry: string;
  companySize: string;
  topChallenges: string;
  budget: string;
  email: string;
}

interface HeatMapArea {
  area: string;
  score: number;
  description: string;
  topOpportunity: string;
}

interface RoadmapStep {
  title: string;
  description: string;
  // Remove timeframe and complexity for simplicity with AI generation for now
  // timeframe: string;
  // complexity: 'Low' | 'Medium' | 'High';
}

interface AnalysisResult {
  reportId: string;
  rawAIResponse?: string; // Store the full AI response
  opportunityScore?: number; // Parsed from AI response
  // Keep aiOpportunities and suggestedSteps if the AI can provide them structured
  aiOpportunities?: string[];
  suggestedSteps?: string[];
  // fallback is no longer needed with direct AI call
  // fallback?: boolean;
}

export default function StrategyReport() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    industry: '',
    companySize: '',
    topChallenges: '',
    budget: '',
    email: ''
  });

  // State variables
  const [stage, setStage] = useState<'form' | 'processing' | 'results'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Indicates if analysis completed
  const [isDownloading, setIsDownloading] = useState(false); // For PDF download
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [heatMapData, setHeatMapData] = useState<HeatMapArea[]>([]);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isTypingResponse, setIsTypingResponse] = useState(false);
  const [challengeSuggestions, setChallengeSuggestions] = useState<string[]>([]);

  // --- New AI Response Parsing Function ---
  // Basic parser - This will likely need significant refinement based on
  // how the AI structures its response. Assumes AI provides JSON-like strings.
  const parseAIResponse = (responseText: string): Partial<AnalysisResult & { heatMap: HeatMapArea[], roadmap: RoadmapStep[] }> => {
    console.log("Raw AI Response:", responseText);
    let parsedData: Partial<AnalysisResult & { heatMap: HeatMapArea[], roadmap: RoadmapStep[] }> = {
      rawAIResponse: responseText,
      opportunityScore: 50, // Default score
      heatMap: [],
      roadmap: []
    };

    try {
      // Attempt 1: Look for JSON object within the response
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsedJson = JSON.parse(jsonMatch[1]);
        console.log("Parsed JSON from AI:", parsedJson);
        parsedData = { ...parsedData, ...parsedJson }; // Merge parsed JSON data
      } else {
        // Attempt 2: Very basic parsing based on keywords (less reliable)
        const scoreMatch = responseText.match(/Opportunity Score:.*?(\d+)/i);
        if (scoreMatch && scoreMatch[1]) {
          parsedData.opportunityScore = parseInt(scoreMatch[1], 10);
        }

        // Example parsing for heatmap (adjust keywords as needed)
        const heatMapRegex = /Heatmap Area: (.*?)\nScore: (\d+)\nOpportunity: (.*?)\n/g;
        let match;
        while ((match = heatMapRegex.exec(responseText)) !== null) {
          parsedData.heatMap?.push({ area: match[1], score: parseInt(match[2], 10), description: '', topOpportunity: match[3] });
        }

        // Example parsing for roadmap (adjust keywords as needed)
        const roadmapRegex = /Roadmap Step: (.*?)\nDescription: (.*?)\n/g;
        while ((match = roadmapRegex.exec(responseText)) !== null) {
          parsedData.roadmap?.push({ title: match[1], description: match[2] });
        }
      }
      // Ensure score is within bounds
      if (parsedData.opportunityScore) {
         parsedData.opportunityScore = Math.min(100, Math.max(0, parsedData.opportunityScore));
      }

      // Basic validation/defaults if parsing failed to populate heatmap/roadmap
      if (!parsedData.heatMap || parsedData.heatMap.length === 0) {
         parsedData.heatMap = [{ area: 'General', score: parsedData.opportunityScore || 50, description: 'See consultation', topOpportunity: 'AI Use Case' }];
      }
       if (!parsedData.roadmap || parsedData.roadmap.length === 0) {
         parsedData.roadmap = [{ title: 'Discuss Strategy', description: 'Schedule consultation for details.' }];
      }


    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Use defaults or raw text if parsing fails completely
       parsedData.opportunityScore = parsedData.opportunityScore || 40; // Default lower score on error
       parsedData.heatMap = [{ area: 'Analysis Error', score: 30, description: 'Consultation needed', topOpportunity: 'Error' }];
       parsedData.roadmap = [{ title: 'Parsing Error', description: 'Could not interpret AI response. Please consult.' }];
    }

     // Generate a simple report ID
     parsedData.reportId = `ai-${Date.now()}`;


    console.log("Final Parsed Data:", parsedData);
    return parsedData;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Generate challenge suggestions
    if (name === 'topChallenges' && value.length > 2 && formData.industry) {
      getSuggestedChallenges(formData.industry, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStage('processing');
    setError(null);
    setAnalysisResult(null); // Clear previous results
    setHeatMapData([]);
    setRoadmapSteps([]);

    try {
      sessionStorage.setItem('strategyReportFormData', JSON.stringify(formData));

      // Construct the prompt for the OpenAI API
      const prompt = `
        Analyze the following business information and generate a brief AI opportunity assessment.
        Business Name: ${formData.businessName}
        Industry: ${formData.industry}
        Company Size: ${formData.companySize} employees
        Top Challenges/Goals: ${formData.topChallenges}
        Estimated AI Budget: ${formData.budget}

        Please provide the following in your response, ideally formatted as a JSON object within triple backticks (\`\`\`json ... \`\`\`):
        1.  **opportunityScore**: An estimated AI opportunity score (integer between 0 and 100).
        2.  **heatMap**: An array of 3-6 key business areas (e.g., 'Operations', 'Sales & Marketing', 'Customer Experience') with:
            *   'area': Name of the area (string).
            *   'score': Relevance/opportunity score for this area (integer 0-100).
            *   'topOpportunity': A brief description of the top AI opportunity in this area (string).
        3.  **roadmap**: An array of 3-4 high-level roadmap steps (teaser) with:
            *   'title': Name of the step (string).
            *   'description': Brief description of the step (string).

        Keep descriptions concise and focused on providing a *teaser* that encourages booking a consultation for full details. If you cannot generate specific details based on the input, provide more general suggestions appropriate for the industry. For example JSON format:
        \`\`\`json
        {
          "opportunityScore": 75,
          "heatMap": [
            { "area": "Customer Experience", "score": 85, "topOpportunity": "AI Chatbots for Support" },
            { "area": "Operations", "score": 70, "topOpportunity": "Process Automation" },
            { "area": "Sales & Marketing", "score": 65, "topOpportunity": "Lead Scoring" }
          ],
          "roadmap": [
            { "title": "Data Readiness Check", "description": "Assess data sources for AI application." },
            { "title": "Pilot Project Identification", "description": "Select a high-impact starter project." },
            { "title": "Develop Full Strategy", "description": "Outline long-term AI integration plan." }
          ]
        }
        \`\`\`
      `;

      console.log("Sending prompt to OpenAI:", prompt);

      // Call the OpenAI chat API endpoint
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        // Attempt to read error details from the response body
        let errorBody = 'Unknown error';
        try {
          errorBody = await response.text();
        } catch (_) {}
        throw new Error(`AI analysis request failed: ${response.status} - ${errorBody}`);
      }

      // Assuming the API route returns the full text content after streaming is complete
      // Adjust this if the API returns a different structure (e.g., streaming chunks directly)
       const result = await response.json(); // Expecting { content: "..." } or similar from Vercel AI SDK endpoint
       const aiContent = result.content;

      if (!aiContent) {
        throw new Error("Received empty response from AI.");
      }

      // Parse the AI's response text
      const parsedData = parseAIResponse(aiContent);

      // Update state with parsed data
      setAnalysisResult({
          reportId: parsedData.reportId || `err-${Date.now()}`, // Use parsed or generate error ID
          rawAIResponse: aiContent, // Store raw response
          opportunityScore: parsedData.opportunityScore,
          // If AI provided structured data, it might be directly usable here
          // aiOpportunities: parsedData.aiOpportunities,
          // suggestedSteps: parsedData.suggestedSteps
      });
      setHeatMapData(parsedData.heatMap || []);
      setRoadmapSteps(parsedData.roadmap || []);

      setStage('results');
      setIsSuccess(true);

    } catch (error: any) {
      console.error('AI Analysis Submission Error:', error);
      setError(`Failed to generate assessment: ${error.message}. Please try again or contact support if the issue persists.`);
      setStage('form'); // Revert to form on error
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Helper Functions ---

  const getSuggestedChallenges = (industry: string, currentInput: string) => {
    const industrySpecificChallenges: Record<string, string[]> = {
      'retail': ['Inventory optimization', 'Customer churn prediction', 'Personalized marketing'],
      'manufacturing': ['Predictive maintenance', 'Supply chain optimization', 'Quality control automation'],
      'healthcare': ['Patient outcome prediction', 'Administrative workflow automation', 'Medical image analysis'],
      'finance': ['Fraud detection', 'Risk assessment automation', 'Personalized financial advice'],
      'technology': ['Development workflow optimization', 'User behavior prediction', 'Support ticket automation'],
      'education': ['Student performance prediction', 'Personalized learning paths', 'Administrative task automation'],
      'hospitality': ['Guest experience personalization', 'Revenue management optimization', 'Staff scheduling automation'],
      'other': ['Process automation', 'Customer insights', 'Operational efficiency']
    };
    const relevantChallenges = industrySpecificChallenges[industry.toLowerCase()] || industrySpecificChallenges['other'];
    const filteredSuggestions = currentInput.length > 1 
      ? relevantChallenges.filter(challenge => 
          challenge.toLowerCase().includes(currentInput.toLowerCase()))
      : [];
    setChallengeSuggestions(filteredSuggestions.slice(0, 3));
  };

  const handleAskAI = async () => {
    if (!chatQuestion.trim()) return;
    setIsTypingResponse(true);
    setChatResponse('');
    try {
      const res = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Answer this business question about AI implementation very briefly (1-2 sentences max) and strongly suggest scheduling a consultation for details: ${chatQuestion}`
          }]
        })
      });
      if (!res.ok) throw new Error('Chat request failed');
      const data = await res.json();
      const fullText = data.content || 'For detailed insights, please schedule a consultation with our experts.';
      
      // Typing effect simulation
      let displayText = '';
      for (let i = 0; i < fullText.length; i++) {
        displayText += fullText[i];
        setChatResponse(displayText);
        await new Promise(r => setTimeout(r, 10)); // Faster typing
      }
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      setChatResponse("Apologies, I couldn't process that. Please schedule a consultation for assistance.");
    } finally {
      setIsTypingResponse(false);
    }
  };

  const selectChallengeSuggestion = (suggestion: string) => {
    setFormData({ ...formData, topChallenges: suggestion });
    setChallengeSuggestions([]);
  };

  // --- PDF Functions (Placeholder - Not the focus) ---
  const downloadReport = () => { alert('PDF download currently unavailable.'); };
  const sendReportByEmail = () => { alert('Email report currently unavailable.'); };

  // --- Render Logic --- 
  const renderStageContent = () => {
    switch (stage) {
      case 'processing':
        return (
          <div className="p-8 md:p-12 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="mb-4">
                <RefreshCw size={40} className="text-purple-600" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Your Potential...</h2>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">Our AI is crafting your personalized opportunity assessment.</p>
            </div>
          </div>
        );
        
      case 'results':
        if (!analysisResult) return null; // Should not happen if stage is 'results'
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="py-8 px-4 md:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Your AI Opportunity Snapshot</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
                Here's a high-level look at potential AI impact areas for {formData.businessName}. For a full strategy, let's talk!
              </p>
            </div>
            
            {/* Score */}
            <div className="flex justify-center mb-10">
              <div className="relative w-36 h-36 md:w-44 md:h-44">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="45" fill="none" stroke="#7c3aed"
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    initial={{ strokeDashoffset: `${2 * Math.PI * 45}` }}
                    animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - (analysisResult.opportunityScore || 0) / 100)}` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col text-center">
                  <span className="text-3xl md:text-4xl font-bold text-purple-700">
                    {/* Ensure score is displayed correctly, handle potential undefined */}
                    {analysisResult?.opportunityScore !== undefined ? `${analysisResult.opportunityScore}%` : '??%'}
                  </span>
                  <span className="text-xs md:text-sm text-gray-500 mt-1 leading-tight">AI Opportunity<br/>Score</span>
                </div>
              </div>
            </div>
            
            {/* --- TEMPORARY DEBUGGING START --- */}
            {analysisResult?.rawAIResponse && (
              <div className="my-6 p-4 bg-gray-100 border border-gray-300 rounded-md overflow-x-auto">
                <h4 className="text-sm font-semibold mb-2 text-gray-700">Raw AI Response (for debugging):</h4>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words">
                  {analysisResult.rawAIResponse}
                </pre>
              </div>
            )}
            {/* --- TEMPORARY DEBUGGING END --- */}

            {/* Heat Map */}
            <div className="mb-10">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">Opportunity Heat Map</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {heatMapData.map((area, index) => (
                  <div 
                    key={index} 
                    className="relative p-3 md:p-4 rounded-lg transition-shadow duration-300 hover:shadow-md border border-transparent"
                    style={{ background: `rgba(124, 58, 237, ${Math.max(0.05, Math.min(1, (area.score || 0) / 120))})` }}
                  >
                    <h4 className="text-purple-900 font-semibold text-sm md:text-base mb-1">{area.area}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-800/90 text-xs md:text-sm italic">{area.topOpportunity || 'Key Opportunity'}</span>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 ml-2 shadow-sm">
                        <span className="font-bold text-sm md:text-base">{area.score !== undefined ? area.score : '?'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Roadmap Teaser */}
            <div className="mb-10">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">Preliminary Roadmap Steps</h3>
              <div className="relative pt-4">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-purple-200 rounded-full"></div>
                {roadmapSteps.map((step, i: number) => (
                  <div key={i} className="relative mb-4 pl-12 last:mb-0">
                    <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center border-4 border-white text-sm font-semibold shadow-sm">
                      {i+1}
                    </div>
                    <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-100">
                      <h4 className="font-semibold text-sm md:text-base text-gray-800 mb-0.5">{step.title}</h4>
                      <p className="text-gray-500 text-xs md:text-sm italic">{step.description} (Details in consultation)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Try AI Chat */}
            <div className="mb-10 bg-purple-50 rounded-lg p-5 md:p-6 border border-purple-100">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-purple-800">
                <MessageCircle className="mr-2" size={18} />
                Quick Question for Our AI?
              </h3>
              <div className="mb-3">
                <input
                  type="text"
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  placeholder="E.g., How long does AI implementation usually take?"
                  className="w-full p-2 border border-purple-200 rounded text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <button 
                onClick={handleAskAI}
                disabled={isTypingResponse || !chatQuestion.trim()}
                className="px-4 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors flex items-center justify-center disabled:bg-purple-300"
              >
                {isTypingResponse ? (
                   <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Thinking...
                   </>
                ) : (
                  <>Ask AI <Send size={14} className="ml-1.5" /></>
                )}
              </button>
              {chatResponse && (
                <div className="bg-white p-3 rounded border border-purple-100 mt-3 text-sm text-gray-700">
                  {chatResponse}
                </div>
              )}
            </div>
            
            {/* Final CTA */}
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-lg p-6 md:p-8 shadow-lg mt-8">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold mb-2">Unlock Your Full AI Potential</h3>
                <p className="text-white/90 mb-5 text-sm md:text-base max-w-xl mx-auto">
                  This snapshot shows promising directions. Schedule your free consultation to get a detailed, actionable AI strategy and implementation plan.
                </p>
                <Link 
                  href={`/schedule-consultation?source=strategy-report-results&id=${analysisResult?.reportId || 'ai-report'}`}
                  className="inline-block px-6 py-2.5 bg-white text-purple-700 font-semibold rounded-md hover:bg-gray-100 transition text-sm md:text-base shadow"
                >
                  Schedule Free Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        );
      
      default: // 'form' stage
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {/* Form Fields - Simplified layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="businessName" className="block text-xs font-medium text-gray-600 mb-1">Business Name</label>
                  <input type="text" id="businessName" name="businessName" required className="input-field" value={formData.businessName} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="industry" className="block text-xs font-medium text-gray-600 mb-1">Industry</label>
                  <select id="industry" name="industry" required className="input-field bg-white" value={formData.industry} onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="technology">Technology</option>
                    <option value="education">Education</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="companySize" className="block text-xs font-medium text-gray-600 mb-1">Company Size</label>
                <select id="companySize" name="companySize" required className="input-field bg-white" value={formData.companySize} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="1-10">1-10</option> <option value="11-50">11-50</option> <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option> <option value="501-1000">501-1000</option> <option value="1000+">1000+</option>
                </select>
              </div>
              <div className="relative">
                <label htmlFor="topChallenges" className="block text-xs font-medium text-gray-600 mb-1">Top Challenges / AI Goals</label>
                <textarea id="topChallenges" name="topChallenges" required rows={3} className="input-field" placeholder="E.g., reduce costs, improve sales..." value={formData.topChallenges} onChange={handleChange}></textarea>
                {challengeSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-32 overflow-y-auto">
                    <ul className="py-1">
                      {challengeSuggestions.map((suggestion, index) => (
                        <li key={index} className="px-3 py-1.5 hover:bg-purple-50 cursor-pointer text-xs" onClick={() => selectChallengeSuggestion(suggestion)}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budget" className="block text-xs font-medium text-gray-600 mb-1">Est. AI Budget</label>
                  <select id="budget" name="budget" required className="input-field bg-white" value={formData.budget} onChange={handleChange}>
                    <option value="">Select range...</option>
                    <option value="25k-50k">$25k-$50k</option> <option value="50k-100k">$50k-$100k</option> <option value="100k-250k">$100k-$250k</option> <option value="250k+">$250k+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">Business Email</label>
                  <input type="email" id="email" name="email" required className="input-field" value={formData.email} onChange={handleChange} />
                </div>
              </div>
              <div className="pt-3">
                <button type="submit" disabled={isSubmitting} className="button-primary w-full flex items-center justify-center">
                  {isSubmitting ? (
                    <><svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</>
                  ) : (
                    <>Generate My AI Assessment <ArrowRight className="ml-2" size={18} /></>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        );
    }
  };

  // --- Main Component Return --- 
  return (
    <main className="bg-gradient-to-b from-purple-50 via-white to-white min-h-screen py-12 md:py-20">
      <style jsx>{`
        .input-field { @apply w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150; }
        .button-primary { @apply w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-5 rounded-md transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed; }
      `}</style>
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 md:p-10">
            {/* Header */}
            {stage === 'form' && (
              <div className="text-center mb-6 md:mb-8">
                 <div className="inline-block p-3 bg-purple-100 rounded-full mb-3">
                   <FileText className="h-8 w-8 text-purple-600" />
                 </div>
                 <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">AI Strategy Quick Assessment</h1>
                 <p className="text-gray-500 text-sm md:text-base">Answer 5 questions for a personalized AI opportunity analysis.</p>
              </div>
            )}
            
            {/* Error Display */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 p-3 rounded-md text-left">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {/* Main Content Area */}
            {renderStageContent()}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

// Note: PDF functions removed for clarity as they are not the current focus.

// Note: PDF functions removed for clarity as they are not the current focus. 