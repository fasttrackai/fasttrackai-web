'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { BarChart, LineChart, Activity, Users, CheckCircle, Clock, Loader, AlertCircle, RefreshCw, Info, LayoutDashboard, LayoutList, TrendingUp, Target, BarChart3, DollarSign, Building, ClipboardCheck, Check, CircleAlert, Zap } from 'lucide-react';
import { 
  DataSourceHealthCheck, 
  OpportunityTeaser, 
  SavingsEstimator, 
  AutomationPotential, 
  MAReadinessScorecard, 
  AIDocumentationChecklist,
  ImplementationRoadmap,
  ROICalculator,
  ProgressTracker
} from './ValueAddComponents';
import { useRouter } from 'next/navigation';

// Define types for the dashboard data
interface MaturityScore {
  category: string;
  score: number;
  improvement: number;
  lastUpdated: string;
}

interface GrowthMetric {
  label: string;
  current: number;
  previous: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  percentChange: number;
}

interface ProjectStatus {
  name: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  progress: number;
  daysRemaining: number;
}

interface AssessmentSummary {
  id: string;
  date: string;
  score: number;
  nextSteps: string[];
}

interface ROICalculation {
  id: string;
  date: string;
  package: string;
  annualBenefit: number;
  roi: number;
}

// Mock data for development and fallback
const mockMaturityScores: MaturityScore[] = [
  { category: 'Data Readiness', score: 68, improvement: 12, lastUpdated: '2023-11-15' },
  { category: 'Technology Stack', score: 73, improvement: 8, lastUpdated: '2023-11-15' },
  { category: 'Process Integration', score: 62, improvement: 15, lastUpdated: '2023-11-15' },
  { category: 'Team Capabilities', score: 57, improvement: 10, lastUpdated: '2023-11-15' }
];

const mockGrowthMetrics: GrowthMetric[] = [
  { label: 'Customer Satisfaction', current: 92, previous: 86, unit: '%', trend: 'up', percentChange: 7 },
  { label: 'Response Time', current: 2.8, previous: 4.5, unit: 'hours', trend: 'down', percentChange: 38 },
  { label: 'Process Efficiency', current: 78, previous: 65, unit: '%', trend: 'up', percentChange: 20 },
  { label: 'Cost Reduction', current: 22, previous: 15, unit: '%', trend: 'up', percentChange: 47 }
];

const mockProjects: ProjectStatus[] = [
  { name: 'Data Integration', status: 'in-progress', progress: 65, daysRemaining: 12 },
  { name: 'Model Training', status: 'planning', progress: 25, daysRemaining: 30 },
  { name: 'Dashboard Setup', status: 'review', progress: 90, daysRemaining: 3 },
  { name: 'Process Automation', status: 'completed', progress: 100, daysRemaining: 0 }
];

const mockAssessments: AssessmentSummary[] = [
  {
    id: 'a123',
    date: '2023-10-15',
    score: 64,
    nextSteps: ['Improve data collection', 'Train team on AI concepts']
  }
];

const mockROICalculations: ROICalculation[] = [
  {
    id: 'r456',
    date: '2023-10-18',
    package: 'Enterprise',
    annualBenefit: 256000,
    roi: 184
  }
];

// Define type for active view
type DashboardView = 'overview' | 'roi' | 'progress';
type DashboardCategory = 'grow' | 'optimize' | 'sell';

// Define interfaces for package-specific metrics and KPIs
interface PackageMetric {
  name: string;
  value: number;
  previous: number;
  unit: string;
  change: number;
  trend: 'up' | 'down';
}

interface PackageKPI {
  name: string;
  value: string;
  target: string;
  progress: number;
}

interface FocusArea {
  name: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Deployed' | 'In Progress' | 'Planning' | 'On Hold';
}

interface PackageData {
  metrics: PackageMetric[];
  kpis: PackageKPI[];
  focusAreas: FocusArea[];
  recommendations: string[];
}

