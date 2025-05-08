'use client';

import { Building, Target, Users, Lightbulb, Star, ChevronRight, Zap, BarChart, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

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

export default function About() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-purple-900 to-purple-700"
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
            className="text-4xl font-bold mb-6"
            variants={fadeInUp}
          >
            Transforming Businesses Through AI Integration
          </motion.h1>
          <motion.p 
            className="text-xl max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            We help businesses of all sizes leverage AI technology to drive growth, 
            increase operational efficiency, and build sustainable competitive advantages.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Company Story Section */}
      <section id="story" className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  FastTrackAI was founded in 2020 with a clear purpose: to bridge the gap between cutting-edge 
                  AI technology and practical business implementation. What began as a specialized consultancy 
                  helping mid-market companies integrate AI solutions has evolved into a comprehensive 
                  implementation partner serving organizations across the spectrum.
                </p>
                <p>
                  Our founders, drawing from backgrounds in both enterprise AI solutions and business strategy 
                  consulting, recognized that most businesses weren't failing at AI due to technology limitations, 
                  but rather implementation challenges. The marketplace was crowded with AI vendors selling 
                  capabilities without clear paths to business value.
                </p>
                <p>
                  By developing a methodical, business-first approach to AI integration, FastTrackAI has become 
                  known for creating measurable value through strategic AI implementation, helping clients enhance 
                  operations, improve customer experiences, and build sustainable competitive advantages.
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="lg:w-1/2 relative h-80 lg:h-96 w-full rounded-lg overflow-hidden shadow-xl bg-purple-100"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-6 bg-white rounded-full shadow-lg">
                  <Zap className="h-16 w-16 text-purple-700" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gray-50">
        <motion.div 
          className="container mx-auto px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h3>
              <p className="text-gray-600">
                To accelerate business transformation through strategic AI implementation, delivering measurable 
                value by making advanced AI capabilities accessible, actionable, and aligned with specific 
                business objectives.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-sm"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Star className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Vision</h3>
              <p className="text-gray-600">
                We envision a future where AI capabilities are seamlessly integrated across businesses of all sizes, 
                driving innovation and creating value without requiring massive technology investments or specialized 
                teams. FastTrackAI aims to be the trusted implementation partner for organizations at every stage of 
                their AI transformation journey.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section id="values" className="py-20">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-gray-900"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Our Core Values
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Target,
                title: "Results-Driven Implementation",
                description: "We measure success through business outcomes, not technology deployment. Every AI initiative we undertake is designed with clear metrics and value creation in mind."
              },
              {
                icon: Lightbulb,
                title: "Democratized Expertise",
                description: "We believe advanced AI capabilities should be accessible to organizations regardless of size or technical resources. We translate complex technology into practical business solutions."
              },
              {
                icon: Users,
                title: "Partnership Mindset",
                description: "We succeed when our clients succeed. We build collaborative relationships focused on long-term value creation rather than one-time projects."
              },
              {
                icon: Zap,
                title: "Practical Innovation",
                description: "We stay at the forefront of AI advancements while remaining grounded in what delivers real business impact. Innovation without practical application has no place in our methodology."
              },
              {
                icon: BarChart,
                title: "Transparency & Education",
                description: "We demystify AI for our clients, providing clarity around capabilities, limitations, and expected outcomes. We empower clients with knowledge throughout the implementation process."
              }
            ].map((value) => {
              const Icon = value.icon;
              return (
                <motion.div 
                  key={value.title} 
                  className="text-center"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="h-8 w-8 text-purple-700" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Company Impact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Impact</h2>
            <p className="text-gray-600 text-lg">
              FastTrackAI has helped businesses across industries transform their operations through strategic AI implementation.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-12">
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-5xl font-bold text-purple-700 mb-2">95%</div>
              <p className="text-gray-600">Implementation Success Rate</p>
            </motion.div>
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-5xl font-bold text-purple-700 mb-2">320%</div>
              <p className="text-gray-600">Average First-Year ROI</p>
            </motion.div>
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-5xl font-bold text-purple-700 mb-2">45</div>
              <p className="text-gray-600">Days to Initial Business Impact</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-purple-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Client Success</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-purple-700 mr-2 flex-shrink-0" />
                  <span>87% client retention beyond initial implementation</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-purple-700 mr-2 flex-shrink-0" />
                  <span>40% faster revenue growth compared to industry peers</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-purple-700 mr-2 flex-shrink-0" />
                  <span>Successful implementations across 12 industries</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <Clock className="h-6 w-6 text-purple-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Implementation Efficiency</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-purple-700 mr-2 flex-shrink-0" />
                  <span>3.5x faster time-to-value than traditional consulting approaches</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-purple-700 mr-2 flex-shrink-0" />
                  <span>Average of 5 use cases identified within first week of engagement</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-purple-700 mr-2 flex-shrink-0" />
                  <span>Industry-specific AI solutions ready for rapid deployment</span>
                </li>
              </ul>
            </motion.div>
          </div>
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
        <motion.div 
          className="container mx-auto px-6 text-center"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl font-bold mb-8"
            variants={fadeInUp}
          >
            Ready to Transform Your Business with AI?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Join the growing number of businesses that have successfully integrated AI capabilities
            and increased their market value through our proven methodology.
          </motion.p>
          <Link href="/schedule-consultation">
            <motion.button
              className="bg-white text-purple-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule a Consultation
              <ChevronRight className="ml-2 h-5 w-5" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
} 