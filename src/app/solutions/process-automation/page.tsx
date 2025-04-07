'use client';

import { motion } from 'framer-motion';
import { Workflow, FileText, Gauge, CheckCircle, Clock, Cog, Bot, Zap, ArrowRight, Settings, RefreshCw, Repeat } from 'lucide-react';
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

export default function ProcessAutomation() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-900 to-cyan-700 py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Workflow className="h-10 w-10 text-yellow-400 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Process Automation
              </h1>
            </div>
            <p className="text-xl text-white mb-10">
              Transform your operations with intelligent workflow automation powered by AI
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/schedule-consultation" 
                className="bg-white text-cyan-700 px-6 py-3 rounded-lg hover:bg-cyan-50 transition-colors font-medium"
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
              <h2 className="text-3xl font-bold text-white mb-4">Why AI-Powered Process Automation</h2>
              <p className="text-xl text-white">
                Elevate your operations from manual and rule-based to intelligent and adaptive
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Clock,
                  title: "Operational Efficiency",
                  description: "Reduce process cycle times by 70-80% and eliminate human error with intelligent automation that works 24/7."
                },
                {
                  icon: Gauge,
                  title: "Scalable Operations",
                  description: "Handle growth and volume spikes without adding headcount, scaling your operations automatically as needed."
                },
                {
                  icon: RefreshCw,
                  title: "Adaptive Workflows",
                  description: "AI-powered workflows that learn and adapt to changing conditions and exceptions without manual intervention."
                },
                {
                  icon: Settings,
                  title: "End-to-End Integration",
                  description: "Connect and orchestrate all your business systems into seamless automated processes across your organization."
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
                      <div className="bg-cyan-800 p-3 rounded-full mr-4">
                        <Icon className="h-6 w-6 text-cyan-300" />
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

      {/* Automation Capabilities */}
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
              <h2 className="text-3xl font-bold text-white mb-4">Comprehensive Automation Solutions</h2>
              <p className="text-xl text-white">
                Our intelligent automation platform addresses your most complex operational challenges
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Workflow,
                  title: "Intelligent Workflows",
                  description: "End-to-end process automation with AI-powered decision making and exception handling."
                },
                {
                  icon: FileText,
                  title: "Document Processing",
                  description: "Automated extraction, analysis, and processing of documents with high accuracy and speed."
                },
                {
                  icon: Bot,
                  title: "Digital Workers",
                  description: "AI-powered bots that perform complex tasks and integrate with your existing systems and tools."
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={index}
                    variants={fadeInUp}
                    className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 text-center"
                  >
                    <div className="bg-cyan-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-cyan-700" />
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Automation Implementation Process</h2>
              <p className="text-xl text-gray-700">
                A proven methodology to transform your manual processes into intelligent workflows
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  step: "Phase 1",
                  title: "Process Discovery & Analysis",
                  description: "We map your current processes, identify bottlenecks, and calculate automation ROI to prioritize implementation.",
                  deliverables: [
                    "Process maps & documentation",
                    "Automation opportunity assessment",
                    "ROI analysis & prioritization"
                  ]
                },
                {
                  step: "Phase 2",
                  title: "Solution Design",
                  description: "We design optimized future-state processes and automation architecture tailored to your business needs.",
                  deliverables: [
                    "Future-state process maps",
                    "Technical automation design",
                    "Implementation roadmap"
                  ]
                },
                {
                  step: "Phase 3",
                  title: "Development & Testing",
                  description: "We build and test your automation solutions, ensuring seamless integration with existing systems.",
                  deliverables: [
                    "Automated workflow development",
                    "Integration with existing systems",
                    "Comprehensive testing & validation"
                  ]
                },
                {
                  step: "Phase 4",
                  title: "Deployment & Optimization",
                  description: "We deploy your automation solutions and continuously optimize performance based on real-world data.",
                  deliverables: [
                    "Production deployment",
                    "Team training & documentation",
                    "Performance monitoring & optimization"
                  ]
                }
              ].map((phase, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-start">
                    <div className="bg-cyan-700 text-white px-4 py-2 rounded-lg font-bold mb-4 md:mb-0 md:mr-6 text-center md:text-left">
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
      <section className="py-20 bg-black">
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
              <h2 className="text-3xl font-bold text-white mb-4">Automation Success Stories</h2>
              <p className="text-xl text-white">
                Real-world operational transformations powered by our intelligent automation solutions
              </p>
            </motion.div>

            <div className="space-y-8">
              {[
                {
                  company: "SupplyChain Partners",
                  industry: "Logistics & Distribution",
                  challenge: "Manual order processing requiring 15+ touchpoints, resulting in high error rates and 48+ hour processing times.",
                  solution: "Implemented end-to-end order processing automation with AI-powered exception handling and real-time tracking.",
                  results: "Reduced processing time from 48+ hours to 15 minutes, decreased errors by 96%, and enabled 3x volume handling with existing staff.",
                  timeline: "10 weeks from kickoff to full deployment"
                },
                {
                  company: "InsureTech Global",
                  industry: "Insurance",
                  challenge: "Complex claims processing requiring manual document review and inconsistent approval workflows.",
                  solution: "Deployed intelligent document processing with automated claims validation and exception-based routing.",
                  results: "Increased straight-through processing from 15% to 85%, reduced claims processing time by 73%, and improved compliance accuracy to 99.8%.",
                  timeline: "12 weeks from kickoff to full deployment"
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
                      <p className="text-cyan-700 font-medium mb-4">{story.industry}</p>
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
                className="text-cyan-400 font-medium inline-flex items-center hover:underline"
              >
                View more success stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cyan-900">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Business Operations?
            </h2>
            <p className="text-xl text-white mb-10">
              Discover how our intelligent automation solutions can dramatically improve efficiency and reduce costs.
            </p>
            <Link 
              href="/schedule-consultation" 
              className="bg-white text-cyan-700 px-8 py-4 rounded-lg hover:bg-cyan-50 transition-colors font-medium text-lg inline-block"
            >
              Schedule Your Automation Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 