// This file has been temporarily disabled but kept for future use
// To re-enable, rename this file back to page.tsx

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function BlogComingSoon() {
  return (
    <main className="min-h-screen gradient-primary flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center text-white"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog Coming Soon</h1>
        <p className="text-xl mb-8 opacity-90">
          Our blog is currently under construction. We're working on creating valuable content about AI 
          implementation strategies, best practices, and industry insights.
        </p>
        <p className="mb-10 opacity-80">
          Please check back later or subscribe to our newsletter to be notified when new content is available.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center text-white border border-white/30 px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Homepage
        </Link>
      </motion.div>
    </main>
  );
} 