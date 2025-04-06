'use client';

import Link from "next/link";
import { ArrowRight, Bot, BarChart, Target, Zap } from "lucide-react";
import ChatBot from "./components/ChatBot";
import { motion } from "framer-motion";
import ResponsiveContainer from "./components/ResponsiveContainer";
import ValueProp from "./components/ValueProp";

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

export default function Home() {
  return (
    <main className="min-h-screen gradient-primary">
      {/* Hero Section */}
      <motion.section 
        className="py-12 md:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <ResponsiveContainer>
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="heading-1 mb-6 text-white"
              variants={fadeInUp}
            >
              Fast-Track Your Business with AI Integration
            </motion.h1>
            <motion.p 
              className="body-large mb-8 text-white"
              variants={fadeInUp}
            >
              Accelerating the integration of AI capabilities into everyday results for small businesses.
              Transform your operations and become an attractive M&A target.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/strategy-report" className="button-secondary inline-flex items-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </ResponsiveContainer>
      </motion.section>

      {/* Value Proposition Section */}
      <section className="py-12 md:py-20 gradient-secondary">
        <ResponsiveContainer>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Zap,
                title: "Rapid Integration",
                description: "Deploy AI solutions in weeks, not months. Quick implementation with measurable results."
              },
              {
                icon: BarChart,
                title: "Enhanced Valuation",
                description: "Boost your company's value with proven AI capabilities and documented ROI."
              },
              {
                icon: Target,
                title: "M&A Ready",
                description: "Position your business as an attractive acquisition target with modern AI infrastructure."
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={item.title}
                  className="text-center"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center"
                  >
                    <Icon className="h-8 w-8 text-purple-800" />
                  </motion.div>
                  <h3 className="heading-3 mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-200 mx-auto max-w-sm">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </ResponsiveContainer>
      </section>

      {/* Value Prop Component - NEW */}
      <ValueProp />

      {/* Solutions Section */}
      <section className="py-12 md:py-20">
        <ResponsiveContainer>
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4 text-white">Our AI Solutions</h2>
            <p className="body-large text-gray-200 max-w-3xl mx-auto">
              Customized AI implementation strategies designed for small to medium businesses
              seeking operational excellence and increased valuation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI Integration",
                description: "Seamlessly integrate AI tools into your existing workflow with minimal disruption.",
                link: "/solutions/ai-integration"
              },
              {
                title: "M&A Readiness",
                description: "Prepare your business for acquisition with AI-enhanced operations and documentation.",
                link: "/solutions/ma-readiness"
              },
              {
                title: "Rapid Implementation",
                description: "Quick deployment methodologies to achieve ROI within weeks, not months.",
                link: "/solutions/rapid-implementation"
              },
              {
                title: "Analytics",
                description: "Derive actionable insights from your data using advanced AI analytics.",
                link: "/solutions/analytics"
              },
              {
                title: "Automation",
                description: "Streamline repetitive tasks and workflows with intelligent automation.",
                link: "/solutions/automation"
              },
              {
                title: "Customer Service",
                description: "Enhance customer experience with AI-powered support and engagement tools.",
                link: "/solutions/customer-service"
              }
            ].map((item) => (
              <motion.div 
                key={item.title}
                className="card flex flex-col justify-between h-full"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h3 className="heading-3 mb-3 text-purple-900">{item.title}</h3>
                  <p className="text-gray-600 mb-8">{item.description}</p>
                </div>
                <div>
                  <Link href={item.link} className="text-purple-700 font-medium flex items-center hover:text-purple-900">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </ResponsiveContainer>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 gradient-secondary">
        <ResponsiveContainer className="text-center">
          <h2 className="heading-2 mb-4 text-white">Success Stories</h2>
          <p className="body-large text-gray-200 max-w-3xl mx-auto mb-12">
            See how our clients have transformed their businesses with our AI implementation strategy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                title: "CEO, TechSolutions Inc.",
                quote: "FastTrack AI helped us implement intelligent automation that reduced our operational costs by 35% in just three months.",
                avatar: "/avatars/sarah-chen.jpg"
              },
              {
                name: "Marcus Johnson",
                title: "Operations Director, LogiTech",
                quote: "After implementing their AI strategy, our valuation increased by 2.5x, leading to a successful acquisition.",
                avatar: "/avatars/marcus-johnson.jpg"
              },
              {
                name: "Aisha Patel",
                title: "Founder, DataSmart",
                quote: "The rapid implementation approach meant we saw ROI within weeks, not the months or years we expected.",
                avatar: "/avatars/aisha-patel.jpg"
              }
            ].map((testimonial) => (
              <motion.div 
                key={testimonial.name}
                className="bg-purple-900/50 p-6 md:p-8 rounded-xl border border-purple-800"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex-shrink-0 overflow-hidden mr-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-purple-300 text-sm">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-left text-gray-200 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12">
            <Link href="/case-studies" className="button-secondary inline-flex items-center">
              View All Case Studies <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Chat Bot Section */}
      <section className="py-12 md:py-20 relative">
        <ResponsiveContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-4 text-white">Ask Our AI Assistant</h2>
              <p className="text-gray-200 mb-6">
                Have questions about how AI can benefit your specific business? Ask our AI assistant for 
                personalized insights and recommendations.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "How can AI improve my business valuation?",
                  "What's the typical implementation timeline?",
                  "Which AI solution is best for my industry?",
                  "How do I prepare my team for AI adoption?"
                ].map((question, index) => (
                  <li key={index} className="flex items-start">
                    <Bot className="h-5 w-5 text-purple-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{question}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ChatBot />
            </div>
          </div>
        </ResponsiveContainer>
      </section>
    </main>
  );
}
