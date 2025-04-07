'use client';

import { useState } from 'react';
import { Bot, X, Send, Calendar, PhoneCall } from 'lucide-react';
import { useChat } from 'ai/react';
import { nanoid } from 'nanoid';
import { Message } from 'ai';

const INITIAL_MESSAGE: Message = {
  id: nanoid(),
  role: 'assistant',
  content: "Hi! I'm here to help evaluate your business's AI readiness and potential for value creation. What industry are you in, and how many employees do you have?"
};

const qualificationQuestions = [
  {
    id: 'industry_size',
    question: "What industry are you in, and how many employees do you have?",
    category: "Company Information"
  },
  {
    id: 'revenue',
    question: "What's your annual revenue range? (This helps us gauge potential AI impact)",
    category: "Business Metrics"
  },
  {
    id: 'data_readiness',
    question: "Do you currently collect and store digital data about your operations, customers, or processes?",
    category: "Technical Assessment"
  },
  {
    id: 'pain_points',
    question: "What are your top 3 operational challenges that you believe AI could help solve?",
    category: "Needs Assessment"
  },
  {
    id: 'current_tech',
    question: "What software or systems do you currently use for your core business operations?",
    category: "Technical Assessment"
  },
  {
    id: 'timeline_budget',
    question: "What's your desired timeline for AI implementation, and do you have a budget range in mind?",
    category: "Implementation Planning"
  },
  {
    id: 'exit_strategy',
    question: "Are you considering M&A opportunities in the next 12-24 months?",
    category: "Strategic Goals"
  }
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showConsultOptions, setShowConsultOptions] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Connect to our API endpoint using the useChat hook from the Vercel AI SDK
  const { messages, input, handleInputChange, handleSubmit: aiHandleSubmit } = useChat({
    api: '/api/openai/chat', // Use our custom API endpoint
    initialMessages: [INITIAL_MESSAGE],
    onResponse: (response) => {
      // Keep track of the response but don't clear messages
      setIsLoading(false);
    },
    onFinish: (message) => {
      // Move to next question or show consultation options
      if (questionIndex < qualificationQuestions.length - 1) {
        setQuestionIndex(prev => prev + 1);
      } else {
        setShowConsultOptions(true);
      }
      // Store the answer
      setAnswers(prev => ({
        ...prev,
        [qualificationQuestions[questionIndex].id]: input
      }));
      
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error from chat API:', error);
      setIsLoading(false);
    },
    id: 'ai-advisor-chat', // Add a persistent ID for the chat
    preserve: true, // Preserve messages between rerenders
  });

  // Wrap the handleSubmit to add loading state
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setIsLoading(true);
    aiHandleSubmit(e);
  };

  const handleScheduleConsult = () => {
    // Save the collected answers to local storage or context for later use
    localStorage.setItem('qualification_answers', JSON.stringify(answers));
    window.open('/schedule-consultation', '_blank');
  };

  const handleInstantConsult = () => {
    // Save the collected answers to local storage or context for later use
    localStorage.setItem('qualification_answers', JSON.stringify(answers));
    window.location.href = '/instant-consultation';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`${isOpen ? 'hidden' : 'flex'} items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors`}
      >
        <Bot className="h-5 w-5" />
        <span>Chat with AI Advisor</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold">AI Business Advisor</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'assistant'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-[#4285f4] text-black'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            )}

            {/* Consultation Options */}
            {showConsultOptions && (
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Ready to take the next step?</h4>
                  <div className="space-y-2">
                    <button
                      onClick={handleScheduleConsult}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Schedule Consultation</span>
                    </button>
                    <button
                      onClick={handleInstantConsult}
                      className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <PhoneCall className="h-5 w-5" />
                      <span>Consult Now</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          {!showConsultOptions && (
            <form
              onSubmit={handleSubmit}
              className="border-t p-4 flex items-center space-x-2"
            >
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
} 