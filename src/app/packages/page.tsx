'use client';

import { Rocket, Target, Gauge, Check, ArrowRight, Shield, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const packages = [
  {
    name: 'Priced to Grow',
    icon: Rocket,
    description: 'Perfect for businesses looking to scale operations with AI',
    price: 'Starting at $25,000',
    timeframe: '2-3 months implementation',
    features: [
      'AI-powered customer service automation',
      'Basic data analytics and reporting',
      'Single workflow automation',
      'Employee training and onboarding',
      'Standard support package',
      '6-month growth roadmap'
    ],
    bestFor: [
      'Growing startups',
      'Small businesses scaling operations',
      'Companies with 10-50 employees'
    ],
    accentColor: 'emerald',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    buttonBg: 'bg-emerald-700',
    buttonHover: 'hover:bg-emerald-800'
  },
  {
    name: 'Priced to Optimize',
    icon: Gauge,
    description: 'Strategic AI implementation for operational excellence',
    price: 'Starting at $50,000',
    timeframe: '2-4 months implementation',
    features: [
      'Custom AI solution development',
      'Process optimization analysis',
      'Advanced workflow automation',
      'Business intelligence dashboard',
      'ROI tracking and optimization',
      'Enhanced support package',
      'Quarterly performance reviews'
    ],
    bestFor: [
      'Established businesses',
      'Process-driven organizations',
      'Companies focused on efficiency'
    ],
    accentColor: 'blue',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    buttonBg: 'bg-blue-700',
    buttonHover: 'hover:bg-blue-800',
    featured: true
  },
  {
    name: 'Priced to Sell',
    icon: Target,
    description: 'Comprehensive AI integration for maximum valuation',
    price: 'Starting at $150,000',
    timeframe: '3-4 months implementation',
    features: [
      'Full AI infrastructure implementation',
      'Advanced analytics and predictive modeling',
      'Multiple workflow automations',
      'Custom AI model development',
      'M&A readiness assessment',
      'Technical due diligence preparation',
      'Valuation optimization strategy',
      'Priority support package'
    ],
    bestFor: [
      'Companies preparing for acquisition',
      'Businesses seeking higher valuation',
      'Organizations with 50+ employees'
    ],
    accentColor: 'purple',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700',
    buttonBg: 'bg-purple-700',
    buttonHover: 'hover:bg-purple-800'
  }
];

export default function Packages() {
  return (
    <div className="min-h-screen gradient-primary">
      {/* Hero Section */}
      <motion.div 
        className="py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="container mx-auto px-6 text-center text-white"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h1 className="heading-1 mb-6">
            Strategic AI Integration Packages
          </h1>
          <p className="body-large max-w-2xl mx-auto text-white">
            Choose the right AI implementation package aligned with your business goals,
            whether you're looking to grow, optimize, or prepare for acquisition.
          </p>
        </motion.div>
      </motion.div>

      {/* Packages Grid */}
      <div className="py-20 gradient-secondary">
        <motion.div 
          className="container mx-auto px-6"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => {
              const Icon = pkg.icon;
              return (
                <motion.div 
                  key={pkg.name}
                  className={`relative card ${
                    pkg.featured ? `ring-2 ring-${pkg.accentColor}-500 shadow-lg` : ''
                  } flex flex-col`}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {pkg.featured && (
                    <motion.div 
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="bg-purple-700 text-white px-4 py-1 rounded-full text-sm shadow-md">
                        Most Popular
                      </span>
                    </motion.div>
                  )}
                  <div className="flex-1">
                    <motion.div 
                      className={`${pkg.iconBg} p-3 rounded-lg w-14 h-14 flex items-center justify-center mb-6`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className={`h-7 w-7 ${pkg.iconColor}`} />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{pkg.name}</h3>
                    <p className="text-gray-700 mb-4">{pkg.description}</p>
                    <div className="mb-6">
                      <p className="text-3xl font-bold text-gray-900">{pkg.price}</p>
                      <p className="text-gray-500">{pkg.timeframe}</p>
                    </div>
                    <motion.div 
                      className="space-y-6"
                      variants={staggerChildren}
                    >
                      <div>
                        <h4 className="font-semibold mb-3 text-gray-900">Features:</h4>
                        <ul className="space-y-3">
                          {pkg.features.map((feature, i) => (
                            <motion.li 
                              key={feature} 
                              className="flex items-start"
                              variants={fadeInUp}
                            >
                              <Check className={`h-5 w-5 ${pkg.iconColor} mr-2 flex-shrink-0 mt-0.5`} />
                              <span className="text-gray-700">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-gray-900">Best For:</h4>
                        <ul className="space-y-3">
                          {pkg.bestFor.map((item, i) => (
                            <motion.li 
                              key={item} 
                              className="text-gray-700 flex items-start"
                              variants={fadeInUp}
                            >
                              <span className={`inline-block w-2 h-2 bg-${pkg.accentColor}-700 rounded-full mr-2 mt-1.5 flex-shrink-0`}></span>
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8"
                  >
                    <Link
                      href="/schedule-consultation"
                      className={`w-full ${pkg.buttonBg} text-white px-6 py-3 rounded-lg ${pkg.buttonHover} transition-colors flex items-center justify-center shadow-sm`}
                    >
                      Learn More <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Value Proposition Section - Moved below packages */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-2 mb-6 text-purple-800">Our Unique Approach to AI Integration</h2>
            <p className="body-large max-w-3xl mx-auto text-gray-700">
              More than just technology implementation—we deliver a complete strategic framework that 
              ensures your AI investment translates directly to business outcomes.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
          >
            <motion.div 
              className="bg-gray-50 p-8 rounded-xl"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="h-12 w-12 text-purple-700 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Expert Strategy</h3>
              <p className="text-gray-700">
                Our team of seasoned AI strategists ensures your implementation is aligned with 
                business objectives, not just technical capabilities. We focus on outcomes that 
                matter to your bottom line.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-50 p-8 rounded-xl"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Users className="h-12 w-12 text-emerald-700 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Proven Framework</h3>
              <p className="text-gray-700">
                We've refined our implementation methodology across dozens of successful projects. 
                This proven framework minimizes risk and accelerates time-to-value compared to 
                traditional approaches.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-50 p-8 rounded-xl"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Zap className="h-12 w-12 text-blue-700 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Accelerated Results</h3>
              <p className="text-gray-700">
                While others focus on extended development cycles, our approach delivers measurable 
                results in weeks, not months or years. We focus on rapid implementation of 
                high-impact solutions.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <motion.div 
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6">
          <motion.h2 
            className="heading-2 text-center mb-12 text-purple-800"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Common Questions
          </motion.h2>
          <motion.div 
            className="max-w-3xl mx-auto space-y-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                question: "How long does implementation typically take?",
                answer: "Implementation timelines vary based on the package and your specific business needs. Our Priced to Grow package typically takes 2-3 months, while our more comprehensive Priced to Sell package may take 3-4 months. We work closely with your team to establish a realistic timeline and ensure minimal disruption to your operations."
              },
              {
                question: "Do you offer customization for specific industries?",
                answer: "Yes, we specialize in tailoring our AI solutions to specific industry needs. Whether you're in healthcare, finance, manufacturing, or retail, we customize our implementation approach to address your industry-specific challenges and compliance requirements."
              },
              {
                question: "What kind of ROI can we expect?",
                answer: "ROI varies based on your specific business and the solutions implemented. Typically, our clients see productivity improvements of 20-30% in automated processes, customer service response time reductions of up to 60%, and significant improvements in data-driven decision making. We work with you to establish clear KPIs and ROI tracking from the beginning."
              },
              {
                question: "How do you handle the implementation process?",
                answer: "We follow a proven framework that combines expert strategic guidance with efficient implementation. Our team handles project management, technical implementation, training, and ongoing support to ensure your AI solution delivers measurable business value from day one."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 rounded-lg p-6"
                variants={fadeInUp}
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="py-20 gradient-cta text-white"
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
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            className="body-large mb-10 max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Schedule a consultation with our team to discuss which package is right for your business.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/schedule-consultation"
              className="button-secondary"
            >
              Schedule a Consultation
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 