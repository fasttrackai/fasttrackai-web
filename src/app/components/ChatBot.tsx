'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Calendar, PhoneCall, Zap, BarChart, Database, Brain, ChevronRight, MessageSquare, Clock } from 'lucide-react';
import { useChat } from 'ai/react';
import { nanoid } from 'nanoid';
import { Message } from 'ai';
import { saveLead } from '@/lib/firebase/firebaseUtils';
import { LeadData, AssessmentAnswer } from '@/lib/types/leads';

// Initial welcome message shown to users
const INITIAL_MESSAGE: Message = {
  id: nanoid(),
  role: 'assistant',
  content: "Hi! I'm your AI Advisor. Need an AI readiness assessment or have a specific question?"
};

// Define assessment stages for a guided experience
const ASSESSMENT_STAGES = [
  {
    id: 'introduction',
    title: 'Introduction',
    description: 'Understanding your business',
    icon: <Brain className="h-5 w-5" />,
    questions: [
      {
        id: 'industry',
        question: "What industry is your business in?",
        placeholder: "e.g., Healthcare, Manufacturing, Technology"
      },
      {
        id: 'company_size',
        question: "Roughly how many employees does your organization have?",
        placeholder: "e.g., 10-50, 50-200, 200+"
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical Readiness',
    description: 'Evaluating your data systems',
    icon: <Database className="h-5 w-5" />,
    questions: [
      {
        id: 'data_systems',
        question: "Do you currently collect and store digital data about your operations, customers, or processes?",
        placeholder: "Yes/No and brief details if applicable"
      },
      {
        id: 'current_tech',
        question: "What software or systems do you currently use for your core business operations?",
        placeholder: "List your key software tools"
      }
    ]
  },
  {
    id: 'business',
    title: 'Business Objectives',
    description: 'Understanding your goals',
    icon: <BarChart className="h-5 w-5" />,
    questions: [
      {
        id: 'pain_points',
        question: "What are your top operational challenges that you believe AI could help solve?",
        placeholder: "Describe your challenges"
      },
      {
        id: 'roi_expectations',
        question: "What kind of ROI expectations do you have for AI implementation?",
        placeholder: "e.g., Efficiency gains, cost reduction"
      }
    ]
  },
  {
    id: 'implementation',
    title: 'Implementation Planning',
    description: 'Planning your AI journey',
    icon: <Zap className="h-5 w-5" />,
    questions: [
      {
        id: 'timeline_budget',
        question: "What's your desired timeline for AI implementation, and do you have a budget range in mind?",
        placeholder: "e.g., 6 months, $50K-100K budget"
      },
      {
        id: 'exit_strategy',
        question: "Are you considering M&A opportunities in the next 12-24 months?",
        placeholder: "Yes/No and brief explanation"
      }
    ]
  }
];

export default function ChatBot() {
  // State variables
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [mode, setMode] = useState<'chat' | 'assessment'>('chat');
  const [currentStage, setCurrentStage] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const showOptionsRef = useRef(false);
  const [minimized, setMinimized] = useState(false);
  const [typingEffect, setTypingEffect] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [messageFocus, setMessageFocus] = useState(-1);
  const [contextMemory, setContextMemory] = useState<string[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const lastMessageTimeRef = useRef<number>(Date.now());
  const userInactiveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [detailsRequested, setDetailsRequested] = useState<Record<string, number>>({});
  const [assessmentState, setAssessmentState] = useState<'in_progress' | 'reviewing' | 'completed'>('in_progress');
  
  // Lead tracking
  const [leadInfo, setLeadInfo] = useState<{
    interactionStartTime: number;
    messageCount: number;
    lastPromptTime: number | null;
  }>({
    interactionStartTime: Date.now(),
    messageCount: 0,
    lastPromptTime: null
  });

  // Suggestions for various questions
  const suggestions = {
    industry_size: ["Healthcare, 100-500 employees", "Retail, 10-50 employees", "Manufacturing, 500+ employees", "Technology, 50-100 employees"],
    pain_points: ["Operational inefficiency", "Customer service delays", "Production bottlenecks", "Data analysis challenges"],
    timeline_budget: ["6 months, $50K-100K", "12 months, $100K-250K", "3 months, under $50K", "Exploratory phase only"]
  };

  // Connection to our simple-chat API endpoint (the one that works) using the Vercel AI SDK
  const { messages, input, handleInputChange, handleSubmit: aiHandleSubmit, isLoading, append, setMessages } = useChat({
    api: '/api/simple-chat', // Using the working API route
    initialMessages: [INITIAL_MESSAGE],
    onFinish: (message) => {
      setUnreadCount(prev => isOpen ? prev : prev + 1);
      
      // Track message count for lead generation
      setLeadInfo(prev => ({
        ...prev,
        messageCount: prev.messageCount + 1
      }));
      
      // Update context memory with key information from AI responses
      updateContextMemory(message.content);
      
      // Generate relevant quick replies based on the AI's response
      generateQuickReplies(message.content);
      
      // Reset typing animation
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      setTypingEffect(false);
      
      // Record last message time for inactivity detection
      lastMessageTimeRef.current = Date.now();
      
      // Use a ref to get the current value of showOptions to prevent loops
      const currentShowOptions = showOptionsRef.current;
      
      // Only show consultation prompt in chat mode or when assessment is complete
      const shouldPromptConsultation = (
        !currentShowOptions && 
        (mode === 'chat' && leadInfo.messageCount >= 3 || 
         (mode === 'assessment' && assessmentComplete)) &&
        (leadInfo.lastPromptTime === null || (Date.now() - leadInfo.lastPromptTime > 5 * 60 * 1000))
      );
      
      if (shouldPromptConsultation) {
        // Set the ref immediately to prevent multiple prompts
        showOptionsRef.current = true;
        
        setTimeout(() => {
          append({
            id: nanoid(),
            role: 'assistant',
            content: "Want to discuss how our AI solutions can help your business? Schedule a free consultation with our experts."
          });
          
          setShowOptions(true);
          setLeadInfo(prev => ({
            ...prev,
            lastPromptTime: Date.now()
          }));
          
          // Log the lead interaction
          logLeadInteraction().catch(err => 
            console.error('Failed to log lead interaction:', err)
          );
        }, 2000);
      }
      
      // Only set up inactivity prompt in chat mode, not during assessment
      if (mode === 'chat') {
        setupInactivityPrompt();
      }
    },
    onError: (error) => {
      console.error('Chat error:', error);
      append({
        id: nanoid(),
        role: 'assistant',
        content: "I'm having trouble connecting to our servers. Please try again or contact our support team."
      });
    }
  });

  // Extract key information from responses to build context
  const updateContextMemory = (message: string) => {
    // Look for industry mentions
    const industryMatch = message.match(/industry.{1,20}(healthcare|retail|manufacturing|technology|finance|education|insurance)/i);
    if (industryMatch && !contextMemory.some(item => item.includes('industry'))) {
      setContextMemory(prev => [...prev, `Industry: ${industryMatch[1]}`]);
    }
    
    // Look for company size
    const sizeMatch = message.match(/(\d+)[ -]+(\d+)?\s*employees/i);
    if (sizeMatch && !contextMemory.some(item => item.includes('company size'))) {
      setContextMemory(prev => [...prev, `Company size: ${sizeMatch[0]}`]);
    }
    
    // Look for pain points
    const painMatch = message.match(/(challenges?|problems?|pain points?|struggles?).{1,30}(efficiency|data|customer|process|cost)/i);
    if (painMatch && !contextMemory.some(item => item.includes('pain point'))) {
      setContextMemory(prev => [...prev, `Pain point: ${painMatch[2]}`]);
    }
    
    // Limit context memory size
    if (contextMemory.length > 5) {
      setContextMemory(prev => prev.slice(-5));
    }
  };

  // Generate quick reply suggestions based on conversation context
  const generateQuickReplies = (lastMessage: string) => {
    // If the message is asking a question
    if (lastMessage.includes('?')) {
      if ((lastMessage.includes('industry') || lastMessage.includes('sector')) && 
          !lastMessage.includes('employee')) {
        setQuickReplies([
          'Healthcare', 
          'Technology', 
          'Manufacturing', 
          'Financial Services',
          'Retail'
        ]);
      } else if (lastMessage.includes('employee') || lastMessage.includes('size')) {
        setQuickReplies([
          '1-10 employees',
          '10-50 employees',
          '50-200 employees',
          '200-500 employees',
          '500+ employees'
        ]);
      } else if (lastMessage.includes('data') || lastMessage.includes('store')) {
        setQuickReplies([
          'Yes, we collect customer data',
          'Yes, we have operational data',
          'Limited data collection',
          'No, we don\'t have organized data'
        ]);
      } else if (lastMessage.includes('challenge') || lastMessage.includes('problem')) {
        setQuickReplies([
          'Operational inefficiency',
          'Data management challenges',
          'Customer insights',
          'Process automation',
          'Quality control'
        ]);
      } else if (lastMessage.includes('ROI') || lastMessage.includes('expectations')) {
        setQuickReplies([
          'Cost reduction',
          'Revenue growth',
          'Improved efficiency',
          'Better decision making',
          'Enhanced customer experience'
        ]);
      } else {
        // Default replies for any other question
        setQuickReplies([
          'Tell me more about that',
          'How would AI help with this?',
          'What solutions do you offer?',
          'Can you provide case studies?',
          'What\'s the typical ROI?'
        ]);
      }
    } else {
      // Clear quick replies if not a question
      setQuickReplies([]);
    }
  };

  // Set up inactivity prompt for engagement
  const setupInactivityPrompt = () => {
    // Clear any existing timeout
    if (userInactiveTimeoutRef.current) {
      clearTimeout(userInactiveTimeoutRef.current);
    }
    
    // Set new timeout for 2 minutes
    userInactiveTimeoutRef.current = setTimeout(() => {
      // Only prompt if chat is open, user hasn't been prompted recently, and not in assessment mode
      if (isOpen && Date.now() - lastMessageTimeRef.current > 120000 && !showOptions && mode === 'chat') {
        append({
          id: nanoid(),
          role: 'assistant',
          content: "I notice you're still thinking. Would you like more information about any specific AI solution or use case?"
        });
      }
    }, 120000); // 2 minutes
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      if (userInactiveTimeoutRef.current) {
        clearTimeout(userInactiveTimeoutRef.current);
      }
    };
  }, []);

  // Log lead interaction for hot lead tracking
  const logLeadInteraction = async () => {
    try {
      // Get conversation history
      const conversationHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      
      // Prepare lead data
      const leadData: LeadData = {
        timestamp: new Date().toISOString(),
        interactionDuration: Math.floor((Date.now() - leadInfo.interactionStartTime) / 1000),
        messageCount: leadInfo.messageCount,
        conversationHistory,
        assessmentAnswers: mode === 'assessment' ? assessmentAnswers : {},
        source: 'chatbot',
        userAgent: navigator.userAgent,
        pagePath: window.location.pathname,
        referrer: document.referrer,
        contactMethod: mode === 'assessment' ? 'assessment' : 'chat'
      };
      
      // Store locally as backup
      const existingLeads = JSON.parse(localStorage.getItem('hotLeads') || '[]');
      existingLeads.push(leadData);
      localStorage.setItem('hotLeads', JSON.stringify(existingLeads));
      
      // Save to Firebase Realtime Database
      const leadId = await saveLead(leadData);
      console.log('Hot lead saved to Firebase with ID:', leadId);
      
      return leadId;
    } catch (error) {
      console.error('Error logging lead:', error);
      // Still try to save locally if Firebase fails
      return null;
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingEffect]);

  // Regular submit handler for free chat mode
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    setHasInteracted(true);
    
    // Reset quick replies when user sends a message
    setQuickReplies([]);
    
    // Reset inactivity timer
    lastMessageTimeRef.current = Date.now();
    
    // Simulate typing effect
    setTypingEffect(true);
    const newTimeout = setTimeout(() => {
      setTypingEffect(false);
    }, 1000 + Math.random() * 2000); // Random typing time between 1-3 seconds
    setTypingTimeout(newTimeout);
    
    await aiHandleSubmit(e);
  };

  // Handle assessment mode submissions
  const handleAssessmentSubmit = () => {
    if (!userAnswer.trim()) return;
    
    const currentStageData = ASSESSMENT_STAGES[currentStage];
    const currentQuestionData = currentStageData.questions[currentQuestion];
    
    // Check if the answer is too short and we haven't asked for details twice already
    const questionId = currentQuestionData.id;
    const detailsCount = detailsRequested[questionId] || 0;
    
    // Only ask for more details for certain question types and longer responses
    const shouldAskForDetails = 
      userAnswer.length < 5 && 
      detailsCount < 1 && 
      !['industry', 'company_size'].includes(questionId) && 
      !userAnswer.toLowerCase().includes('yes') && 
      !userAnswer.toLowerCase().includes('no');
    
    if (shouldAskForDetails) {
      // Ask for more details
      setDetailsRequested(prev => ({ ...prev, [questionId]: detailsCount + 1 }));
      
      append({
        id: nanoid(),
        role: 'user',
        content: userAnswer
      });
      
      setTimeout(() => {
        append({
          id: nanoid(),
          role: 'assistant',
          content: `Could you provide a bit more detail about that? This will help us better assess your AI readiness.`
        });
      }, 500);
      
      setUserAnswer('');
      return;
    }
    
    // Save the answer
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: userAnswer
    }));
    
    // Simulate adding messages to the chat
    append({
      id: nanoid(),
      role: 'user',
      content: userAnswer
    });
    
    // Track message count for lead generation
    setLeadInfo(prev => ({
      ...prev,
      messageCount: prev.messageCount + 1
    }));
    
    // Clear input
    setUserAnswer('');
    
    // Reset inactivity timer
    lastMessageTimeRef.current = Date.now();
    
    // Move to next question or stage
    if (currentQuestion < currentStageData.questions.length - 1) {
      // Next question in the same stage
      setCurrentQuestion(currentQuestion + 1);
      
      setTimeout(() => {
        const nextQuestion = currentStageData.questions[currentQuestion + 1].question;
        append({
          id: nanoid(),
          role: 'assistant',
          content: nextQuestion
        });
      }, 700);
    } else {
      // Move to next stage or complete assessment
      if (currentStage < ASSESSMENT_STAGES.length - 1) {
        setCurrentStage(currentStage + 1);
        setCurrentQuestion(0);
        
        // Add a transition message between stages
        setTimeout(() => {
          append({
            id: nanoid(),
            role: 'assistant',
            content: `Thanks for that information. Let's move on to ${ASSESSMENT_STAGES[currentStage + 1].title}.`
          });
          
          // Add a slight pause before showing the next question
          setTimeout(() => {
            const nextStage = ASSESSMENT_STAGES[currentStage + 1];
            append({
              id: nanoid(),
              role: 'assistant',
              content: nextStage.questions[0].question
            });
          }, 1000);
        }, 700);
      } else {
        // Assessment complete - set reviewing state
        setAssessmentState('reviewing');
        
        setTimeout(() => {
          append({
            id: nanoid(),
            role: 'assistant',
            content: "Thanks for completing the assessment! I'm reviewing your information to provide personalized recommendations..."
          });
          
          // Simulate "thinking" and then provide a personalized recommendation
          setTimeout(() => {
            // Generate personalized recommendation based on collected answers
            const industry = assessmentAnswers['industry'] || '';
            const companySize = assessmentAnswers['company_size'] || '';
            const painPoints = assessmentAnswers['pain_points'] || '';
            
            let recommendation = '';
            
            if (industry.toLowerCase().includes('manufacturing')) {
              recommendation = `Based on your assessment, I see your manufacturing business could benefit from AI in ${painPoints.toLowerCase().includes('efficien') ? 'process optimization and predictive maintenance' : 'quality control and supply chain management'}. Our team has helped similar manufacturers achieve 15-30% efficiency gains.`;
            } else if (industry.toLowerCase().includes('health')) {
              recommendation = `For your healthcare organization, AI can transform ${painPoints.toLowerCase().includes('data') ? 'patient data analysis and care optimization' : 'administrative efficiency and clinical decision support'}. Our healthcare clients typically see reduced costs and improved outcomes within 4-6 months.`;
            } else if (industry.toLowerCase().includes('retail')) {
              recommendation = `In retail, we've helped businesses like yours leverage AI for ${painPoints.toLowerCase().includes('customer') ? 'personalized customer experiences and demand forecasting' : 'inventory optimization and pricing strategy'}. Clients typically see ROI within the first year.`;
            } else if (industry.toLowerCase().includes('tech')) {
              recommendation = `For technology companies, our AI solutions can ${painPoints.toLowerCase().includes('develop') ? 'accelerate product development and automate testing' : 'enhance customer support and optimize operations'}. We've helped similar companies reduce development cycles by up to 40%.`;
            } else if (industry.toLowerCase().includes('financ')) {
              recommendation = `In financial services, AI can provide ${painPoints.toLowerCase().includes('risk') ? 'advanced risk assessment and fraud detection' : 'customer insights and process automation'}. Our clients typically see significant compliance improvements and cost reductions.`;
            } else {
              recommendation = `Based on your assessment, I can see several opportunities where AI could deliver significant value for your ${industry || ''} business, particularly around ${painPoints || 'operational efficiency and data-driven decision making'}.`;
            }
            
            // Add the recommendation
            append({
              id: nanoid(),
              role: 'assistant',
              content: recommendation
            });
            
            // Mark assessment as complete
            setAssessmentComplete(true);
            setAssessmentState('completed');
            
            // Show consultation options after a short delay
            setTimeout(() => {
              setShowOptions(true);
              
              // Log the lead interaction when assessment is complete
              logLeadInteraction().catch(err => 
                console.error('Failed to log assessment completion lead:', err)
              );
            }, 1500);
          }, 2500);
        }, 1000);
      }
    }
  };

  // Handle starting guided assessment
  const startAssessment = () => {
    setMode('assessment');
    setShowWelcome(false);
    setAssessmentState('in_progress');
    
    // Reset assessment state
    setCurrentStage(0);
    setCurrentQuestion(0);
    setAssessmentAnswers({});
    setDetailsRequested({});
    setQuickReplies([]); // Reset quick replies
    setShowOptions(false); // Reset consultation options
    showOptionsRef.current = false; // Reset options ref
    
    // Reset messages to only show the first question
    setMessages([
      {
        id: nanoid(),
        role: 'assistant',
        content: ASSESSMENT_STAGES[0].questions[0].question
      }
    ]);
  };

  // Handle scheduling consultation
  const handleScheduleConsult = async () => {
    // Log lead before redirecting
    try {
      await logLeadInteraction();
      
      // Store assessment answers
      localStorage.setItem('assessment_answers', JSON.stringify(assessmentAnswers));
      
      // Add confirmation message
      append({
        id: nanoid(),
        role: 'assistant',
        content: "Great! Redirecting you to our booking page."
      });
      
      // Redirect after a brief delay
      setTimeout(() => {
        window.open('/schedule-consultation', '_blank');
      }, 1500);
    } catch (error) {
      console.error('Error handling consultation scheduling:', error);
      
      // Still redirect even if there's an error with logging
      setTimeout(() => {
        window.open('/schedule-consultation', '_blank');
      }, 1500);
    }
  };

  // Handle instant consultation
  const handleInstantConsult = async () => {
    // Log lead before redirecting
    try {
      await logLeadInteraction();
      
      // Store assessment answers
      localStorage.setItem('assessment_answers', JSON.stringify(assessmentAnswers));
      
      // Add confirmation message
      append({
        id: nanoid(),
        role: 'assistant',
        content: "Connecting you with an AI expert right away."
      });
      
      // Redirect after a brief delay
      setTimeout(() => {
        window.location.href = '/instant-consultation';
      }, 1500);
    } catch (error) {
      console.error('Error handling instant consultation:', error);
      
      // Still redirect even if there's an error with logging
      setTimeout(() => {
        window.location.href = '/instant-consultation';
      }, 1500);
    }
  };

  // Gets appropriate suggestions for current question
  const getCurrentSuggestions = () => {
    if (mode !== 'assessment') return [];
    
    const currentStageData = ASSESSMENT_STAGES[currentStage];
    const currentQuestionData = currentStageData.questions[currentQuestion];
    
    return suggestions[currentQuestionData.id as keyof typeof suggestions] || [];
  };

  // Apply suggestion to input
  const applySuggestion = (suggestion: string) => {
    setUserAnswer(suggestion);
    setShowSuggestions(false);
  };

  // Apply quick reply
  const applyQuickReply = (reply: string) => {
    if (mode === 'assessment') {
      setUserAnswer(reply);
    } else {
      handleInputChange({ target: { value: reply } } as React.ChangeEvent<HTMLInputElement>);
    }
    setQuickReplies([]);
  };

  // Reset unread count when chat is opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Keep showOptionsRef in sync with showOptions state
  useEffect(() => {
    showOptionsRef.current = showOptions;
  }, [showOptions]);

  return (
    <>
      {/* Minimized floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-16 h-16 bg-purple-700 text-white rounded-full shadow-lg hover:bg-purple-800 transition-all duration-300 group"
        >
          <MessageSquare className="h-7 w-7" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          <span className="absolute whitespace-nowrap right-full mr-2 px-2 py-1 bg-purple-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Chat with AI Advisor
          </span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className={`fixed ${minimized ? 'bottom-4 right-4 w-80 h-16' : 'bottom-8 right-8 w-96 h-[600px]'} bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 border border-purple-200`}>
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
            {minimized ? (
              <div className="flex items-center space-x-2 w-full" onClick={() => setMinimized(false)}>
                <Bot className="h-6 w-6 text-white" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">AI Business Advisor</h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="text-white/80 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">AI Business Advisor</h3>
                    <p className="text-xs text-white/70">Powered by fasttrackai</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setMinimized(true)}
                    className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {!minimized && (
            <>
              {/* Assessment progress bar when in assessment mode */}
              {mode === 'assessment' && !assessmentComplete && (
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <div className="flex items-center justify-between mb-1.5 text-xs text-gray-600">
                    <span>Assessment Progress</span>
                    <span>{Math.round(((currentStage * 100) + (currentQuestion * 25)) / ASSESSMENT_STAGES.length)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.round(((currentStage * 100) + (currentQuestion * 25)) / ASSESSMENT_STAGES.length)}%` }}>
                    </div>
                  </div>
                  <div className="flex justify-between mt-3">
                    {ASSESSMENT_STAGES.map((stage, idx) => (
                      <div key={stage.id} className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${idx <= currentStage ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
                          {idx + 1}
                        </div>
                        <span className="text-[10px] mt-1 text-gray-600">{stage.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Welcome screen */}
              {showWelcome && (
                <div className="p-6 flex-1 overflow-auto">
                  <h3 className="text-xl font-bold text-center mb-6 text-purple-800">How can I assist you today?</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <button 
                      onClick={startAssessment}
                      className="flex items-center p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-left"
                    >
                      <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <BarChart className="h-6 w-6 text-purple-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">AI Readiness Assessment</h4>
                        <p className="text-sm text-gray-600">Take a guided assessment to evaluate your organization's AI readiness</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
                    </button>
                    
                    <button
                      onClick={() => setShowWelcome(false)}
                      className="flex items-center p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-left"
                    >
                      <div className="bg-indigo-100 p-3 rounded-full mr-4">
                        <MessageSquare className="h-6 w-6 text-indigo-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Free Chat</h4>
                        <p className="text-sm text-gray-600">Ask any questions about AI implementation or our services</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
                    </button>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">We're here to help you navigate your AI journey.</p>
                  </div>
                </div>
              )}

              {/* Messages */}
              {!showWelcome && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages">
                  {/* Context banner - show when we have gathered useful information in chat mode only */}
                  {contextMemory.length > 0 && mode === 'chat' && (
                    <div className="bg-purple-50 text-purple-800 text-xs px-3 py-2 rounded-lg mb-2">
                      <div className="flex items-center mb-1">
                        <Brain className="h-3 w-3 mr-1" />
                        <span className="font-semibold">AI context awareness</span>
                      </div>
                      <div className="text-gray-600 text-[10px]">
                        {contextMemory.map((item, i) => (
                          <span key={i} className="mr-2">{item}{i < contextMemory.length - 1 ? ' • ' : ''}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assessment reviewing state indicator */}
                  {mode === 'assessment' && assessmentState === 'reviewing' && !assessmentComplete && (
                    <div className="bg-indigo-50 text-indigo-800 text-xs px-3 py-2 rounded-lg mb-2 animate-pulse">
                      <div className="flex items-center">
                        <Brain className="h-3 w-3 mr-1 animate-pulse" />
                        <span className="font-semibold">Analyzing your assessment...</span>
                      </div>
                    </div>
                  )}

                  {/* Message display */}
                  {messages.map((message, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        message.role === 'assistant' ? 'justify-start' : 'justify-end'
                      } ${i === messageFocus ? 'animate-pulse' : ''}`}
                      onClick={() => setMessageFocus(i === messageFocus ? -1 : i)}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center mr-2">
                          <Bot className="h-5 w-5 text-purple-700" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 ${
                          message.role === 'assistant'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-purple-700 text-white'
                        }`}
                      >
                        {message.content}
                        
                        {/* Add timestamp to messages */}
                        <div className={`text-[9px] mt-1.5 text-right ${
                          message.role === 'assistant' ? 'text-gray-500' : 'text-purple-200'
                        }`}>
                          {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex-shrink-0 flex items-center justify-center ml-2">
                          <span className="text-purple-700 font-semibold text-sm">You</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Quick replies */}
                  {quickReplies.length > 0 && !isLoading && !showOptions && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {quickReplies.map((reply, i) => (
                        <button
                          key={i}
                          onClick={() => applyQuickReply(reply)}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs px-2.5 py-1.5 rounded-full transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Enhanced typing indicator with animated ellipsis */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center mr-2">
                        <Bot className="h-5 w-5 text-purple-700" />
                      </div>
                      <div className="max-w-[85%] rounded-2xl p-3.5 bg-gray-100 flex items-center">
                        <span className="relative h-2">
                          <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ left: '0px', animationDelay: '0ms' }}></span>
                          <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ left: '6px', animationDelay: '200ms' }}></span>
                          <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ left: '12px', animationDelay: '400ms' }}></span>
                        </span>
                        <span className="ml-5 text-xs text-gray-500">AI is thinking</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Consultation Options */}
                  {showOptions && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
                        <h4 className="font-semibold mb-3 text-purple-900">Ready to take the next step?</h4>
                        <div className="space-y-2">
                          <button
                            onClick={handleScheduleConsult}
                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-700 to-indigo-600 text-white px-4 py-2.5 rounded-lg hover:from-purple-800 hover:to-indigo-700 transition-colors"
                          >
                            <Calendar className="h-5 w-5" />
                            <span>Schedule Consultation</span>
                          </button>
                          <button
                            onClick={handleInstantConsult}
                            className="w-full flex items-center justify-center space-x-2 bg-white border border-purple-300 text-purple-800 px-4 py-2.5 rounded-lg hover:bg-purple-50 transition-colors"
                          >
                            <PhoneCall className="h-5 w-5" />
                            <span>Get Instant Help</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Input area */}
              {!showWelcome && !showOptions && (
                <div className="p-3 border-t border-gray-200">
                  {mode === 'chat' ? (
                    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                      <input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-800"
                        disabled={isLoading}
                      />
                      <button
                        type="submit"
                        className="bg-purple-700 hover:bg-purple-800 text-white p-2.5 rounded-lg transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
                        disabled={isLoading || !input.trim()}
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          value={userAnswer}
                          onChange={(e) => {
                            setUserAnswer(e.target.value);
                            setShowSuggestions(!!e.target.value && e.target.value.length > 1);
                          }}
                          onFocus={() => setShowSuggestions(!!userAnswer && userAnswer.length > 1)}
                          placeholder={ASSESSMENT_STAGES[currentStage].questions[currentQuestion].placeholder}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-800"
                        />
                        
                        {showSuggestions && getCurrentSuggestions().length > 0 && (
                          <div className="absolute bottom-full mb-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-48 overflow-y-auto z-10">
                            {getCurrentSuggestions().map((suggestion, idx) => (
                              <div 
                                key={idx} 
                                className="p-2 hover:bg-purple-50 cursor-pointer text-sm text-gray-800"
                                onClick={() => applySuggestion(suggestion)}
                              >
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setMode('chat')}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700"
                        >
                          Cancel Assessment
                        </button>
                        <button
                          onClick={handleAssessmentSubmit}
                          disabled={!userAnswer.trim()}
                          className="flex-1 bg-purple-700 hover:bg-purple-800 text-white px-3 py-2 rounded-lg transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {currentStage === ASSESSMENT_STAGES.length - 1 && currentQuestion === ASSESSMENT_STAGES[currentStage].questions.length - 1 
                            ? 'Complete Assessment' 
                            : 'Next Question'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
} 