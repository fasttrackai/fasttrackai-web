/**
 * Development configuration with mock data
 * This file contains mock data and configurations for development purposes only.
 * In production, these values are replaced with actual API responses.
 */

// Mock user data
export const mockUsers = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john@example.com',
    company: 'ABC Tech',
    role: 'client',
    photoURL: 'https://placehold.co/150x150/3b82f6/ffffff?text=JS',
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    company: 'XYZ Innovations',
    role: 'admin',
    photoURL: 'https://placehold.co/150x150/4f46e5/ffffff?text=SJ',
  },
];

// Mock assessment data
export const mockAssessments = [
  {
    id: 'assessment-1',
    userId: 'user-1',
    companyName: 'ABC Tech',
    industry: 'SaaS',
    size: '10-50',
    revenue: '$1M-$5M',
    aiReadiness: 65,
    techStack: ['AWS', 'React', 'Node.js'],
    painPoints: ['Customer support scalability', 'Data analysis'],
    completedAt: new Date('2025-02-15').toISOString(),
    recommendations: [
      { solution: 'Customer Service AI', score: 87, priority: 'High' },
      { solution: 'Business Analytics', score: 76, priority: 'Medium' },
      { solution: 'Process Automation', score: 54, priority: 'Low' },
    ],
  },
];

// Mock ROI calculations
export const mockRoiData = [
  {
    id: 'roi-1',
    userId: 'user-1',
    solutionType: 'Customer Service AI',
    initialInvestment: 35000,
    monthlyOperatingCost: 2500,
    currentCosts: 12000,
    projectedSavings: 8500,
    implementationTimeMonths: 2,
    paybackPeriodMonths: 7,
    fiveYearRoi: 680,
    calculatedAt: new Date('2025-02-20').toISOString(),
  },
];

// Mock chat messages
export const mockChatMessages = [
  {
    role: 'system',
    content: 'I am an AI assistant helping with AI integration information.',
  },
  {
    role: 'user',
    content: 'How can AI help improve our customer service?',
  },
  {
    role: 'assistant',
    content: 'AI can transform your customer service by providing 24/7 support through chatbots, automating responses to common questions, analyzing customer sentiment, and routing complex issues to the right human agents. This typically reduces response times by 80% and support costs by 30-40%.',
  },
];

// Mock image generation prompts
export const mockImageGenerationPrompts = [
  "A business dashboard showing AI analytics with blue and purple charts",
  "A customer service chatbot helping a client with a professional modern interface",
  "AI process automation workflow diagram with robotic process automation elements",
];

// Development flags
export const devFlags = {
  useMockData: true,
  showDevTools: true,
  simulateNetworkDelay: true,
  networkDelayMs: 800,
}; 