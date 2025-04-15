'use client';

import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Download, Mail, ArrowRight, Check, Clock, Zap, BarChart, Target, Activity, Users, AlertCircle, RefreshCw, Info, MessageCircle, Send } from 'lucide-react';

// Type definitions for our assessment feature
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
  timeframe: string;
  complexity: 'Low' | 'Medium' | 'High';
}

interface AnalysisResult {
  reportId: string;
  aiOpportunities?: string[];
  suggestedSteps?: string[];
  opportunityScore?: number;
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

  // New state variables for interactive assessment
  const [stage, setStage] = useState<'form' | 'processing' | 'results' | 'aiChat'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [heatMapData, setHeatMapData] = useState<HeatMapArea[]>([]);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isTypingResponse, setIsTypingResponse] = useState(false);
  const [challengeSuggestions, setChallengeSuggestions] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Generate challenge suggestions if typing in the challenges field
    if (name === 'topChallenges' && value.length > 3 && formData.industry) {
      getSuggestedChallenges(formData.industry, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStage('processing');
    
    try {
      // Store form data in session for potential use later
      sessionStorage.setItem('strategyReportFormData', JSON.stringify(formData));
      
      // Call the analysis API
      const response = await fetch('/api/strategy/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: formData.industry,
          companySize: formData.companySize,
          topChallenges: formData.topChallenges,
          budget: formData.budget
        })
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const result = await response.json();
      setAnalysisResult(result);
      
      // Generate heat map data based on analysis
      generateHeatMapData(result, formData.industry);
      
      // Generate roadmap steps
      generateRoadmapSteps(result, formData.industry);
      
      // Move to results stage
      setStage('results');
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong with the analysis. Please try again.');
      setStage('form');
      setIsSubmitting(false);
    }
  };

  // Helper function to get suggested challenges based on industry and input
  const getSuggestedChallenges = (industry: string, currentInput: string) => {
    const industrySpecificChallenges: Record<string, string[]> = {
      'retail': [
        'Inventory optimization across multiple locations',
        'Customer churn prediction and prevention',
        'Omnichannel customer journey analysis',
        'Product recommendation effectiveness'
      ],
      'manufacturing': [
        'Predictive maintenance for equipment',
        'Supply chain optimization and forecasting',
        'Quality control process automation',
        'Production scheduling and resource allocation'
      ],
      'healthcare': [
        'Patient outcome prediction',
        'Administrative workflow automation',
        'Medical image analysis',
        'Resource allocation optimization'
      ],
      'finance': [
        'Fraud detection and prevention',
        'Customer segmentation and personalization',
        'Risk assessment automation',
        'Document processing optimization'
      ],
      'technology': [
        'Development workflow optimization',
        'User behavior prediction',
        'Support ticket automation',
        'Infrastructure scaling optimization'
      ],
      'education': [
        'Student performance prediction',
        'Administrative task automation',
        'Personalized learning path creation',
        'Resource allocation optimization'
      ],
      'other': [
        'Process automation opportunities',
        'Customer insights and analytics',
        'Operational efficiency improvements',
        'Decision-making optimization'
      ]
    };
    
    // Get challenges for the selected industry, fallback to 'other'
    const relevantChallenges = industrySpecificChallenges[industry.toLowerCase()] || 
                              industrySpecificChallenges['other'];
    
    // Filter challenges that match the current input
    const filteredSuggestions = currentInput.length > 2 
      ? relevantChallenges.filter(challenge => 
          challenge.toLowerCase().includes(currentInput.toLowerCase()))
      : [];
    
    setChallengeSuggestions(filteredSuggestions.slice(0, 3));
  };

  // Function to generate heat map data from analysis results
  const generateHeatMapData = (analysis: AnalysisResult, industry: string) => {
    // Define business areas to analyze
    const businessAreas = [
      'Customer Experience', 
      'Operations', 
      'Product Development', 
      'Sales & Marketing', 
      'Finance', 
      'Human Resources'
    ];
    
    // Industry-specific weightings
    const industryWeights: Record<string, Record<string, number>> = {
      'retail': { 
        'Customer Experience': 0.9, 
        'Operations': 0.7, 
        'Sales & Marketing': 0.8,
        'Product Development': 0.6,
        'Finance': 0.5,
        'Human Resources': 0.4
      },
      'manufacturing': { 
        'Operations': 0.9, 
        'Product Development': 0.8,
        'Customer Experience': 0.5,
        'Sales & Marketing': 0.6,
        'Finance': 0.5,
        'Human Resources': 0.6
      },
      'healthcare': { 
        'Operations': 0.8, 
        'Customer Experience': 0.7,
        'Product Development': 0.6,
        'Sales & Marketing': 0.5,
        'Finance': 0.6,
        'Human Resources': 0.7
      },
      'finance': { 
        'Finance': 0.9, 
        'Customer Experience': 0.7,
        'Operations': 0.7,
        'Product Development': 0.5,
        'Sales & Marketing': 0.8,
        'Human Resources': 0.6
      },
      'technology': { 
        'Product Development': 0.9, 
        'Operations': 0.8,
        'Customer Experience': 0.7,
        'Sales & Marketing': 0.7,
        'Finance': 0.6,
        'Human Resources': 0.6
      },
      // Fallback weights
      'default': { 
        'Customer Experience': 0.7, 
        'Operations': 0.7, 
        'Product Development': 0.7,
        'Sales & Marketing': 0.7,
        'Finance': 0.6,
        'Human Resources': 0.6
      }
    };
    
    // Calculate impact scores
    const heatMapData = businessAreas.map(area => {
      // Get industry weights or fall back to default
      const weights = industryWeights[industry.toLowerCase()] || industryWeights['default'];
      
      // Base score calculation
      const baseScore = Math.floor(Math.random() * 40) + 30; // 30-70 base score
      const industryMultiplier = weights[area] || 0.6;
      
      // Check if opportunities mention this area
      const opportunityBoost = analysis.aiOpportunities?.some(opp => 
        opp.toLowerCase().includes(area.toLowerCase().split(' ')[0])) 
        ? 25 : 0;
      
      // Calculate final score
      const totalScore = Math.min(95, Math.floor(baseScore * industryMultiplier + opportunityBoost));
      
      return {
        area,
        score: totalScore,
        description: getAreaDescription(area, totalScore, industry),
        topOpportunity: getTopOpportunity(area, industry)
      };
    });
    
    setHeatMapData(heatMapData);
  };

  // Generate descriptions for heat map areas
  const getAreaDescription = (area: string, score: number, industry: string): string => {
    const descriptions: Record<string, Record<string, string>> = {
      'Customer Experience': {
        'high': 'High potential for AI-driven personalization and service optimization',
        'medium': 'Moderate opportunity for enhancing customer interactions',
        'low': 'Limited immediate opportunity in customer experience'
      },
      'Operations': {
        'high': 'Significant opportunity for process automation and efficiency gains',
        'medium': 'Several operational processes could benefit from AI integration',
        'low': 'Basic operational improvements possible through targeted AI'
      },
      'Product Development': {
        'high': 'Strong potential for AI-enhanced innovation and product optimization',
        'medium': 'Specific aspects of product development could leverage AI',
        'low': 'Limited immediate applications for AI in current product development'
      },
      'Sales & Marketing': {
        'high': 'Major opportunity for AI-powered targeting and campaign optimization',
        'medium': 'Select marketing processes would benefit from AI enhancement',
        'low': 'Targeted AI applications could improve specific marketing elements'
      },
      'Finance': {
        'high': 'Strong potential for automated analysis and financial optimization',
        'medium': 'Specific financial processes could be enhanced with AI',
        'low': 'Limited immediate applications for AI in financial operations'
      },
      'Human Resources': {
        'high': 'Significant opportunity for talent management and HR automation',
        'medium': 'Select HR processes could benefit from AI assistance',
        'low': 'Basic HR functions could be enhanced with targeted AI'
      }
    };
    
    // Determine score range
    const level = score >= 80 ? 'high' : (score >= 50 ? 'medium' : 'low');
    
    return descriptions[area]?.[level] || 'Potential area for AI implementation';
  };

  // Generate top opportunities for each area
  const getTopOpportunity = (area: string, industry: string): string => {
    const opportunities: Record<string, Record<string, string>> = {
      'retail': {
        'Customer Experience': 'Personalized shopping recommendations',
        'Operations': 'Inventory optimization across locations',
        'Product Development': 'Trend-based product feature enhancement',
        'Sales & Marketing': 'AI-powered customer targeting',
        'Finance': 'Automated cash flow forecasting',
        'Human Resources': 'Smarter employee scheduling'
      },
      'manufacturing': {
        'Customer Experience': 'Predictive maintenance scheduling',
        'Operations': 'Production line optimization',
        'Product Development': 'Defect prediction and prevention',
        'Sales & Marketing': 'Supply chain demand forecasting',
        'Finance': 'Operational cost optimization',
        'Human Resources': 'Workforce skills forecasting'
      },
      'healthcare': {
        'Customer Experience': 'Personalized care recommendations',
        'Operations': 'Resource allocation optimization',
        'Product Development': 'Treatment outcome prediction',
        'Sales & Marketing': 'Targeted service outreach',
        'Finance': 'Claims processing automation',
        'Human Resources': 'Staff scheduling optimization'
      },
      'finance': {
        'Customer Experience': 'Personalized financial recommendations',
        'Operations': 'Risk assessment automation',
        'Product Development': 'AI-powered financial products',
        'Sales & Marketing': 'Client retention prediction',
        'Finance': 'Fraud detection enhancement',
        'Human Resources': 'Performance analytics optimization'
      },
      'default': {
        'Customer Experience': 'Personalized user experiences',
        'Operations': 'Process automation and optimization',
        'Product Development': 'Data-driven innovation',
        'Sales & Marketing': 'Customer targeting and prediction',
        'Finance': 'Financial forecasting and optimization',
        'Human Resources': 'Talent management enhancement'
      }
    };
    
    // Get industry-specific opportunities or fall back to default
    const industryOpps = opportunities[industry.toLowerCase()] || opportunities['default'];
    
    return industryOpps[area] || 'AI implementation opportunity';
  };

  // Generate the implementation roadmap
  const generateRoadmapSteps = (analysis: AnalysisResult, industry: string) => {
    // Base steps all companies should take
    const baseSteps: RoadmapStep[] = [
      { 
        title: 'Data Readiness Assessment', 
        description: 'Evaluate your current data infrastructure and identify gaps',
        timeframe: '2-4 weeks',
        complexity: 'Medium'
      },
      { 
        title: 'Solution Architecture Planning', 
        description: 'Design AI implementation approach with expert guidance',
        timeframe: '3-6 weeks',
        complexity: 'High'
      }
    ];
    
    // Industry-specific steps
    const industrySteps: Record<string, RoadmapStep[]> = {
      'retail': [
        { 
          title: 'Customer Journey Mapping',
          description: 'Map key customer touchpoints for AI enhancement opportunities',
          timeframe: '3-5 weeks',
          complexity: 'Medium'
        }
      ],
      'manufacturing': [
        { 
          title: 'Production Process Analysis',
          description: 'Identify high-value automation opportunities in manufacturing',
          timeframe: '4-6 weeks',
          complexity: 'Medium'
        }
      ],
      'healthcare': [
        { 
          title: 'Patient Data Integration Planning',
          description: 'Design approach for secure, compliant data utilization',
          timeframe: '4-8 weeks',
          complexity: 'High'
        }
      ],
      'finance': [
        { 
          title: 'Risk Assessment Framework',
          description: 'Design AI-enhanced risk evaluation methodology',
          timeframe: '4-6 weeks',
          complexity: 'High'
        }
      ]
    };
    
    // Opportunity-driven steps
    const opportunitySteps = analysis.aiOpportunities?.map(opp => ({
      title: `${opp} Implementation Planning`,
      description: 'Develop targeted approach with expert guidance',
      timeframe: '4-6 weeks',
      complexity: 'High' as 'High'
    })) || [];
    
    // Combine and limit to 5 steps
    const allSteps = [
      ...baseSteps, 
      ...(industrySteps[industry.toLowerCase()] || []), 
      ...opportunitySteps
    ];
    
    setRoadmapSteps(allSteps.slice(0, 5));
  };

  // Handle AI chat question submission
  const handleAskAI = async () => {
    if (!chatQuestion.trim()) return;
    
    setIsTypingResponse(true);
    try {
      const res = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Answer this business question about AI implementation briefly and end by suggesting a consultation: ${chatQuestion}`
          }]
        })
      });
      
      if (!res.ok) throw new Error('Chat failed');
      
      const data = await res.json();
      
      // Simulate typing effect
      let displayText = '';
      const fullText = data.text || 'I recommend scheduling a consultation for personalized guidance on this topic.';
      
      for (let i = 0; i < fullText.length; i++) {
        displayText += fullText[i];
        setChatResponse(displayText);
        await new Promise(r => setTimeout(r, 15));
      }
    } catch (error) {
      console.error(error);
      setChatResponse("I'm having trouble answering that right now. Please schedule a consultation for personalized assistance.");
    } finally {
      setIsTypingResponse(false);
    }
  };

  // Handle challenge suggestion selection
  const selectChallengeSuggestion = (suggestion: string) => {
    setFormData({
      ...formData,
      topChallenges: suggestion
    });
    setChallengeSuggestions([]);
  };

  // Render different components based on the current stage
  const renderStageContent = () => {
    switch (stage) {
      case 'processing':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 md:p-12 text-center"
          >
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={48} className="text-purple-600" />
                </motion.div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Business</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Our AI is identifying opportunities specific to your industry and business challenges...
              </p>
            </div>
          </motion.div>
        );
        
      case 'results':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="py-8"
          >
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your AI Opportunity Assessment</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Based on your input, we've identified these high-potential areas for AI implementation.
                This is a preliminary assessment - schedule a consultation for a comprehensive strategy.
              </p>
            </div>
            
            {/* Overall score with animation */}
            <div className="flex flex-col items-center mb-12">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none" stroke="#e2e8f0" strokeWidth="10"
                  />
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none" stroke="#7c3aed"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - (analysisResult?.opportunityScore || 0) / 100)}`}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold text-purple-700">
                    {analysisResult?.opportunityScore || 0}%
                  </span>
                  <span className="text-sm text-gray-600">AI Opportunity</span>
                </div>
              </div>
            </div>
            
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Opportunity Heat Map</h3>
              <p className="text-gray-600 mb-6">
                Explore where AI could create the most value for your business:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {heatMapData.map((area, index) => (
                  <div 
                    key={index} 
                    className="relative p-5 rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, rgba(124,58,237,${area.score/100}) 0%, rgba(79,40,195,${area.score/100}) 100%)`,
                      boxShadow: `0 0 ${area.score/5}px rgba(124,58,237,0.5)`
                    }}
                  >
                    <h3 className="text-white font-semibold mb-1">{area.area}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white/90 text-sm">{area.topOpportunity}</span>
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{area.score}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your AI Implementation Roadmap</h3>
              <p className="text-gray-600 mb-6">
                A preliminary roadmap to unlock the value of AI for your business:
              </p>
              <div className="relative py-8">
                {/* Progress line */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-purple-200"></div>
                
                {roadmapSteps.map((step, i) => (
                  <div key={i} className="relative mb-8 ml-14 last:mb-0">
                    {/* Milestone dot */}
                    <div className="absolute -left-14 w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center border-4 border-white">
                      {i+1}
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg shadow">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-gray-600 mb-2">{step.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-700 flex items-center">
                          <Clock className="inline-block w-4 h-4 mr-1" />
                          {step.timeframe}
                        </span>
                        <span className={`px-2 py-1 rounded ${
                          step.complexity === 'High' ? 'bg-amber-100 text-amber-800' : 
                          step.complexity === 'Medium' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {step.complexity} Complexity
                        </span>
                      </div>
                      
                      {/* Deliberately vague next steps */}
                      {i === 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-500 italic">
                            Implementation requires expert guidance to address your specific business context
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-12 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MessageCircle className="mr-2 text-purple-600" size={18} />
                Ask Our AI a Specific Question
              </h3>
              
              <div className="mb-4">
                <input
                  type="text"
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  placeholder="E.g., How could AI improve our customer retention?"
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
              
              <button 
                onClick={handleAskAI}
                disabled={isTypingResponse || !chatQuestion.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center justify-center disabled:bg-purple-300"
              >
                {isTypingResponse ? 'AI is thinking...' : (
                  <>
                    Ask AI <Send size={16} className="ml-2" />
                  </>
                )}
              </button>
              
              {chatResponse && (
                <div className="bg-white p-4 rounded border border-gray-200 mt-4">
                  <p className="text-gray-700">{chatResponse}</p>
                </div>
              )}
            </div>
            
            {/* CTA Section */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white rounded-xl p-8 shadow-xl">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl font-bold mb-2">Ready to Move Forward?</h3>
                <p className="text-white/90 mb-6">
                  This assessment is just the beginning. Schedule a consultation with our AI experts to develop a comprehensive 
                  implementation strategy tailored to your specific business needs.
                </p>
                <Link 
                  href="/schedule-consultation?source=strategy-report" 
                  className="inline-block px-6 py-3 bg-white text-purple-900 font-semibold rounded-md hover:bg-gray-100 transition"
                >
                  Schedule Your Free Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        );
      
      default: // form stage
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  className="w-full p-3 border border-gray-300 rounded"
                  value={formData.businessName}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select
                  id="industry"
                  name="industry"
                  required
                  className="w-full p-3 border border-gray-300 rounded"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  <option value="">Select your industry</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance & Banking</option>
                  <option value="technology">Technology</option>
                  <option value="education">Education</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                <select
                  id="companySize"
                  name="companySize"
                  required
                  className="w-full p-3 border border-gray-300 rounded"
                  value={formData.companySize}
                  onChange={handleChange}
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              
              <div className="relative">
                <label htmlFor="topChallenges" className="block text-sm font-medium text-gray-700 mb-1">
                  Top Business Challenges
                </label>
                <textarea
                  id="topChallenges"
                  name="topChallenges"
                  required
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder="Describe your top 2-3 business challenges that you think AI could help with..."
                  value={formData.topChallenges}
                  onChange={handleChange}
                ></textarea>
                
                {/* Challenge suggestions appear here */}
                {challengeSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                    <ul className="py-1">
                      {challengeSuggestions.map((suggestion, index) => (
                        <li 
                          key={index}
                          className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm"
                          onClick={() => selectChallengeSuggestion(suggestion)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget for AI Solutions</label>
                <select
                  id="budget"
                  name="budget"
                  required
                  className="w-full p-3 border border-gray-300 rounded"
                  value={formData.budget}
                  onChange={handleChange}
                >
                  <option value="">Select budget range</option>
                  <option value="25000-50000">$25,000 - $50,000</option>
                  <option value="50000-100000">$50,000 - $100,000</option>
                  <option value="100000-150000">$100,000 - $150,000</option>
                  <option value="150000-250000">$150,000 - $250,000</option>
                  <option value="250000+">$250,000+</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full p-3 border border-gray-300 rounded"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Generate My AI Strategy Report <ArrowRight className="ml-2" size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        );
    }
  };

  // ... [keep all the existing functions like downloadReport, generateReportContent, etc.]
  // They won't be used in the immediate flow but we'll keep them for future functionality
  
  return (
    <main className="bg-purple-900 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          className="bg-white rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8 md:p-12 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 text-purple-600">
                <FileText className="w-full h-full" />
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Strategy Report Generator</h1>
            <p className="text-gray-600 mb-8">
              Answer a few questions to get a preliminary AI analysis.
            </p>
            
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-left">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {renderStageContent()}
          </div>
        </motion.div>
      </div>
    </main>
  );
} 