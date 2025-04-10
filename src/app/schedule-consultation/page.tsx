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

// Form initial state
const initialFormState = {
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

const testimonials = [
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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormState);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCalWidget, setShowCalWidget] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize Cal.com
    (async function () {
      // @ts-ignore
      const Cal = await (window.Cal as any);
      Cal?.('init', {
        origin: 'https://cal.com',
      });

      if (currentStep === 2) {
        Cal?.('inline', {
          elementOrSelector: '#cal-booking-place',
          calLink: 'fast-track-ai-oge7mz/consultation-fast-track-ai',
          config: {
            name: formData.industry,
            notes: `Primary Challenge: ${formData.primaryChallenge}\nBudget Range: ${formData.implementationBudget}\nAdditional Info: ${formData.additionalInfo}`,
          },
        });
      }
    })();
  }, [currentStep, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setCurrentStep(2);
  };

  const isStepOneValid = () => {
    return formData.industry && formData.primaryChallenge && formData.implementationBudget;
  };

  const renderStep = () => {
    if (isSuccess) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepOneValid()}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Schedule
                </button>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule Your Consultation</h2>
            <p className="text-gray-600 mb-6">Select a date and time that works best for your 30-minute strategy session.</p>
            <div id="cal-booking-place" style={{ minHeight: '700px', width: '100%' }} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen gradient-primary py-16">
      <Script 
        src="https://cal.com/embed.js" 
        strategy="beforeInteractive"
        onLoad={() => {
          // @ts-ignore
          window?.Cal?.('init', {
            origin: 'https://cal.com',
          });
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Schedule a Consultation
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 max-w-3xl mx-auto"
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