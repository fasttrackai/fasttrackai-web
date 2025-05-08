'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function CaseStudiesComingSoon() {
  return (
    <main className="min-h-screen gradient-primary flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center text-white"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Case Studies Coming Soon</h1>
        <p className="text-xl mb-8 opacity-90">
          Our case studies section is currently under development. We're working on 
          documenting real-world AI implementation success stories.
        </p>
        <p className="mb-10 opacity-80">
          Please check back later or schedule a consultation to learn how our solutions
          have helped businesses like yours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="inline-flex items-center text-white border border-white/30 px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Homepage
          </Link>
          <Link 
            href="/schedule-consultation"
            className="inline-flex items-center bg-white text-purple-900 px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            Schedule a Consultation
          </Link>
        </div>
      </motion.div>
    </main>
  );
} 