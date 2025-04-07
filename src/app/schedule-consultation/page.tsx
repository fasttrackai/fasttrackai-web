'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Check, User, Mail, Building, Phone, MessageSquare, Send, ArrowRight, Star, Briefcase, Target, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ScheduleConsultation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    industry: '',
    budget: '',
    challengeArea: ''
  });
  
  const [dateSelection, setDateSelection] = useState({
    selectedDate: '',
    selectedTime: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCalWidget, setShowCalWidget] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Initialize Cal widget when it's shown
  useEffect(() => {
    if (showCalWidget && calendarRef.current) {
      // @ts-ignore - Cal is added by the script
      if (typeof window !== 'undefined' && window.Cal) {
        try {
          // @ts-ignore - Cal is added by the script
          const cal = window.Cal.getOrCreateInstance();
          cal.inline({
            elementOrSelector: calendarRef.current,
            calLink: "fasttrack-ai/consultation",
            config: {
              name: formData.name,
              email: formData.email,
              notes: `Company: ${formData.company}\nIndustry: ${formData.industry}\nChallenge: ${formData.challengeArea}\nBudget: ${formData.budget || 'Not specified'}\nAdditional Info: ${formData.message || 'None'}`
            }
          });
        } catch (error) {
          console.error("Error initializing Cal widget:", error);
        }
      }
    }
  }, [showCalWidget, formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSelection = (date: string) => {
    setDateSelection(prev => ({
      ...prev,
      selectedDate: date
    }));
  };

  const handleTimeSelection = (time: string) => {
    setDateSelection(prev => ({
      ...prev,
      selectedTime: time
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (error) {
      console.error('Error scheduling consultation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Available time slots for demo
  const availableDates = [
    { date: '2023-11-15', display: 'Wed, Nov 15' },
    { date: '2023-11-16', display: 'Thu, Nov 16' },
    { date: '2023-11-17', display: 'Fri, Nov 17' },
    { date: '2023-11-20', display: 'Mon, Nov 20' },
    { date: '2023-11-21', display: 'Tue, Nov 21' },
    { date: '2023-11-22', display: 'Wed, Nov 22' }
  ];

  const availableTimes = [
    { time: '09:00', display: '9:00 AM' },
    { time: '10:00', display: '10:00 AM' },
    { time: '11:00', display: '11:00 AM' },
    { time: '13:00', display: '1:00 PM' },
    { time: '14:00', display: '2:00 PM' },
    { time: '15:00', display: '3:00 PM' },
    { time: '16:00', display: '4:00 PM' }
  ];

  const testimonials = [
    {
      name: "Sarah Thompson",
      role: "CTO, TechNova Solutions",
      quote: "The strategy consultation with FastTrack AI was eye-opening. They identified AI opportunities we hadn't considered and provided a clear roadmap for implementation.",
      stars: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Operations Director, Global Retail Inc.",
      quote: "Within just 90 days of implementing FastTrack AI's recommendations, we've seen a 27% improvement in inventory management accuracy.",
      stars: 5
    },
    {
      name: "Jennifer Wu",
      role: "VP of Innovation, HealthFirst",
      quote: "Their consultation helped us navigate the complex intersection of AI and healthcare regulations, leading to solutions that improved patient outcomes while maintaining compliance.",
      stars: 5
    }
  ];

  // Updated step renderer
  const renderStep = () => {
    if (isSuccess) {
      return (
        <motion.div 
          className="text-center p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="heading-2 mb-4 text-gray-900">Consultation Scheduled!</h2>
          <p className="text-lg text-gray-700 mb-6">
            Thank you for scheduling a consultation with FastTrack AI. We've sent a confirmation to your email at <span className="font-semibold">{formData.email}</span>.
          </p>
          <p className="text-gray-700 mb-8">
            One of our AI strategy experts will be contacting you shortly at your scheduled time.
          </p>
          <div className="p-4 bg-purple-50 rounded-lg mb-8">
            <h3 className="font-semibold text-purple-800 mb-2">What to expect next:</h3>
            <ul className="text-left text-gray-700 space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                <span>Confirmation email with calendar invite</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                <span>Pre-consultation questionnaire to help us prepare</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                <span>30-minute strategy session with an AI implementation expert</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                <span>Follow-up with a customized implementation proposal</span>
              </li>
            </ul>
          </div>
          <Link href="/" className="button-primary inline-flex items-center">
            Return to Homepage
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="heading-3 mb-4 text-gray-900">Tell Us About Your Business</h2>
            <p className="text-gray-700 mb-6">
              Help us understand your business needs so we can prepare for a productive consultation.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-purple-600">
                    <div className="bg-gray-50 flex items-center justify-center px-3 border-r border-gray-300">
                      <User className="text-gray-400 h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 sm:py-3 border-0 focus:ring-0 focus:outline-none text-gray-900"
                      placeholder="John Smith"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Email *
                  </label>
                  <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-purple-600">
                    <div className="bg-gray-50 flex items-center justify-center px-3 border-r border-gray-300">
                      <Mail className="text-gray-400 h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 sm:py-3 border-0 focus:ring-0 focus:outline-none text-gray-900"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-purple-600">
                    <div className="bg-gray-50 flex items-center justify-center px-3 border-r border-gray-300">
                      <Building className="text-gray-400 h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 sm:py-3 border-0 focus:ring-0 focus:outline-none text-gray-900"
                      placeholder="Acme Corp"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-purple-600">
                    <div className="bg-gray-50 flex items-center justify-center px-3 border-r border-gray-300">
                      <Phone className="text-gray-400 h-5 w-5" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 sm:py-3 border-0 focus:ring-0 focus:outline-none text-gray-900"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Industry *
                </label>
                <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-purple-600">
                  <div className="bg-gray-50 flex items-center justify-center px-3 border-r border-gray-300">
                    <Briefcase className="text-gray-400 h-5 w-5" />
                  </div>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 sm:py-3 border-0 focus:ring-0 focus:outline-none text-gray-900"
                    required
                  >
                    <option value="">Select your industry</option>
                    <option value="retail">Retail</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance & Banking</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="technology">Technology</option>
                    <option value="education">Education</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="challengeArea" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Challenge Area *
                </label>
                <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-purple-600">
                  <div className="bg-gray-50 flex items-center justify-center px-3 border-r border-gray-300">
                    <Target className="text-gray-400 h-5 w-5" />
                  </div>
                  <select
                    id="challengeArea"
                    name="challengeArea"
                    value={formData.challengeArea}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 sm:py-3 border-0 focus:ring-0 focus:outline-none text-gray-900"
                    required
                  >
                    <option value="">Select your primary challenge</option>
                    <option value="strategy">Developing an AI strategy</option>
                    <option value="implementation">Implementing AI solutions</option>
                    <option value="integration">Integrating AI with existing systems</option>
                    <option value="optimization">Optimizing current AI implementations</option>
                    <option value="training">Training staff on AI technologies</option>
                    <option value="compliance">AI governance and compliance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Implementation Budget Range
                </label>
                <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-purple-600">
                  <div className="bg-gray-50 flex items-center justify-center px-3 border-r border-gray-300">
                    <DollarSign className="text-gray-400 h-5 w-5" />
                  </div>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 sm:py-3 border-0 focus:ring-0 focus:outline-none text-gray-900"
                  >
                    <option value="">Select budget range</option>
                    <option value="25000-50000">$25,000 - $50,000</option>
                    <option value="50000-100000">$50,000 - $100,000</option>
                    <option value="100000-150000">$100,000 - $150,000</option>
                    <option value="150000-250000">$150,000 - $250,000</option>
                    <option value="250000+">$250,000+</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-purple-600">
                  <div className="bg-gray-50 flex items-center justify-center px-3 border-r border-gray-300 self-stretch">
                    <MessageSquare className="text-gray-400 h-5 w-5" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="flex-1 px-4 py-3 sm:py-3 border-0 focus:ring-0 focus:outline-none text-gray-900"
                    placeholder="Tell us more about your AI goals or specific challenges..."
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="button-primary flex items-center"
                  disabled={!formData.name || !formData.email || !formData.company || !formData.industry || !formData.challengeArea}
                >
                  Continue to Schedule
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        if (showCalWidget) {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="p-4"
            >
              <h2 className="heading-3 mb-4 text-gray-900">Schedule Your Consultation</h2>
              <p className="text-gray-700 mb-6">
                Select a date and time that works best for your 30-minute strategy session.
              </p>
              
              <div 
                ref={calendarRef}
                className="rounded-md overflow-hidden"
                style={{ height: '630px' }}
              ></div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowCalWidget(false)}
                  className="button-secondary flex items-center"
                >
                  Back to Manual Selection
                </button>
              </div>
            </motion.div>
          );
        }
        
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="heading-3 mb-4 text-gray-900">Schedule Your Consultation</h2>
            <p className="text-gray-700 mb-6">
              Select a date and time that works best for your 30-minute strategy session.
            </p>
            
            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Scheduling Options
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowCalWidget(true)}
                  className="w-full bg-white border border-purple-200 hover:border-purple-300 text-purple-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Use Calendar Scheduling Tool
                </button>
                <p className="text-sm text-gray-600 italic">
                  Recommended: View real-time availability and automatically add to your calendar
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                Or Select a Date Manually
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableDates.map((date) => (
                  <button
                    key={date.date}
                    type="button"
                    className={`px-4 py-3 rounded-md text-left transition-colors ${
                      dateSelection.selectedDate === date.date
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleDateSelection(date.date)}
                  >
                    {date.display}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-purple-600" />
                Select a Time
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableTimes.map((time) => (
                  <button
                    key={time.time}
                    type="button"
                    className={`px-4 py-3 rounded-md text-center transition-colors ${
                      dateSelection.selectedTime === time.time
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleTimeSelection(time.time)}
                    disabled={!dateSelection.selectedDate}
                  >
                    {time.display}
                  </button>
                ))}
              </div>
            </div>
            
            {dateSelection.selectedDate && dateSelection.selectedTime && (
              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-purple-800 mb-2">Your Selected Appointment</h3>
                <p className="text-gray-700">
                  {availableDates.find(d => d.date === dateSelection.selectedDate)?.display} at{' '}
                  {availableTimes.find(t => t.time === dateSelection.selectedTime)?.display}
                </p>
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="button-secondary flex items-center"
              >
                Back to Information
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="button-primary flex items-center"
                disabled={!dateSelection.selectedDate || !dateSelection.selectedTime || isSubmitting}
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
                    Schedule Consultation
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen gradient-primary py-16">
      <Script src="https://cal.com/embed.js" strategy="afterInteractive" />
      
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center mb-12"
          >
            <motion.h1 
              className="heading-1 text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Schedule a Consultation
            </motion.h1>
            <motion.p 
              className="body-large text-white max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Speak with our AI strategy experts and discover how FastTrack AI can transform your business operations with customized AI solutions.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div 
              className="lg:col-span-7 bg-white rounded-xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-8">
                {!isSuccess && (
                  <div className="mb-6">
                    <div className="flex items-center justify-center w-full mb-4">
                      <div className={`h-2 w-2/4 rounded-l-full ${currentStep >= 1 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                      <div className={`h-2 w-2/4 rounded-r-full ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Business Information</span>
                      <span>Schedule Time</span>
                    </div>
                  </div>
                )}
                <form onSubmit={(e) => e.preventDefault()}>
                  {renderStep()}
                </form>
              </div>
            </motion.div>

            <motion.div 
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
                <div className="bg-purple-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white">What to Expect</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 rounded-full bg-purple-100 items-center justify-center">
                          <span className="text-sm font-medium text-purple-800">1</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-900">Discovery Call</h4>
                        <p className="mt-1 text-sm text-gray-500">30-minute call to understand your business needs and AI goals</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 rounded-full bg-purple-100 items-center justify-center">
                          <span className="text-sm font-medium text-purple-800">2</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-900">Strategy Proposal</h4>
                        <p className="mt-1 text-sm text-gray-500">Receive a customized AI strategy proposal within 48 hours</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 rounded-full bg-purple-100 items-center justify-center">
                          <span className="text-sm font-medium text-purple-800">3</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-900">Implementation Plan</h4>
                        <p className="mt-1 text-sm text-gray-500">Detailed roadmap for successful AI implementation</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-purple-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white">Client Testimonials</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex mb-2">
                          {[...Array(testimonial.stars)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-700 italic mb-2 text-sm">"{testimonial.quote}"</p>
                        <div className="font-medium text-gray-900 text-sm">{testimonial.name}</div>
                        <div className="text-gray-500 text-xs">{testimonial.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
} 