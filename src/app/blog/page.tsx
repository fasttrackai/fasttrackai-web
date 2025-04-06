'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Filter, Tag, ChevronRight, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Future of AI in Business: 2024 Trends and Predictions',
    excerpt: 'Explore the emerging AI trends that will shape business operations in 2024 and beyond, from generative AI to autonomous systems.',
    author: {
      name: 'Dr. Sarah Chen',
      role: 'AI Research Director',
      avatar: '/avatars/sarah-chen.jpg'
    },
    date: '2024-04-01',
    readTime: '8 min read',
    category: 'Trends',
    image: '/blog/ai-trends-2024.jpg',
    tags: ['AI Trends', 'Future Tech', 'Business Strategy']
  },
  {
    id: 'post-2',
    title: 'Implementing AI in SMBs: A Practical Guide',
    excerpt: 'Learn how small and medium-sized businesses can effectively implement AI solutions without breaking the bank.',
    author: {
      name: 'Michael Rodriguez',
      role: 'Implementation Specialist',
      avatar: '/avatars/michael-rodriguez.jpg'
    },
    date: '2024-03-28',
    readTime: '12 min read',
    category: 'Implementation',
    image: '/blog/smb-ai-guide.jpg',
    tags: ['SMB', 'Implementation', 'Cost Optimization']
  },
  {
    id: 'post-3',
    title: 'AI Security Best Practices for Enterprise',
    excerpt: 'Discover essential security measures and best practices for implementing AI systems in enterprise environments.',
    author: {
      name: 'Lisa Thompson',
      role: 'Security Expert',
      avatar: '/avatars/lisa-thompson.jpg'
    },
    date: '2024-03-25',
    readTime: '10 min read',
    category: 'Security',
    image: '/blog/ai-security.jpg',
    tags: ['Security', 'Enterprise', 'Best Practices']
  },
  {
    id: 'post-4',
    title: 'ROI of AI: Measuring Success in Digital Transformation',
    excerpt: 'Learn how to measure and maximize the return on investment from your AI implementation initiatives.',
    author: {
      name: 'James Wilson',
      role: 'Business Analyst',
      avatar: '/avatars/james-wilson.jpg'
    },
    date: '2024-03-22',
    readTime: '15 min read',
    category: 'ROI',
    image: '/blog/ai-roi.jpg',
    tags: ['ROI', 'Analytics', 'Digital Transformation']
  }
];

const categories = Array.from(new Set(blogPosts.map(post => post.category)));
const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => post.tags.includes(tag));
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTags && matchesSearch;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <main className="min-h-screen gradient-primary">
      {/* Hero Section */}
      <motion.section 
        className="py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 text-center text-white">
          <motion.h1 
            className="heading-1 mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            AI Implementation Insights
          </motion.h1>
          <motion.p 
            className="body-large max-w-2xl mx-auto text-white"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            Expert perspectives on AI implementation, trends, and best practices
          </motion.p>
        </div>
      </motion.section>

      {/* Content Section */}
      <section className="py-16 gradient-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Filters */}
            <motion.div 
              className="mb-12"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <motion.button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? 'bg-purple-700 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    All Categories
                  </motion.button>
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                        selectedCategory === category
                          ? 'bg-purple-700 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <motion.button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-700 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Blog Posts Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <motion.article
                    key={post.id}
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    className="card p-0 overflow-hidden"
                  >
                    <div className="relative h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      <h2 className="heading-3 mb-2 line-clamp-2 text-gray-900">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                            <Image
                              src={post.author.avatar}
                              alt={post.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{post.author.name}</p>
                            <p className="text-sm text-gray-500">{post.author.role}</p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => router.push(`/blog/${post.id}`)}
                          className="text-purple-700 font-medium flex items-center hover:text-purple-800"
                          whileHover={{ x: 5 }}
                        >
                          Read More
                          <ChevronRight className="h-5 w-5 ml-1" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <motion.div 
                  className="col-span-2 text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-xl text-gray-200 mb-4">No articles match your search criteria</p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedTags([]);
                      setSearchQuery('');
                    }}
                    className="button-secondary"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div 
              className="mt-16 gradient-cta text-white rounded-xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-2 mb-4">Stay Informed</h2>
              <p className="body-large mb-6 max-w-2xl mx-auto opacity-90">
                Subscribe to our newsletter for the latest insights on AI implementation and industry trends.
              </p>
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-field"
                />
                <motion.button
                  onClick={() => alert('Subscription functionality coming soon!')}
                  className="button-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
} 