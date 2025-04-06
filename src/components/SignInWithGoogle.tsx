"use client";

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useRouter } from 'next/navigation';
import logger from '@/lib/utils/logger';

export default function SignInWithGoogle() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      if (!auth) {
        throw new Error('Firebase authentication not initialized');
      }
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/client-dashboard');
    } catch (err) {
      logger.error('Failed to sign in with Google:', err);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="flex items-center justify-center bg-white text-gray-700 font-semibold py-2 px-4 rounded-full border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out"
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-6 h-6 mr-2" />
      Sign in with Google
    </button>
  );
}
