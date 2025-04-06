'use client';

import { useState } from 'react';
import { 
  BarChart, 
  Users, 
  Clock, 
  Building, 
  Briefcase,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Check,
  HelpCircle,
  ChevronRight,
  Rocket,
  Zap,
  Star
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Feature {
  name: string;
  description: string;
  tiers: {
    starter: boolean;
    professional: boolean;
    enterprise: boolean;
  };
}

interface FAQ {
  question: string;
  answer: string;
}

interface ResultMetric {
  metric: string;
  value: string;
  icon: 'trending' | 'users' | 'clock' | 'building' | 'briefcase';
}

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: ResultMetric[];
  implementationTime: string;
  companySize: string;
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
}

const features: Feature[] = [
  {
    name: 'AI Readiness Assessment',
    description: 'Comprehensive evaluation of your organization\'s AI implementation readiness',
    tiers: {
      starter: true,
      professional: true,
      enterprise: true
    }
  },
  {
    name: 'Custom AI Strategy',
    description: 'Tailored AI implementation strategy based on your business needs',
    tiers: {
      starter: true,
      professional: true,
      enterprise: true
    }
  },
  {
    name: 'Process Automation',
    description: 'Automated workflows and business processes using AI',
    tiers: {
      starter: true,
      professional: true,
      enterprise: true
    }
  },
  {
    name: 'Data Analysis',
    description: 'AI-powered data analysis and insights',
    tiers: {
      starter: false,
      professional: true,
      enterprise: true
    }
  },
  {
    name: 'Custom AI Models',
    description: 'Development of custom AI models for specific use cases',
    tiers: {
      starter: false,
      professional: true,
      enterprise: true
    }
  },
  {
    name: 'API Integration',
    description: 'Integration with existing systems and APIs',
    tiers: {
      starter: false,
      professional: true,
      enterprise: true
    }
  },
  {
    name: '24/7 Support',
    description: 'Round-the-clock technical support and maintenance',
    tiers: {
      starter: false,
      professional: false,
      enterprise: true
    }
  },
  {
    name: 'Dedicated Account Manager',
    description: 'Personal account manager for ongoing support',
    tiers: {
      starter: false,
      professional: false,
      enterprise: true
    }
  },
  {
    name: 'Custom Integrations',
    description: 'Custom integrations with any system or platform',
    tiers: {
      starter: false,
      professional: false,
      enterprise: true
    }
  }
];

const faqs: FAQ[] = [
  {
    question: 'How long does implementation typically take?',
    answer: 'Implementation time varies based on your needs and chosen tier. Starter implementations typically take 2-4 weeks, Professional 4-8 weeks, and Enterprise solutions are customized to your timeline.'
  },
  {
    question: 'What kind of support is included?',
    answer: 'All tiers include email support during business hours. Professional adds priority support, while Enterprise includes 24/7 support and a dedicated account manager.'
  },
  {
    question: 'Can I upgrade my plan later?',
    answer: 'Yes, you can upgrade your plan at any time. We will help you transition smoothly to ensure minimal disruption to your operations.'
  },
  {
    question: 'Do you offer custom solutions?',
    answer: 'Yes, our Enterprise tier includes fully customized solutions tailored to your specific needs. We can also customize certain aspects of our Professional tier.'
  }
];

type IconType = {
  [key: string]: LucideIcon;
};

const icons: IconType = {
  trending: TrendingUp,
  users: Users,
  clock: Clock,
  building: Building,
  briefcase: Briefcase
};