// Package-specific dashboard data
// GROW package data - focused on customer acquisition, AI readiness, and revenue growth
const growPackageData: PackageData = {
  metrics: [
    { name: 'Customer Satisfaction', value: 92, previous: 86, unit: '%', change: 7, trend: 'up' },
    { name: 'Response Time', value: 2.8, previous: 4.5, unit: 'hours', change: 38, trend: 'down' },
    { name: 'AI Readiness Score', value: 68, previous: 55, unit: '%', change: 24, trend: 'up' },
    { name: 'New Customers', value: 34, previous: 22, unit: '', change: 55, trend: 'up' }
  ],
  kpis: [
    { name: 'AI-Augmented Revenue', value: '$285K', target: '$300K', progress: 95 },
    { name: 'Customer Retention', value: '94%', target: '90%', progress: 104 },
    { name: 'AI Adoption Rate', value: '78%', target: '85%', progress: 92 },
    { name: 'Service Quality Score', value: '4.7/5', target: '4.5/5', progress: 104 }
  ],
  focusAreas: [
    { name: 'Customer Data Integration', priority: 'High', status: 'In Progress' },
    { name: 'AI Chatbot Implementation', priority: 'Medium', status: 'Planning' },
    { name: 'Predictive Analytics Model', priority: 'High', status: 'In Progress' }
  ],
  recommendations: [
    'Enhance data collection for customer behavior analysis',
    'Implement AI-powered lead scoring system',
    'Deploy natural language processing for customer feedback analysis',
    'Create customer journey mapping with AI insights'
  ]
};

// OPTIMIZE package data - focused on operational efficiency, cost reduction, and process improvement
const optimizePackageData: PackageData = {
  metrics: [
    { name: 'Process Efficiency', value: 78, previous: 65, unit: '%', change: 20, trend: 'up' },
    { name: 'Cost Reduction', value: 22, previous: 15, unit: '%', change: 47, trend: 'up' },
    { name: 'Time Savings', value: 240, previous: 180, unit: 'hrs/mo', change: 33, trend: 'up' },
    { name: 'Error Rate', value: 0.8, previous: 3.5, unit: '%', change: 77, trend: 'down' }
  ],
  kpis: [
    { name: 'Automation Coverage', value: '65%', target: '80%', progress: 81 },
    { name: 'Manual Process Reduction', value: '45%', target: '50%', progress: 90 },
    { name: 'Operational Cost Savings', value: '$125K', target: '$150K', progress: 83 },
    { name: 'Process Cycle Time', value: '2.2 days', target: '2 days', progress: 91 }
  ],
  focusAreas: [
    { name: 'Invoice Processing Automation', priority: 'High', status: 'Deployed' },
    { name: 'Inventory Management AI', priority: 'Medium', status: 'In Progress' },
    { name: 'Customer Onboarding Automation', priority: 'High', status: 'Planning' }
  ],
  recommendations: [
    'Implement robotic process automation for repetitive tasks',
    'Deploy machine learning for demand forecasting',
    'Integrate AI-powered quality control systems',
    'Automate document processing workflow'
  ]
};

// SELL package data - focused on M&A readiness, business valuation, and documentation
const sellPackageData: PackageData = {
  metrics: [
    { name: 'M&A Readiness', value: 82, previous: 65, unit: '%', change: 26, trend: 'up' },
    { name: 'Business Valuation', value: 5.2, previous: 4.3, unit: 'x EBITDA', change: 21, trend: 'up' },
    { name: 'Documentation', value: 85, previous: 60, unit: '%', change: 42, trend: 'up' },
    { name: 'Risk Score', value: 18, previous: 35, unit: '', change: 49, trend: 'down' }
  ],
  kpis: [
    { name: 'AI Asset Valuation', value: '$1.8M', target: '$1.5M', progress: 120 },
    { name: 'IP Documentation', value: '85%', target: '90%', progress: 94 },
    { name: 'Compliance Score', value: '92/100', target: '90/100', progress: 102 },
    { name: 'Due Diligence Readiness', value: '78%', target: '85%', progress: 92 }
  ],
  focusAreas: [
    { name: 'AI IP Documentation', priority: 'Critical', status: 'In Progress' },
    { name: 'Data Governance Framework', priority: 'High', status: 'Deployed' },
    { name: 'Security Audit', priority: 'High', status: 'In Progress' }
  ],
  recommendations: [
    'Complete comprehensive AI asset inventory',
    'Finalize data governance policy documentation',
    'Implement rigorous model performance tracking',
    'Create detailed AI ROI analysis reports'
  ]
};

