'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users, BarChart, Clock, CheckCircle, Bot, Shield, Zap, ArrowRight, BrainCircuit, Headphones, MessagesSquare } from 'lucide-react';
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

export default function CustomerServiceAI() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-900 to-indigo-700 py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-6">
              <MessagesSquare className="h-10 w-10 text-yellow-400 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Customer Service AI
              </h1>
            </div>
            <p className="text-xl text-white mb-10">
              Transform your customer experience with intelligent automation and personalized service
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/schedule-consultation" 
                className="bg-white text-indigo-700 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
              >
                Schedule a Demo
              </Link>
              <Link 
                href="/strategy-report" 
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                Get Your Strategy Report
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
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
              <h2 className="text-3xl font-bold text-white mb-4">Why Customer Service AI Matters</h2>
              <p className="text-xl text-white">
                Deliver exceptional customer experiences while reducing costs and scaling support
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Clock,
                  title: "24/7 Availability",
                  description: "Provide instant support to customers at any time, increasing satisfaction while reducing wait times by up to 80%."
                },
                {
                  icon: BarChart,
                  title: "Cost Reduction",
                  description: "Lower support costs by 60-70% by automating routine inquiries and enabling agents to focus on complex issues."
                },
                {
                  icon: Users,
                  title: "Personalized Experience",
                  description: "Deliver customized interactions based on customer history, preferences, and behavior patterns."
                },
                {
                  icon: BrainCircuit,
                  title: "Continuous Improvement",
                  description: "AI systems learn from every interaction, constantly improving accuracy and effectiveness over time."
                }
              ].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div 
                    key={index}
                    variants={fadeInUp}
                    className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700"
                  >
                    <div className="flex items-start">
                      <div className="bg-indigo-800 p-3 rounded-full mr-4">
                        <Icon className="h-6 w-6 text-indigo-300" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                        <p className="text-white">{benefit.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Capabilities */}
      <section className="py-20 bg-gray-900">
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
              <h2 className="text-3xl font-bold text-white mb-4">Comprehensive AI Support Solutions</h2>
              <p className="text-xl text-white">
                Our customer service AI platform offers a complete suite of intelligent support tools
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Bot,
                  title: "AI Chatbots",
                  description: "Intelligent conversational agents that handle routine inquiries and guide users to solutions 24/7."
                },
                {
                  icon: MessageCircle,
                  title: "Smart Ticketing",
                  description: "Automated ticket routing and prioritization with AI-powered response suggestions for agents."
                },
                {
                  icon: Headphones,
                  title: "Voice AI Assistants",
                  description: "Natural language processing for phone support that understands context and customer intent."
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={index}
                    variants={fadeInUp}
                    className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 text-center"
                  >
                    <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-indigo-700" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <motion.div 
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Implementation Approach</h2>
              <p className="text-xl text-gray-700">
                A structured methodology to deliver intelligent customer service solutions
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  step: "Phase 1",
                  title: "Analysis & Strategy",
                  description: "We analyze your current customer service operations, identify automation opportunities, and create a tailored implementation plan.",
                  deliverables: [
                    "Customer journey mapping",
                    "Support channel assessment",
                    "Automation opportunity analysis"
                  ]
                },
                {
                  step: "Phase 2",
                  title: "Knowledge Base Development",
                  description: "We build and structure your knowledge base to power intelligent responses and ensure accuracy across all channels.",
                  deliverables: [
                    "Content categorization",
                    "Response library",
                    "Decision tree construction"
                  ]
                },
                {
                  step: "Phase 3",
                  title: "AI Model Training & Integration",
                  description: "We train custom AI models on your data and integrate with your existing customer service infrastructure.",
                  deliverables: [
                    "AI model development",
                    "CRM integration",
                    "Conversation flow design"
                  ]
                },
                {
                  step: "Phase 4",
                  title: "Testing & Optimization",
                  description: "We thoroughly test all systems, train your team, and continuously optimize performance based on real-world feedback.",
                  deliverables: [
                    "A/B testing",
                    "Agent training",
                    "Performance dashboard"
                  ]
                }
              ].map((phase, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-start">
                    <div className="bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold mb-4 md:mb-0 md:mr-6 text-center md:text-left">
                      {phase.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{phase.title}</h3>
                      <p className="text-gray-700 mb-4">{phase.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Key Deliverables:</h4>
                        {phase.deliverables.map((deliverable, i) => (
                          <div key={i} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Service AI Success Stories</h2>
              <p className="text-xl text-gray-700">
                Real-world results from our customer service AI implementations
              </p>
            </motion.div>

            <div className="space-y-8">
              {[
                {
                  company: "GlobalRetail Inc.",
                  industry: "E-commerce",
                  challenge: "Struggling to manage 10,000+ daily customer inquiries with seasonal spikes up to 30,000.",
                  solution: "Implemented an AI chatbot with CRM integration, handling 78% of all routine inquiries and providing 24/7 support.",
                  results: "Reduced response time from 4 hours to under 1 minute, achieved 92% CSAT, and saved $1.2M annually.",
                  timeline: "8 weeks from kickoff to full deployment"
                },
                {
                  company: "TechSupport Solutions",
                  industry: "SaaS",
                  challenge: "Long wait times and inconsistent quality in technical support responses.",
                  solution: "Deployed AI-powered agent assist system with intelligent routing and knowledge base integration.",
                  results: "Increased first-contact resolution by 47%, reduced escalations by 65%, and improved agent productivity by 35%.",
                  timeline: "10 weeks from kickoff to full deployment"
                }
              ].map((story, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{story.company}</h3>
                      <p className="text-indigo-700 font-medium mb-4">{story.industry}</p>
                      <div className="flex items-center text-sm text-gray-700">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{story.timeline}</span>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">Challenge:</h4>
                          <p className="text-gray-700">{story.challenge}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Solution:</h4>
                          <p className="text-gray-700">{story.solution}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Results:</h4>
                          <p className="text-gray-700">{story.results}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              variants={fadeInUp}
              className="text-center mt-10"
            >
              <Link 
                href="/case-studies" 
                className="text-indigo-700 font-medium inline-flex items-center hover:underline"
              >
                View more success stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-900">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Transform Your Customer Service Experience
            </h2>
            <p className="text-xl text-white mb-10">
              Let us show you how AI can revolutionize your customer support while reducing costs.
            </p>
            <Link 
              href="/schedule-consultation" 
              className="bg-white text-indigo-700 px-8 py-4 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-lg inline-block"
            >
              Schedule Your Customer Service AI Demo
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 