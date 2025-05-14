'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Calendar, PhoneCall, Zap, BarChart, Database, Brain, ChevronRight, MessageSquare } from 'lucide-react';
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
        id: 'industry_size',
        question: "What industry are you in, and roughly how many employees does your organization have?",
        placeholder: "e.g., Healthcare, 50-100 employees"
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
        placeholder: "Tell us about your data systems"
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [messageFocus, setMessageFocus] = useState(-1);
  
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
  const { messages, input, handleInputChange, handleSubmit: aiHandleSubmit, isLoading, append } = useChat({
    api: '/api/simple-chat', // Using the working API route
    initialMessages: [INITIAL_MESSAGE],
    onFinish: (message) => {
      setUnreadCount(prev => isOpen ? prev : prev + 1);
      
      // Track message count for lead generation
      setLeadInfo(prev => ({
        ...prev,
        messageCount: prev.messageCount + 1
      }));
      
      // Use a ref to get the current value of showOptions to prevent loops
      const currentShowOptions = showOptionsRef.current;
      
      // Check if we should prompt for consultation (after 2 messages or 5 minutes)
      const shouldPromptConsultation = (
        !currentShowOptions && 
        (leadInfo.messageCount >= 2) && 
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
    }
  });

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
    await aiHandleSubmit(e);
  };

  // Handle assessment mode submissions
  const handleAssessmentSubmit = () => {
    if (!userAnswer.trim()) return;
    
    const currentStageData = ASSESSMENT_STAGES[currentStage];
    const currentQuestionData = currentStageData.questions[currentQuestion];
    
    // Save the answer
    setAssessmentAnswers(prev => ({
      ...prev,
      [currentQuestionData.id]: userAnswer
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
      }, 500);
    } else {
      // Move to next stage or complete assessment
      if (currentStage < ASSESSMENT_STAGES.length - 1) {
        setCurrentStage(currentStage + 1);
        setCurrentQuestion(0);
        
        setTimeout(() => {
          const nextStage = ASSESSMENT_STAGES[currentStage + 1];
          append({
            id: nanoid(),
            role: 'assistant',
            content: nextStage.questions[0].question
          });
        }, 500);
      } else {
        // Assessment complete
        setAssessmentComplete(true);
        setShowOptions(true);
        
        setTimeout(() => {
          append({
            id: nanoid(),
            role: 'assistant',
            content: "Thanks! Would you like to schedule a consultation to discuss your personalized AI strategy?"
          });
          
          // Log the lead interaction when assessment is complete
          logLeadInteraction().catch(err => 
            console.error('Failed to log assessment completion lead:', err)
          );
        }, 800);
      }
    }
  };

  // Handle starting guided assessment
  const startAssessment = () => {
    setMode('assessment');
    setShowWelcome(false);
    
    // Add the first question to the chat
    setTimeout(() => {
      append({
        id: nanoid(),
        role: 'assistant',
        content: `What industry are you in and how many employees do you have?`
      });
    }, 500);
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
                <div className="px-4 py-2 bg-gray-50 border-b">
                  <div className="flex items-center justify-between mb-1 text-xs text-gray-600">
                    <span>Assessment Progress</span>
                    <span>{Math.round(((currentStage * 100) + (currentQuestion * 25)) / ASSESSMENT_STAGES.length)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.round(((currentStage * 100) + (currentQuestion * 25)) / ASSESSMENT_STAGES.length)}%` }}>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    {ASSESSMENT_STAGES.map((stage, idx) => (
                      <div key={stage.id} className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${idx <= currentStage ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
                          {idx + 1}
                        </div>
                        <span className="text-xs mt-1 text-gray-600 hidden md:block">{stage.title}</span>
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
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex-shrink-0 flex items-center justify-center ml-2">
                          <span className="text-purple-700 font-semibold text-sm">You</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center mr-2">
                        <Bot className="h-5 w-5 text-purple-700" />
                      </div>
                      <div className="max-w-[85%] rounded-2xl p-4 bg-gray-100 flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
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