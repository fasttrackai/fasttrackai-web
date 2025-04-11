'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Loader, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth(); // Assuming useAuth provides a signIn function
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!signIn) {
         throw new Error('Sign in function not available from useAuth.');
      }
      await signIn(email, password);
      // Sign-in successful, redirect to client dashboard
      router.push('/client-dashboard'); 
    } catch (err: any) {
      console.error("Login Error:", err);
      // Provide more user-friendly error messages
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <motion.div 
        className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
        initial="initial" 
        animate="animate" 
        variants={fadeInUp}
      >
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
             <Link href="/" className="inline-block mb-4">
                <span className="text-2xl font-bold text-primary">FastTrack AI</span>
             </Link>
             <h1 className="text-2xl font-bold text-gray-900">Client Login</h1>
             <p className="mt-2 text-gray-600">Access your AI Performance Dashboard.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                 </div>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                 </div>
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                 <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                 <span>{error}</span>
              </div>
            )}

            <div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="button-primary w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-3" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <LogIn className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

           {/* Optional: Add link to sign up or forgot password */}
           <div className="mt-6 text-center text-sm">
             <p className="text-gray-600">
                Need access? Contact support. 
                {/* Or add a sign-up link: <Link href="/signup" className="font-medium text-purple-600 hover:text-purple-500">Sign up</Link> */}
             </p>
           </div>
        </div>
      </motion.div>
    </main>
  );
} 