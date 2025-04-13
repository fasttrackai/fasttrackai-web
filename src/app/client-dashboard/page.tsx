'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { BarChart, LineChart, Activity, Users, CheckCircle, Clock, Loader, AlertCircle, RefreshCw, Info, LayoutDashboard, LayoutList, TrendingUp, Target as TargetIcon } from 'lucide-react';
import { 
  DataSourceHealthCheck, 
  OpportunityTeaser, 
  SavingsEstimator, 
  AutomationPotential, 
  MAReadinessScorecard, 
  AIDocumentationChecklist 
} from './ValueAddComponents';

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
type DashboardView = 'grow' | 'optimize' | 'sell';

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
  const [activeView, setActiveView] = useState<DashboardView>('grow'); // Default to 'grow'

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      // Check if user is loaded and authenticated
      if (!user) {
        console.log("[Dashboard] No user logged in, using mock data.");
        setMaturityScores(mockMaturityScores);
        setGrowthMetrics(mockGrowthMetrics);
        setProjects(mockProjects);
        setAssessments(mockAssessments);
        setRoiCalculations(mockROICalculations);
        setUsedMockData(true);
        setLoading(false);
        return; // Exit if no user
      }

      // User is logged in, proceed to fetch real data
      setLoading(true);
      setError(null);
      setUsedMockData(false); // Assume we'll get real data

      try {
        // Get the Firebase ID token
        const token = await user.getIdToken();

        // Attempt to fetch from API with Authorization header
        const response = await fetch('/api/client/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Send the token
          },
        });

        const data = await response.json();

        if (isMounted) {
          if (!response.ok || data.usedMockData) {
            // Use mock data as fallback if API returns an error (e.g., 401, 404, 500)
            console.warn(`API fetch ${!response.ok ? `failed (${response.status})` : 'indicated mock data'}, using mock data. Error: ${data.error || data.message}`);
            setMaturityScores(mockMaturityScores);
            setGrowthMetrics(mockGrowthMetrics);
            setProjects(mockProjects);
            setAssessments(mockAssessments);
            setRoiCalculations(mockROICalculations);
            setUsedMockData(true);
            // Set error message based on API response if available
            setError(data.message || data.error || 'Failed to load dashboard data. Using sample data.'); 
          } else {
            // API call was successful
            console.log("[Dashboard] Successfully fetched real data.");
            setMaturityScores(data.maturityScores || []);
            setGrowthMetrics(data.growthMetrics || []);
            setProjects(data.projects || []);
            setAssessments(data.assessments || []);
            setRoiCalculations(data.roiCalculations || []);
            setUsedMockData(false); // Trust API's flag if present
            setError(null); // Clear any previous errors
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (isMounted) {
          // Use mock data on network or other unexpected errors
          setMaturityScores(mockMaturityScores);
          setGrowthMetrics(mockGrowthMetrics);
          setProjects(mockProjects);
          setAssessments(mockAssessments);
          setRoiCalculations(mockROICalculations);
          setUsedMockData(true);
          setError('Failed to connect to server. Using sample data.');
          setLoading(false);
        }
      }
    };

    // Call the fetch function only when user object is available
    if (user !== undefined) { // Check if useAuth has determined auth state
        fetchDashboardData();
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user]); // Depend only on user object

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

  // --- Tab Data ---
  const tabItems: { id: DashboardView; label: string; icon: React.ElementType }[] = [
    { id: 'grow', label: 'Grow', icon: LayoutList },
    { id: 'optimize', label: 'Optimize', icon: TrendingUp },
    { id: 'sell', label: 'Sell', icon: TargetIcon },
  ];

  // --- RENDER VIEW Function ---
  const renderDashboardView = () => {
    switch (activeView) {
      case 'grow':
        return (
          <div className="space-y-8">
            {/* Grow View Layout - Emphasize Maturity & Opportunities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Maturity takes more space */}
              <motion.div className="lg:col-span-2"> 
                 {/* AI Maturity Scores Component (Existing) */}
                 <motion.div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl h-full">
                     <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center"><Activity className="h-6 w-6 mr-3 text-purple-600" /> AI Maturity Scores</h2>
                     <div className="space-y-5">
                       {maturityScores.map((item) => (
                         <div key={item.category}>
                           <div className="flex justify-between mb-1">
                             <span className="text-md font-medium text-gray-800">{item.category}</span>
                             <span className="text-sm font-semibold text-gray-700 flex items-center">
                               <span>{item.score}%</span>
                               {item.improvement > 0 && (
                                 <span className="text-green-600 ml-2 flex items-center text-xs font-bold">
                                   <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                   </svg>
                                   {item.improvement}%
                                 </span>
                               )}
                             </span>
                           </div>
                           <div className="w-full bg-gray-200 rounded-full h-3">
                             <div 
                               className="bg-gradient-to-r from-purple-500 to-purple-700 h-3 rounded-full transition-all duration-500 ease-out" 
                               style={{ width: `${item.score}%` }}
                             ></div>
                           </div>
                           <p className="text-xs text-gray-500 mt-1.5">Last updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
                         </div>
                       ))}
                     </div>
                 </motion.div>
              </motion.div>
              <div className="space-y-6">
                 {/* Data Source Health (New) */}
                <DataSourceHealthCheck />
                 {/* Opportunity Teaser (New) */}
                <OpportunityTeaser />
              </div>
            </div>
            {/* Projects Table (Existing) */}
             <motion.div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Users className="h-6 w-6 mr-3 text-purple-600" />
                  Implementation Projects
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                         <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Project Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Timeline
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.map((project, index) => (
                        <tr key={index} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{project.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${
                              project.status === 'completed' ? 'bg-green-100 text-green-800' :
                              project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              project.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 w-32">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    project.status === 'completed' ? 'bg-green-600' : 'bg-gradient-to-r from-purple-500 to-purple-700'
                                  }`}
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <span className="ml-3 text-sm font-medium text-gray-700">{project.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {project.status === 'completed' ? (
                              <span className="flex items-center text-green-600 font-medium">
                                <CheckCircle className="h-4 w-4 mr-1.5" />
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
             {/* Growth Metrics (Existing - lower priority for Grow) */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {growthMetrics.map((metric, index) => (
                   <motion.div
                     key={metric.label}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl"
                   >
                     <div className="flex justify-between items-start mb-4">
                       <h3 className="text-gray-500 font-semibold">{metric.label}</h3>
                       {metric.trend === 'up' ? (
                         <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                           <span className="mr-1">+{metric.percentChange}%</span>
                           <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                           </svg>
                         </div>
                       ) : metric.trend === 'down' ? (
                         <div className={`text-xs font-bold px-2 py-1 rounded-full flex items-center ${
                           metric.label.toLowerCase().includes('time') || metric.label.toLowerCase().includes('cost') 
                             ? 'bg-green-100 text-green-700' // Green for positive reduction
                             : 'bg-red-100 text-red-700' // Red for negative change
                         }`}>
                           <span className="mr-1">{metric.percentChange}%</span>
                           <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                           </svg>
                         </div>
                       ) : null }
                     </div>
                     <div className="flex items-end">
                       <span className="text-4xl font-bold text-purple-700">{metric.current}</span>
                       <span className="ml-1 text-gray-600 font-medium">{metric.unit}</span>
                     </div>
                     <div className="mt-1 text-sm text-gray-500">
                       Previous: {metric.previous}{metric.unit}
                     </div>
                   </motion.div>
                 ))}
             </div>
          </div>
        );
      case 'optimize':
        return (
          <div className="space-y-8">
             {/* Optimize View Layout - Emphasize Metrics & Automation */}
             {/* Growth Metrics (Existing - High priority) */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {growthMetrics.map((metric, index) => (
                   <motion.div
                     key={metric.label}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl"
                   >
                     <div className="flex justify-between items-start mb-4">
                       <h3 className="text-gray-500 font-semibold">{metric.label}</h3>
                       {metric.trend === 'up' ? (
                         <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                           <span className="mr-1">+{metric.percentChange}%</span>
                           <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                           </svg>
                         </div>
                       ) : metric.trend === 'down' ? (
                         <div className={`text-xs font-bold px-2 py-1 rounded-full flex items-center ${
                           metric.label.toLowerCase().includes('time') || metric.label.toLowerCase().includes('cost') 
                             ? 'bg-green-100 text-green-700' // Green for positive reduction
                             : 'bg-red-100 text-red-700' // Red for negative change
                         }`}>
                           <span className="mr-1">{metric.percentChange}%</span>
                           <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                           </svg>
                         </div>
                       ) : null }
                     </div>
                     <div className="flex items-end">
                       <span className="text-4xl font-bold text-purple-700">{metric.current}</span>
                       <span className="ml-1 text-gray-600 font-medium">{metric.unit}</span>
                     </div>
                     <div className="mt-1 text-sm text-gray-500">
                       Previous: {metric.previous}{metric.unit}
                     </div>
                   </motion.div>
                 ))}
             </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Savings Estimator (New) */}
                 <SavingsEstimator />
                 {/* Automation Potential (New) */}
                 <AutomationPotential />
                  {/* Recent Activities (Existing) */}
                 <motion.div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <Clock className="h-6 w-6 mr-3 text-purple-600" />
                        Recent Activities
                      </h2>
                      <div className="space-y-4">
                         <div className="border-l-4 border-purple-400 pl-4 py-2 bg-purple-50/50 rounded-r-md">
                           <p className="text-sm font-semibold text-purple-800">AI Readiness Assessment</p>
                           <p className="text-xs text-gray-700">Score: {assessments.length > 0 ? `${assessments[0].score}%` : 'N/A'}</p>
                           <p className="text-xs text-gray-500">{assessments.length > 0 ? new Date(assessments[0].date).toLocaleDateString() : 'Invalid Date'}</p>
                         </div>
                         <div className="border-l-4 border-green-400 pl-4 py-2 bg-green-50/50 rounded-r-md">
                           <p className="text-sm font-semibold text-green-800">ROI Calculation</p>
                           <p className="text-xs text-gray-700">{roiCalculations.length > 0 ? `${roiCalculations[0].package} Plan • ${roiCalculations[0].roi}% ROI` : 'N/A'}</p>
                           <p className="text-xs text-gray-500">{roiCalculations.length > 0 ? new Date(roiCalculations[0].date).toLocaleDateString() : 'Invalid Date'}</p>
                         </div>
                         {projects.filter(p => p.status === 'completed').slice(0, 1).map((project) => (
                           <div key={project.name} className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50/50 rounded-r-md">
                             <p className="text-sm font-semibold text-blue-800">{project.name} Completed</p>
                             <p className="text-xs text-gray-500">Recently Completed</p>
                           </div>
                         ))}
                      </div>
                      <div className="mt-6">
                        <a href="#" // Keep href to #
                           onClick={(e) => e.preventDefault()} // Prevent default anchor behavior
                           className="text-sm text-purple-600 hover:text-purple-800 font-semibold cursor-not-allowed opacity-50" // Style as disabled
                           title="Activity Log page not yet implemented"
                         >
                          View All Activity →
                        </a>
                      </div>
                  </motion.div>
              </div>
             {/* Projects Table (Existing) */}
             <motion.div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
                 <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                   <Users className="h-6 w-6 mr-3 text-purple-600" />
                   Implementation Projects
                 </h2>
                 <div className="overflow-x-auto">
                   <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                       <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                           Project Name
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                           Status
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                           Progress
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                           Timeline
                         </th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                       {projects.map((project, index) => (
                         <tr key={index} className="hover:bg-gray-50/50">
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className="text-sm font-medium text-gray-900">{project.name}</div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${
                               project.status === 'completed' ? 'bg-green-100 text-green-800' :
                               project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                               project.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                               'bg-gray-100 text-gray-800'
                             }`}>
                               {project.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                             </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className="flex items-center">
                               <div className="w-full bg-gray-200 rounded-full h-2.5 w-32">
                                 <div 
                                   className={`h-2.5 rounded-full ${
                                     project.status === 'completed' ? 'bg-green-600' : 'bg-gradient-to-r from-purple-500 to-purple-700'
                                   }`}
                                   style={{ width: `${project.progress}%` }}
                                 ></div>
                               </div>
                               <span className="ml-3 text-sm font-medium text-gray-700">{project.progress}%</span>
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                             {project.status === 'completed' ? (
                               <span className="flex items-center text-green-600 font-medium">
                                 <CheckCircle className="h-4 w-4 mr-1.5" />
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
          </div>
        );
      case 'sell':
        return (
           <div className="space-y-8">
             {/* Sell View Layout - Emphasize Readiness & Summaries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* M&A Readiness Score (New) */}
                 <MAReadinessScorecard />
                 {/* AI Documentation Checklist (New) */}
                 <AIDocumentationChecklist />
              </div>
             {/* Growth Metrics (Existing - Summary?) */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {growthMetrics.map((metric, index) => (
                   <motion.div
                     key={metric.label}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl"
                   >
                     <div className="flex justify-between items-start mb-4">
                       <h3 className="text-gray-500 font-semibold">{metric.label}</h3>
                       {metric.trend === 'up' ? (
                         <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                           <span className="mr-1">+{metric.percentChange}%</span>
                           <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                           </svg>
                         </div>
                       ) : metric.trend === 'down' ? (
                         <div className={`text-xs font-bold px-2 py-1 rounded-full flex items-center ${
                           metric.label.toLowerCase().includes('time') || metric.label.toLowerCase().includes('cost') 
                             ? 'bg-green-100 text-green-700' // Green for positive reduction
                             : 'bg-red-100 text-red-700' // Red for negative change
                         }`}>
                           <span className="mr-1">{metric.percentChange}%</span>
                           <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                           </svg>
                         </div>
                       ) : null }
                     </div>
                     <div className="flex items-end">
                       <span className="text-4xl font-bold text-purple-700">{metric.current}</span>
                       <span className="ml-1 text-gray-600 font-medium">{metric.unit}</span>
                     </div>
                     <div className="mt-1 text-sm text-gray-500">
                       Previous: {metric.previous}{metric.unit}
                     </div>
                   </motion.div>
                 ))}
             </div>
              {/* Projects Table (Existing - focus on Completed?) */}
             <motion.div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
                 <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                   <Users className="h-6 w-6 mr-3 text-purple-600" />
                   Implementation Projects
                 </h2>
                 <div className="overflow-x-auto">
                   <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                       <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                           Project Name
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                           Status
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                           Progress
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                           Timeline
                         </th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                       {projects.map((project, index) => (
                         <tr key={index} className="hover:bg-gray-50/50">
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className="text-sm font-medium text-gray-900">{project.name}</div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${
                               project.status === 'completed' ? 'bg-green-100 text-green-800' :
                               project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                               project.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                               'bg-gray-100 text-gray-800'
                             }`}>
                               {project.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                             </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className="flex items-center">
                               <div className="w-full bg-gray-200 rounded-full h-2.5 w-32">
                                 <div 
                                   className={`h-2.5 rounded-full ${
                                     project.status === 'completed' ? 'bg-green-600' : 'bg-gradient-to-r from-purple-500 to-purple-700'
                                   }`}
                                   style={{ width: `${project.progress}%` }}
                                 ></div>
                               </div>
                               <span className="ml-3 text-sm font-medium text-gray-700">{project.progress}%</span>
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                             {project.status === 'completed' ? (
                               <span className="flex items-center text-green-600 font-medium">
                                 <CheckCircle className="h-4 w-4 mr-1.5" />
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
               {/* Maturity Scores (Existing - lower priority?) */}
              <motion.div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
                 <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center"><Activity className="h-6 w-6 mr-3 text-purple-600" /> AI Maturity Scores</h2>
                 <div className="space-y-5">
                    {maturityScores.map((item) => (
                      <div key={item.category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-md font-medium text-gray-800">{item.category}</span>
                          <span className="text-sm font-semibold text-gray-700 flex items-center">
                            <span>{item.score}%</span>
                            {item.improvement > 0 && (
                              <span className="text-green-600 ml-2 flex items-center text-xs font-bold">
                                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                {item.improvement}%
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-purple-700 h-3 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">Last updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
                      </div>
                    ))}
                 </div>
              </motion.div>
           </div>
        );
      default:
        return <div>Invalid view selected</div>;
    }
  };

  // --- Main Return ---
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header - Enhanced Title & Layout */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
          {/* Title with Icon */}
          <div className="flex items-center mb-4 sm:mb-0">
             <LayoutDashboard className="h-8 w-8 mr-3 text-purple-600 flex-shrink-0" /> 
             <h1 className="text-3xl font-bold text-gray-800 tracking-tight">AI Performance Dashboard</h1>
          </div>
          {/* Buttons and Banner Area */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
             {/* Sample Data Banner - Amber Color */}
             {usedMockData && (
               <span className={`text-sm inline-flex items-center bg-amber-100 text-amber-800 font-medium px-3 py-1 rounded-full shadow-sm order-2 sm:order-1'`}>
                  <Info className="h-4 w-4 mr-1.5" /> Viewing sample data
               </span>
             )}
            <button 
              className="button-primary inline-flex items-center order-1 sm:order-2" // Themed button
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
           <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center shadow-sm">
             <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
             <p className="font-medium">{error}</p>
           </div>
        )}
        
        {/* === TABS for View Switching === */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-150 ease-in-out ${
                    activeView === tab.id
                      ? 'border-purple-600 text-purple-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-current={activeView === tab.id ? 'page' : undefined}
                >
                  <tab.icon className={`-ml-0.5 mr-2 h-5 w-5 ${activeView === tab.id ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        {/* === End Tabs === */}

        {/* === Conditionally Rendered View Content === */}
        <div className="dashboard-content-area mt-8">
           {renderDashboardView()} {/* Call the function to render the active view */} 
        </div>
        {/* === End Conditional Content Area === */}
        
        {/* Keep CTA at the bottom */}
         <motion.div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between mt-12">
            <div className="mb-4 md:mb-0 md:mr-6 text-center md:text-left">
              <h2 className="text-xl font-bold mb-2">Ready to take your AI implementation to the next level?</h2>
              <p className="text-purple-100/90">Schedule a consultation with our experts to discuss optimizing your AI strategy.</p>
            </div>
            <div className="flex-shrink-0 flex space-x-4">
              <a 
                href="/schedule-consultation" 
                className="button-secondary-light"
              >
                Schedule Consultation
              </a>
            </div>
         </motion.div>

      </div>
    </main>
  );
} 