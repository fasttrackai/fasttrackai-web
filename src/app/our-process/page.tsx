'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Users, PenTool, Layers, BarChart, Workflow, Shield, Download } from 'lucide-react';
import ResponsiveContainer from '../components/ResponsiveContainer';

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

export default function OurProcess() {
  const steps = [
    {
      id: 1,
      title: 'Strategic Discovery',
      description: 'We begin by understanding your business objectives, challenges, and opportunities for AI adoption.',
      icon: PenTool,
      color: 'purple'
    },
    {
      id: 2,
      title: 'Solution Architecture',
      description: 'Our experts design a customized AI solution roadmap aligned with your specific business needs.',
      icon: BrainCircuit,
      color: 'emerald'
    },
    {
      id: 3,
      title: 'Rapid Implementation',
      description: 'We deploy AI solutions using our proven frameworks and integration tools to minimize disruption.',
      icon: Workflow,
      color: 'blue'
    },
    {
      id: 4,
      title: 'Training & Adoption',
      description: 'We ensure your team understands and embraces the new AI capabilities through comprehensive training.',
      icon: Users,
      color: 'amber'
    },
    {
      id: 5,
      title: 'Measure & Optimize',
      description: 'We track performance metrics against business goals and continuously improve your AI solution.',
      icon: BarChart,
      color: 'red'
    }
  ];

  return (
    <main className="min-h-screen gradient-primary">
      {/* Hero Section */}
      <section className="py-20">
        <ResponsiveContainer>
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="heading-1 mb-6 text-white"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              Our AI Implementation Process
            </motion.h1>
            <motion.p 
              className="body-large mb-8 text-white"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              We've refined our methodology through years of successful AI implementations.
              Our process ensures seamless integration, rapid results, and maximum business impact.
            </motion.p>
          </motion.div>
        </ResponsiveContainer>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-white">
        <ResponsiveContainer>
          <div className="mb-16 text-center">
            <h2 className="heading-2 mb-6 text-purple-800">Our 5-Step Implementation Framework</h2>
            <p className="body-large max-w-3xl mx-auto text-gray-700">
              Our process combines strategic guidance with efficient implementation to deliver
              measurable business value in weeks, not months.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-purple-200 transform -translate-x-1/2"></div>
            
            {/* Steps */}
            <div className="space-y-20">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.id}
                  className={`flex flex-col lg:flex-row items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Timeline Circle */}
                  <div className="hidden lg:flex lg:items-center lg:justify-center w-full">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-${step.color}-100 text-${step.color}-600 border-4 border-white z-10`}>
                      <span className="font-bold">{step.id}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}>
                    <div className={`bg-${step.color}-50 p-8 rounded-lg border border-${step.color}-200`}>
                      <div className="flex items-center mb-4">
                        <div className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-${step.color}-100 text-${step.color}-600 mr-4`}>
                          <span className="font-bold">{step.id}</span>
                        </div>
                        <step.icon className={`h-8 w-8 text-${step.color}-600 mr-3`} />
                        <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-gray-700">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Our Expertise */}
      <section className="py-20 gradient-secondary">
        <ResponsiveContainer>
          <div className="mb-16 text-center">
            <h2 className="heading-2 mb-6 text-white">Why Our Approach Works</h2>
            <p className="body-large max-w-3xl mx-auto text-gray-200">
              Our methodology combines strategic guidance with efficient implementation, 
              leveraging industry expertise and proven frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Strategic Guidance",
                description: "Our team of AI strategists ensures your implementation aligns with your unique business goals and delivers measurable ROI."
              },
              {
                icon: Layers,
                title: "Proven Technology Stack",
                description: "We've built a proprietary implementation framework that leverages best-in-class tools and accelerates deployment."
              },
              {
                icon: Users,
                title: "Expert Team",
                description: "Our carefully selected team combines business strategy and technical expertise to deliver results that matter."
              },
              {
                icon: Download,
                title: "Efficient Implementation",
                description: "Our implementation process minimizes business disruption while accelerating time-to-value."
              },
              {
                icon: BrainCircuit,
                title: "AI Strategy Expertise",
                description: "We specialize in creating AI solutions that provide both immediate value and long-term competitive advantage."
              },
              {
                icon: BarChart,
                title: "ROI-Focused Approach",
                description: "Every implementation includes clear metrics and KPIs to ensure your AI investment delivers measurable returns."
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-purple-900/50 p-8 rounded-xl border border-purple-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <item.icon className="h-10 w-10 text-purple-300 mb-4" />
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-200">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </ResponsiveContainer>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <ResponsiveContainer>
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl p-12 text-center">
            <h2 className="heading-2 mb-6 text-white">Ready to Fast-Track Your AI Journey?</h2>
            <p className="body-large mb-8 text-white max-w-3xl mx-auto">
              Schedule a consultation with our team to learn how our proven implementation process
              can help you achieve your business goals.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/schedule-consultation" className="button-secondary inline-flex items-center">
                Schedule a Consultation <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </ResponsiveContainer>
      </section>
    </main>
  );
} 