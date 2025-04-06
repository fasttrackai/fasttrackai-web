'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, Tag, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

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
}

// Mock blog post data with content
const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Future of AI in Business: 2024 Trends and Predictions',
    excerpt: 'Explore the emerging AI trends that will shape business operations in 2024 and beyond, from generative AI to autonomous systems.',
    content: `
# The Future of AI in Business: 2024 Trends and Predictions

Artificial Intelligence continues to transform the business landscape at an unprecedented pace. As we move through 2024, several key trends are emerging that will define how organizations leverage AI to gain competitive advantages.

## Generative AI Goes Mainstream

Generative AI technologies like GPT-4 and its successors have moved beyond novelty to become essential business tools. Companies are now integrating these technologies into their workflows for:

- Content creation and marketing
- Product design and prototyping
- Customer service automation
- Code generation and software development

The ability to generate human-quality text, images, and code is dramatically reducing the time and resources needed for creative and technical tasks.

## AI-Powered Decision Intelligence

Decision intelligence platforms that combine AI with data analytics are helping executives make better strategic choices. These systems:

1. Analyze vast amounts of structured and unstructured data
2. Identify patterns and correlations humans might miss
3. Generate scenario analyses with probability assessments
4. Provide explainable recommendations

Organizations implementing these systems report 35% faster decision-making processes and 28% better outcomes on average.

## Autonomous Systems Beyond Vehicles

While self-driving cars continue to develop, autonomous systems are expanding into many other domains:

- Warehouse and logistics robots
- Autonomous drones for delivery and inspection
- Self-optimizing manufacturing systems
- Automated financial trading platforms

These systems are increasingly capable of operating with minimal human supervision, dramatically improving efficiency and reducing costs.

## The Rise of AI Governance

As AI becomes more pervasive, organizations are establishing formal governance structures to ensure responsible use. This includes:

- Ethics committees to review AI applications
- Bias detection and mitigation protocols
- Transparency requirements for AI-based decisions
- Regular audits of AI systems

Companies that implement robust AI governance frameworks are better positioned to avoid reputational damage and regulatory penalties.

## Conclusion

The AI landscape in 2024 offers tremendous opportunities for businesses ready to embrace these technologies. Organizations that strategically implement AI solutions while maintaining appropriate governance will gain significant advantages in efficiency, innovation, and customer experience.
    `,
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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Simulate fetching the blog post
    setLoading(true);
    const foundPost = blogPosts.find(p => p.id === postId);
    
    setTimeout(() => {
      if (foundPost) {
        setPost(foundPost);
        setError(null);
      } else {
        setError('Blog post not found');
      }
      setLoading(false);
    }, 500);
  }, [postId]);

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
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.log('Error copying to clipboard', error));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-secondary py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen gradient-secondary py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto flex flex-col justify-center items-center min-h-[60vh]">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-xl text-gray-600 mb-6">{error || 'Blog post not found'}</p>
            <button
              onClick={() => router.push('/blog')}
              className="button-primary"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen gradient-secondary">
      {/* Hero Section with Image */}
      <div className="w-full h-[40vh] md:h-[50vh] relative">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-12">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="px-3 py-1 bg-purple-700 text-white rounded-full text-sm font-medium mb-4 inline-block">
                  {post.category}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {post.title}
                </h1>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Navigation and Meta */}
              <div className="flex justify-between items-center mb-8">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-purple-700 hover:text-purple-800 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 text-gray-600 hover:text-purple-700 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-1 transition-colors ${
                      isBookmarked ? 'text-purple-700' : 'text-gray-600 hover:text-purple-700'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-purple-700' : ''}`} />
                    <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Author and Date */}
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
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
                <div className="flex flex-col items-end text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(post.date)}
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-700 prose-strong:text-gray-900 prose-li:text-gray-700 mb-12">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </article>

              {/* Tags */}
              <div className="mb-12">
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium flex items-center"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related Posts */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogPosts
                    .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
                    .slice(0, 2)
                    .map((relatedPost) => (
                      <motion.div
                        key={relatedPost.id}
                        whileHover={{ y: -5 }}
                        className="card p-0 overflow-hidden"
                      >
                        <div className="relative h-40">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-lg mb-2 line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <button
                            onClick={() => router.push(`/blog/${relatedPost.id}`)}
                            className="text-purple-700 font-medium flex items-center hover:text-purple-800"
                          >
                            Read More
                            <ChevronRight className="h-5 w-5 ml-1" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
} 