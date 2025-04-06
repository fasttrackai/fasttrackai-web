'use client';

import { Bot, BarChart, Zap, Brain, Cog, ChartBar } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

const solutions = [
  {
    icon: Bot,
    title: 'Customer Service AI',
    description: 'Automate customer support with intelligent chatbots and virtual assistants.',
    benefits: ['24/7 Customer Support', 'Reduced Response Time', 'Consistent Service Quality'],
    href: '/solutions/customer-service-ai',
    color: 'bg-purple-700',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700'
  },
  {
    icon: BarChart,
    title: 'Business Analytics',
    description: 'Transform your data into actionable insights with predictive analytics.',
    benefits: ['Predictive Insights', 'Data Visualization', 'Performance Tracking'],
    href: '/solutions/business-analytics',
    color: 'bg-blue-700',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700'
  },
  {
    icon: Brain,
    title: 'Process Automation',
    description: 'Streamline operations with intelligent workflow automation.',
    benefits: ['Workflow Optimization', 'Error Reduction', 'Increased Efficiency'],
    href: '/solutions/process-automation',
    color: 'bg-emerald-700',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700'
  },
  {
    icon: Cog,
    title: 'AI Integration Services',
    description: 'Custom AI solutions tailored to your specific business needs.',
    benefits: ['Customized Solutions', 'Seamless Integration', 'Technical Support'],
    href: '/solutions/ai-integration',
    color: 'bg-indigo-700',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-700'
  },
  {
    icon: Zap,
    title: 'Rapid Implementation',
    description: 'Quick deployment of AI solutions with measurable results.',
    benefits: ['Fast Deployment', 'Minimal Disruption', 'Quick ROI'],
    href: '/solutions/rapid-implementation',
    color: 'bg-amber-600',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    icon: ChartBar,
    title: 'M&A Readiness',
    description: 'Enhance your business value with modern AI infrastructure.',
    benefits: ['Value Enhancement', 'Technical Due Diligence', 'Growth Strategy'],
    href: '/solutions/ma-readiness',
    color: 'bg-purple-800',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-800'
  },
];

export default function Solutions() {
  return (
    <main className="min-h-screen gradient-primary">
      {/* Hero Section */}
      <motion.section 
        className="py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="container mx-auto px-6 text-center text-white"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1 
            className="heading-1 mb-6"
            variants={fadeInUp}
          >
            AI Solutions for Your Business
          </motion.h1>
          <motion.p 
            className="body-large max-w-2xl mx-auto text-white"
            variants={fadeInUp}
          >
            Discover how our AI solutions can transform your operations, 
            enhance customer experiences, and drive growth.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Solutions Grid */}
      <section className="py-20 gradient-secondary">
        <div className="container mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {solutions.map((solution) => {
              const Icon = solution.icon;
              return (
                <motion.div
                  key={solution.title}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <Link 
                    href={solution.href}
                    className="card h-full block"
                  >
                    <motion.div 
                      className={`${solution.iconBg} p-3 rounded-lg w-14 h-14 flex items-center justify-center mb-6`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className={`h-7 w-7 ${solution.iconColor}`} />
                    </motion.div>
                    <h3 className="heading-3 mb-4 text-gray-900">{solution.title}</h3>
                    <p className="text-gray-800 mb-6">{solution.description}</p>
                    <motion.ul 
                      className="space-y-3"
                      variants={staggerContainer}
                    >
                      {solution.benefits.map((benefit) => (
                        <motion.li 
                          key={benefit} 
                          className="text-sm text-gray-700 flex items-start"
                          variants={fadeInUp}
                        >
                          <span className={`inline-block w-2 h-2 ${solution.color} rounded-full mr-2 mt-1.5 flex-shrink-0`}></span>
                          {benefit}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
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
        <motion.div 
          className="container mx-auto px-6 text-center"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="heading-2 mb-8"
            variants={fadeInUp}
          >
            Ready to Transform Your Business?
          </motion.h2>
          <motion.p 
            className="body-large opacity-90 mb-10 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Our team of experts will help you identify the right AI solutions for your business
            and guide you through the implementation process.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/schedule-consultation"
              className="button-secondary"
            >
              Schedule a Free Consultation
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
} 