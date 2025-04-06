'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import ResponsiveContainer from './ResponsiveContainer';

export default function Header() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Our Process', href: '/our-process' },
    // Temporarily hidden, but available for future integration
    // { name: 'Training Portal', href: '/training-portal' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Blog', href: '/blog' }
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
      <ResponsiveContainer>
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">FastTrack AI</span>
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    isActive(item.href)
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="hidden md:ml-4 md:flex md:items-center">
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {user.displayName?.[0] || user.email?.[0] || 'U'}
                    </div>
                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                      {user.displayName || user.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
                  </button>

                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1"
                    >
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted flex items-center"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Your Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-muted flex items-center"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground font-medium text-sm"
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </ResponsiveContainer>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden"
        >
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-3 border-l-4 text-base font-medium ${
                  isActive(item.href)
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-transparent text-muted-foreground hover:bg-muted hover:border-gray-300 hover:text-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-6">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg">
                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-foreground">
                    {user.displayName || 'User'}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-6">
                <Link
                  href="/profile"
                  className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex flex-col space-y-3 px-6">
                <Link
                  href="/login"
                  className="text-muted-foreground font-medium py-3 px-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="bg-primary text-primary-foreground px-4 py-3 rounded-md text-sm font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </header>
  );
} 