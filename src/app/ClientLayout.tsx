'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedRocket from './components/AnimatedRocket';

const fadeInUp = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 }
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSolutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  
  // Use useRef for timeout reference to fix the const reassignment issue
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Solutions for dropdown menu
  const solutionsItems = [
    { name: 'Customer Service AI', href: '/solutions/customer-service-ai' },
    { name: 'Business Analytics', href: '/solutions/business-analytics' },
    { name: 'Process Automation', href: '/solutions/process-automation' },
    { name: 'M&A Readiness', href: '/solutions/ma-readiness' },
    { name: 'Rapid Implementation', href: '/solutions/rapid-implementation' },
    { name: 'AI Integration Services', href: '/solutions/ai-integration' }
  ];
  
  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Improved dropdown handlers with delay for better UX
  const handleDropdownEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setSolutionsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    // Set a longer delay before closing to give users more time to move to the dropdown
    timeoutRef.current = setTimeout(() => {
      setSolutionsDropdownOpen(false);
    }, 300); // 300ms delay
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <AnimatedRocket />
            </div>

            <div className="hidden lg:flex items-center justify-end space-x-1 flex-1">
              <div className="relative">
                <button 
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-2 py-1.5 hover:bg-gray-50 rounded-md whitespace-nowrap text-sm flex items-center"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                  onClick={() => setSolutionsDropdownOpen(!isSolutionsDropdownOpen)}
                >
                  Solutions
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {isSolutionsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg z-10 py-1 border"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {/* Add padding-top to create a seamless hover area */}
                    <div className="absolute h-4 w-full -top-4"></div>
                    <Link href="/solutions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">
                      All Solutions
                    </Link>
                    <div className="border-t my-1"></div>
                    {solutionsItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
              <Link href="/packages" className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-2 py-1.5 hover:bg-gray-50 rounded-md whitespace-nowrap text-sm">
                Packages
              </Link>
              <Link href="/strategy-report" className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-2 py-1.5 hover:bg-gray-50 rounded-md whitespace-nowrap text-sm">
                Strategy Report
              </Link>
              {/* Training Portal temporarily hidden, but available for future integration
              <Link href="/training-portal" className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-2 py-1.5 hover:bg-gray-50 rounded-md whitespace-nowrap text-sm">
                Training Portal
              </Link>
              */}
              <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-2 py-1.5 hover:bg-gray-50 rounded-md whitespace-nowrap text-sm">
                Contact
              </Link>
              <Link href="/client-dashboard" className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-2 py-1.5 hover:bg-gray-50 rounded-md whitespace-nowrap text-sm">
                Dashboard
              </Link>
              <Link 
                href="/schedule-consultation" 
                className="bg-purple-700 text-white px-3 py-1.5 rounded-lg hover:bg-purple-800 transition-colors font-medium ml-1 shadow-sm hover:shadow whitespace-nowrap text-sm"
              >
                Schedule Consultation
              </Link>
            </div>

            <div className="lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link 
                  href="/solutions"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Solutions
                </Link>
                
                {/* Indented solution items for mobile */}
                {solutionsItems.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 pl-6 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <Link 
                  href="/packages"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Packages
                </Link>
                <Link 
                  href="/strategy-report"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Strategy Report
                </Link>
                {/* Training Portal temporarily hidden, but available for future integration
                <Link 
                  href="/training-portal"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Training Portal
                </Link>
                */}
                <Link 
                  href="/contact"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link 
                  href="/client-dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/schedule-consultation"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-purple-700 text-white hover:bg-purple-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Schedule Consultation
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">About Us</h3>
              </div>
              <p className="text-gray-600">Accelerating AI integration for small businesses.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Solutions</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/solutions/customer-service-ai" className="hover:text-gray-900 transition-colors">Customer Service AI</Link></li>
                <li><Link href="/solutions/business-analytics" className="hover:text-gray-900 transition-colors">Business Analytics</Link></li>
                <li><Link href="/solutions/process-automation" className="hover:text-gray-900 transition-colors">Process Automation</Link></li>
                <li><Link href="/solutions/ma-readiness" className="hover:text-gray-900 transition-colors">M&A Readiness</Link></li>
                <li><Link href="/solutions/rapid-implementation" className="hover:text-gray-900 transition-colors">Rapid Implementation</Link></li>
                <li><Link href="/solutions/ai-integration" className="hover:text-gray-900 transition-colors">AI Integration Services</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/case-studies" className="hover:text-gray-900 transition-colors">Case Studies</Link></li>
                <li><Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link></li>
                <li><Link href="/docs" className="hover:text-gray-900 transition-colors">Documentation</Link></li>
                {/* Training Portal temporarily hidden, but available for future integration
                <li><Link href="/training-portal" className="hover:text-gray-900 transition-colors">Training Portal</Link></li>
                */}
                <li><Link href="/strategy-report" className="hover:text-gray-900 transition-colors">AI Strategy Report</Link></li>
                <li><Link href="/roi-calculator" className="hover:text-gray-900 transition-colors">ROI Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact</h3>
              <ul className="space-y-2 text-gray-600">
                <li>contact@fasttrack.ai</li>
                <li>1-800-AI-BOOST</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-10 pt-8 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} FastTrackAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 