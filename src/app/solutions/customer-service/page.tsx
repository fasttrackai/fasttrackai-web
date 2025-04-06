'use client';

import { Bot, MessageSquare, Clock, BarChart, Users, Zap } from 'lucide-react';
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

const features = [
  {
    icon: Bot,
    title: "Intelligent Chatbots",
    description: "AI-powered chatbots that understand context and provide accurate, helpful responses.",
    color: "bg-purple-700",
    bgColor: "bg-purple-100"
  },
  {
    icon: MessageSquare,
    title: "Multi-Channel Support",
    description: "Seamless integration across email, chat, social media, and voice channels.",
    color: "bg-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Round-the-clock customer support without the need for human intervention.",
    color: "bg-emerald-600",
    bgColor: "bg-emerald-100"
  },
  {
    icon: BarChart,
    title: "Analytics & Insights",
    description: "Detailed analytics on customer interactions and support performance.",
    color: "bg-indigo-600",
    bgColor: "bg-indigo-100"
  },
  {
    icon: Users,
    title: "Human Handoff",
    description: "Smooth transition to human agents for complex queries when needed.",
    color: "bg-amber-600",
    bgColor: "bg-amber-100"
  },
  {
    icon: Zap,
    title: "Quick Implementation",
    description: "Rapid deployment with minimal disruption to existing operations.",
    color: "bg-purple-800",
    bgColor: "bg-purple-100"
  }
];

export default function CustomerService() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="py-24 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 text-center text-white">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6 }}
          >
            AI-Powered Customer Service Solutions
          </motion.h1>
          <motion.p 
            className="text-xl max-w-2xl mx-auto opacity-90"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Transform your customer support with intelligent automation and 24/7 service capabilities.
          </motion.p>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="bg-white rounded-xl shadow-md p-8 border border-gray-100"
                  variants={fadeInUp}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className={`${feature.bgColor} p-3 rounded-lg w-14 h-14 flex items-center justify-center mb-6`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className={`h-7 w-7 ${feature.color.replace('bg-', 'text-')}`} />
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
      <section className="py-20 bg-white">
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
                number: "1",
                title: "Reduced Response Time",
                description: "Instant responses to customer queries, improving satisfaction and retention.",
                color: "bg-purple-700"
              },
              {
                number: "2",
                title: "Cost Efficiency",
                description: "Significant reduction in customer service operational costs.",
                color: "bg-blue-600"
              },
              {
                number: "3",
                title: "Scalability",
                description: "Easily handle increasing customer support volume without proportional cost increase.",
                color: "bg-emerald-600"
              }
            ].map((benefit) => (
              <motion.div 
                key={benefit.number}
                className="flex items-start space-x-4"
                variants={fadeInUp}
                transition={{ duration: 0.4 }}
              >
                <div className={`flex-shrink-0 w-10 h-10 ${benefit.color} rounded-full flex items-center justify-center shadow-sm`}>
                  <span className="text-white font-bold">{benefit.number}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-24 bg-gradient-to-br from-purple-800 to-indigo-900 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-8"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Ready to Transform Your Customer Service?
          </motion.h2>
          <motion.p 
            className="text-xl mb-10 max-w-2xl mx-auto opacity-90"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Schedule a consultation to see how our AI-powered customer service solutions can help your business.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/schedule-consultation"
              className="inline-flex items-center bg-white text-purple-800 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-md"
            >
              Schedule a Demo
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
} 