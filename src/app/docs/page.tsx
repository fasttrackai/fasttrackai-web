'use client';

import { Book, FileText, Video, HelpCircle, Lightbulb, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const resources = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of AI integration and how to prepare your business.",
    icon: Book,
    href: "/docs/getting-started"
  },
  {
    title: "Implementation Guides",
    description: "Step-by-step guides for implementing different AI solutions.",
    icon: FileText,
    href: "/docs/implementation"
  },
  {
    title: "Video Tutorials",
    description: "Watch our video tutorials on AI integration and best practices.",
    icon: Video,
    href: "/docs/tutorials"
  },
  {
    title: "FAQs",
    description: "Find answers to commonly asked questions about our services.",
    icon: HelpCircle,
    href: "/docs/faqs"
  },
  {
    title: "Best Practices",
    description: "Learn industry best practices for AI implementation.",
    icon: Lightbulb,
    href: "/docs/best-practices"
  },
  {
    title: "Community Forum",
    description: "Join our community of businesses implementing AI solutions.",
    icon: Users,
    href: "/docs/community"
  }
];

export default function Documentation() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-purple-700">
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-4xl font-bold mb-6">
            Documentation & Resources
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Everything you need to know about implementing AI in your business.
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Link
                  key={resource.title}
                  href={resource.href}
                  className="bg-white rounded-lg shadow-sm p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="bg-purple-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-purple-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{resource.title}</h3>
                  <p className="text-gray-600">{resource.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Quick Links</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">For Beginners</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/docs/introduction" className="text-purple-700 hover:text-purple-800">
                      Introduction to AI Integration
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/prerequisites" className="text-purple-700 hover:text-purple-800">
                      Prerequisites & Requirements
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/first-steps" className="text-purple-700 hover:text-purple-800">
                      First Steps Guide
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">For Developers</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/docs/api" className="text-purple-700 hover:text-purple-800">
                      API Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/integration" className="text-purple-700 hover:text-purple-800">
                      Integration Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/examples" className="text-purple-700 hover:text-purple-800">
                      Code Examples
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Need Help?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you with any questions about our documentation or services.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="bg-purple-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-800 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/schedule-consultation"
              className="bg-white text-purple-700 px-8 py-3 rounded-full font-semibold border border-purple-700 hover:bg-purple-50 transition-colors"
            >
              Schedule a Call
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 