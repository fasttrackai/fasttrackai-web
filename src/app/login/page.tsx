'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Loader, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import AnimatedRocket from '@/app/components/AnimatedRocket';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2 
    }
  }
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth(); 
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (!signIn) throw new Error('Sign in function not available from useAuth.');
      await signIn(email, password);
      router.push('/client-dashboard'); 
    } catch (err: any) {
      console.error("Login Error:", err);
      let errorMessage = 'Login failed. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email'){
        errorMessage = 'Please enter a valid email address.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-100 to-violet-200 p-4">
      <motion.div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        {/* Header Section with Rocket */}
        <div className="p-6 bg-gradient-to-r from-purple-700 to-purple-900 text-center relative overflow-hidden">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 100 }}
            className="absolute -top-4 -left-4 w-24 h-24 opacity-10"
           >
             <AnimatedRocket />
          </motion.div>
           <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 100 }}
            className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 transform rotate-12"
           >
             <AnimatedRocket />
          </motion.div>
           <Link href="/" className="inline-block mb-2 relative z-10">
              <span className="text-3xl font-bold text-white tracking-tight">FastTrack AI</span>
           </Link>
           <p className="text-purple-200/90 text-sm relative z-10">Client Portal Login</p>
        </div>

        {/* Form Section */}
        <div className="p-8 md:p-10">
          <motion.form 
            onSubmit={handleLogin} 
            className="space-y-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                 </div>
                <input 
                  type="email" name="email" id="email" required 
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="form-input-themed" // Using class from globals.css or component styling
                  placeholder="you@example.com"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                 </div>
                <input 
                  type="password" name="password" id="password" required 
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="form-input-themed" // Using class from globals.css or component styling
                  placeholder="••••••••"
                />
              </div>
            </motion.div>
            
            {error && (
              <motion.div 
                className="flex items-center p-3 bg-red-100 border border-red-300 rounded-lg text-sm text-red-800 shadow-sm"
                variants={fadeInUp}
              >
                 <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                 <span>{error}</span>
              </motion.div>
            )}

            <motion.div variants={fadeInUp}>
              <button 
                type="submit" 
                disabled={isLoading}
                className="button-primary w-full flex items-center justify-center text-base py-2.5" 
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-3" /> Signing In...
                  </>
                ) : (
                  <>
                    Sign In <LogIn className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>

           <motion.div className="mt-8 text-center text-sm" variants={fadeInUp}>
             <p className="text-gray-500">
                Trouble logging in? Contact support.
             </p>
           </motion.div>
        </div>
      </motion.div>
    </main>
  );
}

/* Add these to globals.css if not already defined:
@layer components {
  .form-input-themed {
    @apply block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900;
  }
  .button-primary {
     @apply bg-purple-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-800 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed;
  }
}
*/ 