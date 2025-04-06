'use client';

import { motion } from 'framer-motion';
import { Bot, Server, Database, Zap, BarChart, Users, Code, CheckCircle } from 'lucide-react';
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

export default function AIIntegration() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 to-purple-700 py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Enterprise AI Integration Services
            </h1>
            <p className="text-xl text-white mb-10">
              Seamlessly integrate AI into your existing systems and workflows
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/strategy-report" 
                className="bg-white text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors font-medium"
              >
                Get Your AI Strategy Report
              </Link>
              <Link 
                href="/schedule-consultation" 
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                Schedule a Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div 
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Integration Process</h2>
              <p className="text-xl text-gray-700">
                A systematic approach to implementing AI solutions in your enterprise environment
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Bot,
                  title: "Assessment & Strategy",
                  description: "We analyze your current systems, data infrastructure, and business goals to create a tailored AI integration strategy."
                },
                {
                  icon: Database,
                  title: "Data Preparation",
                  description: "We prepare and structure your data for AI consumption, ensuring quality, compliance, and accessibility."
                },
                {
                  icon: Code,
                  title: "API Development",
                  description: "We build secure, scalable APIs to connect your existing systems with new AI capabilities."
                },
                {
                  icon: Server,
                  title: "Infrastructure Setup",
                  description: "We configure the necessary cloud or on-premises infrastructure to support your AI workloads."
                },
                {
                  icon: Zap,
                  title: "Deployment & Testing",
                  description: "We deploy AI solutions with rigorous testing to ensure reliability, performance, and security."
                },
                {
                  icon: Users,
                  title: "Training & Handover",
                  description: "We train your team and provide comprehensive documentation for seamless knowledge transfer."
                }
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div 
                    key={index}
                    variants={fadeInUp}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <Icon className="h-6 w-6 text-purple-700" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-700">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Types */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div 
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Integration Solutions</h2>
              <p className="text-xl text-gray-200">
                Flexible approaches to fit your technical environment and business needs
              </p>
            </motion.div>

            <div className="space-y-8">
              {[
                {
                  title: "API-Based Integration",
                  description: "Connect your existing systems with AI capabilities through secure, well-documented APIs.",
                  features: [
                    "RESTful and GraphQL interfaces",
                    "Authentication and authorization",
                    "Rate limiting and throttling",
                    "Comprehensive documentation"
                  ]
                },
                {
                  title: "Data Pipeline Integration",
                  description: "Build automated data flows between your systems and AI processing engines.",
                  features: [
                    "Real-time and batch processing",
                    "Data transformation and enrichment",
                    "Error handling and recovery",
                    "Monitoring and alerting"
                  ]
                },
                {
                  title: "Embedded AI Solutions",
                  description: "Integrate AI capabilities directly into your existing applications and workflows.",
                  features: [
                    "SDK and library integration",
                    "Microservices architecture",
                    "Containerized deployment",
                    "Version control and updates"
                  ]
                }
              ].map((solution, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="bg-gray-800 p-8 rounded-lg shadow-md border border-gray-700"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">{solution.title}</h3>
                  <p className="text-gray-200 mb-6">{solution.description}</p>
                  <div className="space-y-2">
                    {solution.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-purple-400 mr-2" />
                        <span className="text-gray-200">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-900">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Integrate AI Into Your Business?
            </h2>
            <p className="text-xl text-white mb-10">
              Our AI integration specialists are ready to help you transform your business operations.
            </p>
            <Link 
              href="/schedule-consultation" 
              className="bg-white text-purple-700 px-8 py-4 rounded-lg hover:bg-purple-50 transition-colors font-medium text-lg inline-block"
            >
              Schedule Your Integration Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 