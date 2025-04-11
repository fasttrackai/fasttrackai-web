'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedRocket from './components/AnimatedRocket';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  
  const solutionsItems = [
    { name: 'Customer Service AI', href: '/solutions/customer-service-ai' },
    { name: 'Business Analytics', href: '/solutions/business-analytics' },
    { name: 'Process Automation', href: '/solutions/process-automation' },
    { name: 'M&A Readiness', href: '/solutions/ma-readiness' },
    { name: 'Rapid Implementation', href: '/solutions/rapid-implementation' },
    { name: 'AI Integration Services', href: '/solutions/ai-integration' }
  ];
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (profileTimeoutRef.current) clearTimeout(profileTimeoutRef.current);
    };
  }, []);
  
  const handleDropdownEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setSolutionsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setSolutionsDropdownOpen(false);
    }, 300);
  };

  const handleProfileEnter = () => {
    if (profileTimeoutRef.current) clearTimeout(profileTimeoutRef.current);
    setIsProfileDropdownOpen(true);
  };
  const handleProfileLeave = () => {
    profileTimeoutRef.current = setTimeout(() => {
      setIsProfileDropdownOpen(false);
    }, 300);
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
              <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-2 py-1.5 hover:bg-gray-50 rounded-md whitespace-nowrap text-sm">
                Contact
              </Link>
              {user ? (
                <>
                  <Link 
                    href="/client-dashboard" 
                    className={`text-gray-700 hover:text-gray-900 transition-colors font-medium px-2 py-1.5 hover:bg-gray-50 rounded-md whitespace-nowrap text-sm ${
                      isActive('/client-dashboard') ? 'text-purple-700 font-semibold' : ''
                    }`}
                  >
                    Dashboard
                  </Link>
                  <div className="relative ml-3" onMouseEnter={handleProfileEnter} onMouseLeave={handleProfileLeave}>
                    <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                      <span className="sr-only">Open user menu</span>
                       <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                          {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                       </div>
                       <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                    </button>
                    {isProfileDropdownOpen && (
                       <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.2 }}
                         className="absolute right-0 mt-1 w-56 origin-top-right bg-white rounded-md shadow-lg z-10 py-1 border focus:outline-none"
                       >
                         <div className="px-4 py-3">
                           <p className="text-sm font-medium text-gray-900 truncate">{user.displayName || 'User'}</p>
                           <p className="text-xs text-gray-500 truncate">{user.email}</p>
                         </div>
                         <div className="border-t border-gray-100"></div>
                         <Link href="/client-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setIsProfileDropdownOpen(false)}>
                           <LayoutDashboard className="mr-2 h-4 w-4 text-gray-500" /> Client Dashboard
                         </Link>
                         <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setIsProfileDropdownOpen(false)}>
                           <User className="mr-2 h-4 w-4 text-gray-500" /> Your Profile
                         </Link>
                         <div className="border-t border-gray-100"></div>
                         <button 
                           onClick={() => { signOut(); setIsProfileDropdownOpen(false); }}
                           className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                         >
                           <LogOut className="mr-2 h-4 w-4" /> Sign out
                         </button>
                       </motion.div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-2 py-1.5 hover:bg-gray-50 rounded-md whitespace-nowrap text-sm">Sign In</Link>
                  <Link 
                    href="/schedule-consultation" 
                    className="bg-purple-700 text-white px-3 py-1.5 rounded-lg hover:bg-purple-800 transition-colors font-medium ml-1 shadow-sm hover:shadow whitespace-nowrap text-sm"
                  >
                    Schedule Consultation
                  </Link>
                </>
              )}
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
                <Link 
                  href="/contact"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                {user && (
                    <Link 
                        href="/client-dashboard" 
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500"/> Dashboard
                    </Link>
                )}
                <Link 
                  href="/schedule-consultation"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-purple-700 text-white hover:bg-purple-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Schedule Consultation
                </Link>
              </div>
              {user ? (
                 <div className="pt-4 pb-3 border-t border-gray-200">
                   <div className="flex items-center px-5">
                     <div className="flex-shrink-0">
                       <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                         {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                       </div>
                     </div>
                     <div className="ml-3">
                       <div className="text-base font-medium text-gray-800">{user.displayName || 'User'}</div>
                       <div className="text-sm font-medium text-gray-500">{user.email}</div>
                     </div>
                   </div>
                   <div className="mt-3 px-2 space-y-1">
                     <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                       <User className="mr-3 h-5 w-5 text-gray-500"/> Your Profile
                     </Link>
                     <button 
                       onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                       className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center"
                     >
                       <LogOut className="mr-3 h-5 w-5"/> Sign out
                     </button>
                   </div>
                 </div>
               ) : (
                 <div className="pt-4 pb-3 border-t border-gray-200">
                   <div className="px-5">
                     <Link 
                       href="/login"
                       className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-700 hover:bg-purple-800"
                       onClick={() => setIsMobileMenuOpen(false)}
                     >
                       Sign In
                     </Link>
                   </div>
                 </div>
               )}
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
                <li><Link href="/schedule-consultation?source=nav" className="hover:text-gray-900 transition-colors">AI Strategy Consultation</Link></li>
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