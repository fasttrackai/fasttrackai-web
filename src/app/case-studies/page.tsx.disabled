'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, Building, Filter, ChevronRight, Briefcase, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    icon: keyof typeof icons;
  }[];
  implementationTime: string;
  companySize: string;
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
}

const icons = {
  trending: TrendingUp,
  users: Users,
  clock: Clock,
  building: Building,
  briefcase: Briefcase
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const caseStudies: CaseStudy[] = [
  {
    id: 'cs-1',
    title: 'AI-Powered Customer Service Transformation',
    company: 'TechRetail Inc.',
    industry: 'Retail',
    challenge: 'Managing high volume of customer inquiries with long response times and inconsistent service quality.',
    solution: 'Implemented AI chatbot and customer service automation platform with intelligent routing and response suggestions.',
    results: [
      { metric: 'Response Time', value: '-75%', icon: 'clock' },
      { metric: 'Customer Satisfaction', value: '+45%', icon: 'users' },
      { metric: 'Cost Savings', value: '$2.5M/year', icon: 'trending' }
    ],
    implementationTime: '3 months',
    companySize: '500-1000 employees',
    testimonial: {
      quote: 'The AI implementation transformed our customer service operations, allowing us to handle more inquiries while improving quality and reducing costs.',
      author: 'Sarah Johnson',
      position: 'Director of Customer Experience'
    }
  },
  {
    id: 'cs-2',
    title: 'Manufacturing Process Optimization',
    company: 'IndustrialTech Solutions',
    industry: 'Manufacturing',
    challenge: 'Inefficient production processes leading to high waste and quality control issues.',
    solution: 'Deployed AI-powered predictive maintenance and quality control system.',
    results: [
      { metric: 'Defect Rate', value: '-60%', icon: 'trending' },
      { metric: 'Downtime', value: '-40%', icon: 'clock' },
      { metric: 'Production Efficiency', value: '+35%', icon: 'building' }
    ],
    implementationTime: '6 months',
    companySize: '1000+ employees',
    testimonial: {
      quote: 'The AI system has revolutionized our production line, significantly reducing waste and improving overall efficiency.',
      author: 'Michael Chen',
      position: 'Head of Operations'
    }
  },
  {
    id: 'cs-3',
    title: 'SMB Financial Operations Enhancement',
    company: 'GrowthFinance LLC',
    industry: 'Financial Services',
    challenge: 'Manual financial processes causing delays and errors in reporting and analysis.',
    solution: 'Implemented AI-driven financial analysis and automation tools.',
    results: [
      { metric: 'Processing Time', value: '-80%', icon: 'clock' },
      { metric: 'Accuracy', value: '+95%', icon: 'trending' },
      { metric: 'Cost Reduction', value: '40%', icon: 'briefcase' }
    ],
    implementationTime: '2 months',
    companySize: '50-100 employees'
  }
];

export default function CaseStudies() {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const industries = Array.from(new Set(caseStudies.map(cs => cs.industry)));

  const filteredCaseStudies = caseStudies.filter(study => {
    const matchesIndustry = selectedIndustry === 'all' || study.industry === selectedIndustry;
    const matchesSearch = study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  return (
    <main className="min-h-screen gradient-primary">
      {/* Hero Section */}
      <motion.section 
        className="py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 text-center text-white">
          <motion.h1 
            className="heading-1 mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            Case Studies
          </motion.h1>
          <motion.p 
            className="body-large max-w-2xl mx-auto text-white"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            Discover how organizations are transforming their operations with AI
          </motion.p>
        </div>
      </motion.section>

      {/* Filters Section */}
      <section className="py-16 gradient-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Filters */}
            <motion.div 
              className="mb-12 flex flex-col sm:flex-row gap-4"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search case studies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <motion.button
                  onClick={() => setSelectedIndustry('all')}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                    selectedIndustry === 'all'
                      ? 'bg-purple-700 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  All Industries
                </motion.button>
                {industries.map((industry) => (
                  <motion.button
                    key={industry}
                    onClick={() => setSelectedIndustry(industry)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                      selectedIndustry === industry
                        ? 'bg-purple-700 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {industry}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Case Studies Grid */}
            <motion.div 
              className="space-y-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {filteredCaseStudies.map((study) => (
                <motion.div
                  key={study.id}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="card"
                >
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700 mb-2">
                          {study.industry}
                        </span>
                        <h2 className="heading-3 mb-2 text-gray-900">{study.title}</h2>
                        <p className="text-gray-700">{study.company}</p>
                      </div>
                      <div className="mt-4 lg:mt-0 flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Implementation: {study.implementationTime}
                        <Users className="h-4 w-4 ml-4 mr-1" />
                        {study.companySize}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-semibold mb-2 text-purple-800">Challenge</h3>
                        <p className="text-gray-600">{study.challenge}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-purple-800">Solution</h3>
                        <p className="text-gray-600">{study.solution}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {study.results.map((result, index) => {
                        const Icon = icons[result.icon];
                        return (
                          <motion.div
                            key={index}
                            className="bg-purple-50 rounded-lg p-4 flex items-center"
                            whileHover={{ scale: 1.03 }}
                          >
                            <div className="p-2 bg-purple-100 rounded-lg mr-3">
                              <Icon className="h-6 w-6 text-purple-700" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">{result.metric}</p>
                              <p className="text-xl font-bold text-purple-700">
                                {result.value}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {study.testimonial && (
                      <div className="border-t pt-6">
                        <blockquote className="italic text-gray-600 mb-4">
                          "{study.testimonial.quote}"
                        </blockquote>
                        <div>
                          <p className="font-medium">{study.testimonial.author}</p>
                          <p className="text-sm text-gray-500">{study.testimonial.position}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                    <motion.button
                      onClick={() => router.push('/schedule-consultation')}
                      className="text-purple-700 font-medium flex items-center hover:text-purple-800"
                      whileHover={{ x: 5 }}
                    >
                      Learn how we can help your organization
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* No Results Message */}
            {filteredCaseStudies.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-xl text-gray-200 mb-4">No case studies match your search criteria</p>
                <button 
                  onClick={() => {
                    setSelectedIndustry('all');
                    setSearchQuery('');
                  }}
                  className="button-secondary"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-24 gradient-cta text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            className="heading-2 mb-8"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Ready to Transform Your Business?
          </motion.h2>
          <motion.p 
            className="body-large mb-10 max-w-2xl mx-auto opacity-90"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Join these success stories and discover how AI can revolutionize your operations.
            Schedule a consultation to discuss your specific needs and goals.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/schedule-consultation" className="button-secondary">
              Schedule Free Consultation
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
} 