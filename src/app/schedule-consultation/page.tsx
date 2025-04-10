'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
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
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Define custom FormData interface
interface ConsultationFormData {
  industry: string;
  primaryChallenge: string;
  implementationBudget: string;
  additionalInfo: string;
}

// Form initial state
const initialFormState: ConsultationFormData = {
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

// Define Cal.com window type
declare global {
  interface Window {
    Cal?: {
      (command: 'init'): void;
      (command: 'ui', args: { theme?: 'light' | 'dark' }): void;
    };
  }
}

export default function ScheduleConsultation() {
  const [formData, setFormData] = useState<ConsultationFormData>(initialFormState);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  // Function to handle calendar ready state
  const handleCalendarReady = () => {
    setIsCalendarLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/schedule-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setCurrentStep(2);
        setIsSubmitting(false);
      } else {
        alert('Failed to submit form. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ConsultationFormData) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setCurrentStep(2);
  };

  const isStepOneValid = () => {
    return formData.industry && formData.primaryChallenge && formData.implementationBudget;
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
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
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
                  Primary Challenge Area
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
                  Implementation Budget Range
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
                  Additional Information (Optional)
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

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.industry || !formData.primaryChallenge || !formData.implementationBudget}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                    (isSubmitting || !formData.industry || !formData.primaryChallenge || !formData.implementationBudget) &&
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
            
            <div className="relative w-full min-h-[700px] rounded-lg overflow-hidden bg-white">
              {isCalendarLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                    <p className="text-gray-600">Loading calendar...</p>
                  </div>
                </div>
              )}

              <iframe
                src="https://cal.com/fasttrack-ai/consultation?embed=true"
                className="w-full h-[700px] border-0"
                frameBorder="0"
                data-cal-link="fasttrack-ai/consultation"
                onLoad={handleCalendarReady}
              />

              <button
                onClick={() => setCurrentStep(1)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-purple-600 text-sm font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Back to Form
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
        strategy="lazyOnload"
        onLoad={() => {
          // Initialize Cal when script loads
          if (typeof window !== 'undefined' && window.Cal) {
            window.Cal('init');
          }
        }}
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