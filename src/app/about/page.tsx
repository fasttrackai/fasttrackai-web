'use client';

import { Building, Target, Users, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

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
            We help small and medium-sized businesses leverage AI technology to increase their value
            and become attractive M&A targets.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Mission Section */}
      <section className="py-20">
        <motion.div 
          className="container mx-auto px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl font-bold mb-8 text-gray-900"
              variants={fadeInUp}
            >
              Our Mission
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              variants={fadeInUp}
            >
              Accelerating the integration of AI capabilities into everyday results for small businesses.
              We believe that every business deserves access to the transformative power of AI technology.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-gray-900"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Our Values
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Building,
                title: "Innovation",
                description: "Constantly exploring new ways to apply AI technology to solve business challenges."
              },
              {
                icon: Target,
                title: "Results-Driven",
                description: "Focused on delivering measurable business outcomes and ROI."
              },
              {
                icon: Users,
                title: "Partnership",
                description: "Building long-term relationships with our clients for sustained success."
              },
              {
                icon: Lightbulb,
                title: "Simplicity",
                description: "Making AI integration straightforward and accessible."
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
            Ready to Start Your AI Journey?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Join the growing number of businesses that have successfully integrated AI capabilities
            and increased their market value.
          </motion.p>
          <motion.button
            className="bg-white text-purple-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Schedule a Consultation
          </motion.button>
        </motion.div>
      </motion.section>
    </main>
  );
} 