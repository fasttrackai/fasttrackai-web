'use client';

import { Bot, Cog, Zap, Workflow, Clock, Shield } from 'lucide-react';
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

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 }
};

export default function Automation() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-purple-900 to-purple-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 text-center text-white">
          <motion.h1 
            className="text-4xl font-bold mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6 }}
          >
            AI-Powered Business Automation
          </motion.h1>
          <motion.p 
            className="text-xl max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Streamline operations and boost efficiency with intelligent automation solutions.
          </motion.p>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              {
                icon: Bot,
                title: "Process Automation",
                description: "Automate repetitive tasks and workflows with AI-powered solutions."
              },
              {
                icon: Workflow,
                title: "Workflow Optimization",
                description: "Streamline business processes with intelligent workflow management."
              },
              {
                icon: Clock,
                title: "Time Savings",
                description: "Reduce manual work and focus on high-value activities."
              },
              {
                icon: Shield,
                title: "Error Reduction",
                description: "Minimize human error with automated validation and checks."
              },
              {
                icon: Cog,
                title: "System Integration",
                description: "Connect and automate interactions between different business systems."
              },
              {
                icon: Zap,
                title: "Rapid Implementation",
                description: "Quick deployment of automation solutions with minimal disruption."
              }
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="bg-white rounded-lg shadow-sm p-8"
                  variants={fadeInUp}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="bg-purple-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-6"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="h-6 w-6 text-purple-700" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-900"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Key Benefits
          </motion.h2>
          <motion.div 
            className="max-w-3xl mx-auto space-y-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Increased Productivity",
                description: "Automate routine tasks to free up your team for strategic work and innovation."
              },
              {
                title: "Cost Reduction",
                description: "Lower operational costs through efficient process automation and reduced manual work."
              },
              {
                title: "Improved Accuracy",
                description: "Eliminate human error and ensure consistent quality in business processes."
              }
            ].map((benefit, index) => (
              <motion.div 
                key={benefit.title}
                className="bg-white p-6 rounded-lg shadow-sm"
                variants={fadeInUp}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-purple-900 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-8"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Ready to Automate Your Business?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Schedule a consultation to see how our AI-powered automation can transform your operations.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/schedule-consultation"
              className="inline-flex items-center bg-white text-purple-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
} 