'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            404 - Page Not Found
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 mb-6">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="w-full max-w-xs mx-auto my-8">
            <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <rect width="300" height="200" fill="white"/>
              
              {/* Background elements */}
              <circle cx="150" cy="100" r="80" fill="#F3F4F6"/>
              
              {/* 404 Text */}
              <path d="M90 70V130H110V110H130V130H150V70H130V90H110V70H90Z" fill="#9333EA" opacity="0.8"/>
              <path d="M170 70V90H190V130H210V90H230V70H170Z" fill="#9333EA" opacity="0.8"/>
              <path d="M250 70V130H270V70H250Z" fill="#9333EA" opacity="0.8"/>
              
              {/* Rocket */}
              <g transform="translate(130, 150) rotate(-45)">
                <rect x="-10" y="-5" width="20" height="30" rx="10" fill="#9333EA"/>
                <path d="M-10 10L-20 20L-20 30L-10 20L-10 10Z" fill="#9333EA"/>
                <path d="M10 10L20 20L20 30L10 20L10 10Z" fill="#9333EA"/>
                <circle cx="0" cy="0" r="8" fill="#F3F4F6"/>
                <circle cx="0" cy="0" r="4" fill="#9333EA"/>
                <path d="M-10 25L-5 40L0 25L5 40L10 25Z" fill="#FDE68A"/>
              </g>
              
              {/* Stars */}
              <circle cx="50" cy="40" r="3" fill="#9333EA" opacity="0.6"/>
              <circle cx="80" cy="30" r="2" fill="#9333EA" opacity="0.6"/>
              <circle cx="220" cy="50" r="3" fill="#9333EA" opacity="0.6"/>
              <circle cx="250" cy="30" r="2" fill="#9333EA" opacity="0.6"/>
              <circle cx="40" cy="160" r="2" fill="#9333EA" opacity="0.6"/>
              <circle cx="260" cy="170" r="3" fill="#9333EA" opacity="0.6"/>
            </svg>
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <Home className="h-4 w-4 mr-2" />
            Go to Homepage
          </Link>
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
} 