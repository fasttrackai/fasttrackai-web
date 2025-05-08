'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    info: "1-800-AI-BOOST",
    color: "bg-purple-700",
    bgColor: "bg-purple-100"
  },
  {
    icon: Mail,
    title: "Email",
    info: "contact@fasttrack.ai",
    color: "bg-blue-700",
    bgColor: "bg-blue-100"
  },
  {
    icon: MapPin,
    title: "Office",
    info: "123 AI Street, Tech City, TC 12345",
    color: "bg-emerald-700",
    bgColor: "bg-emerald-100"
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen gradient-primary">
      {/* Hero Section */}
      <motion.section 
        className="py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 text-center text-white">
          <motion.h1 
            className="heading-1 mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            className="body-large max-w-2xl mx-auto text-white"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            Get in touch with our team to discuss how we can help transform your business with AI.
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Information and Form */}
      <section className="py-16 gradient-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {contactInfo.map((contact) => {
                const Icon = contact.icon;
                return (
                  <motion.div 
                    key={contact.title} 
                    className="text-center card"
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                  >
                    <motion.div 
                      className={`${contact.bgColor} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className={`h-6 w-6 text-${contact.color.replace('bg-', '')}`} />
                    </motion.div>
                    <h3 className="heading-3 mb-2 text-gray-900">{contact.title}</h3>
                    <p className="text-gray-700">{contact.info}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.h2 
                className="heading-3 mb-6 text-gray-900"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                Send us a Message
              </motion.h2>
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={fadeInUp}
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="input-field"
                    required
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  className="button-primary w-full flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </motion.button>
              </motion.form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-24 gradient-cta text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            className="heading-2 mb-8"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Ready to Start Your AI Journey?
          </motion.h2>
          <motion.p 
            className="body-large mb-10 max-w-2xl mx-auto opacity-90"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Schedule a consultation to discuss your business needs and how our AI solutions can help.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/schedule-consultation" className="button-secondary">
              Schedule a Consultation
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
} 