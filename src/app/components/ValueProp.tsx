import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Layers, Zap, Users } from 'lucide-react';
import Link from 'next/link';

const ValueProp = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-12">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="heading-2 mb-4 text-purple-800">Why Companies Choose FastTrack AI</h2>
          <p className="body-large max-w-3xl mx-auto text-gray-700">
            We specialize in rapid, effective AI implementation that delivers measurable business impact
            without the typical complexity, costs, and risks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg border border-purple-200 h-full">
              <div className="mb-4 flex items-center">
                <Shield className="h-8 w-8 text-purple-700 mr-3" />
                <h3 className="text-xl font-bold text-purple-900">Expert Guidance, Not Just Technology</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Unlike traditional consultants or pure technology providers, we combine strategic expertise with 
                efficient implementation. Our team includes both business strategists and AI technologists who 
                work together to deliver solutions that address your specific challenges.
              </p>
              <ul className="space-y-2">
                {[
                  "Business-first approach to AI implementation",
                  "Expert team with proven track record",
                  "Strategic guidance throughout the process"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-700 mr-2 font-bold">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg border border-blue-200 h-full">
              <div className="mb-4 flex items-center">
                <Zap className="h-8 w-8 text-blue-700 mr-3" />
                <h3 className="text-xl font-bold text-blue-900">Rapid, Efficient Implementation</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Our proprietary implementation methodology accelerates time-to-value, helping you achieve 
                results in weeks, not months or years. We've refined our process to minimize business 
                disruption while maximizing ROI.
              </p>
              <ul className="space-y-2">
                {[
                  "2-4x faster implementation than typical AI projects",
                  "Proven methodology refined across dozens of implementations",
                  "Minimal business disruption during integration"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-700 mr-2 font-bold">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg border border-green-200 h-full">
              <div className="mb-4 flex items-center">
                <Layers className="h-8 w-8 text-green-700 mr-3" />
                <h3 className="text-xl font-bold text-green-900">Proven Technology Stack</h3>
              </div>
              <p className="text-gray-700 mb-6">
                We've built a proprietary technology stack and implementation framework that combines best-in-class 
                tools with our own accelerators. This allows us to deliver enterprise-grade solutions at a 
                fraction of the typical cost and time.
              </p>
              <ul className="space-y-2">
                {[
                  "Pre-built integration components for rapid deployment",
                  "Best-in-class AI tools and frameworks",
                  "Scalable architecture that grows with your needs"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-700 mr-2 font-bold">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-lg border border-amber-200 h-full">
              <div className="mb-4 flex items-center">
                <Users className="h-8 w-8 text-amber-700 mr-3" />
                <h3 className="text-xl font-bold text-amber-900">Comprehensive Support Model</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Our relationship doesn't end at implementation. We provide comprehensive training, documentation, 
                and ongoing support to ensure your team can effectively leverage the new AI capabilities long after 
                our initial engagement.
              </p>
              <ul className="space-y-2">
                {[
                  "Thorough team training and knowledge transfer",
                  "Detailed documentation and best practices",
                  "Ongoing support and optimization services"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-700 mr-2 font-bold">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link 
            href="/our-process" 
            className="bg-purple-700 text-white px-8 py-3 rounded-lg hover:bg-purple-800 transition-colors shadow-md inline-flex items-center"
          >
            Learn About Our Process
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProp; 