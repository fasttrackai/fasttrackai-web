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
        // Generate industry-specific heat map areas if available
        parsedData.heatMap = getIndustrySpecificHeatMap(formData.industry, formData.topChallenges);
      }
      
      if (!parsedData.roadmap || parsedData.roadmap.length === 0) {
        // Generate industry-specific roadmap steps if available
        parsedData.roadmap = getIndustrySpecificRoadmap(formData.industry, formData.topChallenges);
      }

    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Use defaults or raw text if parsing fails completely
      parsedData.opportunityScore = parsedData.opportunityScore || 60; // More optimistic default score
      parsedData.heatMap = getIndustrySpecificHeatMap(formData.industry, formData.topChallenges);
      parsedData.roadmap = getIndustrySpecificRoadmap(formData.industry, formData.topChallenges);
    }

    // Generate a simple report ID
    parsedData.reportId = `ai-${Date.now()}`;

    console.log("Final Parsed Data:", parsedData);
    return parsedData;
  };

  // --- Industry-specific fallback data generators ---
  
  const getIndustrySpecificHeatMap = (industry: string, challenges: string): HeatMapArea[] => {
    // Default heatmap for any industry
    const defaultHeatMap: HeatMapArea[] = [
      {
        area: "Sales Optimization",
        score: 85,
        description: "Using AI to analyze sales patterns",
        topOpportunity: "AI-powered sales forecasting to predict customer needs and optimize inventory levels, increasing revenue by up to 15%."
      },
      {
        area: "Marketing Analytics",
        score: 75,
        description: "Customer segmentation and targeting",
        topOpportunity: "Customer behavior prediction models that identify high-value prospects and personalize marketing messaging for 3x engagement rates."
      },
      {
        area: "Operational Efficiency",
        score: 65,
        description: "Streamlining business processes",
        topOpportunity: "Workflow optimization through AI-powered process analysis, reducing operational costs by identifying inefficiencies."
      }
    ];

    // Check for sales-related challenges to enhance default content further
    if (challenges.toLowerCase().includes("sales") || challenges.toLowerCase().includes("revenue")) {
      defaultHeatMap[0].score = 90; // Increase score for sales area
      defaultHeatMap[0].topOpportunity = "Advanced predictive sales analytics that forecasts customer behavior and identifies cross-selling opportunities, potentially increasing revenue by 20-30%."
    }

    // Industry-specific heat maps
    const industryHeatMaps: Record<string, HeatMapArea[]> = {
      'retail': [
        {
          area: "Inventory Management",
          score: 88,
          description: "Predictive stock optimization",
          topOpportunity: "AI-driven demand forecasting that reduces stockouts by 35% while decreasing excess inventory costs by 25%."
        },
        {
          area: "Customer Experience",
          score: 82,
          description: "Personalized shopping journeys",
          topOpportunity: "Hyper-personalized product recommendations based on real-time behavior analysis, increasing average order value by 28%."
        },
        {
          area: "Dynamic Pricing",
          score: 75,
          description: "Competitive price optimization",
          topOpportunity: "Automated price optimization that adjusts in real-time based on demand, competitor prices, and inventory levels."
        }
      ],
      'manufacturing': [
        {
          area: "Predictive Maintenance",
          score: 87,
          description: "Equipment failure prevention",
          topOpportunity: "Machine learning algorithms that predict equipment failures 2-3 weeks before they occur, reducing downtime by up to 45%."
        },
        {
          area: "Quality Control",
          score: 83,
          description: "Automated defect detection",
          topOpportunity: "Computer vision systems that identify product defects with 99.7% accuracy, reducing quality issues and warranty claims."
        },
        {
          area: "Supply Chain Optimization",
          score: 78,
          description: "End-to-end visibility and forecasting",
          topOpportunity: "AI-powered supply chain resilience tools that predict disruptions and automatically suggest alternative sourcing options."
        }
      ],
      'finance': [
        {
          area: "Risk Assessment",
          score: 90,
          description: "Advanced fraud detection",
          topOpportunity: "Real-time transaction monitoring that detects fraudulent patterns with 95% accuracy, reducing losses by up to 60%."
        },
        {
          area: "Customer Insights",
          score: 85,
          description: "Behavioral analytics",
          topOpportunity: "AI models that predict customer financial needs and identify personalized product recommendations, improving conversion by 32%."
        },
        {
          area: "Process Automation",
          score: 80,
          description: "Document processing",
          topOpportunity: "Intelligent document processing that extracts key information from financial documents with 99% accuracy, reducing processing time by 80%."
        }
      ],
      'technology': [
        {
          area: "Software Development",
          score: 88,
          description: "Accelerated coding and testing",
          topOpportunity: "AI-powered code generation and review that can reduce development time by 40% and identify potential bugs before deployment."
        },
        {
          area: "Customer Support",
          score: 82,
          description: "Intelligent assistance",
          topOpportunity: "Advanced support chatbots that resolve 75% of customer inquiries without human intervention, available 24/7."
        },
        {
          area: "Product Analytics",
          score: 78,
          description: "Usage pattern insights",
          topOpportunity: "AI-driven feature prioritization based on actual usage patterns, helping focus development on high-impact areas."
        }
      ]
    };

    // Return industry-specific heat map if available, otherwise default
    return industryHeatMaps[industry?.toLowerCase()] || defaultHeatMap;
  };

  const getIndustrySpecificRoadmap = (industry: string, challenges: string): RoadmapStep[] => {
    // Default roadmap steps for any industry
    const defaultRoadmap: RoadmapStep[] = [
      {
        title: "Strategic Data Assessment",
        description: "Evaluate your current data infrastructure and identify key business metrics for AI integration and opportunity analysis."
      },
      {
        title: "Prioritized Pilot Implementation",
        description: "Develop and deploy a focused AI solution in your highest-potential area with a 45-day implementation timeline."
      },
      {
        title: "Expansion & Integration Strategy",
        description: "Create a comprehensive roadmap for scaling successful AI implementations across multiple business functions."
      }
    ];

    // Industry-specific roadmaps
    const industryRoadmaps: Record<string, RoadmapStep[]> = {
      'retail': [
        {
          title: "Customer Data Integration",
          description: "Unify customer data from in-store, online, and marketing channels to create comprehensive customer profiles."
        },
        {
          title: "Personalization Engine Deployment",
          description: "Implement AI-driven product recommendations and personalized marketing campaigns based on customer behavior patterns."
        },
        {
          title: "Inventory Optimization System",
          description: "Deploy predictive inventory management to balance stock levels with anticipated demand across locations."
        }
      ],
      'manufacturing': [
        {
          title: "Production Data Infrastructure",
          description: "Connect IoT sensors and production systems to create a unified data platform for AI analysis."
        },
        {
          title: "Predictive Maintenance Implementation",
          description: "Deploy machine learning models that detect potential equipment failures before they occur, reducing downtime."
        },
        {
          title: "Quality Optimization System",
          description: "Implement computer vision and analytics to enhance quality control and reduce defect rates."
        }
      ],
      'finance': [
        {
          title: "Data Security & Compliance Framework",
          description: "Establish robust data governance and security protocols to enable AI with regulatory compliance."
        },
        {
          title: "Risk Analysis Engine Deployment",
          description: "Implement predictive models to enhance risk assessment accuracy and optimize decision-making processes."
        },
        {
          title: "Customer Intelligence System",
          description: "Deploy AI-driven insights platforms to personalize financial products and enhance customer relationships."
        }
      ],
      'technology': [
        {
          title: "Development Workflow Enhancement",
          description: "Integrate AI-powered code assistance and testing tools into your development lifecycle."
        },
        {
          title: "Intelligent Support Implementation",
          description: "Deploy advanced chatbots and predictive support systems to enhance customer experience."
        },
        {
          title: "Product Intelligence Framework",
          description: "Implement AI analytics to understand product usage patterns and prioritize feature development."
        }
      ]
    };

    // Add a sales-specific step if the challenge includes sales
    if (challenges.toLowerCase().includes("sales") || challenges.toLowerCase().includes("revenue")) {
      const salesStep: RoadmapStep = {
        title: "Revenue Optimization Engine",
        description: "Deploy AI models that analyze customer purchasing patterns and identify opportunities to increase sales conversion and value."
      };
      
      // Add to industry-specific roadmap if it exists, otherwise to default
      if (industryRoadmaps[industry?.toLowerCase()]) {
        industryRoadmaps[industry.toLowerCase()].unshift(salesStep);
        // Keep only 3 steps
        industryRoadmaps[industry.toLowerCase()] = industryRoadmaps[industry.toLowerCase()].slice(0, 3);
      } else {
        defaultRoadmap.unshift(salesStep);
        defaultRoadmap.pop(); // Remove the last step to keep 3 steps total
      }
    }

    // Return industry-specific roadmap if available, otherwise default
    return industryRoadmaps[industry?.toLowerCase()] || defaultRoadmap;
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
      
      // Construct the prompt for the OpenAI API - Refined for specificity and value
      const prompt = `
        Analyze the following business information for "${formData.businessName}", specializing in the ${formData.industry} industry, and generate a brief AI opportunity assessment focused on high-impact areas.
        Business Name: ${formData.businessName}
        Industry: ${formData.industry}
        Company Size: ${formData.companySize} employees
        Top Challenges/Goals: ${formData.topChallenges}
        Estimated AI Budget: ${formData.budget}

        Please provide the following in your response, formatted as a JSON object within triple backticks (\`\`\`json ... \`\`\`):\n        1.  **opportunityScore**: An estimated AI opportunity score (integer 0-100), reflecting the potential impact AI could have based on the inputs.\n        2.  **heatMap**: An array of 3-4 key business areas *highly relevant* to a ${formData.industry} business like "${formData.businessName}". For each area:\n            *   'area': Name of the area (string).\n            *   'score': Relevance/opportunity score (integer 0-100).\n            *   'topOpportunity': A compelling, specific AI opportunity description for this area (string, e.g., "AI-powered dynamic pricing for camp spots" instead of just "Pricing optimization". Briefly mention the potential *benefit*.\n        3.  **roadmap**: An array of 2-3 high-level roadmap steps (teaser). For each step:\n            *   'title': Name of the step (string).\n            *   'description': Brief description highlighting the value, implicitly suggesting complexity requiring consultation (e.g., "Implement pilot project for [Top Opportunity Area]" rather than just "Pilot Project").\n

        Keep descriptions concise but benefit-oriented. The goal is to provide valuable insights *as a teaser*, strongly encouraging the user to book a consultation for the full, detailed strategy and implementation plan. Example JSON structure:\n        \`\`\`json
        {\n          "opportunityScore": 85,\n          "heatMap": [\n            { "area": "Dynamic Camp Scheduling", "score": 90, "topOpportunity": "Use AI to optimize camp schedules based on predicted demand, maximizing resource usage." },\n            { "area": "Targeted Marketing", "score": 80, "topOpportunity": "AI analysis of past attendee data to identify high-potential audiences for personalized campaigns, boosting enrollment." },\n            { "area": "Automated Support", "score": 75, "topOpportunity": "Implement AI chatbots trained on camp info to provide instant answers to common questions, freeing up staff time." }\n          ],\n          "roadmap": [\n            { "title": "Data Integration & Readiness", "description": "Consolidate and prepare your existing data sources for effective AI analysis." },\n            { "title": "Pilot [Top Opportunity Area] Implementation", "description": "Launch a focused pilot project to demonstrate ROI in your highest potential area." },\n            { "title": "Develop Scalable AI Strategy", "description": "Create a comprehensive plan for wider AI adoption across the business." }\n          ]\n        }\`\`\`
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

  // Predefined responses for common questions to use when API is unavailable
  const getFallbackResponse = (question: string): string => {
    const questionLower = question.toLowerCase();
    
    // Map of keywords to pre-defined responses
    const commonResponses: Record<string, string> = {
      'roi': "Most businesses see ROI from AI within 3-6 months with proper implementation. For your specific industry and use case, schedule a consultation for a detailed timeline.",
      'cost': "AI implementation costs vary by scope, with targeted solutions starting at $25K and enterprise-wide implementations scaling up. Schedule a consultation for a customized estimate.",
      'time': "Typical AI implementation takes 4-12 weeks depending on complexity and data readiness. For a personalized timeline based on your needs, please schedule a consultation.",
      'benefit': "AI can deliver 25-45% operational efficiency gains, 15-35% revenue increases, and significant competitive advantages. Schedule a consultation for industry-specific benefits.",
      'start': "Begin with a strategic assessment of your data resources and highest-value opportunities. For a guided implementation plan tailored to your business, schedule a consultation.",
      'data': "Quality data is essential, but we can help analyze your current state and develop appropriate strategies. For a data readiness assessment, schedule a consultation.",
      'security': "We implement industry-leading security protocols with all AI solutions, ensuring data protection and compliance. For specific security details, schedule a consultation.",
      'compare': "Different AI solutions offer varying benefits depending on your business needs and objectives. For a comparison tailored to your industry, schedule a consultation.",
      'training': "Staff training is included in our implementation process, with ongoing support options available. For a complete overview of our training approach, schedule a consultation.",
      'risk': "We mitigate implementation risks through our proven methodology and expertise. For a detailed risk assessment specific to your business, schedule a consultation."
    };
    
    // Check if the question contains any of our keywords
    for (const [keyword, response] of Object.entries(commonResponses)) {
      if (questionLower.includes(keyword)) {
        return response;
      }
    }
    
    // Industry-specific responses
    if (formData.industry) {
      const industryLower = formData.industry.toLowerCase();
      
      const industryResponses: Record<string, string> = {
        'retail': "Retail businesses typically see significant ROI from AI in inventory management and personalized marketing. Schedule a consultation for retail-specific AI opportunities.",
        'manufacturing': "Manufacturing companies achieve 15-40% efficiency gains with AI-powered predictive maintenance and quality control. Schedule a consultation for manufacturing-specific insights.",
        'finance': "Financial institutions leverage AI for risk assessment and fraud detection with up to 60% improvement rates. Schedule a consultation for finance-specific AI strategies.",
        'technology': "Tech companies accelerate development and enhance products with AI, seeing 30-50% productivity improvements. Schedule a consultation for tech-specific AI integration plans."
      };
      
      if (industryResponses[industryLower]) {
        return industryResponses[industryLower];
      }
    }
    
    // Default response if no matches
    return "That's an excellent question about AI implementation. For a detailed answer specific to your business needs, I recommend scheduling a consultation with our experts.";
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
      
      // Process the response or use fallback
      let fullText = '';
      
      if (!res.ok) {
        console.log("API response not OK, using fallback response");
        fullText = getFallbackResponse(chatQuestion);
      } else {
      const data = await res.json();
        if (data.content && data.content.trim() !== '') {
          fullText = data.content;
        } else {
          // If API returned empty content, use fallback
          console.log("API returned empty content, using fallback response");
          fullText = getFallbackResponse(chatQuestion);
        }
      }
      
      // Typing effect simulation
      let displayText = '';
      for (let i = 0; i < fullText.length; i++) {
        displayText += fullText[i];
        setChatResponse(displayText);
        await new Promise(r => setTimeout(r, 10)); // Faster typing
      }
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      // On error, use our fallback response system instead of showing an error
      const fallbackText = getFallbackResponse(chatQuestion);
      
      // Typing effect for fallback
      let displayText = '';
      for (let i = 0; i < fallbackText.length; i++) {
        displayText += fallbackText[i];
        setChatResponse(displayText);
        await new Promise(r => setTimeout(r, 10)); // Faster typing
      }
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
            <div className="flex flex-col items-center justify-center py-6 md:py-10">
              <div className="relative mb-8">
                <motion.div 
                  className="h-32 w-32 border-4 border-purple-300 rounded-full flex items-center justify-center"
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="h-24 w-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full"
                    animate={{ 
                      boxShadow: ["0 0 20px 0px rgba(139, 92, 246, 0.3)", "0 0 30px 10px rgba(139, 92, 246, 0.5)", "0 0 20px 0px rgba(139, 92, 246, 0.3)"] 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
              </motion.div>
                
                {/* Orbiting elements */}
                <motion.div 
                  className="absolute top-0 left-0 right-0 bottom-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 bg-indigo-500 rounded-full shadow-lg"
                    whileHover={{ scale: 1.2 }}
                  />
                </motion.div>
                
                <motion.div 
                  className="absolute top-0 left-0 right-0 bottom-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-purple-600 rounded-full shadow-lg"
                    whileHover={{ scale: 1.2 }}
                  />
                </motion.div>
                
                <motion.div 
                  className="absolute top-0 left-0 right-0 bottom-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-7 w-7 bg-violet-500 rounded-full shadow-lg"
                    whileHover={{ scale: 1.2 }}
                  />
                </motion.div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Analyzing Your AI Potential</h2>
              
              <div className="max-w-lg mx-auto">
                <motion.div
                  className="h-2 bg-gray-200 rounded-full overflow-hidden mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: "easeInOut" }}
                  />
                </motion.div>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center justify-center space-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Check className="text-green-500 h-5 w-5" />
                    <p className="text-gray-700">Identifying industry-specific AI opportunities</p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-center space-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <Check className="text-green-500 h-5 w-5" />
                    <p className="text-gray-700">Evaluating potential ROI and implementation complexity</p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-center space-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7 }}
                  >
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="text-purple-600"
                    >
                      <RefreshCw size={20} />
                    </motion.div>
                    <p className="text-gray-700">Generating your customized implementation roadmap</p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-center space-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.4 }}
                  >
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="text-purple-600"
                    >
                      <RefreshCw size={20} />
                    </motion.div>
                    <p className="text-gray-700">Preparing your AI strategy report</p>
                  </motion.div>
                </div>
              </div>
              
              <div className="mt-10 text-sm text-gray-500 max-w-md mx-auto italic">
                This typically takes less than a minute. Thank you for your patience while we analyze your business needs.
              </div>
            </div>
          </div>
        );
        
      case 'results':
        if (!analysisResult) return null; // Should not happen if stage is 'results'
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
            className="pb-8 px-4 md:px-8"
          >
            {/* Header with Results Summary */}
            <motion.div 
              className="mb-8 md:mb-12 pt-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-center">
                <motion.div 
                  className="inline-flex mb-4 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white p-2 md:p-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                >
                  <Check className="h-6 w-6 md:h-8 md:w-8" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Your AI Opportunity Analysis
                </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
                  Here's a high-level assessment of how AI could transform {formData.businessName} based on your input.
              </p>
            </div>
            </motion.div>
            
            {/* Disclaimer */}
            <div className="text-center mb-8 px-4">
              <p className="text-sm text-gray-500 italic"><Info size={14} className="inline mr-1.5 -mt-0.5" />This AI-generated snapshot is a starting point. For an expert-developed, comprehensive strategy, schedule a consultation.</p>
            </div>
            
            {/* Enhanced Score with Animation */}
            <motion.div 
              className="mb-16 md:mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-56 h-56 md:w-64 md:h-64">
                    {/* Background circles */}
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-purple-50"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    />
                    <motion.div 
                      className="absolute inset-2 rounded-full bg-purple-100"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    />
                    <motion.div 
                      className="absolute inset-4 rounded-full bg-white shadow-inner"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    />
            
            {/* Score */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 1 }}
                        className="text-center"
                      >
                        <div className="mb-1 text-sm uppercase tracking-wider text-purple-700 font-medium">Opportunity Score</div>
                        <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                          {analysisResult?.opportunityScore !== undefined ? `${analysisResult.opportunityScore}%` : '??%'}
                        </div>
                        <div className="mt-1 text-gray-500 text-sm font-medium">
                          {analysisResult?.opportunityScore !== undefined && analysisResult.opportunityScore >= 70 
                            ? 'Excellent Potential' 
                            : analysisResult?.opportunityScore !== undefined && analysisResult.opportunityScore >= 40
                              ? 'Strong Potential'
                              : 'Moderate Potential'
                          }
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                {/* Circular Progress */}
                <div className="flex justify-center">
                  <svg className="w-56 h-56 md:w-64 md:h-64" viewBox="0 0 100 100">
                    {/* Gray background circle */}
                    <circle 
                      cx="50" cy="50" r="45" fill="none" 
                      stroke="#e2e8f0" strokeWidth="8" 
                    />
                    
                    {/* Colored progress circle */}
                  <motion.circle
                      cx="50" cy="50" r="45" fill="none" 
                      stroke="url(#scoreGradient)" strokeLinecap="round"
                      strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    initial={{ strokeDashoffset: `${2 * Math.PI * 45}` }}
                      animate={{ 
                        strokeDashoffset: `${2 * Math.PI * 45 * (1 - (analysisResult.opportunityScore || 0) / 100)}` 
                      }}
                      transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                    transform="rotate(-90 50 50)"
                  />
                    
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#4f46e5" />
                      </linearGradient>
                    </defs>
                </svg>
                </div>
              </div>
              
              {/* Score Explanation */}
              <motion.div 
                className="text-center mt-8 max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1.3 }}
              >
                <p className="text-gray-700">
                  {analysisResult?.opportunityScore !== undefined && analysisResult.opportunityScore >= 70 
                    ? `${formData.businessName} has exceptional potential for AI transformation based on your industry and challenges.` 
                    : analysisResult?.opportunityScore !== undefined && analysisResult.opportunityScore >= 40
                      ? `${formData.businessName} shows solid potential for AI implementation that could drive meaningful business results.`
                      : `${formData.businessName} has specific areas where AI could create value, though implementation may be more targeted.`
                  }
                </p>
              </motion.div>
            </motion.div>
            
            {/* Enhanced Heat Map with Better Animations */}
            <motion.div 
              className="mb-16 md:mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
                <span className="inline-block">
                  <span className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 h-1 w-10 mb-2 mx-auto"></span>
                  <span className="block">AI Opportunity Heat Map</span>
                  </span>
              </h3>
              
              {/* Visual heat map legend at the top - Improved for all screen sizes */}
              <div className="flex justify-center mb-6">
                <div className="bg-white px-3 py-2 rounded-lg shadow inline-flex flex-wrap items-center justify-center gap-3">
                  <span className="text-xs text-gray-700 font-semibold whitespace-nowrap">Opportunity Level:</span>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span className="text-xs text-gray-600">Low</span>
                </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-xs text-gray-600">Medium</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-purple-700"></div>
                      <span className="text-xs text-gray-600">High</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-indigo-800"></div>
                      <span className="text-xs text-gray-600">Very High</span>
                    </div>
                  </div>
              </div>
            </div>
            
              <div className="relative max-w-4xl mx-auto">
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-50 rounded-full opacity-50 hidden md:block"></div>
                <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-indigo-50 rounded-full opacity-50 hidden md:block"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {heatMapData.length > 0 ? heatMapData
                    .sort((a, b) => b.score - a.score) // Sort by score descending
                    .slice(0, 3) // Take top 3
                    .map((area, index) => {
                      // Determine background gradient based on score
                      const getGradient = (score: number): string => {
                        if (score >= 85) return 'from-indigo-800 via-indigo-700 to-purple-800'; // Very High
                        if (score >= 75) return 'from-purple-800 via-purple-700 to-purple-600'; // High
                        if (score >= 65) return 'from-purple-600 via-purple-500 to-purple-400'; // Medium
                        if (score >= 45) return 'from-purple-500 via-purple-400 to-blue-500'; // Medium-Low
                        return 'from-blue-500 via-blue-400 to-blue-300'; // Low
                      };
                      const gradientClass = getGradient(area.score || 0);
                      
                      // Create a pulsing animation that's proportional to the score
                      const pulseIntensity = Math.min(1.1, 1 + (area.score / 200)); // Max 1.1x for highest scores
                      
                      return (
                        <motion.div 
                    key={index} 
                          className={`rounded-xl overflow-hidden shadow-lg relative isolation`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.8 + (index * 0.2) }}
                          whileHover={{ 
                            scale: 1.03, 
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                          }}
                        >
                          {/* Pulsing background based on score */}
                          <motion.div 
                            className={`absolute inset-0 -z-10 bg-gradient-to-br ${gradientClass} opacity-80`}
                            animate={{ 
                              scale: [1, pulseIntensity, 1],
                              opacity: [0.8, 0.9, 0.8]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          />
                          
                          <div className={`bg-gradient-to-br ${gradientClass} p-5 text-white h-full flex flex-col backdrop-blur-sm relative z-10`}>
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-bold text-lg">{area.area}</h4>
                              <div className="relative">
                                <div className="text-xs text-gray-700 absolute -top-5 right-0 bg-white/80 px-2 py-0.5 rounded-t">score</div>
                                <div className="flex items-center justify-center bg-white/90 text-gray-800 h-10 w-10 rounded-lg font-bold shadow-lg">
                                  <span className="text-base">{area.score !== undefined ? area.score : '?'}</span>
                      </div>
                    </div>
                  </div>
                            
                            <div className="flex-1">
                              <div className="text-white/95 text-base mb-3 font-medium">Top Opportunity:</div>
                              <p className="text-white text-sm leading-relaxed">{area.topOpportunity || 'Key Opportunity'}</p>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-white/20">
                              <div className="flex justify-between items-center">
                                <div className="text-xs text-white/90 font-medium bg-black/10 px-2 py-0.5 rounded">
                                  {area.score >= 85 ? 'Very High Priority' :
                                   area.score >= 75 ? 'High Priority' : 
                                   area.score >= 65 ? 'Medium Priority' : 
                                   area.score >= 45 ? 'Consider' : 'Low Priority'}
                                </div>
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map(dot => (
                                    <div 
                                      key={dot} 
                                      className={`h-1.5 w-1.5 rounded-full ${
                                        (area.score || 0) / 20 >= dot 
                                          ? 'bg-white' 
                                          : 'bg-white/30'
                                      }`}
                                    ></div>
                ))}
              </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }) : (
                      <div className="col-span-3 p-8 text-center text-gray-500 italic bg-gray-50 rounded-xl border border-gray-200">
                        Heatmap data could not be generated. Please consult for details.
                      </div>
                    )}
            </div>
            
                {/* Pulse animations in background */}
                <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    className="absolute w-32 h-32 rounded-full bg-purple-200 opacity-20"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.2, 0.1, 0.2]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute w-48 h-48 rounded-full bg-indigo-200 opacity-10"
                    animate={{ 
                      scale: [1, 2, 1],
                      opacity: [0.1, 0.05, 0.1]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />
                    </div>
                    </div>
            </motion.div>
            
            {/* Enhanced Roadmap Steps with Animations - Fixed Overlapping Issues */}
            <motion.div 
              className="mb-16 md:mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
                <span className="inline-block">
                  <span className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 h-1 w-10 mb-2 mx-auto"></span>
                  <span className="block">Strategic Implementation Roadmap</span>
                </span>
              </h3>
              
              <div className="max-w-3xl mx-auto px-4">
                <div className="relative py-12">
                  {/* Main line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-200 via-indigo-200 to-purple-100 rounded-full"></div>
                  
                  {roadmapSteps.map((step, index) => (
                    <motion.div 
                      key={index} 
                      className={`relative mb-16 mt-8 last:mb-0 ${index % 2 === 0 ? 'md:ml-auto md:mr-[50%]' : 'md:mr-auto md:ml-[50%]'} md:w-[45%]`}
                      initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1 + (index * 0.3) }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Connector to main line */}
                      <div className={`hidden md:block absolute top-7 ${index % 2 === 0 ? 'right-0 translate-x-[135%]' : 'left-0 -translate-x-[135%]'} w-[35%] h-0.5 bg-gradient-to-r from-purple-300 to-indigo-300`}></div>
                      
                      {/* Step Number Circle - Desktop vs Mobile positioning */}
                      {/* Desktop version - positioned to the side */}
                      <div className={`hidden md:flex absolute ${index % 2 === 0 ? 'right-0 -translate-x-[135%]' : 'left-0 translate-x-[135%]'} top-0 -translate-y-1/2 bg-white rounded-full border-4 border-purple-100 shadow-md z-20 items-center justify-center h-14 w-14`}>
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-xl font-bold">{index + 1}</div>
                  </div>
                      
                      {/* Mobile version - positioned above the card */}
                      <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 -top-8 bg-white rounded-full border-4 border-purple-100 shadow-md z-20 flex items-center justify-center h-14 w-14">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-xl font-bold">{index + 1}</div>
                      </div>
                      
                      {/* Card with content - no need for extra padding now */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 relative z-10">
                        <h4 className="font-bold text-xl text-gray-800 mb-3">{step.title}</h4>
                        <p className="text-gray-600">{step.description}</p>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="text-purple-700 text-sm font-medium">
                              <Clock size={14} className="inline mr-1.5 -mt-0.5" />
                              Timeframe: Custom
                            </div>
                            <div className="text-indigo-700 text-sm font-medium">
                              <Target size={14} className="inline mr-1.5 -mt-0.5" />
                              Impact: High
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Final dot */}
                  <motion.div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-purple-50 rounded-full p-1 shadow-md z-10"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + (roadmapSteps.length * 0.3), duration: 0.5, type: "spring" }}
                  >
                    <div className="h-5 w-5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full"></div>
                  </motion.div>
              </div>
            </div>
            </motion.div>
            
            {/* Enhanced AI Chat Section */}
            <motion.div 
              className="mb-16 md:mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
            >
              <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-purple-100">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 relative">
                  <div className="absolute -top-10 right-5 w-20 h-20 bg-purple-500 rounded-full opacity-30"></div>
                  <div className="absolute -bottom-10 left-10 w-24 h-24 bg-indigo-500 rounded-full opacity-20"></div>
                  
                  <div className="relative">
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                      <MessageCircle className="h-6 w-6 mr-3" />
                      Ask Our AI Assistant
              </h3>
                    <p className="text-purple-100 mb-4">
                      Quick questions about your AI implementation? Our assistant can help with the basics.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-3 mb-5">
                    <div className="flex-1 relative">
                <input
                  type="text"
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && chatQuestion.trim() && !isTypingResponse) {
                            handleAskAI();
                          }
                        }}
                        placeholder="Ask about ROI, implementation time, costs, benefits, or where to start..."
                        className={`w-full p-4 pr-12 border ${chatQuestion.trim() ? 'border-purple-300' : 'border-purple-200'} rounded-lg text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${isTypingResponse ? 'bg-purple-50' : 'bg-white'} shadow-sm transition-all duration-200`}
                        disabled={isTypingResponse}
                      />
                      <div 
                        className={`absolute inset-y-0 right-4 flex items-center ${chatQuestion.trim() && !isTypingResponse ? 'text-purple-500' : 'text-gray-400'} transition-colors duration-200`}
                      >
                        <Send size={16} />
              </div>
                    </div>
                    
                    <motion.button 
                onClick={handleAskAI}
                disabled={isTypingResponse || !chatQuestion.trim()}
                      className={`px-6 py-4 bg-gradient-to-r ${
                        isTypingResponse 
                          ? 'from-gray-400 to-gray-500 cursor-not-allowed' 
                          : chatQuestion.trim() 
                            ? 'from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
                            : 'from-purple-400 to-indigo-400 cursor-not-allowed'
                      } text-white font-semibold rounded-lg flex items-center justify-center shadow-md transition-all duration-200`}
                      whileHover={!isTypingResponse && chatQuestion.trim() ? { scale: 1.02 } : {}}
                      whileTap={!isTypingResponse && chatQuestion.trim() ? { scale: 0.98 } : {}}
              >
                {isTypingResponse ? (
                   <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                   </>
                ) : (
                        <div className="flex items-center">
                          Ask AI <Send size={16} className="ml-2" />
                        </div>
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Helper text */}
                  {!chatResponse && !isTypingResponse && (
                    <div className="text-xs text-gray-500 mb-5 italic">
                      Press Enter or click the button to submit your question.
                    </div>
                  )}
                  
              {chatResponse && (
                    <motion.div 
                      className="bg-purple-50 p-6 rounded-lg border border-purple-100 shadow-inner relative overflow-hidden"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-purple-200 rounded-full opacity-30"></div>
                      <div className="absolute -top-6 -left-6 w-12 h-12 bg-indigo-200 rounded-full opacity-20"></div>
                      
                      <div className="relative">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                              <div className="relative">
                                <MessageCircle size={16} className="absolute opacity-30 -left-[3px] -top-[3px]" />
                                <MessageCircle size={16} />
                </div>
                            </div>
                          </div>
                          <div className="text-gray-700 text-base leading-relaxed">
                            {/* Add shimmer effect while typing response */}
                            {isTypingResponse ? (
                              <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            ) : (
                              <div>
                                {chatResponse || (
                                  <span className="text-gray-500 italic">Ask a question to get a response...</span>
                                )}
                              </div>
                            )}
                          </div>
            </div>
            
                        <div className="mt-4 pt-3 border-t border-purple-200">
                          <div className="flex items-center">
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.5 }}
                              className="mr-2 text-purple-600"
                            >
                              <Info size={16} />
                            </motion.div>
                            <p className="text-purple-700 font-medium text-sm">
                              Need a comprehensive strategy? <Link href="/schedule-consultation" className="underline hover:text-purple-800">Schedule a consultation</Link> for in-depth analysis.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
            
            {/* Enhanced Final CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.5 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-indigo-700 to-violet-800"></div>
              
              {/* Animated background elements */}
              <motion.div 
                className="absolute h-56 w-56 rounded-full bg-purple-600/30"
                style={{ left: '5%', top: '10%' }}
                animate={{ 
                  y: [0, 15, 0],
                  x: [0, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute h-72 w-72 rounded-full bg-indigo-600/20"
                style={{ right: '5%', bottom: '10%' }}
                animate={{ 
                  y: [0, -20, 0],
                  x: [0, -15, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <div className="relative z-10 px-8 py-16 md:py-20 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.6 }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/10 backdrop-blur-md mb-6">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ready to Implement Your AI Strategy?
                  </h3>
                  <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    This snapshot reveals your potential. Let's transform these insights into an actionable implementation plan with measurable results.
                  </p>
                </motion.div>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                    className="w-full md:w-auto"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                <Link 
                      href={`/schedule-consultation?source=strategy-report-results&id=${analysisResult?.reportId || 'ai-report'}`}
                      className="block w-full md:w-auto bg-white text-purple-800 font-bold rounded-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  Schedule Free Consultation
                </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2 }}
                    className="w-full md:w-auto"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      href="/packages"
                      className="block w-full md:w-auto bg-transparent border-2 border-white/40 backdrop-blur-sm text-white font-semibold rounded-lg px-8 py-4 hover:bg-white/10 transition-colors text-lg"
                    >
                      Explore AI Packages
                    </Link>
                  </motion.div>
              </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2.2 }}
                  className="mt-10 md:mt-12 text-white/80 text-sm"
                >
                  <p>We've helped businesses achieve up to 320% ROI on AI investments within 12 months.</p>
                </motion.div>
            </div>
            </motion.div>
          </motion.div>
        );
      
      default: // 'form' stage
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 mb-6 shadow-inner">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5 mr-3" />
                <p className="text-sm text-purple-800">
                  This assessment takes just 60 seconds to complete and will provide you with a personalized AI opportunity analysis for your business.
                </p>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-7">
              {/* Form Fields - Enhanced layout */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div 
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  variants={fadeInUp}
                >
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input 
                    type="text" 
                    id="businessName" 
                    name="businessName" 
                    required 
                    className="input-field bg-gray-50 focus:bg-white" 
                    value={formData.businessName} 
                    onChange={handleChange} 
                    placeholder="Your company name"
                  />
                </motion.div>
                
                <motion.div 
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  variants={fadeInUp}
                >
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select 
                    id="industry" 
                    name="industry" 
                    required 
                    className="input-field bg-gray-50 focus:bg-white" 
                    value={formData.industry} 
                    onChange={handleChange}
                  >
                    <option value="">Select your industry...</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="technology">Technology</option>
                    <option value="education">Education</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="other">Other</option>
                  </select>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'].map((size) => (
                    <div 
                      key={size} 
                      onClick={() => setFormData({...formData, companySize: size})}
                      className={`cursor-pointer text-center py-2 px-1 rounded border ${
                        formData.companySize === size 
                          ? 'bg-purple-100 border-purple-300 text-purple-700 font-medium' 
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      } transition-colors text-sm`}
                    >
                      {size}
                </div>
                  ))}
              </div>
                <input type="hidden" name="companySize" value={formData.companySize} required />
              </motion.div>
              
              <motion.div 
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <label htmlFor="topChallenges" className="block text-sm font-medium text-gray-700 mb-2">
                  Top Challenges / AI Goals
                </label>
                <textarea 
                  id="topChallenges" 
                  name="topChallenges" 
                  required 
                  rows={3} 
                  className="input-field bg-gray-50 focus:bg-white" 
                  placeholder="E.g., reduce operational costs, improve sales forecasting, automate customer support..." 
                  value={formData.topChallenges} 
                  onChange={handleChange}
                ></textarea>
                
                {challengeSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-[calc(100%-2rem)] bg-white shadow-lg rounded-md border border-purple-200 max-h-36 overflow-y-auto">
                    <ul className="py-1">
                      {challengeSuggestions.map((suggestion, index) => (
                        <li 
                          key={index} 
                          className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm flex items-center" 
                          onClick={() => selectChallengeSuggestion(suggestion)}
                        >
                          <Check className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div 
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  variants={fadeInUp}
                >
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">Est. AI Budget</label>
                  <select 
                    id="budget" 
                    name="budget" 
                    required 
                    className="input-field bg-gray-50 focus:bg-white" 
                    value={formData.budget} 
                    onChange={handleChange}
                  >
                    <option value="">Select budget range...</option>
                    <option value="25k-50k">$25k-$50k</option>
                    <option value="50k-100k">$50k-$100k</option>
                    <option value="100k-250k">$100k-$250k</option>
                    <option value="250k+">$250k+</option>
                  </select>
                </motion.div>
                
                <motion.div 
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  variants={fadeInUp}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    className="input-field bg-gray-50 focus:bg-white" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="you@company.com"
                  />
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="pt-4"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="button-primary text-lg py-4 font-medium relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Your Business...
                      </>
                    ) : (
                      <>
                        Generate My AI Assessment 
                        <ArrowRight className="ml-2" size={20} />
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
                
                <p className="text-center text-xs text-gray-500 mt-3">
                  Your information is securely processed. No credit card required.
                </p>
              </motion.div>
            </form>
          </motion.div>
        );
    }
  };

  // --- Main Component Return --- 
  return (
    <main className="bg-gradient-to-b from-gray-50 via-purple-50 to-white min-h-screen py-16 md:py-24">
      <style jsx>{`
        .input-field { @apply w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-150 shadow-sm; }
        .button-primary { @apply w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-5 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow hover:shadow-md disabled:shadow; }
        .gradient-hero { @apply bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800; }
      `}</style>
      
      {/* Hero Section with Animation */}
        <motion.div 
        className="container mx-auto mb-12 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">AI Potential</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Transform your business with AI opportunities tailored to your needs
          </motion.p>
          
          {/* Animated Icons */}
          <motion.div 
            className="flex justify-center gap-8 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">Fast Results</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <BarChart className="h-8 w-8 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">Data-Driven</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <Target className="h-8 w-8 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">Actionable</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4">
        <motion.div 
          className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="p-6 md:p-10">
            {/* Header */}
            {stage === 'form' && (
              <div className="text-center mb-8 md:mb-10">
                <div className="inline-block p-4 bg-purple-100 rounded-full mb-4 shadow-inner">
                  <FileText className="h-10 w-10 text-purple-600" />
                 </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">AI Strategy Quick Assessment</h2>
                <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">Answer a few questions for a personalized AI opportunity snapshot.</p>
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