'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactRedirect() {
  const router = useRouter();

  // Automatically redirect after a short delay
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/schedule-consultation');
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <main className="min-h-screen gradient-primary flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center text-white"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">We've Streamlined Our Process</h1>
        <p className="text-xl mb-8 opacity-90">
          Our contact page has been integrated into our consultation scheduling system
          for faster response times and more personalized service.
        </p>
        <p className="text-lg mb-10 opacity-80">
          You'll be redirected to our scheduling page in a moment...
        </p>
        <Link 
          href="/schedule-consultation"
          className="inline-flex items-center bg-white text-purple-900 px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
        >
          <Calendar className="h-5 w-5 mr-2" />
          Schedule a Consultation
          <ChevronRight className="h-5 w-5 ml-2" />
        </Link>
      </motion.div>
    </main>
  );
} 