export default function Services() {
  const [selectedTier, setSelectedTier] = useState<'starter' | 'professional' | 'enterprise'>('professional');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <main className="min-h-screen py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Service Tiers</h1>
            <p className="text-xl text-gray-600">
              Choose the perfect AI implementation package for your business
            </p>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Starter Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-lg shadow-sm p-8 ${
                selectedTier === 'starter' ? 'ring-2 ring-purple-600' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Starter</h2>
                  <p className="text-gray-600">For small businesses</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Rocket className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$999</span>
                <span className="text-gray-600">/month</span>
              </div>
              <button
                onClick={() => setSelectedTier('starter')}
                className={`w-full py-3 rounded-lg font-medium mb-6 ${
                  selectedTier === 'starter'
                    ? 'bg-purple-600 text-white'
                    : 'border border-purple-600 text-purple-600 hover:bg-purple-50'
                }`}
              >
                Select Plan
              </button>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li
                    key={feature.name}
                    className={`flex items-start ${
                      feature.tiers.starter ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    <Check className={`h-5 w-5 mr-2 flex-shrink-0 ${
                      feature.tiers.starter ? 'text-purple-600' : 'text-gray-300'
                    }`} />
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Professional Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={`bg-white rounded-lg shadow-sm p-8 ${
                selectedTier === 'professional' ? 'ring-2 ring-purple-600' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Professional</h2>
                  <p className="text-gray-600">For growing companies</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">$2,499</span>
                <span className="text-gray-600">/month</span>
              </div>
              <button
                onClick={() => setSelectedTier('professional')}
                className={`w-full py-3 rounded-lg font-medium mb-6 ${
                  selectedTier === 'professional'
                    ? 'bg-purple-600 text-white'
                    : 'border border-purple-600 text-purple-600 hover:bg-purple-50'
                }`}
              >
                Select Plan
              </button>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li
                    key={feature.name}
                    className={`flex items-start ${
                      feature.tiers.professional ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    <Check className={`h-5 w-5 mr-2 flex-shrink-0 ${
                      feature.tiers.professional ? 'text-purple-600' : 'text-gray-300'
                    }`} />
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Enterprise Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={`bg-white rounded-lg shadow-sm p-8 ${
                selectedTier === 'enterprise' ? 'ring-2 ring-purple-600' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Enterprise</h2>
                  <p className="text-gray-600">For large organizations</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mb-6">
                <span className="text-2xl font-bold">Custom Pricing</span>
              </div>
              <button
                onClick={() => setSelectedTier('enterprise')}
                className={`w-full py-3 rounded-lg font-medium mb-6 ${
                  selectedTier === 'enterprise'
                    ? 'bg-purple-600 text-white'
                    : 'border border-purple-600 text-purple-600 hover:bg-purple-50'
                }`}
              >
                Contact Sales
              </button>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li
                    key={feature.name}
                    className={`flex items-start ${
                      feature.tiers.enterprise ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    <Check className={`h-5 w-5 mr-2 flex-shrink-0 ${
                      feature.tiers.enterprise ? 'text-purple-600' : 'text-gray-300'
                    }`} />
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Feature Comparison */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 pr-4">Feature</th>
                    <th className="text-center py-4 px-4">Starter</th>
                    <th className="text-center py-4 px-4">Professional</th>
                    <th className="text-center py-4 px-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature) => (
                    <tr key={feature.name} className="border-b">
                      <td className="py-4 pr-4">
                        <div className="flex items-center">
                          {feature.name}
                          <button
                            className="ml-2"
                            onMouseEnter={() => setShowTooltip(feature.name)}
                            onMouseLeave={() => setShowTooltip(null)}
                          >
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </button>
                          {showTooltip === feature.name && (
                            <div className="absolute mt-2 p-2 bg-gray-900 text-white text-sm rounded-lg max-w-xs z-10">
                              {feature.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        {feature.tiers.starter ? (
                          <Check className="h-5 w-5 text-purple-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {feature.tiers.professional ? (
                          <Check className="h-5 w-5 text-purple-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {feature.tiers.enterprise ? (
                          <Check className="h-5 w-5 text-purple-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="bg-white rounded-lg shadow-sm">
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                    onClick={() => setOpenFaq(openFaq === faq.question ? null : faq.question)}
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {openFaq === faq.question ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {openFaq === faq.question && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 bg-purple-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="mb-8 max-w-2xl mx-auto">
              Schedule a consultation to discuss your needs and find the perfect solution for your business.
            </p>
            <button
              onClick={() => window.location.href = '/schedule-consultation'}
              className="px-8 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Schedule Free Consultation
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 