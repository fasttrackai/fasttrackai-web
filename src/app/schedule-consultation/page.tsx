'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MdPerson, MdEmail, MdPhone, MdBusiness, MdCategory, MdAssignment, MdAttachMoney, MdDescription, MdArrowBack, MdCalendarMonth, MdAccessTime } from 'react-icons/md';
import { z } from 'zod';
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
  date: string;
  time: string;
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
  date: '',
  time: '',
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

const ScheduleConsultation = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'form' | 'schedule'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<ConsultationFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    primaryChallenge: '',
    implementationBudget: '',
    additionalInfo: '',
    date: '',
    time: '',
  });

  // Generate available dates (next 14 days, excluding weekends)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends (0 is Sunday, 6 is Saturday)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })
        });
      }
    }
    
    return dates;
  };

  // Generate available time slots (9 AM to 5 PM, hourly)
  const generateAvailableTimeSlots = () => {
    const timeSlots = [];
    
    for (let hour = 9; hour <= 17; hour++) {
      timeSlots.push({
        value: `${hour}:00`,
        label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
      });
    }
    
    return timeSlots;
  };

  const availableDates = generateAvailableDates();
  const availableTimeSlots = generateAvailableTimeSlots();

  const isStepOneValid = () => {
    try {
      // Define validation schema
      const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Valid email is required'),
        phone: z.string().min(10, 'Valid phone number is required'),
        company: z.string().min(1, 'Company name is required'),
        industry: z.string().min(1, 'Industry is required'),
        primaryChallenge: z.string().min(1, 'Primary challenge is required'),
        implementationBudget: z.string().min(1, 'Implementation budget is required'),
      });
      
      // Validate form data
      schema.parse(formData);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error message when user types
    if (error) setError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isStepOneValid()) {
      setError('Please fill out all required fields');
      return;
    }
    
    if (currentStep === 'form') {
      setCurrentStep('schedule');
      return;
    }
    
    // Make sure date and time are selected
    if (!formData.date || !formData.time) {
      setError('Please select both date and time');
      return;
    }
    
    // Submit the form
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/schedule-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Something went wrong');
      }
      
      setSuccess(result.message || 'Consultation scheduled successfully!');
      
      // Redirect to confirmation page or show success message
      setTimeout(() => {
        router.push('/thank-you');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule consultation');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">Business Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdPerson className="text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Full Name"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdEmail className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Your Email"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdPhone className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-10 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Phone Number"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="company" className="block text-sm font-medium">
              Company *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdBusiness className="text-gray-400" />
              </div>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="pl-10 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Company Name"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="industry" className="block text-sm font-medium">
              Industry *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdCategory className="text-gray-400" />
              </div>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="pl-10 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                <option value="">Select Industry</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Technology">Technology</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="primaryChallenge" className="block text-sm font-medium">
              Primary Challenge *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdAssignment className="text-gray-400" />
              </div>
              <select
                id="primaryChallenge"
                name="primaryChallenge"
                value={formData.primaryChallenge}
                onChange={handleInputChange}
                className="pl-10 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                <option value="">Select Primary Challenge</option>
                <option value="Process Automation">Process Automation</option>
                <option value="Customer Experience">Customer Experience</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Content Generation">Content Generation</option>
                <option value="Product Development">Product Development</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="implementationBudget" className="block text-sm font-medium">
              Implementation Budget *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdAttachMoney className="text-gray-400" />
              </div>
              <select
                id="implementationBudget"
                name="implementationBudget"
                value={formData.implementationBudget}
                onChange={handleInputChange}
                className="pl-10 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                <option value="">Select Budget Range</option>
                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                <option value="$100,000+">$100,000+</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <label htmlFor="additionalInfo" className="block text-sm font-medium">
            Additional Information
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
              <MdDescription className="text-gray-400" />
            </div>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              className="pl-10 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600 min-h-[100px]"
              placeholder="Any other details or questions about your project..."
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
          disabled={loading || !isStepOneValid()}
        >
          {loading ? 'Processing...' : 'Proceed to Schedule'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
    </form>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setCurrentStep('form')}
        className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
      >
        <MdArrowBack className="mr-1" /> Back to Form
      </motion.button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border rounded-lg p-6 bg-white shadow-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Schedule Your Consultation</h2>
        <p className="mb-6">Select a date and time that works best for your 30-minute strategy session.</p>
        
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium">
                Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdCalendarMonth className="text-gray-400" />
                </div>
                <select
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="pl-10 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                >
                  <option value="">Select a Date</option>
                  {availableDates.map(date => (
                    <option key={date.value} value={date.value}>
                      {date.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="time" className="block text-sm font-medium">
                Time *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdAccessTime className="text-gray-400" />
                </div>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="pl-10 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                >
                  <option value="">Select a Time</option>
                  {availableTimeSlots.map(time => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
              disabled={loading || !formData.date || !formData.time}
            >
              {loading ? 'Scheduling...' : 'Schedule Consultation'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${currentStep === 'form' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-800'}`}>
                  Business Information
                </div>
                <div className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${currentStep === 'schedule' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-800'}`}>
                  Schedule Time
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200 mt-2">
                <div
                  style={{ width: currentStep === 'form' ? '50%' : '100%' }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600 transition-all duration-300"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentStep === 'form' ? renderForm() : renderSchedule()}
      </motion.div>
    </div>
  );
};

export default ScheduleConsultation; 