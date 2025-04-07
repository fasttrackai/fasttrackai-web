'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, Tag, ChevronRight, Zap, BarChart, Shield, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Head from 'next/head';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
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
  featured?: boolean;
  relatedSolutions?: string[];
  seoKeywords?: string[];
}

// Mock blog post data with content
const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'AI Implementation Strategies That Drive Business Growth',
    excerpt: 'Discover how FastTrack AI helps businesses implement cutting-edge AI solutions that deliver measurable ROI and competitive advantages.',
    content: `
# AI Implementation Strategies That Drive Business Growth

In today's competitive business landscape, artificial intelligence has moved from a futuristic concept to an essential driver of growth and innovation. Organizations that effectively implement AI are seeing significant advantages in efficiency, customer experiences, and revenue generation.

## Strategic Approaches to AI Implementation

FastTrack AI has developed a comprehensive framework for implementing AI solutions that consistently deliver measurable business results:

### 1. Business-First Approach

The most successful AI implementations begin with clear business objectives rather than technology:

- **Revenue growth opportunities**: Identifying where AI can help increase sales, improve customer retention, or enable new business models
- **Efficiency optimization**: Targeting processes with high manual effort and potential for automation
- **Experience enhancement**: Focusing on customer and employee experiences that can be transformed through AI

### 2. Phased Implementation Strategy

Rather than attempting organization-wide transformation, our data shows that companies achieve better results with a phased approach:

1. **Discovery and assessment**: Comprehensive evaluation of business processes, data readiness, and opportunity sizing
2. **Pilot implementation**: Small-scale deployment with strict success metrics
3. **Operational integration**: Connecting AI systems with existing workflows and training staff
4. **Scaled deployment**: Expanding successful implementations across the organization
5. **Continuous optimization**: Ongoing refinement based on performance data

### 3. Data Strategy Alignment

AI solutions are only as good as the data that powers them. FastTrack AI helps organizations:

- Develop data governance frameworks that ensure quality and compliance
- Implement data integration solutions that connect siloed information sources
- Create data enrichment pipelines that improve AI system performance

## Case Study: Retail Chain Transformation

A mid-sized retail chain with 150+ locations implemented FastTrack AI's customer analytics solution and achieved:

- 18% increase in average transaction value through personalized recommendations
- 32% reduction in inventory carrying costs through AI-powered demand forecasting
- $3.2M annual savings from optimized staffing based on foot traffic predictions

Their phased implementation took just 14 weeks from assessment to full deployment, with positive ROI achieved in the first 60 days.

## Key Success Factors

Our experience across hundreds of implementations has identified these critical success factors:

1. **Executive sponsorship**: Active support from leadership throughout the implementation
2. **Cross-functional teams**: Collaboration between business, IT, and data science roles
3. **Clear success metrics**: Well-defined KPIs established before implementation begins
4. **Change management focus**: Comprehensive training and communication strategies
5. **Technical flexibility**: Solutions designed to integrate with existing systems

## Conclusion

Implementing AI is no longer optional for organizations seeking competitive advantages. With FastTrack AI's strategic implementation approach, businesses of all sizes can achieve measurable growth, improved efficiency, and enhanced customer experiences through AI—without the extended timelines and high failure rates common in traditional digital transformation initiatives.

[Contact our team](/schedule-consultation) to learn how FastTrack AI can help your organization implement AI solutions that drive measurable business growth.
    `,
    author: {
      name: 'Dr. Sarah Chen',
      role: 'AI Research Director',
      avatar: '/avatars/sarah-chen.jpg'
    },
    date: '2024-04-01',
    readTime: '8 min read',
    category: 'Strategy',
    image: '/blog/ai-trends-2024.jpg',
    tags: ['AI Strategy', 'Implementation', 'Business Growth', 'ROI'],
    featured: true,
    relatedSolutions: ['AI Integration', 'Process Automation', 'Business Analytics'],
    seoKeywords: ['AI implementation strategy', 'business growth with AI', 'FastTrack AI solutions', 'AI ROI']
  },
  {
    id: 'post-2',
    title: 'Implementing AI in SMBs: A Practical Guide',
    excerpt: 'Learn how small and medium-sized businesses can effectively implement AI solutions without breaking the bank.',
    content: `
# Implementing AI in SMBs: A Practical Guide

Small and medium-sized businesses (SMBs) often believe that artificial intelligence is only accessible to large enterprises with massive budgets. However, the democratization of AI technologies has made them increasingly accessible to organizations of all sizes.

## Start with Clear Business Objectives

Before implementing any AI solution, define specific business problems you want to solve:

- Are you looking to automate repetitive tasks?
- Do you need better customer insights?
- Are you trying to optimize your supply chain?
- Do you want to improve customer service?

Having clear objectives will help you select the right AI solutions and measure their impact.

## Leverage Pre-built AI Solutions

Many affordable, pre-built AI solutions exist that require minimal technical expertise:

- **Customer service chatbots** from providers like Intercom or Drift
- **Marketing automation tools** with AI capabilities like HubSpot or Mailchimp
- **Business intelligence platforms** like Tableau or Power BI with built-in AI features
- **Cloud-based AI services** from AWS, Google Cloud, or Microsoft Azure

These solutions offer subscription-based pricing models that make them accessible to SMBs.

## Start Small and Scale Gradually

Instead of attempting a company-wide AI transformation:

1. Begin with a pilot project in one department
2. Measure results carefully
3. Refine your approach based on feedback
4. Expand to other areas once you've proven value

This approach minimizes risk and allows your team to develop AI implementation expertise.

## Invest in Data Quality

Even the most sophisticated AI systems will fail without good data. Prioritize:

- Cleaning and organizing your existing data
- Implementing consistent data collection processes
- Training staff on data entry best practices
- Establishing data governance policies

Remember that AI is only as good as the data it learns from.

## Build the Right Skills

While you don't need a team of data scientists, you should develop some internal AI capabilities:

- Train existing staff on AI concepts and applications
- Consider hiring a data analyst or partnering with consultants
- Encourage continuous learning about AI technologies
- Join SMB networks focused on digital transformation

## Conclusion

Implementing AI in SMBs doesn't require massive investments or specialized teams. By starting with clear objectives, leveraging pre-built solutions, and focusing on data quality, small and medium businesses can harness the power of AI to improve efficiency, enhance customer experiences, and gain competitive advantages.
    `,
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
    content: `
# AI Security Best Practices for Enterprise

As artificial intelligence becomes increasingly integrated into enterprise operations, securing AI systems has become a critical priority. AI security presents unique challenges beyond traditional cybersecurity concerns.

## Understanding AI Security Risks

Enterprise AI systems face several distinct security threats:

- **Data poisoning attacks** that corrupt training data
- **Model inversion attacks** that extract sensitive training data
- **Adversarial examples** that trick AI into misclassifications
- **Model theft** through API probing or side-channel attacks
- **Supply chain vulnerabilities** in AI components

## Essential Security Measures

### Secure the Training Pipeline

- Implement strict access controls for training data
- Validate and sanitize all training inputs
- Maintain detailed provenance records for all data
- Use differential privacy techniques to protect sensitive information
- Regularly audit training data for potential poisoning

### Protect Deployed Models

- Implement robust authentication for model access
- Monitor model inputs and outputs for anomalies
- Deploy models in isolated environments when possible
- Use rate limiting to prevent probing attacks
- Implement input validation to detect adversarial examples

### Ensure Model Transparency

- Document model development and training processes
- Maintain version control for models and data
- Implement explainability tools for high-risk applications
- Conduct regular bias audits
- Create mechanisms for human oversight of critical decisions

## Governance Framework

Establish a comprehensive AI governance framework that includes:

1. Clear roles and responsibilities for AI security
2. Regular security assessments of AI systems
3. Incident response plans for AI-specific threats
4. Compliance monitoring for relevant regulations
5. Ongoing security training for AI development teams

## Conclusion

Securing enterprise AI systems requires a multifaceted approach that addresses the unique vulnerabilities of machine learning models. By implementing robust security measures throughout the AI lifecycle and establishing clear governance frameworks, organizations can safely harness the power of artificial intelligence while protecting sensitive data and maintaining stakeholder trust.
    `,
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
    content: `
# ROI of AI: Measuring Success in Digital Transformation

Artificial intelligence represents a significant investment for organizations undertaking digital transformation. Measuring the return on this investment requires a structured approach that goes beyond traditional ROI calculations.

## Beyond Traditional ROI Metrics

While conventional ROI metrics remain important, AI initiatives require additional considerations:

- **Time horizons**: AI benefits often compound over time as models improve
- **Indirect benefits**: AI can create value that's difficult to quantify directly
- **Risk reduction**: AI may prevent costly problems rather than generate revenue
- **Competitive positioning**: AI capabilities may provide strategic advantages

## Key Performance Indicators for AI Initiatives

### Efficiency Metrics

- **Process automation rate**: Percentage of tasks automated
- **Time savings**: Hours saved through AI-assisted workflows
- **Resource utilization**: Improved allocation of human and physical resources
- **Error reduction**: Decrease in mistakes and rework

### Revenue Metrics

- **Conversion rate improvements**: Increased sales from AI-powered recommendations
- **Customer lifetime value**: Enhanced through personalization
- **New product development**: Revenue from AI-enabled offerings
- **Market expansion**: Access to new segments through AI capabilities

### Strategic Value Metrics

- **Decision quality**: Improved outcomes from AI-augmented decisions
- **Innovation rate**: New ideas generated or implemented
- **Knowledge capture**: Institutional knowledge preserved and accessible
- **Organizational agility**: Faster response to market changes

## Measuring AI ROI: A Framework

1. **Establish baselines**: Document pre-AI performance metrics
2. **Define success criteria**: Set clear, measurable objectives
3. **Implement measurement systems**: Deploy tools to track relevant metrics
4. **Calculate direct returns**: Quantify cost savings and revenue increases
5. **Assess indirect benefits**: Evaluate strategic and competitive advantages
6. **Adjust for AI-specific factors**: Consider learning curves and model improvement

## Common Pitfalls in AI ROI Measurement

- **Unrealistic expectations**: Expecting immediate returns from complex AI initiatives
- **Narrow focus**: Measuring only direct cost savings while ignoring strategic benefits
- **Attribution errors**: Failing to isolate AI's impact from other factors
- **Neglecting maintenance costs**: Underestimating ongoing expenses for model updates

## Conclusion

Measuring the ROI of AI requires a comprehensive approach that considers both quantitative metrics and qualitative benefits. By establishing clear baselines, tracking appropriate KPIs, and taking a long-term view, organizations can accurately assess the value of their AI investments and optimize their digital transformation strategies.
    `,
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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const post = blogPosts.find(post => post.id === params.id);
    
    if (post) {
      setCurrentPost(post);
      
      // Find related posts based on tags
      const related = blogPosts
        .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
        .slice(0, 3);
      
      setRelatedPosts(related);
    } else {
      router.push('/blog');
    }
  }, [params.id, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentPost?.title,
        text: currentPost?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getSolutionIcon = (solution: string) => {
    switch (solution) {
      case 'AI Integration':
      case 'Rapid Implementation':
        return <Zap className="h-4 w-4 text-purple-500" />;
      case 'Business Analytics':
      case 'ROI Calculator':
      case 'Performance Metrics':
        return <BarChart className="h-4 w-4 text-purple-500" />;
      case 'AI Security Framework':
      case 'Risk Assessment':
        return <Shield className="h-4 w-4 text-purple-500" />;
      case 'Customer Service AI':
      case 'NLP Solutions':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <ChevronRight className="h-4 w-4 text-purple-500" />;
    }
  };

  if (!currentPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{currentPost.title} | FastTrack AI Blog</title>
        <meta name="description" content={currentPost.excerpt} />
        <meta name="keywords" content={currentPost.seoKeywords?.join(', ') || currentPost.tags.join(', ')} />
        <meta property="og:title" content={`${currentPost.title} | FastTrack AI Blog`} />
        <meta property="og:description" content={currentPost.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://fasttrackai.io/blog/${currentPost.id}`} />
        <meta property="og:image" content={`https://fasttrackai.io${currentPost.image}`} />
        <meta property="article:published_time" content={currentPost.date} />
        <meta property="article:author" content={currentPost.author.name} />
        {currentPost.tags.map((tag, i) => (
          <meta key={i} property="article:tag" content={tag} />
        ))}
      </Head>
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-purple-900 to-purple-800 relative">
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
          <div className="container mx-auto px-6 py-16 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center text-white"
            >
              <Link 
                href="/blog"
                className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to all articles
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {currentPost.title}
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                {currentPost.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                    <Image
                      src={currentPost.author.avatar}
                      alt={currentPost.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{currentPost.author.name}</p>
                    <p className="text-sm text-white/80">{currentPost.author.role}</p>
                  </div>
                </div>
                <div className="w-px h-10 bg-white/20 hidden sm:block"></div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-white/70" />
                  <span className="text-sm text-white/80">{formatDate(currentPost.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-white/70" />
                  <span className="text-sm text-white/80">{currentPost.readTime}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {currentPost.tags.map((tag, index) => (
                  <Link 
                    key={index} 
                    href={`/blog?tag=${tag}`}
                    className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    <span className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-96 w-full bg-gray-100">
          <Image
            src={currentPost.image}
            alt={currentPost.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between mb-8">
              <div className="flex gap-2">
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Share article"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`p-2 rounded-full transition-colors ${
                    bookmarked ? 'text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
                >
                  <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>

              <Link 
                href="/schedule-consultation"
                className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Schedule a Consultation
              </Link>
            </div>

            {/* Related Solutions */}
            {currentPost.relatedSolutions && currentPost.relatedSolutions.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg mb-8 border border-purple-100">
                <h3 className="text-sm font-semibold text-purple-800 mb-2">Related FastTrack AI Solutions:</h3>
                <div className="flex flex-wrap gap-3">
                  {currentPost.relatedSolutions.map((solution, index) => (
                    <Link 
                      key={index} 
                      href={`/solutions/${solution.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center text-sm font-medium text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors"
                    >
                      {getSolutionIcon(solution)}
                      <span className="ml-1">{solution}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Article Content */}
            <motion.article 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-hr:border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ReactMarkdown>{currentPost.content}</ReactMarkdown>
            </motion.article>

            {/* Author Bio */}
            <div className="mt-16 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={currentPost.author.avatar}
                    alt={currentPost.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{currentPost.author.name}</h3>
                  <p className="text-gray-500 mb-3">{currentPost.author.role}</p>
                  <p className="text-gray-700">
                    FastTrack AI expert specializing in helping businesses implement effective AI solutions that drive measurable results and competitive advantages.
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-10 border-t border-b border-gray-200 py-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-gray-700 font-medium">Tags:</span>
                {currentPost.tags.map((tag, index) => (
                  <Link 
                    key={index} 
                    href={`/blog?tag=${tag}`}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 bg-purple-900 text-white p-8 rounded-xl">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                <div className="lg:col-span-3">
                  <h3 className="text-2xl font-bold mb-2">Ready to Implement AI in Your Business?</h3>
                  <p className="text-white/80">Our AI implementation specialists can help you develop a tailored strategy for your organization.</p>
                </div>
                <div className="lg:col-span-2">
                  <Link 
                    href="/schedule-consultation"
                    className="block w-full bg-white text-purple-900 text-center font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Schedule Your Free Consultation
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {relatedPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      variants={fadeInUp}
                      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-transform hover:shadow-md hover:-translate-y-1"
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={post.image || '/blog/placeholder.jpg'}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide mb-2">
                          {post.category}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <Link 
                          href={`/blog/${post.id}`}
                          className="inline-flex items-center text-sm font-medium text-purple-700 hover:text-purple-900"
                        >
                          Read article
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Newsletter */}
            <div className="mt-16 border-t border-gray-200 pt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Get the latest insights on AI implementation, case studies, and industry best practices delivered to your inbox.
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button className="bg-purple-700 hover:bg-purple-600 text-white font-medium px-6 py-3 rounded-lg whitespace-nowrap transition-colors">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  By subscribing, you agree to our Privacy Policy. You can unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 