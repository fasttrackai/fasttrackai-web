import { db, storage, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  arrayUnion,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

// Check if Firebase is initialized correctly
const isFirebaseInitialized = () => {
  if (!isFirebaseConfigured()) {
    return false;
  }

  try {
    return !!db && !!storage;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
};

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  content: string;
  locked?: boolean;
  order: number;
  pathId: string;
  thumbnail: string;
  quiz?: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
  resources?: {
    title: string;
    url: string;
    type: string;
  }[];
}

export interface TrainingPath {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  modules: string[];
  prerequisites?: string[];
  level: string;
  category: string;
  duration: string;
}

export interface ModuleProgress {
  completed: boolean;
  quizScore: number;
  dateCompleted: string | null;
}

export interface UserProgress {
  completedModules: Record<string, ModuleProgress>;
  inProgressModules: string[];
  savedModules: string[];
}

// Mock data for development
const mockTrainingPaths: TrainingPath[] = [
  {
    id: 'strategic-ai-implementation',
    title: 'Strategic AI Implementation',
    description: 'Master the end-to-end process of implementing AI in your organization, from business case development to deployment and ROI measurement.',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    modules: ['ai-business-case', 'ai-strategy-roadmap', 'change-management', 'implementation-governance', 'measuring-ai-success'],
    level: 'intermediate',
    category: 'Strategy',
    duration: '8 hours'
  },
  {
    id: 'enterprise-ai-integration',
    title: 'Enterprise AI Integration',
    description: 'Learn how to integrate AI systems with your existing enterprise architecture, focusing on technical implementation, data pipelines, and system optimization.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop',
    modules: ['enterprise-ai-architecture', 'data-pipelines', 'model-deployment', 'system-integration', 'performance-optimization'],
    level: 'advanced',
    category: 'Technical',
    duration: '10 hours'
  },
  {
    id: 'ai-business-transformation',
    title: 'AI-Driven Business Transformation',
    description: 'Discover how to leverage AI to transform your business model, operations, customer experience, and create new revenue streams.',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop',
    modules: ['business-model-innovation', 'operational-excellence', 'customer-experience', 'new-revenue-streams', 'transformation-leadership'],
    level: 'intermediate',
    category: 'Business',
    duration: '8 hours'
  }
];

const mockTrainingModules: Record<string, TrainingModule> = {
  // ===== STRATEGIC AI IMPLEMENTATION MODULES =====
  'ai-business-case': {
    id: 'ai-business-case',
    pathId: 'strategic-ai-implementation',
    title: 'Building the AI Business Case',
    description: 'Learn how to develop a compelling business case for AI implementation in your organization.',
    duration: '1.5 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
    content: `# Building a Compelling AI Business Case

## Understanding the Business Value of AI
- Identifying high-value business problems
- Quantifying potential benefits and ROI
- Evaluating competitive advantages

## Components of an Effective AI Business Case
1. Problem statement and opportunity assessment
2. Technical feasibility analysis
3. Resource requirements and timeline
4. Cost-benefit analysis
5. Risk assessment and mitigation strategies

## Stakeholder Alignment
- Mapping key stakeholders and their interests
- Addressing stakeholder concerns
- Building executive sponsorship

## Case Studies: Successful AI Business Cases
- Examples from different industries
- Lessons learned and best practices`,
    order: 1,
    quiz: {
      questions: [
        {
          question: 'What is the most important factor when quantifying potential AI benefits?',
          options: [
            'Using the latest AI technologies',
            'Linking outcomes to specific business metrics',
            'Focusing on short-term gains',
            'Comparing with competitors'
          ],
          correctAnswer: 1
        },
        {
          question: 'Which of the following is NOT typically part of an AI business case?',
          options: [
            'Risk assessment',
            'Resource requirements',
            'Detailed code implementation plan',
            'Cost-benefit analysis'
          ],
          correctAnswer: 2
        }
      ]
    },
    resources: [
      {
        title: 'Business Case Template',
        url: 'https://fasttrackai.com/resources/ai-business-case-template.pdf',
        type: 'PDF'
      },
      {
        title: 'ROI Calculator',
        url: 'https://fasttrackai.com/tools/roi-calculator',
        type: 'Tool'
      }
    ]
  },
  'ai-strategy-roadmap': {
    id: 'ai-strategy-roadmap',
    pathId: 'strategic-ai-implementation',
    title: 'Developing Your AI Strategy Roadmap',
    description: 'Create a comprehensive AI strategy and implementation roadmap for your organization.',
    duration: '2 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
    content: `# Developing a Comprehensive AI Strategy Roadmap

## Elements of an AI Strategy
- Vision and strategic objectives
- Core capabilities and focus areas
- Organizational readiness assessment
- Data strategy alignment

## Building Your Implementation Roadmap
1. Prioritizing use cases based on value and feasibility
2. Defining phases and milestones
3. Resource allocation and capability building
4. Technical infrastructure requirements

## Governance and Operating Model
- AI governance framework
- Roles and responsibilities
- Ethical considerations and responsible AI

## Change Management Planning
- Communications strategy
- Training and upskilling approach
- Cultural transformation considerations`,
    order: 2,
    quiz: {
      questions: [
        {
          question: 'What is the most effective approach to prioritizing AI use cases?',
          options: [
            'Implementing the most technically advanced solutions first',
            'Following what competitors are doing',
            'Balancing business value and implementation feasibility',
            'Focusing exclusively on cost reduction opportunities'
          ],
          correctAnswer: 2
        },
        {
          question: 'Which element should be included in an AI governance framework?',
          options: [
            'Detailed coding standards',
            'Ethics guidelines and responsible AI principles',
            'Complete technical specifications',
            'Vendor selection criteria'
          ],
          correctAnswer: 1
        }
      ]
    }
  },
  'change-management': {
    id: 'change-management',
    pathId: 'strategic-ai-implementation',
    title: 'Change Management for AI Adoption',
    description: 'Strategies to manage organizational change and drive AI adoption.',
    duration: '1.5 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    content: `# Change Management for AI Adoption

## Understanding AI-Specific Change Challenges
- Fear and misconceptions about AI
- Skills gaps and workforce concerns
- Process disruption and workflow changes

## Effective Change Management Frameworks
1. Stakeholder analysis and engagement
2. Communication strategy development
3. Training and enablement planning
4. Resistance management
5. Reinforcement and sustainability

## Building an AI-Ready Culture
- Fostering a data-driven mindset
- Promoting experimentation and learning
- Encouraging cross-functional collaboration

## Measuring Change Readiness and Adoption
- Key metrics and indicators
- Feedback mechanisms
- Continuous improvement approaches`,
    order: 3,
    locked: false,
    quiz: {
      questions: [
        {
          question: 'What is typically the greatest barrier to AI adoption in organizations?',
          options: [
            'Technical infrastructure limitations',
            'Budget constraints',
            'Human and cultural factors',
            'Regulatory compliance'
          ],
          correctAnswer: 2
        }
      ]
    }
  },
  'implementation-governance': {
    id: 'implementation-governance',
    pathId: 'strategic-ai-implementation',
    title: 'Implementation and Governance',
    description: 'Best practices for managing AI implementation and establishing effective governance.',
    duration: '1.5 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507208773393-40d9fc670acf?q=80&w=1974&auto=format&fit=crop',
    content: `# AI Implementation and Governance

## Implementation Best Practices
- Project management approaches for AI initiatives
- Resource allocation and team structures
- Managing technical and business workstreams
- Common implementation challenges and solutions

## AI Governance Framework
1. Data governance and management
2. Model development and validation
3. Deployment and operation standards
4. Monitoring and maintenance
5. Responsible AI practices

## Regulatory and Compliance Considerations
- Industry-specific regulations
- Privacy and data protection
- Ethical guidelines and standards
- Documentation and auditability

## Case Studies: Governance in Action
- Examples of effective governance frameworks
- Lessons learned from implementation challenges`,
    order: 4,
    locked: false,
    quiz: {
      questions: [
        {
          question: 'What is a key benefit of establishing an AI governance framework?',
          options: [
            'Eliminating the need for data security',
            'Reducing the cost of AI implementation',
            'Ensuring consistent, ethical, and reliable AI systems',
            'Removing human oversight from AI processes'
          ],
          correctAnswer: 2
        }
      ]
    }
  },
  'measuring-ai-success': {
    id: 'measuring-ai-success',
    pathId: 'strategic-ai-implementation',
    title: 'Measuring AI Success and ROI',
    description: 'Learn how to define, measure, and communicate the impact and ROI of your AI initiatives.',
    duration: '1.5 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    content: `# Measuring AI Success and ROI

## Defining Success Metrics
- Business impact metrics
- Technical performance metrics
- User adoption metrics
- ROI calculation methodologies

## Measurement Frameworks
1. Establishing baselines
2. Designing effective experiments
3. A/B testing approaches
4. Continuous monitoring systems

## Communicating AI Value
- Executive dashboards and reporting
- Translating technical metrics to business outcomes
- Storytelling with AI results
- Addressing skepticism with data

## Iterative Improvement
- Using metrics to drive refinement
- Scaling successful implementations
- Applying learnings to future initiatives`,
    order: 5,
    locked: false,
    quiz: {
      questions: [
        {
          question: 'When calculating AI ROI, which of the following should be included?',
          options: [
            'Only direct cost savings',
            'Only revenue increases',
            'Both tangible and intangible benefits',
            'Only technical performance improvements'
          ],
          correctAnswer: 2
        }
      ]
    }
  },

  // ===== ENTERPRISE AI INTEGRATION MODULES =====
  'enterprise-ai-architecture': {
    id: 'enterprise-ai-architecture',
    pathId: 'enterprise-ai-integration',
    title: 'Enterprise AI Architecture',
    description: 'Design scalable, robust AI architecture that integrates with enterprise systems.',
    duration: '2 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?q=80&w=2070&auto=format&fit=crop',
    content: `# Enterprise AI Architecture

## Key Components of Enterprise AI Architecture
- Data infrastructure and management
- Model development and training environments
- Deployment and serving infrastructure
- Monitoring and observability systems
- Security and governance layers

## Architecture Patterns and Best Practices
1. Microservices vs. monolithic approaches
2. Cloud vs. on-premises considerations
3. Hybrid and multi-cloud strategies
4. Edge computing for AI

## Integration with Enterprise Systems
- ERP and CRM integration patterns
- Legacy system integration approaches
- API and service design
- Event-driven architectures

## Scalability and Performance Considerations
- Handling growing data volumes
- Managing increasing model complexity
- Scaling inference capacity
- High availability design`,
    order: 1,
    quiz: {
      questions: [
        {
          question: 'Which approach is generally most effective for enterprise AI architecture?',
          options: [
            'Building a completely separate AI infrastructure',
            'Using only cloud-based solutions regardless of existing systems',
            'Designing an architecture that integrates with existing enterprise systems',
            'Implementing only on-premises solutions for data security'
          ],
          correctAnswer: 2
        }
      ]
    }
  },
  'data-pipelines': {
    id: 'data-pipelines',
    pathId: 'enterprise-ai-integration',
    title: 'Building Robust Data Pipelines',
    description: 'Design and implement efficient data pipelines for AI systems.',
    duration: '2 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop',
    content: `# Building Robust Data Pipelines for AI

## Data Pipeline Fundamentals
- End-to-end data flow architecture
- Batch vs. streaming processing
- ETL vs. ELT approaches
- Data quality and validation

## Building Production-Grade Pipelines
1. Pipeline orchestration tools and frameworks
2. Handling data dependencies
3. Monitoring and alerting
4. Fault tolerance and recovery
5. Testing strategies

## Performance Optimization
- Parallel processing techniques
- Caching strategies
- Resource optimization
- Handling large-scale data efficiently

## Data Governance Integration
- Data lineage tracking
- Privacy and security controls
- Compliance requirements
- Documentation and metadata management`,
    order: 2,
    quiz: {
      questions: [
        {
          question: 'Which is a key consideration when designing data pipelines for AI systems?',
          options: [
            'Using only the newest technologies available',
            'Minimizing data transformation steps',
            'Ensuring reproducibility and data quality',
            'Storing all data in a single database for simplicity'
          ],
          correctAnswer: 2
        }
      ]
    }
  },
  'model-deployment': {
    id: 'model-deployment',
    pathId: 'enterprise-ai-integration',
    title: 'Model Deployment and Operations',
    description: 'Learn best practices for deploying and operating AI models in production.',
    duration: '2 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    content: `# Model Deployment and Operations (MLOps)

## Model Deployment Strategies
- Containerization and orchestration
- Model serving architectures
- Deployment patterns (canary, blue/green, shadow)
- API design and management

## MLOps Practices
1. CI/CD for ML models
2. Model versioning and registry
3. Feature store implementation
4. Experiment tracking
5. Automated testing for ML

## Monitoring and Observability
- Model performance metrics
- Data drift detection
- Concept drift monitoring
- Alerting and incident response

## Governance and Compliance
- Model documentation requirements
- Auditability and explainability
- Regulatory compliance
- Access control and security`,
    order: 3,
    locked: false,
    quiz: {
      questions: [
        {
          question: 'What is a key benefit of implementing CI/CD for machine learning models?',
          options: [
            'Eliminating the need for data scientists',
            'Making models more accurate',
            'Enabling faster, more reliable model updates',
            'Reducing the need for model monitoring'
          ],
          correctAnswer: 2
        }
      ]
    }
  },
  'system-integration': {
    id: 'system-integration',
    pathId: 'enterprise-ai-integration',
    title: 'System Integration Strategies',
    description: 'Techniques for integrating AI capabilities with existing enterprise systems.',
    duration: '2 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
    content: `# System Integration Strategies for AI

## Integration Patterns and Approaches
- API-based integration
- Event-driven integration
- Database-level integration
- UI/UX integration methods

## Integration with Common Enterprise Systems
1. ERP systems
2. CRM platforms
3. Content management systems
4. Business intelligence tools
5. Legacy system integration

## Technical Considerations
- Authentication and authorization
- Error handling and resilience
- Performance optimization
- Scalability planning
- Backward compatibility

## Implementation Methodology
- Requirements gathering
- Integration planning
- Testing strategies
- Phased rollout approaches
- Post-integration maintenance`,
    order: 4,
    locked: false,
    quiz: {
      questions: [
        {
          question: 'Which approach is most effective when integrating AI with legacy systems?',
          options: [
            'Complete replacement of legacy systems',
            'Building middleware or API layers between AI and legacy systems',
            'Running systems in parallel without integration',
            'Limiting AI capabilities to match legacy system limitations'
          ],
          correctAnswer: 1
        }
      ]
    }
  },
  'performance-optimization': {
    id: 'performance-optimization',
    pathId: 'enterprise-ai-integration',
    title: 'Performance Optimization',
    description: 'Techniques to optimize AI system performance, efficiency, and cost.',
    duration: '2 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    content: `# AI System Performance Optimization

## Performance Bottleneck Identification
- Profiling techniques
- Metrics collection and analysis
- End-to-end performance testing
- User experience impact assessment

## Model Optimization Techniques
1. Model compression and quantization
2. Pruning and knowledge distillation
3. Hardware acceleration
4. Batch processing optimization
5. Caching strategies

## Infrastructure Optimization
- Right-sizing compute resources
- Auto-scaling implementations
- Memory and storage optimization
- Network latency reduction

## Cost Optimization
- Cost monitoring and attribution
- Resource scheduling strategies
- Serverless and spot instance usage
- Performance/cost tradeoff analysis`,
    order: 5,
    locked: false,
    quiz: {
      questions: [
        {
          question: 'What is usually the first step in optimizing AI system performance?',
          options: [
            'Purchasing faster hardware',
            'Rewriting the entire system',
            'Identifying and measuring performance bottlenecks',
            'Implementing caching throughout the system'
          ],
          correctAnswer: 2
        }
      ]
    }
  },

  // ===== AI BUSINESS TRANSFORMATION MODULES =====
  'business-model-innovation': {
    id: 'business-model-innovation',
    pathId: 'ai-business-transformation',
    title: 'AI-Driven Business Model Innovation',
    description: 'Learn how AI can transform your business model and create new value propositions.',
    duration: '1.5 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop',
    content: `# AI-Driven Business Model Innovation

## Understanding Business Model Transformation
- Components of a business model
- How AI disrupts traditional business models
- Value creation, delivery, and capture with AI
- Platform and ecosystem opportunities

## AI-Enabled Business Models
1. Subscription and as-a-service models
2. Predictive and preventative service models
3. Personalization at scale models
4. Data monetization approaches
5. AI-powered platforms and marketplaces

## Transformation Process
- Business model canvas for AI innovation
- Value proposition design
- Customer segment impact analysis
- Partner and ecosystem considerations

## Case Studies
- Industry-specific transformation examples
- Success patterns and lessons learned
- Implementation challenges and solutions`,
    order: 1,
    quiz: {
      questions: [
        {
          question: 'How does AI most fundamentally transform business models?',
          options: [
            'By reducing operational costs',
            'By enabling new ways to create and deliver value',
            'By automating existing processes',
            'By replacing human workers'
          ],
          correctAnswer: 1
        }
      ]
    }
  },
  'operational-excellence': {
    id: 'operational-excellence',
    pathId: 'ai-business-transformation',
    title: 'Operational Excellence Through AI',
    description: 'Transform operations with AI-driven automation, optimization, and decision support.',
    duration: '1.5 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
    content: `# Operational Excellence Through AI

## Operational Transformation Opportunities
- Process automation and enhancement
- Predictive maintenance and operations
- Supply chain optimization
- Resource allocation and scheduling
- Quality control and management

## Implementation Methodology
1. Operational assessment and opportunity identification
2. Process redesign principles
3. Human-in-the-loop vs. full automation considerations
4. Change management for operational transformation

## Decision Intelligence Systems
- AI-augmented decision making
- Real-time analytics dashboards
- Scenario planning and simulation
- Automated and guided decision systems

## Measuring Operational Impact
- Key performance indicators
- Productivity and efficiency metrics
- Quality and compliance metrics
- ROI calculation approaches`,
    order: 2,
    quiz: {
      questions: [
        {
          question: 'What is typically the most significant challenge in AI-driven operational transformation?',
          options: [
            'Technical implementation',
            'Budget constraints',
            'Process redesign and change management',
            'Hardware limitations'
          ],
          correctAnswer: 2
        }
      ]
    }
  },
  'customer-experience': {
    id: 'customer-experience',
    pathId: 'ai-business-transformation',
    title: 'Transforming Customer Experience',
    description: 'Leverage AI to create exceptional, personalized customer experiences.',
    duration: '1.5 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=2047&auto=format&fit=crop',
    content: `# Transforming Customer Experience with AI

## AI-Powered Customer Experience
- Personalization at scale
- Conversational AI and virtual assistants
- Predictive customer needs and behavior
- Omnichannel experience orchestration
- Customer journey optimization

## Implementation Strategies
1. Customer journey mapping and AI opportunity identification
2. Data unification for 360° customer view
3. Experience design principles for AI
4. Testing and optimization methodologies

## Ethics and Trust Considerations
- Transparency in AI-driven experiences
- Privacy and data usage best practices
- Avoiding bias in customer interactions
- Building trust with explainable AI

## Measuring CX Success
- Customer satisfaction metrics
- Engagement and adoption indicators
- Loyalty and retention impact
- Revenue and growth attribution`,
    order: 3,
    locked: false,
    quiz: {
      questions: [
        {
          question: 'What is the key to effective AI-powered personalization?',
          options: [
            'Collecting as much customer data as possible',
            'Using the most advanced AI algorithms',
            'Balancing personalization with privacy and relevance',
            'Completely automating all customer interactions'
          ],
          correctAnswer: 2
        }
      ]
    }
  },
  'new-revenue-streams': {
    id: 'new-revenue-streams',
    pathId: 'ai-business-transformation',
    title: 'Creating New AI-Enabled Revenue Streams',
    description: 'Discover how to leverage AI capabilities to create new products, services, and revenue streams.',
    duration: '1.5 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop',
    content: `# Creating New AI-Enabled Revenue Streams

## AI-Driven Product and Service Innovation
- Data products and insights-as-a-service
- AI-enhanced existing products
- Smart services and solutions
- Algorithm licensing and API economy
- AI-powered subscription models

## Revenue Stream Development Process
1. Opportunity identification framework
2. Customer willingness-to-pay assessment
3. Pricing strategy development
4. MVP design and testing
5. Scaling new offerings

## Go-to-Market Strategy
- Product positioning and messaging
- Sales enablement and education
- Partnership and channel strategies
- Market adoption acceleration techniques

## Financial Modeling and Metrics
- Revenue forecasting approaches
- Investment requirements
- Profitability analysis
- Growth and scaling metrics`,
    order: 4,
    locked: false,
    quiz: {
      questions: [
        {
          question: 'What is often the most valuable AI-enabled revenue stream for established companies?',
          options: [
            'Selling raw data to competitors',
            'Creating standalone AI products',
            'Enhancing existing products and services with AI capabilities',
            'Licensing AI algorithms'
          ],
          correctAnswer: 2
        }
      ]
    }
  },
  'transformation-leadership': {
    id: 'transformation-leadership',
    pathId: 'ai-business-transformation',
    title: 'Leadership for AI Transformation',
    description: 'Develop the leadership capabilities needed to drive successful AI-powered business transformation.',
    duration: '2 hours',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519834022896-8b4b7832264a?q=80&w=1974&auto=format&fit=crop',
    content: `# Leadership for AI Transformation

## Transformation Leadership Principles
- Setting vision and direction
- Building the case for change
- Organizational alignment strategies
- Managing resistance and uncertainty
- Ethical leadership in the AI era

## Building Capabilities and Culture
1. Talent strategy for the AI age
2. Upskilling and reskilling approaches
3. Fostering innovation and experimentation
4. Creating a data-driven culture
5. Balancing AI and human capabilities

## Governance and Organizational Design
- AI governance structures
- Center of excellence models
- Roles and responsibilities
- Decision rights and processes

## Transformation Roadmap and Execution
- Phased transformation planning
- Quick wins and momentum building
- Managing the transformation journey
- Measuring and communicating progress`,
    order: 5,
    locked: false,
    quiz: {
      questions: [
        {
          question: 'What is the most important leadership quality for successful AI transformation?',
          options: [
            'Technical AI expertise',
            'Vision combined with practical execution capabilities',
            'Financial management skills',
            'Marketing and communications abilities'
          ],
          correctAnswer: 1
        }
      ]
    }
  }
};

const mockUserProgress: Record<string, UserProgress> = {
  'user123': {
    completedModules: {
      'ai-business-case': {
        completed: true,
        quizScore: 100,
        dateCompleted: new Date('2023-06-15').toISOString()
      },
      'ai-strategy-roadmap': {
        completed: true,
        quizScore: 90,
        dateCompleted: new Date('2023-06-18').toISOString()
      },
      'change-management': {
        completed: true,
        quizScore: 85,
        dateCompleted: new Date('2023-06-22').toISOString()
      },
      'implementation-governance': {
        completed: false,
        quizScore: 0,
        dateCompleted: null
      },
      'enterprise-ai-architecture': {
        completed: true,
        quizScore: 95,
        dateCompleted: new Date('2023-07-05').toISOString()
      },
      'business-model-innovation': {
        completed: true,
        quizScore: 100,
        dateCompleted: new Date('2023-07-12').toISOString()
      }
    },
    inProgressModules: ['measuring-ai-success', 'data-pipelines', 'operational-excellence'],
    savedModules: ['model-deployment', 'system-integration', 'customer-experience']
  }
};

// Function to get all training paths
export async function getTrainingPaths(): Promise<TrainingPath[]> {
  if (!isFirebaseInitialized()) {
    console.warn('Firebase not properly initialized, returning mock data');
    return mockTrainingPaths;
  }

  if (!db) {
    console.warn('Firebase Firestore not initialized, returning mock data');
    return mockTrainingPaths;
  }

  const pathsRef = collection(db, 'trainingPaths');
  const pathsSnapshot = await getDocs(pathsRef);
  return pathsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainingPath));
}

// Function to get a specific training path with its modules
export async function getTrainingPathWithModules(pathId: string): Promise<Omit<TrainingPath, 'modules'> & { modules: TrainingModule[] }> {
  if (!isFirebaseInitialized()) {
    console.warn('Firebase not properly initialized, returning mock data');
    // Find the mock path
    const mockPath = mockTrainingPaths.find(p => p.id === pathId);
    if (!mockPath) {
      throw new Error(`Training path with ID ${pathId} not found`);
    }
    
    // Map modules from mock data
    const modules = mockPath.modules.map(moduleId => {
      return mockTrainingModules[moduleId] || {
        id: moduleId,
        pathId,
        title: 'Mock Module',
        description: 'Mock module description',
        thumbnail: 'https://via.placeholder.com/300',
        duration: '1 hour',
        videoUrl: '',
        content: '',
        order: 0
      };
    });
    
    const { modules: _, ...pathWithoutModules } = mockPath;
    return {
      ...pathWithoutModules,
      modules
    };
  }

  if (!db) {
    console.warn('Firebase Firestore not initialized, returning mock data');
    // Same mock data logic as above
    const mockPath = mockTrainingPaths.find(p => p.id === pathId);
    if (!mockPath) {
      throw new Error(`Training path with ID ${pathId} not found`);
    }
    
    const modules = mockPath.modules.map(moduleId => {
      return mockTrainingModules[moduleId] || {
        id: moduleId,
        pathId,
        title: 'Mock Module',
        description: 'Mock module description',
        thumbnail: 'https://via.placeholder.com/300',
        duration: '1 hour',
        videoUrl: '',
        content: '',
        order: 0
      };
    });
    
    const { modules: _, ...pathWithoutModules } = mockPath;
    return {
      ...pathWithoutModules,
      modules
    };
  }

  const pathRef = doc(db, 'trainingPaths', pathId);
  const pathDoc = await getDoc(pathRef);
  
  if (!pathDoc.exists()) {
    throw new Error('Training path not found');
  }

  const pathData = pathDoc.data() as TrainingPath;
  const modulePromises = pathData.modules.map(moduleId => getTrainingModule(moduleId));
  const modules = await Promise.all(modulePromises);

  return {
    ...pathData,
    id: pathDoc.id,
    modules: modules.sort((a, b) => a.order - b.order)
  };
}

// Function to get a specific training module by ID
export async function getTrainingModule(moduleId: string): Promise<TrainingModule | null> {
  if (process.env.NODE_ENV === 'development' || !isFirebaseInitialized()) {
    // Return mock data for development
    return mockTrainingModules.find(module => module.id === moduleId) || null;
  }

  /*
  // TEMPORARILY COMMENTED OUT TO FIX BUILD ISSUES
  // This code will be uncommented when the training portal is implemented
  const moduleRef = doc(db, 'trainingModules', moduleId);
  const moduleDoc = await getDoc(moduleRef);
  
  if (!moduleDoc.exists()) {
    throw new Error('Training module not found');
  }

  const moduleData = moduleDoc.data() as TrainingModule;
  
  // If there's a video URL, get the download URL from Storage
  if (moduleData.videoUrl && storage) {
    const videoRef = ref(storage, moduleData.videoUrl);
    moduleData.videoUrl = await getDownloadURL(videoRef);
  }

  return { ...moduleData, id: moduleDoc.id };
  */
  
  // Temporary stub until training portal is fully implemented
  console.warn('Training module fetch bypassed in production - training portal not yet implemented');
  return null;
}

// Function to get user progress
export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  if (process.env.NODE_ENV === 'development' || !isFirebaseInitialized()) {
    // Return mock data for development
    return mockUserProgress[userId] || null;
  }

  try {
    const userProgressRef = doc(db, 'userProgress', userId);
    const userProgressDoc = await getDoc(userProgressRef);

    if (!userProgressDoc.exists()) {
      return null;
    }

    return userProgressDoc.data() as UserProgress;
  } catch (error) {
    console.error('Error getting user progress:', error);
    return null;
  }
}

// Function to update user progress
export async function updateUserProgress(userId: string, moduleId: string, pathId: string, quizScore: number): Promise<void> {
  if (process.env.NODE_ENV === 'development' || !isFirebaseInitialized()) {
    // Update mock data for development
    if (!mockUserProgress[userId]) {
      mockUserProgress[userId] = {
        completedModules: {},
        inProgressModules: [],
        savedModules: []
      };
    }
    
    // Update the completedModules with the new module
    if (!mockUserProgress[userId].completedModules) {
      mockUserProgress[userId].completedModules = {};
    }
    
    mockUserProgress[userId].completedModules[moduleId] = {
      completed: true,
      quizScore: quizScore,
      dateCompleted: new Date().toISOString()
    };
    
    // Remove from inProgressModules if it exists there
    mockUserProgress[userId].inProgressModules = mockUserProgress[userId].inProgressModules.filter(m => m !== moduleId);
    
    console.log('Updated user progress (mock):', mockUserProgress[userId]);
    return;
  }

  try {
    const userProgressRef = doc(db, 'userProgress', userId);
    const userProgressDoc = await getDoc(userProgressRef);
    
    let userProgress: UserProgress;
    
    if (!userProgressDoc.exists()) {
      // Create new progress document if it doesn't exist
      userProgress = {
        completedModules: {},
        inProgressModules: [],
        savedModules: []
      };
    } else {
      userProgress = userProgressDoc.data() as UserProgress;
      if (!userProgress.completedModules) {
        userProgress.completedModules = {};
      }
    }
    
    // Update the module completion data
    userProgress.completedModules[moduleId] = {
      completed: true,
      quizScore: quizScore,
      dateCompleted: new Date().toISOString()
    };
    
    // Remove from inProgressModules if it exists there
    if (userProgress.inProgressModules) {
      userProgress.inProgressModules = userProgress.inProgressModules.filter(m => m !== moduleId);
    }
    
    await setDoc(userProgressRef, userProgress, { merge: true });
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
}

// Get video URL from Firebase Storage
export const getVideoUrl = async (videoPath: string) => {
  const videoRef = ref(storage, videoPath);
  try {
    return await getDownloadURL(videoRef);
  } catch (error) {
    console.error('Error getting video URL:', error);
    throw error;
  }
};

// Get all training paths for a specific category
export const getTrainingPathsByCategory = async (category: string) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, 'trainingPaths'),
      where('category', '==', category),
      orderBy('level')
    )
  );
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as TrainingPath[];
};

// Check if user has completed prerequisites for a path
export const checkPrerequisites = async (userId: string, pathId: string): Promise<boolean> => {
  if (process.env.NODE_ENV === 'development' || !isFirebaseInitialized()) {
    // For development, always return true for the first path and check prerequisites for others
    if (pathId === 'ai-fundamentals') return true;
    
    const path = mockTrainingPaths.find(p => p.id === pathId);
    if (!path || !path.prerequisites || path.prerequisites.length === 0) return true;
    
    // Check if all prerequisites are completed
    for (const prereqId of path.prerequisites) {
      const prereqPath = mockTrainingPaths.find(p => p.id === prereqId);
      if (!prereqPath) continue;
      
      const userProgress = mockUserProgress[userId];
      if (!userProgress) return false;
      
      // Check if all modules in prerequisite path are completed
      const allModulesCompleted = prereqPath.modules.every(moduleId => 
        userProgress.completedModules[moduleId] && 
        userProgress.completedModules[moduleId].completed
      );
      
      if (!allModulesCompleted) {
        return false;
      }
    }
    
    return true;
  }

  const pathRef = doc(db, 'trainingPaths', pathId);
  const pathDoc = await getDoc(pathRef);
  
  if (!pathDoc.exists()) {
    throw new Error('Training path not found');
  }
  
  const pathData = pathDoc.data() as TrainingPath;
  if (!pathData.prerequisites || pathData.prerequisites.length === 0) {
    return true;
  }
  
  // Check if prerequisites are completed
  const userProgress = await getUserProgress(userId);
  if (!userProgress) return false;
  
  const prerequisitePromises = pathData.prerequisites.map(async (prereqId) => {
    // Get the prerequisite path to check how many modules it has
    const prereqPath = await getTrainingPath(prereqId);
    if (!prereqPath) return false;
    
    // Check if all modules are completed
    return prereqPath.modules.every(moduleId => 
      userProgress.completedModules[moduleId] && 
      userProgress.completedModules[moduleId].completed
    );
  });
  
  const prerequisiteResults = await Promise.all(prerequisitePromises);
  return prerequisiteResults.every(result => result === true);
};

// Helper function to get a single training path
async function getTrainingPath(pathId: string): Promise<TrainingPath | null> {
  if (process.env.NODE_ENV === 'development' || !isFirebaseInitialized()) {
    return mockTrainingPaths.find(p => p.id === pathId) || null;
  }
  
  const pathRef = doc(db, 'trainingPaths', pathId);
  const pathDoc = await getDoc(pathRef);
  
  if (!pathDoc.exists()) {
    return null;
  }
  
  return { id: pathDoc.id, ...pathDoc.data() } as TrainingPath;
}

// Helper function to get a user's progress for a specific path
export function getPathProgress(userId: string, pathId: string): { completed: number; total: number; percentage: number } {
  // For development
  if (process.env.NODE_ENV === 'development' || !isFirebaseInitialized()) {
    const user = mockUserProgress[userId];
    const path = mockTrainingPaths.find(p => p.id === pathId);
    
    if (!user || !path || !path.modules || path.modules.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }
    
    const total = path.modules.length;
    const completed = path.modules.filter(moduleId => 
      user.completedModules[moduleId] && user.completedModules[moduleId].completed
    ).length;
    
    const percentage = (completed / total) * 100;
    
    return { completed, total, percentage };
  }
  
  // This would be implemented for production use with real Firebase data
  return { completed: 0, total: 0, percentage: 0 };
}

// Helper function to get all path progress for a user
export function getAllPathsProgress(userId: string): Record<string, { completed: number; total: number; percentage: number }> {
  const result: Record<string, { completed: number; total: number; percentage: number }> = {};
  
  mockTrainingPaths.forEach(path => {
    result[path.id] = getPathProgress(userId, path.id);
  });
  
  return result;
} 