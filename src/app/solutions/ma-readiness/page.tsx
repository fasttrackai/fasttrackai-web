'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, BarChart, CheckCircle, FileText, Shield, Briefcase, ArrowRight } from 'lucide-react';
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

export default function MAReadiness() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-900 to-emerald-700 py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Target className="h-10 w-10 text-yellow-400 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                M&A Readiness
              </h1>
            </div>
            <p className="text-xl text-white mb-10">
              Maximize your company's valuation with strategic AI implementation
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/schedule-consultation" 
                className="bg-white text-emerald-700 px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
              >
                Schedule M&A Assessment
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
              <h2 className="text-3xl font-bold text-white mb-4">How AI Increases Your Valuation</h2>
              <p className="text-xl text-gray-200">
                Strategic AI implementation can significantly boost your company's value for potential acquirers
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: "Revenue Growth",
                  description: "AI-powered sales and marketing automation can accelerate revenue growth by 20-30%, a key valuation driver."
                },
                {
                  icon: BarChart,
                  title: "Operational Efficiency",
                  description: "AI-driven process optimization can reduce operational costs by 15-25%, improving EBITDA margins."
                },
                {
                  icon: Briefcase,
                  title: "Intellectual Property",
                  description: "Proprietary AI models and algorithms become valuable IP assets that increase company valuation."
                },
                {
                  icon: Shield,
                  title: "Risk Reduction",
                  description: "AI-powered risk management and compliance systems reduce potential liabilities during due diligence."
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
                      <div className="bg-emerald-800 p-3 rounded-full mr-4">
                        <Icon className="h-6 w-6 text-emerald-300" />
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

      {/* M&A Readiness Process */}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our M&A Readiness Process</h2>
              <p className="text-xl text-gray-700">
                A comprehensive approach to prepare your company for maximum valuation
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  step: "Step 1",
                  title: "Valuation Assessment",
                  description: "We conduct a thorough assessment of your current valuation drivers and identify opportunities for AI-driven enhancement.",
                  deliverables: [
                    "Current valuation analysis",
                    "AI opportunity assessment",
                    "Valuation gap analysis"
                  ]
                },
                {
                  step: "Step 2",
                  title: "Strategic AI Implementation",
                  description: "We implement AI solutions specifically designed to address valuation gaps and enhance key metrics.",
                  deliverables: [
                    "Custom AI solution development",
                    "Integration with existing systems",
                    "Performance optimization"
                  ]
                },
                {
                  step: "Step 3",
                  title: "Due Diligence Preparation",
                  description: "We prepare comprehensive documentation and data rooms to showcase your AI capabilities to potential acquirers.",
                  deliverables: [
                    "Technical documentation",
                    "Performance metrics dashboard",
                    "IP portfolio documentation"
                  ]
                },
                {
                  step: "Step 4",
                  title: "Acquirer Engagement Support",
                  description: "We provide technical support during the acquisition process to highlight the value of your AI implementations.",
                  deliverables: [
                    "Technical presentations",
                    "Demo environments",
                    "ROI analysis"
                  ]
                }
              ].map((phase, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-start">
                    <div className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold mb-4 md:mb-0 md:mr-6 text-center md:text-left">
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

      {/* Valuation Multipliers */}
      <section className="py-20 bg-white">
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Valuation Multipliers</h2>
              <p className="text-xl text-gray-600">
                See how AI implementation can increase your valuation multiples
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-purple-100">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Industry</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-900">Standard Multiple</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-900">AI-Enhanced Multiple</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-900">Potential Increase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        industry: "SaaS / Technology",
                        standard: "5-7x ARR",
                        enhanced: "8-12x ARR",
                        increase: "60-70%"
                      },
                      {
                        industry: "E-commerce",
                        standard: "2-3x EBITDA",
                        enhanced: "3-5x EBITDA",
                        increase: "50-65%"
                      },
                      {
                        industry: "Financial Services",
                        standard: "8-10x EBITDA",
                        enhanced: "12-15x EBITDA",
                        increase: "40-50%"
                      },
                      {
                        industry: "Healthcare",
                        standard: "6-8x EBITDA",
                        enhanced: "10-14x EBITDA",
                        increase: "65-75%"
                      },
                      {
                        industry: "Manufacturing",
                        standard: "4-6x EBITDA",
                        enhanced: "7-9x EBITDA",
                        increase: "50-75%"
                      }
                    ].map((row, index) => (
                      <tr 
                        key={row.industry}
                        className={`
                          border-t border-gray-200
                          hover:bg-purple-50 transition-colors
                          ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        `}
                      >
                        <td className="py-4 px-6 font-medium text-gray-900">{row.industry}</td>
                        <td className="py-4 px-6 text-center text-gray-700">{row.standard}</td>
                        <td className="py-4 px-6 text-center font-medium text-emerald-700">{row.enhanced}</td>
                        <td className="py-4 px-6 text-center font-medium text-emerald-700">{row.increase}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 italic">
                  *Based on industry averages and FastTrackAI client outcomes. Actual results may vary.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-20 bg-emerald-50">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">M&A Success Story</h2>
              <p className="text-xl text-gray-700">
                How we helped a client achieve a 3.5x valuation increase
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-6 md:mb-0 md:pr-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">TechServe Solutions</h3>
                  <p className="text-emerald-700 font-medium mb-4">IT Services Provider</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Initial Valuation</p>
                      <p className="text-xl font-bold text-gray-900">$12M (4x EBITDA)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Final Acquisition Price</p>
                      <p className="text-2xl font-bold text-emerald-700">$42M (14x EBITDA)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Implementation Timeline</p>
                      <p className="text-gray-900">8 months</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 md:border-l md:pl-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">The Challenge</h4>
                  <p className="text-gray-700 mb-6">
                    TechServe Solutions was preparing for acquisition but was being valued at standard industry multiples. They needed to differentiate themselves and demonstrate higher growth potential to attract premium offers.
                  </p>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Our Solution</h4>
                  <div className="space-y-3 mb-6">
                    {[
                      "Implemented AI-powered predictive maintenance system that reduced client downtime by 78%",
                      "Developed custom AI customer success platform that increased retention by 42%",
                      "Created automated service delivery workflows that improved margins by 35%",
                      "Built comprehensive data room showcasing AI capabilities and performance metrics"
                    ].map((item, i) => (
                      <div key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-4">The Result</h4>
                  <p className="text-gray-700">
                    The company's AI capabilities became a central focus during acquisition talks, demonstrating both current value and future potential. Multiple bidders competed for the acquisition, driving the final valuation to 3.5x the initial estimate.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-900">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Maximize Your Company's Valuation?
            </h2>
            <p className="text-xl text-white mb-10">
              Our M&A readiness services can help you implement the right AI solutions to attract premium acquisition offers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/schedule-consultation" 
                className="bg-white text-emerald-700 px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
              >
                Schedule M&A Assessment
              </Link>
              <Link 
                href="/packages" 
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                View M&A Packages
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 