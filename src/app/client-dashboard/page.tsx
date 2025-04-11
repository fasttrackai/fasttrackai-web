'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { BarChart, LineChart, Activity, Users, CheckCircle, Clock, Loader, AlertCircle } from 'lucide-react';

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

export default function ClientDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maturityScores, setMaturityScores] = useState<MaturityScore[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetric[]>([]);
  const [projects, setProjects] = useState<ProjectStatus[]>([]);
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [roiCalculations, setRoiCalculations] = useState<ROICalculation[]>([]);
  const [usedMockData, setUsedMockData] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Start timer to use mock data if API call takes too long
        timeout = setTimeout(() => {
          if (isMounted) {
            console.log('API call taking too long, using mock data as fallback');
            setMaturityScores(mockMaturityScores);
            setGrowthMetrics(mockGrowthMetrics);
            setProjects(mockProjects);
            setAssessments(mockAssessments);
            setRoiCalculations(mockROICalculations);
            setUsedMockData(true);
            setLoading(false);
          }
        }, 5000);

        // Attempt to fetch from API
        const response = await fetch('/api/client/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Clear timeout since we got a response
        clearTimeout(timeout);

        const data = await response.json();

        if (isMounted) {
          // Check if the response indicates it's using mock data
          if (data.usedMockData) {
            setUsedMockData(true);
            // Don't show error if we're intentionally using mock data in development mode
            setError(null);
          } else if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch dashboard data');
          }

          // Set data from the API (or use mock data as fallback)
          setMaturityScores(data.maturityScores || mockMaturityScores);
          setGrowthMetrics(data.growthMetrics || mockGrowthMetrics);
          setProjects(data.projects || mockProjects);
          setAssessments(data.assessments || mockAssessments);
          setRoiCalculations(data.roiCalculations || mockROICalculations);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        if (isMounted) {
          // Use mock data in case of error
          setMaturityScores(mockMaturityScores);
          setGrowthMetrics(mockGrowthMetrics);
          setProjects(mockProjects);
          setAssessments(mockAssessments);
          setRoiCalculations(mockROICalculations);
          setUsedMockData(true);
          
          // Only show error message if we're not in development mode
          // This prevents showing expected Firebase initialization errors
          if (process.env.NODE_ENV !== 'development') {
            setError('Failed to load dashboard data. Using sample data instead.');
          } else {
            // In development, just log to console but don't show error to user
            console.info('Using mock data in development mode');
            setError(null);
          }
          
          setLoading(false);
        }
      }
    };

    // Call the fetch function
    fetchDashboardData();

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [user?.uid]);

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

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Performance Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {usedMockData ? 'Viewing sample data' : 'Real-time insights on your AI implementation'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Only show error message if it exists and we're not in development mode */}
        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center text-amber-700">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {growthMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-500 font-medium">{metric.label}</h3>
                {metric.trend === 'up' ? (
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <span className="mr-1">+{metric.percentChange}%</span>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                ) : metric.trend === 'down' ? (
                  <div className={`text-xs px-2 py-1 rounded-full flex items-center ${
                    metric.label.toLowerCase().includes('time') || metric.label.toLowerCase().includes('cost') 
                      ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <span className="mr-1">{metric.percentChange}%</span>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                ) : (
                  <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    No change
                  </div>
                )}
              </div>
              <div className="flex items-end">
                <span className="text-3xl font-bold text-gray-900">{metric.current}</span>
                <span className="ml-1 text-gray-600">{metric.unit}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Previous: {metric.previous}{metric.unit}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Maturity Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-600" />
              AI Maturity Scores
            </h2>
            <div className="space-y-4">
              {maturityScores.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <span className="text-sm text-gray-600 flex items-center">
                      <span>{item.score}%</span>
                      {item.improvement > 0 && (
                        <span className="text-green-600 ml-2 flex items-center text-xs">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          {item.improvement}%
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Last updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Clock className="h-6 w-6 mr-3 text-purple-600" />
              Recent Activities
            </h2>
            
            <div className="space-y-4">
              {assessments.length > 0 && (
                <div className="border-l-2 border-purple-200 pl-4 py-1">
                  <p className="text-sm font-medium text-gray-900">AI Readiness Assessment</p>
                  <p className="text-xs text-gray-600">Score: {assessments[0].score}%</p>
                  <p className="text-xs text-gray-500">{new Date(assessments[0].date).toLocaleDateString()}</p>
                </div>
              )}
              
              {roiCalculations.length > 0 && (
                <div className="border-l-2 border-green-200 pl-4 py-1">
                  <p className="text-sm font-medium text-gray-900">ROI Calculation</p>
                  <p className="text-xs text-gray-600">{roiCalculations[0].package} Plan • {roiCalculations[0].roi}% ROI</p>
                  <p className="text-xs text-gray-500">{new Date(roiCalculations[0].date).toLocaleDateString()}</p>
                </div>
              )}
              
              {projects.filter(p => p.status === 'completed').map((project, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4 py-1">
                  <p className="text-sm font-medium text-gray-900">{project.name} Completed</p>
                  <p className="text-xs text-gray-500">Recently Completed</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <a href="#"
                 onClick={(e) => e.preventDefault()}
                 className="text-sm text-purple-600 hover:text-purple-800 font-semibold cursor-not-allowed opacity-50"
                 title="Activity Log page not yet implemented"
               >
                View All Activity →
              </a>
            </div>
          </motion.div>
        </div>

        {/* Implementation Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            Implementation Projects
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 w-32">
                          <div 
                            className={`h-2.5 rounded-full ${
                              project.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-500">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.status === 'completed' ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </span>
                      ) : (
                        <span>{project.daysRemaining} days remaining</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-purple-700 text-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold mb-2">Ready to take your AI implementation to the next level?</h2>
            <p className="text-purple-200">Schedule a consultation with our experts to discuss optimizing your AI strategy.</p>
          </div>
          <div className="flex space-x-4">
            <a 
              href="/schedule-consultation" 
              className="px-4 py-2 bg-white text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Schedule Consultation
            </a>
            <a 
              href="/instant-consultation" 
              className="px-4 py-2 border border-white text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              Instant Consultation
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 