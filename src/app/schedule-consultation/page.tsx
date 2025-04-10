'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Check, User, Mail, Building, Phone, MessageSquare, Send, ArrowRight, Star, Briefcase, Target, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

// Define types for testimonials
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  stars: number;
}

// Define motion variants with proper types
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
} as const;

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;

// Define custom FormData interface
interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  primaryChallenge: string;
  implementationBudget: string;
  additionalInfo: string;
}

// Declare Cal.com types
declare global {
  interface Window {
    Cal?: {
      (method: string, options: any): void;
    };
  }
}

// Form initial state
const initialFormState: ConsultationFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  industry: '',
  primaryChallenge: '',
  implementationBudget: '',
  additionalInfo: '',
};

// Available options
const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Other',
  'Construction',
];

const challengeAreas = [
  'Process Automation',
  'Data Analysis',
  'Customer Service',
  'Document Processing',
  'Quality Control',
  'Other',
];

const budgetRanges = [
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000+',
];

const testimonials: Testimonial[] = [
  {
    quote: "FastTrack AI transformed our operations within weeks. Their expertise in AI implementation is unmatched.",
    name: "Sarah Chen",
    role: "CTO, TechCorp Solutions",
    stars: 5,
  },
  {
    quote: "The consultation process was smooth and insightful. They delivered exactly what we needed.",
    name: "Michael Rodriguez",
    role: "Operations Director, Global Manufacturing Inc.",
    stars: 5,
  },
];

export default function ScheduleConsultation() {
  const [formData, setFormData] = useState<ConsultationFormData>(initialFormState);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Cal.com widget when the component mounts
    const initCal = () => {
      if (window.Cal && calendarRef.current) {
        window.Cal("inline", {
          elementOrSelector: "#cal-booking-place",
          calLink: "fasttrack-ai/consultation",
          layout: "month_view"
        });
      }
    };

    // Check if Cal.com script is already loaded
    if (window.Cal) {
      initCal();
    }
  }, [currentStep]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      console.log('Submitting form data:', formData);
      
      const response = await fetch('/api/schedule-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        setErrorMessage('Server returned an invalid response. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      if (response.ok && data.success) {
        console.log('Form submitted successfully, moving to step 2');
        setCurrentStep(2);
        setIsSubmitting(false);
      } else {
        console.error('Form submission failed:', data);
        setErrorMessage(data.message || 'Failed to submit form. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Network or fetch error:', error);
      setErrorMessage('A network error occurred. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setCurrentStep(2);
  };

  const isStepOneValid = () => {
    return formData.name && formData.email && formData.phone && formData.company && 
           formData.industry && formData.primaryChallenge && formData.implementationBudget;
  };

  const renderStep = () => {
    if (showSuccess) {
      return (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center py-8"
        >
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600">
              Your consultation has been scheduled. We'll send you a confirmation email shortly.
            </p>
          </div>
        </motion.div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="inline-block h-4 w-4 mr-1" /> Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="inline-block h-4 w-4 mr-1" /> Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="inline-block h-4 w-4 mr-1" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Your phone number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    <Building className="inline-block h-4 w-4 mr-1" /> Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="form-input w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Your company name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  <Briefcase className="inline-block h-4 w-4 mr-1" /> Industry
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="form-select w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="primaryChallenge" className="block text-sm font-medium text-gray-700 mb-1">
                  <Target className="inline-block h-4 w-4 mr-1" /> Primary Challenge Area
                </label>
                <select
                  id="primaryChallenge"
                  name="primaryChallenge"
                  value={formData.primaryChallenge}
                  onChange={handleInputChange}
                  className="form-select w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Challenge Area</option>
                  {challengeAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="implementationBudget" className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="inline-block h-4 w-4 mr-1" /> Implementation Budget Range
                </label>
                <select
                  id="implementationBudget"
                  name="implementationBudget"
                  value={formData.implementationBudget}
                  onChange={handleInputChange}
                  className="form-select w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Budget Range</option>
                  {budgetRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  <MessageSquare className="inline-block h-4 w-4 mr-1" /> Additional Information (Optional)
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={4}
                  className="form-textarea w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Please share any specific requirements or questions you have..."
                />
              </div>

              {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !isStepOneValid()}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                    (isSubmitting || !isStepOneValid()) &&
                    'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Continue to Schedule <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule Your Consultation</h2>
            <p className="text-gray-600 mb-6">Select a date and time that works best for your 30-minute strategy session.</p>
            <div 
              id="cal-booking-place"
              ref={calendarRef}
              className="w-full min-h-[700px] rounded-lg overflow-hidden bg-white"
            />
            
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-purple-600 hover:text-purple-800 font-medium flex items-center"
              >
                <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" /> Back to Form
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-800 py-16">
      <Script 
        src="https://cal.com/embed.js" 
        data-cal-link="fasttrack-ai/consultation"
        strategy="lazyOnload"
      />
      
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-4xl font-bold text-white mb-4"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6 }}
            >
              Schedule a Consultation
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 max-w-3xl mx-auto"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Speak with our AI strategy experts and discover how FastTrack AI can transform your business operations with customized AI solutions.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div 
              className="lg:col-span-7 bg-white rounded-xl shadow-xl overflow-hidden"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-8">
                {!showSuccess && (
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderStep()}
                </form>
              </div>
            </motion.div>

            <motion.div 
              className="lg:col-span-5"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
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