export default function ClientDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maturityScores, setMaturityScores] = useState<MaturityScore[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetric[]>([]);
  const [projects, setProjects] = useState<ProjectStatus[]>([]);
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [roiCalculations, setRoiCalculations] = useState<ROICalculation[]>([]);
  const [usedMockData, setUsedMockData] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>('overview'); // Default to 'overview'
  const [activeCategory, setActiveCategory] = useState<DashboardCategory>('grow'); // Default to 'grow'
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  // Function to handle sign in button click
  const handleSignIn = () => {
    router.push('/sign-in');
  };

  // --- Category Tabs Data ---
  const categoryTabs: { id: DashboardCategory; label: string; color: string; icon: React.ElementType }[] = [
    { id: 'grow', label: 'Grow', color: 'emerald', icon: TrendingUp },
    { id: 'optimize', label: 'Optimize', color: 'blue', icon: BarChart3 },
    { id: 'sell', label: 'Sell', color: 'purple', icon: DollarSign },
  ];

  // --- Tab Data ---
  const tabItems: { id: DashboardView; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutList },
    { id: 'roi', label: 'ROI Calculation', icon: Target },
    { id: 'progress', label: 'Progress Tracker', icon: TrendingUp },
  ];

  // Function to render preview banner for mock data
  const renderPreviewBanner = () => {
    if (isUsingMockData) {
      return (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                You're viewing sample data. <a href="#" onClick={handleSignIn} className="font-medium underline hover:text-amber-600">Sign in</a> to see your actual dashboard.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Define the renderDashboardContent function for the selected category
  const renderDashboardContent = () => {
    // Function to render generic metrics cards based on package data
    const renderPackageMetricsCards = (metrics: PackageMetric[]) => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric: PackageMetric, index: number) => (
          <div key={index} className="bg-white rounded-lg shadow p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">{metric.name}</h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                metric.trend === 'up' 
                  ? (metric.name === 'Error Rate' || metric.name === 'Risk Score' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800')
                  : (metric.name === 'Error Rate' || metric.name === 'Risk Score' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
              }`}>
                {metric.trend === 'up' ? '+' : '-'}{metric.change}% {metric.trend === 'up' ? '↑' : '↓'}
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-purple-700">{metric.value}</span>
              <span className="ml-2 text-sm text-gray-500">{metric.unit} (was {metric.previous}{metric.unit})</span>
            </div>
          </div>
        ))}
      </div>
    );

    // Function to render KPI cards for each package
    const renderKPICards = (kpis: PackageKPI[]) => (
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center mb-6">
          <BarChart className="h-5 w-5 mr-2 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Key Performance Indicators</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kpis.map((kpi: PackageKPI, index: number) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-medium text-gray-700">{kpi.name}</h3>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${
                    kpi.progress >= 100 ? 'text-green-600' : 'text-blue-600'
                  }`}>{kpi.value}</span>
                  <span className="mx-1 text-xs text-gray-400">|</span>
                  <span className="text-xs text-gray-500">Target: {kpi.target}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    kpi.progress >= 100 ? 'bg-green-500' : 'bg-blue-600'
                  }`} 
                  style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                ></div>
              </div>
              <div className="text-right mt-1">
                <span className="text-xs text-gray-500">{kpi.progress}% of target</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    // Function to render focus areas
    const renderFocusAreas = (focusAreas: FocusArea[]) => (
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center mb-6">
          <Target className="h-5 w-5 mr-2 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Focus Areas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initiative</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {focusAreas.map((area: FocusArea, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{area.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      area.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                      area.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {area.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      area.status === 'Deployed' ? 'bg-green-100 text-green-800' :
                      area.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {area.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    // Function to render AI recommendations
    const renderRecommendations = (recommendations: string[]) => (
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center mb-6">
          <Zap className="h-5 w-5 mr-2 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Recommendations</h2>
        </div>
        <ul className="space-y-3">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    );

    // Function to render AI Maturity Scores
    const renderMaturityScores = () => (
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center mb-6">
          <Activity className="h-5 w-5 mr-2 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Maturity Scores</h2>
        </div>
        
        <div className="space-y-6">
          {maturityScores.length > 0 ? maturityScores.map((score, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <h3 className="text-sm font-medium text-gray-700">{score.category}</h3>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">{score.score}%</span>
                  <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">+{score.improvement}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${score.score}%` }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Last updated: {score.lastUpdated}</div>
            </div>
          )) : mockMaturityScores.map((score, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <h3 className="text-sm font-medium text-gray-700">{score.category}</h3>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">{score.score}%</span>
                  <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">+{score.improvement}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${score.score}%` }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Last updated: {score.lastUpdated}</div>
            </div>
          ))}
        </div>
      </div>
    );

    // Content for each category based on activeCategory
    switch (activeCategory) {
      case 'grow':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <LayoutDashboard className="h-6 w-6 mr-2 text-emerald-600" />
                Growth AI Dashboard
                <span className="ml-3 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-md font-medium">
                  GROW Package
                </span>
              </h2>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
            </div>
            
            {renderPackageMetricsCards(growPackageData.metrics)}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {renderKPICards(growPackageData.kpis)}
            </div>
            
            {renderFocusAreas(growPackageData.focusAreas)}
            {renderRecommendations(growPackageData.recommendations)}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {renderMaturityScores()}
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 h-full">
                  <div className="flex items-center mb-6">
                    <Clock className="h-5 w-5 mr-2 text-purple-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="border-l-2 border-purple-200 pl-4 py-1">
                      <h3 className="text-sm font-medium text-gray-900">AI Readiness Assessment</h3>
                      <p className="text-xs text-gray-500">Score: 64% | 10/14/2023</p>
                    </div>
                    <div className="border-l-2 border-green-200 pl-4 py-1">
                      <h3 className="text-sm font-medium text-gray-900">Customer Analytics Setup</h3>
                      <p className="text-xs text-gray-500">Phase 1 Complete | 10/17/2023</p>
                    </div>
                    <div className="border-l-2 border-blue-200 pl-4 py-1">
                      <h3 className="text-sm font-medium text-gray-900">AI Training Session</h3>
                      <p className="text-xs text-gray-500">Team Onboarding | 10/22/2023</p>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <a href="#" className="text-sm text-purple-600 hover:text-purple-800 flex items-center justify-center">
                      View All Activity 
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                        <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'optimize':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                Optimization Dashboard
                <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-md font-medium">
                  OPTIMIZE Package
                </span>
              </h2>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
            </div>
            
            {renderPackageMetricsCards(optimizePackageData.metrics)}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {renderKPICards(optimizePackageData.kpis)}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="lg:col-span-1">
                <AutomationPotential usedMockData={isUsingMockData} />
              </div>
              <div className="lg:col-span-1">
                <SavingsEstimator usedMockData={isUsingMockData} />
              </div>
            </div>
            
            {renderFocusAreas(optimizePackageData.focusAreas)}
            {renderRecommendations(optimizePackageData.recommendations)}
            
            <ImplementationRoadmap usedMockData={isUsingMockData} />
          </>
        );
      case 'sell':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <DollarSign className="h-6 w-6 mr-2 text-purple-600" />
                M&A Readiness Dashboard
                <span className="ml-3 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-md font-medium">
                  SELL Package
                </span>
              </h2>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
            </div>
            
            {renderPackageMetricsCards(sellPackageData.metrics)}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {renderKPICards(sellPackageData.kpis)}
            </div>
            
            {renderFocusAreas(sellPackageData.focusAreas)}
            {renderRecommendations(sellPackageData.recommendations)}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="lg:col-span-1">
                <ROICalculator usedMockData={isUsingMockData} />
              </div>
              <div className="lg:col-span-1">
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                      <Building className="h-5 w-5 mr-2 text-cyan-600" /> M&A Readiness Score
                    </h2>
                    <div className="text-center">
                      <p className="text-5xl font-bold text-cyan-700 mb-1">B+</p>
                      <p className="text-sm text-gray-500">Illustrative score based on current AI maturity & documentation.</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                      <ClipboardCheck className="h-5 w-5 mr-2 text-rose-600" /> AI Documentation Status
                    </h2>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center text-gray-700"><Check className="h-4 w-4 mr-2 text-green-500"/> Model Performance Reports</li>
                      <li className="flex items-center text-gray-700"><CircleAlert className="h-4 w-4 mr-2 text-amber-500"/> Process Integration Maps</li>
                      <li className="flex items-center text-gray-700"><Check className="h-4 w-4 mr-2 text-green-500"/> Data Governance Policy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <ProgressTracker usedMockData={isUsingMockData} />
          </>
        );
      default:
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Select a dashboard view</h3>
            <p className="mt-1 text-sm text-gray-500">Please select a view from the tabs above.</p>
          </div>
        );
    }
  };

  useEffect(() => {
    // Check if we have a user - if not, we'll use mock data for anonymous preview
    if (!user) {
      setIsUsingMockData(true);
      setLoading(false);
      return;
    }

    const loadClientData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from Firebase or API
        const response = await fetch('/api/client/dashboard');
        
        if (!response.ok) {
          throw new Error('Failed to load dashboard data');
        }
        
        const data = await response.json();
        
        // Update state with the data
        setMaturityScores(data.maturityScores || []);
        setGrowthMetrics(data.growthMetrics || []);
        setProjects(data.projects || []);
        setAssessments(data.assessments || []);
        setRoiCalculations(data.roiCalculations || []);
        setUsedMockData(data.usedMockData);
        
        // If the API returned that it used mock data, set our state flag
        if (data.usedMockData) {
          setIsUsingMockData(true);
        }
        
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setIsUsingMockData(true); // Fallback to mock data on error
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Loader className="h-12 w-12 text-purple-600" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-900">Loading your dashboard</h2>
          <p className="mt-2 text-gray-600">Getting your AI performance insights...</p>
        </div>
      </div>
    );
  }

  // No user means anonymous view with mock data
  if (!user && !loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Your AI integration and automation insights
              </p>
            </div>
          </div>
          
          {/* Preview Banner if using mock data */}
          {renderPreviewBanner()}
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Category Tabs Navigation */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              {categoryTabs.map((tab) => {
                const Icon = tab.icon;
                const activeColor = tab.id === 'grow' ? 'emerald' : tab.id === 'optimize' ? 'blue' : 'purple';
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`${
                      activeCategory === tab.id
                        ? `border-${activeColor}-500 text-${activeColor}-600`
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } flex items-center py-4 px-8 border-b-2 font-medium text-base`}
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Dynamic View Content */}
          {renderDashboardContent()}
          
          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between mt-12">
            <div className="mb-4 md:mb-0 md:mr-6 text-center md:text-left">
              <h2 className="text-xl font-bold mb-2">Ready to take your AI implementation to the next level?</h2>
              <p className="text-purple-100/90">Schedule a consultation with our experts to discuss optimizing your AI strategy.</p>
            </div>
            <div className="flex-shrink-0 flex space-x-4">
              <a 
                href="/schedule-consultation" 
                className="px-4 py-2 border border-white text-white bg-transparent hover:bg-white/10 rounded-md font-medium text-sm"
              >
                Schedule Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Return ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Your AI integration and automation insights
            </p>
          </div>
        </div>
        
        {/* Preview Banner if using mock data */}
        {renderPreviewBanner()}
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Category Tabs Navigation */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            {categoryTabs.map((tab) => {
              const Icon = tab.icon;
              const activeColor = tab.id === 'grow' ? 'emerald' : tab.id === 'optimize' ? 'blue' : 'purple';
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`${
                    activeCategory === tab.id
                      ? `border-${activeColor}-500 text-${activeColor}-600`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center py-4 px-8 border-b-2 font-medium text-base`}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Dynamic View Content */}
        {renderDashboardContent()}
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between mt-12">
          <div className="mb-4 md:mb-0 md:mr-6 text-center md:text-left">
            <h2 className="text-xl font-bold mb-2">Ready to take your AI implementation to the next level?</h2>
            <p className="text-purple-100/90">Schedule a consultation with our experts to discuss optimizing your AI strategy.</p>
          </div>
          <div className="flex-shrink-0 flex space-x-4">
            <a 
              href="/schedule-consultation" 
              className="px-4 py-2 border border-white text-white bg-transparent hover:bg-white/10 rounded-md font-medium text-sm"
            >
              Schedule Consultation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 