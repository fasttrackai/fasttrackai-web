'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, BookOpen, TrendingUp, Lightbulb, Filter } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'whitepaper' | 'report' | 'guide';
  industry?: string;
  downloadUrl: string;
  readTime: string;
}

const resources: Resource[] = [
  {
    id: 'wp-1',
    title: 'The Future of AI in Business Operations',
    description: 'A comprehensive look at how AI is transforming business operations across industries.',
    type: 'whitepaper',
    downloadUrl: '/whitepapers/ai-business-operations.pdf',
    readTime: '15 min read'
  },
  {
    id: 'rp-1',
    title: '2024 AI Implementation Trends',
    description: 'Analysis of current AI adoption trends and future predictions.',
    type: 'report',
    downloadUrl: '/reports/ai-trends-2024.pdf',
    readTime: '20 min read'
  },
  {
    id: 'gd-1',
    title: 'AI Readiness Checklist',
    description: 'Step-by-step guide to prepare your organization for AI implementation.',
    type: 'guide',
    downloadUrl: '/guides/ai-readiness-checklist.pdf',
    readTime: '10 min read'
  },
  {
    id: 'wp-2',
    title: 'AI-Driven Customer Experience',
    description: 'How AI is revolutionizing customer service and experience management.',
    type: 'whitepaper',
    industry: 'Retail',
    downloadUrl: '/whitepapers/ai-customer-experience.pdf',
    readTime: '18 min read'
  },
  {
    id: 'rp-2',
    title: 'Manufacturing AI Benchmark Report',
    description: 'Industry-specific insights on AI adoption in manufacturing.',
    type: 'report',
    industry: 'Manufacturing',
    downloadUrl: '/reports/manufacturing-ai-benchmark.pdf',
    readTime: '25 min read'
  },
  {
    id: 'gd-2',
    title: 'AI Implementation Playbook',
    description: 'Best practices and strategies for successful AI deployment.',
    type: 'guide',
    downloadUrl: '/guides/ai-implementation-playbook.pdf',
    readTime: '30 min read'
  }
];

export default function Resources() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  const filteredResources = resources.filter(resource => {
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whitepaper':
        return <FileText className="h-6 w-6" />;
      case 'report':
        return <TrendingUp className="h-6 w-6" />;
      case 'guide':
        return <BookOpen className="h-6 w-6" />;
      default:
        return <Lightbulb className="h-6 w-6" />;
    }
  };

  const handleDownload = (resource: Resource) => {
    setDownloadMessage(`${resource.title} download will be available soon!`);
    setTimeout(() => setDownloadMessage(null), 3000);
  };

  const handleSubscribe = () => {
    setDownloadMessage('Newsletter subscription coming soon!');
    setTimeout(() => setDownloadMessage(null), 3000);
  };

  return (
    <main className="min-h-screen py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Resource Center</h1>
            <p className="text-xl text-gray-600">
              Access our latest whitepapers, industry reports, and implementation guides
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedType === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType('whitepaper')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedType === 'whitepaper'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Whitepapers
              </button>
              <button
                onClick={() => setSelectedType('report')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedType === 'report'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setSelectedType('guide')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedType === 'guide'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Guides
              </button>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    {getTypeIcon(resource.type)}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
                    <p className="text-sm text-gray-500">{resource.readTime}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {resource.description}
                </p>

                {resource.industry && (
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-600 mb-4">
                    {resource.industry}
                  </span>
                )}

                <button
                  onClick={() => handleDownload(resource)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-purple-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-6">
              Subscribe to receive our latest resources and AI insights directly in your inbox.
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 p-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button
                onClick={handleSubscribe}
                className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification message */}
      {downloadMessage && (
        <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {downloadMessage}
        </div>
      )}
    </main>
  );
} 