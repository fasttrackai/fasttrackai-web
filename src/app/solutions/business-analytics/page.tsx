'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, CheckCircle, Database, LineChart, ArrowRight, Lightbulb, BrainCircuit, Search, Gauge, Clock } from 'lucide-react';
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

export default function BusinessAnalytics() {
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
            <div className="flex items-center justify-center mb-6">
              <BarChart3 className="h-10 w-10 text-yellow-400 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Business Analytics AI
              </h1>
            </div>
            <p className="text-xl text-white mb-10">
              Turn your data into actionable insights with advanced AI-powered analytics
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/schedule-consultation" 
                className="bg-white text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors font-medium"
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
              <h2 className="text-3xl font-bold text-white mb-4">The Power of AI-Driven Analytics</h2>
              <p className="text-xl text-white">
                Move beyond traditional BI to predictive and prescriptive insights that drive business growth
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Lightbulb,
                  title: "Predictive Insights",
                  description: "Forecast trends, customer behavior, and business outcomes with up to 90% accuracy using advanced machine learning models."
                },
                {
                  icon: TrendingUp,
                  title: "Revenue Optimization",
                  description: "Identify hidden revenue opportunities and optimize pricing strategies for 15-25% revenue uplift."
                },
                {
                  icon: Search,
                  title: "Anomaly Detection",
                  description: "Automatically identify unusual patterns and outliers in your data that may indicate opportunities or threats."
                },
                {
                  icon: Gauge,
                  title: "Real-time Dashboards",
                  description: "Access key metrics and insights in real-time, enabling immediate action on emerging trends and opportunities."
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
                      <div className="bg-purple-800 p-3 rounded-full mr-4">
                        <Icon className="h-6 w-6 text-purple-300" />
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

      {/* Analytics Capabilities */}
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
              <h2 className="text-3xl font-bold text-white mb-4">Comprehensive Analytics Solutions</h2>
              <p className="text-xl text-white">
                Our AI-powered analytics platform offers end-to-end business intelligence capabilities
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Database,
                  title: "Data Integration",
                  description: "Unified data platform that connects to all your data sources for a complete 360° business view."
                },
                {
                  icon: BrainCircuit,
                  title: "AI-Powered Insights",
                  description: "Advanced machine learning models that uncover patterns and relationships in your data."
                },
                {
                  icon: LineChart,
                  title: "Predictive Analytics",
                  description: "Forward-looking insights that forecast trends and help you stay ahead of market changes."
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={index}
                    variants={fadeInUp}
                    className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 text-center"
                  >
                    <div className="bg-purple-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-purple-700" />
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Analytics Implementation Process</h2>
              <p className="text-xl text-gray-700">
                A proven methodology to turn your data into actionable business intelligence
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  step: "Step 1",
                  title: "Data Assessment & Strategy",
                  description: "We analyze your data sources, quality, and business objectives to create a tailored analytics strategy.",
                  deliverables: [
                    "Data source inventory",
                    "Analytics needs assessment",
                    "Implementation roadmap"
                  ]
                },
                {
                  step: "Step 2",
                  title: "Data Integration & Preparation",
                  description: "We connect and consolidate your data sources, ensuring data quality and creating a unified analytics foundation.",
                  deliverables: [
                    "Data integration architecture",
                    "ETL pipeline development",
                    "Data quality framework"
                  ]
                },
                {
                  step: "Step 3",
                  title: "AI Model Development",
                  description: "We build and train custom machine learning models tailored to your specific business needs and use cases.",
                  deliverables: [
                    "Predictive models",
                    "Anomaly detection systems",
                    "Natural language processing capabilities"
                  ]
                },
                {
                  step: "Step 4",
                  title: "Visualization & Deployment",
                  description: "We create intuitive dashboards and reporting tools, ensuring insights are accessible to decision-makers.",
                  deliverables: [
                    "Interactive dashboards",
                    "Automated reporting",
                    "Mobile analytics access"
                  ]
                }
              ].map((phase, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-start">
                    <div className="bg-purple-700 text-white px-4 py-2 rounded-lg font-bold mb-4 md:mb-0 md:mr-6 text-center md:text-left">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Analytics Success Stories</h2>
              <p className="text-xl text-gray-700">
                Real-world business transformations powered by our AI analytics solutions
              </p>
            </motion.div>

            <div className="space-y-8">
              {[
                {
                  company: "RetailCorp Global",
                  industry: "Retail & E-commerce",
                  challenge: "Struggling to optimize inventory levels across 200+ stores, resulting in $3.2M annual loss from stockouts and overstocking.",
                  solution: "Implemented AI-powered demand forecasting and inventory optimization system with real-time analytics dashboard.",
                  results: "Reduced inventory costs by 23%, eliminated 76% of stockouts, and increased overall revenue by 12% within 6 months.",
                  timeline: "12 weeks from kickoff to full deployment"
                },
                {
                  company: "FinServe Partners",
                  industry: "Financial Services",
                  challenge: "Unable to identify high-value clients and personalize offerings effectively in a competitive market.",
                  solution: "Deployed customer segmentation AI with predictive lifetime value modeling and personalized offering recommendations.",
                  results: "Increased customer acquisition by 35%, improved cross-selling by 42%, and boosted customer retention by 28%.",
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
                      <p className="text-purple-700 font-medium mb-4">{story.industry}</p>
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
                className="text-purple-700 font-medium inline-flex items-center hover:underline"
              >
                View more success stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
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
              Ready to Transform Your Decision-Making with AI?
            </h2>
            <p className="text-xl text-white mb-10">
              Discover how our business analytics solutions can give you a competitive edge.
            </p>
            <Link 
              href="/schedule-consultation" 
              className="bg-white text-purple-700 px-8 py-4 rounded-lg hover:bg-purple-50 transition-colors font-medium text-lg inline-block"
            >
              Schedule Your Analytics Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 