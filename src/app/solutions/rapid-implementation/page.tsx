'use client';

import { motion } from 'framer-motion';
import { Zap, Clock, CheckCircle, Calendar, Users, BarChart, Layers, ArrowRight, TrendingUp, Database, PieChart, Lightbulb } from 'lucide-react';
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

export default function RapidImplementation() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Zap className="h-10 w-10 text-yellow-400 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Rapid AI Implementation
              </h1>
            </div>
            <p className="text-xl text-white mb-10">
              Go from concept to production in weeks, not months or years
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/schedule-consultation" 
                className="bg-white text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Schedule a Rapid Assessment
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
              <h2 className="text-3xl font-bold text-white mb-4">Why Rapid AI Implementation Matters</h2>
              <p className="text-xl text-white">
                Accelerated AI deployment delivers critical business advantages in today's competitive landscape
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: "First-Mover Advantage",
                  description: "Beat competitors to market with cutting-edge AI capabilities, capturing market share and establishing industry leadership."
                },
                {
                  icon: BarChart,
                  title: "Faster ROI Realization",
                  description: "Reduce time-to-value by 70% compared to traditional implementation approaches, with positive ROI often within 90 days."
                },
                {
                  icon: Lightbulb,
                  title: "Rapid Innovation Cycles",
                  description: "Implement, test, and refine AI solutions in quick succession, creating a continuous improvement feedback loop."
                },
                {
                  icon: PieChart,
                  title: "Reduced Implementation Risk",
                  description: "Our agile approach identifies and addresses challenges early, significantly reducing the risk of project failure."
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
                      <div className="bg-blue-800 p-3 rounded-full mr-4">
                        <Icon className="h-6 w-6 text-blue-300" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                        <p className="text-gray-200">{benefit.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Benefits */}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Rapid Implementation?</h2>
              <p className="text-xl text-gray-700">
                Our accelerated approach delivers value faster while maintaining enterprise-grade quality
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Clock,
                  title: "Faster Time-to-Value",
                  description: "See tangible results in weeks rather than months with our streamlined implementation process."
                },
                {
                  icon: BarChart,
                  title: "Immediate ROI",
                  description: "Start generating returns on your AI investment within the first 30 days of implementation."
                },
                {
                  icon: Users,
                  title: "Reduced Disruption",
                  description: "Minimize business disruption with our phased implementation approach and comprehensive training."
                }
              ].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div 
                    key={index}
                    variants={fadeInUp}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center"
                  >
                    <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-blue-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-700">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Implementation Timeline */}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our 6-Week Implementation Timeline</h2>
              <p className="text-xl text-gray-700">
                A structured approach that delivers results in record time
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  week: "Week 1-2",
                  title: "Discovery & Planning",
                  description: "We analyze your business needs, data sources, and technical environment to create a tailored implementation plan.",
                  deliverables: [
                    "Detailed implementation roadmap",
                    "Technical requirements document",
                    "Data assessment report"
                  ]
                },
                {
                  week: "Week 3-4",
                  title: "Rapid Development & Integration",
                  description: "Our team works in accelerated sprints to build, integrate, and test your AI solution.",
                  deliverables: [
                    "Working AI prototype",
                    "API integrations with existing systems",
                    "Initial performance metrics"
                  ]
                },
                {
                  week: "Week 5-6",
                  title: "Deployment & Optimization",
                  description: "We deploy your solution to production, train your team, and optimize for performance.",
                  deliverables: [
                    "Production-ready AI solution",
                    "Comprehensive documentation",
                    "Team training and certification"
                  ]
                }
              ].map((phase, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-start">
                    <div className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold mb-4 md:mb-0 md:mr-6 text-center md:text-left">
                      {phase.week}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Rapid Implementation Success Stories</h2>
              <p className="text-xl text-gray-700">
                See how our clients achieved remarkable results in record time
              </p>
            </motion.div>

            <div className="space-y-8">
              {[
                {
                  company: "FinTech Solutions Inc.",
                  industry: "Financial Services",
                  challenge: "Needed to implement AI-powered fraud detection to reduce false positives by 50%.",
                  solution: "Rapid implementation of a custom machine learning model integrated with existing transaction processing system.",
                  results: "Achieved 62% reduction in false positives within 5 weeks of project kickoff.",
                  timeline: "5 weeks from kickoff to production"
                },
                {
                  company: "MediCare Systems",
                  industry: "Healthcare",
                  challenge: "Required AI-powered patient triage system to reduce wait times and improve care allocation.",
                  solution: "Rapid development and deployment of a predictive triage model integrated with existing EHR system.",
                  results: "Reduced average wait times by 37% and improved critical care response by 42%.",
                  timeline: "6 weeks from kickoff to production"
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
                      <p className="text-blue-700 font-medium mb-4">{story.industry}</p>
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
                className="text-blue-700 font-medium inline-flex items-center hover:underline"
              >
                View more success stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Fast-Track Your AI Implementation?
            </h2>
            <p className="text-xl text-white mb-10">
              Our rapid implementation approach can have you up and running with AI in just 6 weeks.
            </p>
            <Link 
              href="/schedule-consultation" 
              className="bg-white text-blue-700 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-medium text-lg inline-block"
            >
              Schedule Your Rapid Assessment
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 