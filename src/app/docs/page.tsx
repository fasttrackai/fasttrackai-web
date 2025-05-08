'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function DocsComingSoon() {
  return (
    <main className="min-h-screen gradient-primary flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center text-white"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentation Coming Soon</h1>
        <p className="text-xl mb-8 opacity-90">
          Our documentation section is currently under development. We're working on
          creating comprehensive guides for AI implementation and best practices.
        </p>
        <p className="mb-10 opacity-80">
          Please check back later or contact our support team for any specific information you need.
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
            href="/contact"
            className="inline-flex items-center bg-white text-purple-900 px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </motion.div>
    </main>
  );
} 