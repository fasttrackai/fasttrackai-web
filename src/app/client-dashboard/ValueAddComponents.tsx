import { useState, useEffect } from 'react';
import { Check, CircleAlert, Database, Zap, DollarSign, Gauge, ClipboardCheck, Building, XCircle, RefreshCw, Activity, AlertCircle, BarChart3, Clock, FileText, TrendingUp, Users, LucideIcon, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion } from 'framer-motion';
import { useDevelopment } from '@/lib/hooks/useDevelopment';

interface DataSourceStatus {
  name: string;
  status: 'connected' | 'pending' | 'failed';
  lastChecked?: string;
}

interface Opportunity {
  id: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

interface SavingsData {
  annualSavings: number;
  roiPercentage: number;
  paybackPeriodMonths: number;
}

interface AutomationData {
  potentialScore: number;
  category: string;
  recommendedNextSteps: string[];
  lastAssessment?: string;
}

// Types
interface ComponentProps {
  usedMockData?: boolean;
}

type Saving = {
  category: string;
  amount: number;
  percentChange: number;
  trend: 'up' | 'down';
  timeframe: string;
  icon: LucideIcon;
};

// Placeholder for Grow View
export const DataSourceHealthCheck = () => {
  const [dataSources, setDataSources] = useState<DataSourceStatus[]>([
    { name: 'CRM Connection', status: 'connected' },
    { name: 'Analytics Platform', status: 'pending' },
    { name: 'ERP System', status: 'connected' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDataSourceHealth = async () => {
      // Skip if no user authenticated
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/client/data-sources', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data source health: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.dataSources) {
          setDataSources(data.dataSources);
        } else {
          // If no data or server returned an error message, keep using mock data
          console.warn('Using mock data for data sources');
        }
      } catch (err) {
        setError('Unable to load data source health');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDataSourceHealth();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Check className="h-4 w-4 mr-2 text-green-500" />;
      case 'pending':
        return <CircleAlert className="h-4 w-4 mr-2 text-amber-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 mr-2 text-red-500" />;
      default:
        return <CircleAlert className="h-4 w-4 mr-2 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="ml-1 font-medium text-green-700">Connected</span>;
      case 'pending':
        return <span className="ml-1 font-medium text-amber-700">Pending Setup</span>;
      case 'failed':
        return <span className="ml-1 font-medium text-red-700">Connection Failed</span>;
      default:
        return <span className="ml-1 font-medium text-gray-700">Unknown</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Database className="h-5 w-5 mr-2 text-blue-600" /> Data Source Health
        </h2>
        {loading && <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />}
      </div>
      {error ? (
        <div className="text-sm text-red-600 py-2">{error}</div>
      ) : (
        <div className="space-y-3 text-sm">
          {dataSources.map((source, index) => (
            <div key={index} className="flex items-center">
              {getStatusIcon(source.status)}
              {source.name}: {getStatusText(source.status)}
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-3">Ensuring data sources are ready for AI integration.</p>
    </div>
  );
};

export const OpportunityTeaser = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    { id: "opp1", description: "Enhance customer support responsiveness.", impact: "high" },
    { id: "opp2", description: "Automate repetitive data entry tasks.", impact: "medium" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOpportunities = async () => {
      // Skip if no user authenticated
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/client/opportunities', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch opportunities: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.opportunities) {
          setOpportunities(data.opportunities);
        } else {
          // If no data or server returned an error message, keep using mock data
          console.warn('Using mock data for opportunities');
        }
      } catch (err) {
        setError('Unable to load opportunities');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOpportunities();
  }, [user]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-blue-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-600" /> Potential AI Opportunities
        </h2>
        {loading && <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />}
      </div>
      {error ? (
        <div className="text-sm text-red-600 py-2">{error}</div>
      ) : (
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {opportunities.map((opportunity) => (
            <li key={opportunity.id} className={getImpactColor(opportunity.impact)}>
              {opportunity.description}
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-500 mt-3">Based on preliminary analysis. Schedule consultation for details.</p>
    </div>
  );
};

// Savings Estimator Component
export function SavingsEstimator({ usedMockData }: ComponentProps) {
  const { useMockData } = useDevelopment();
  const [savings, setSavings] = useState<Saving[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProjectedSavings, setTotalProjectedSavings] = useState(0);

  useEffect(() => {
    const fetchSavings = async () => {
      setLoading(true);
      try {
        // Check if we should use mock data
        if (useMockData) {
          // Mock data delay
          await new Promise((resolve) => setTimeout(resolve, 800));
          
          const mockSavings: Saving[] = [
            {
              category: 'Labor Hours',
              amount: 240,
              percentChange: 15,
              trend: 'down',
              timeframe: 'Monthly',
              icon: Clock
            },
            {
              category: 'Process Costs',
              amount: 18500,
              percentChange: 22,
              trend: 'down',
              timeframe: 'Quarterly',
              icon: DollarSign
            },
            {
              category: 'Error Reduction',
              amount: 85,
              percentChange: 35,
              trend: 'down',
              timeframe: 'Quarterly',
              icon: AlertCircle
            }
          ];
          
          setSavings(mockSavings);
          setTotalProjectedSavings(235000);
        } else {
          // Real API call would go here
          const response = await fetch('/api/client/savings');
          if (!response.ok) {
            throw new Error('Failed to fetch savings data');
          }
          const data = await response.json();
          setSavings(data.savings);
          setTotalProjectedSavings(data.totalProjected);
        }
      } catch (err) {
        console.error('Error fetching savings data:', err);
        setError('Unable to load savings data. Please try again later.');
        // Fallback to mock data in case of error
        const mockSavings: Saving[] = [
          {
            category: 'Labor Hours',
            amount: 240,
            percentChange: 15,
            trend: 'down',
            timeframe: 'Monthly',
            icon: Clock
          },
          {
            category: 'Process Costs',
            amount: 18500,
            percentChange: 22,
            trend: 'down',
            timeframe: 'Quarterly',
            icon: DollarSign
          }
        ];
        
        setSavings(mockSavings);
        setTotalProjectedSavings(235000);
      } finally {
        setLoading(false);
      }
    };

    fetchSavings();
  }, [useMockData]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading savings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
          Savings Estimator
        </h2>
        {usedMockData && (
          <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">
            Preview Data
          </span>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-700">Annual Projected Savings</h3>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-purple-700">${(totalProjectedSavings).toLocaleString()}</span>
          <span className="ml-2 text-sm text-gray-500">USD</span>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          Based on current automation implementation plan
        </div>
      </div>

      <div className="space-y-4">
        {savings.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="border-t pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Icon className="h-4 w-4 text-purple-500 mr-2" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{item.category}</span>
                    <p className="text-xs text-gray-500">{item.timeframe}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    {item.category === 'Labor Hours' ? (
                      <span className="text-sm font-medium text-gray-900">{item.amount} hrs</span>
                    ) : item.category === 'Error Reduction' ? (
                      <span className="text-sm font-medium text-gray-900">{item.amount}%</span>
                    ) : (
                      <span className="text-sm font-medium text-gray-900">${item.amount.toLocaleString()}</span>
                    )}
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      {item.percentChange}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- AutomationPotential Component ---
export function AutomationPotential({ usedMockData }: ComponentProps) {
  const { useMockData } = useDevelopment();
  const [potentialData, setPotentialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPotentialData = async () => {
      setLoading(true);
      try {
        // Check if we should use mock data
        if (useMockData) {
          // Mock data delay
          await new Promise((resolve) => setTimeout(resolve, 800));
          
          const mockPotentialData = {
            overallPotential: 75,
            processAreas: [
              { name: "Invoice Processing", automationScore: 92, priority: "High", estimatedSavings: 35000 },
              { name: "Customer Onboarding", automationScore: 78, priority: "Medium", estimatedSavings: 28000 },
              { name: "Inventory Management", automationScore: 85, priority: "High", estimatedSavings: 42000 },
              { name: "Employee Onboarding", automationScore: 65, priority: "Low", estimatedSavings: 18000 },
              { name: "Data Entry", automationScore: 95, priority: "High", estimatedSavings: 32000 }
            ]
          };
          
          setPotentialData(mockPotentialData);
        } else {
          // Real API call would go here
          const response = await fetch('/api/client/automation-potential');
          if (!response.ok) {
            throw new Error('Failed to fetch automation potential data');
          }
          const data = await response.json();
          setPotentialData(data);
        }
      } catch (err) {
        console.error('Error fetching automation potential data:', err);
        setError('Unable to load automation potential data. Please try again later.');
        // Fallback to mock data in case of error
        const fallbackPotentialData = {
          overallPotential: 75,
          processAreas: [
            { name: "Invoice Processing", automationScore: 92, priority: "High", estimatedSavings: 35000 },
            { name: "Customer Onboarding", automationScore: 78, priority: "Medium", estimatedSavings: 28000 }
          ]
        };
        
        setPotentialData(fallbackPotentialData);
      } finally {
        setLoading(false);
      }
    };

    fetchPotentialData();
  }, [useMockData]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading automation potential data...</p>
        </div>
      </div>
    );
  }

  if (!potentialData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full">
        <div className="text-center text-gray-500">
          <AlertCircle className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          <p>No automation potential data available</p>
        </div>
      </div>
    );
  }

  // Helper function to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    return "bg-yellow-500";
  };

  // Helper function to determine priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return "bg-red-100 text-red-800";
      case 'medium':
        return "bg-yellow-100 text-yellow-800";
      case 'low':
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
          Automation Potential
        </h2>
        {usedMockData && (
          <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">
            Preview Data
          </span>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium text-gray-700">Overall Automation Potential</h3>
          <span className="text-md font-semibold text-purple-700">{potentialData.overallPotential}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-purple-600 h-3 rounded-full" 
            style={{ width: `${potentialData.overallPotential}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Based on process complexity, repetitiveness, and rule-based nature
        </p>
      </div>

      <h3 className="text-md font-medium text-gray-900 mb-4">Recommended Process Areas</h3>
      <div className="space-y-4">
        {potentialData.processAreas.map((area: any, index: number) => (
          <div key={index} className="border border-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-900">{area.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(area.priority)}`}>
                {area.priority} Priority
              </span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Automation Score</span>
              <span className="text-xs font-medium text-gray-700">{area.automationScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full ${getScoreColor(area.automationScore)}`} 
                style={{ width: `${area.automationScore}%` }}
              ></div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">Est. Annual Savings:</span>
              <span className="text-sm font-medium text-green-600 ml-1">${area.estimatedSavings.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Placeholder for Sell View
export const MAReadinessScorecard = () => (
   <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
     <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
       <Building className="h-5 w-5 mr-2 text-cyan-600" /> M&A Readiness Score
     </h2>
      <div className="text-center">
         <p className="text-5xl font-bold text-cyan-700 mb-1">B+</p>
         <p className="text-sm text-gray-500">Illustrative score based on current AI maturity & documentation.</p>
      </div>
   </div>
);

export const AIDocumentationChecklist = () => (
   <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-shadow hover:shadow-xl">
     <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
       <ClipboardCheck className="h-5 w-5 mr-2 text-rose-600" /> AI Documentation Status
     </h2>
     <ul className="space-y-2 text-sm">
       <li className="flex items-center text-gray-700"><Check className="h-4 w-4 mr-2 text-green-500"/> Model Performance Reports</li>
       <li className="flex items-center text-gray-700"><CircleAlert className="h-4 w-4 mr-2 text-amber-500"/> Process Integration Maps</li>
       <li className="flex items-center text-gray-700"><Check className="h-4 w-4 mr-2 text-green-500"/> Data Governance Policy</li>
     </ul>
   </div>
);

// --- ImplementationRoadmap Component ---
export function ImplementationRoadmap({ usedMockData }: ComponentProps) {
  const { useMockData } = useDevelopment();
  const [phases, setPhases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmapData = async () => {
      setLoading(true);
      try {
        // Check if we should use mock data
        if (useMockData) {
          // Mock data delay
          await new Promise((resolve) => setTimeout(resolve, 800));
          
          const mockPhases = [
            {
              name: "Discovery & Assessment",
              complete: true,
              percentComplete: 100,
              tasks: [
                { name: "Initial Assessment", complete: true, description: "Evaluate current automation processes and pain points" },
                { name: "Stakeholder Interviews", complete: true, description: "Gather requirements from key stakeholders" },
                { name: "Technical Audit", complete: true, description: "Review existing systems and technical infrastructure" }
              ]
            },
            {
              name: "Planning & Design",
              complete: false,
              percentComplete: 75,
              tasks: [
                { name: "Solution Architecture", complete: true, description: "Design high-level solution architecture" },
                { name: "Automation Workflow", complete: true, description: "Map out detailed automation workflows" },
                { name: "Resource Planning", complete: false, description: "Allocate resources and create implementation timeline" }
              ]
            },
            {
              name: "Implementation",
              complete: false,
              percentComplete: 10,
              tasks: [
                { name: "Development", complete: false, description: "Build automation solutions based on approved design" },
                { name: "Testing", complete: false, description: "Perform QA and integration testing" },
                { name: "Deployment", complete: false, description: "Deploy automation solutions to production" },
                { name: "Training", complete: false, description: "Train users on new automation capabilities" }
              ]
            }
          ];
          
          setPhases(mockPhases);
        } else {
          // Real API call would go here
          const response = await fetch('/api/client/implementation-roadmap');
          if (!response.ok) {
            throw new Error('Failed to fetch roadmap data');
          }
          const data = await response.json();
          setPhases(data.phases);
        }
      } catch (err) {
        console.error('Error fetching roadmap data:', err);
        setError('Unable to load roadmap data. Please try again later.');
        // Fallback to mock data in case of error
        const fallbackPhases = [
          {
            name: "Discovery & Assessment",
            complete: true,
            percentComplete: 100,
            tasks: [
              { name: "Initial Assessment", complete: true, description: "Evaluate current automation processes" },
              { name: "Stakeholder Interviews", complete: true, description: "Gather requirements" }
            ]
          },
          {
            name: "Planning & Design",
            complete: false,
            percentComplete: 50,
            tasks: [
              { name: "Solution Architecture", complete: true, description: "Design solution architecture" },
              { name: "Automation Workflow", complete: false, description: "Map out workflows" }
            ]
          }
        ];
        
        setPhases(fallbackPhases);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapData();
  }, [useMockData]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading roadmap data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-purple-600" />
          Implementation Roadmap
        </h2>
        {usedMockData && (
          <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">
            Preview Data
          </span>
        )}
      </div>

      <div className="space-y-6">
        {phases.map((phase, phaseIndex) => (
          <div key={phaseIndex} className="relative">
            <div className="flex items-center mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                phase.complete ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
              }`}>
                {phase.complete ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{phaseIndex + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-md font-semibold text-gray-900">{phase.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        phase.complete ? 'bg-green-500' : 'bg-purple-600'
                      }`}
                      style={{ width: `${phase.percentComplete}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-500">{phase.percentComplete}%</span>
                </div>
              </div>
            </div>
            
            <div className="ml-4 pl-8 border-l border-gray-200 space-y-3">
              {phase.tasks.map((task: any, taskIndex: number) => (
                <div key={taskIndex} className="relative">
                  <div className="flex items-start">
                    <div className={`absolute -left-10 mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                      task.complete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {task.complete ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        task.complete ? 'text-gray-700' : 'text-gray-600'
                      }`}>
                        {task.name}
                      </p>
                      <p className="text-xs text-gray-500">{task.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- ROICalculator Component ---
export function ROICalculator({ usedMockData }: ComponentProps) {
  const { useMockData } = useDevelopment();
  const [roiData, setRoiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoiData = async () => {
      setLoading(true);
      try {
        // Check if we should use mock data
        if (useMockData) {
          // Mock data delay
          await new Promise((resolve) => setTimeout(resolve, 800));
          
          const mockRoiData = {
            implementationCost: 120000,
            annualSavings: 275000,
            paybackPeriod: 5.2,
            fiveYearRoi: 560,
            breakdownItems: [
              { category: "Labor Cost Reduction", amount: 150000, percentage: 55 },
              { category: "Error Prevention", amount: 75000, percentage: 27 },
              { category: "Process Efficiency", amount: 35000, percentage: 13 },
              { category: "Compliance Improvement", amount: 15000, percentage: 5 }
            ]
          };
          
          setRoiData(mockRoiData);
        } else {
          // Real API call would go here
          const response = await fetch('/api/client/roi-calculation');
          if (!response.ok) {
            throw new Error('Failed to fetch ROI data');
          }
          const data = await response.json();
          setRoiData(data);
        }
      } catch (err) {
        console.error('Error fetching ROI data:', err);
        setError('Unable to load ROI data. Please try again later.');
        // Fallback to mock data in case of error
        const fallbackRoiData = {
          implementationCost: 120000,
          annualSavings: 275000,
          paybackPeriod: 5.2,
          fiveYearRoi: 560,
          breakdownItems: [
            { category: "Labor Cost Reduction", amount: 150000, percentage: 55 },
            { category: "Error Prevention", amount: 75000, percentage: 27 }
          ]
        };
        
        setRoiData(fallbackRoiData);
      } finally {
        setLoading(false);
      }
    };

    fetchRoiData();
  }, [useMockData]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading ROI data...</p>
        </div>
      </div>
    );
  }

  if (!roiData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full">
        <div className="text-center text-gray-500">
          <AlertCircle className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          <p>No ROI data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
          ROI Calculator
        </h2>
        {usedMockData && (
          <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">
            Preview Data
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Implementation Cost</p>
          <p className="text-2xl font-bold text-gray-900">${roiData.implementationCost.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Annual Savings</p>
          <p className="text-2xl font-bold text-green-600">${roiData.annualSavings.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Payback Period</p>
          <p className="text-2xl font-bold text-gray-900">{roiData.paybackPeriod} months</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 mb-1">5-Year ROI</p>
          <p className="text-2xl font-bold text-purple-700">{roiData.fiveYearRoi}%</p>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Breakdown</h3>
      <div className="space-y-4">
        {roiData.breakdownItems.map((item: any, index: number) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{item.category}</span>
              <span className="text-sm font-medium text-gray-900">${item.amount.toLocaleString()} ({item.percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- ProgressTracker Component ---
export function ProgressTracker({ usedMockData }: ComponentProps) {
  const { useMockData } = useDevelopment();
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      setLoading(true);
      try {
        // Check if we should use mock data
        if (useMockData) {
          // Mock data delay
          await new Promise((resolve) => setTimeout(resolve, 800));
          
          const mockProgressData = {
            overallProgress: 42,
            lastUpdated: new Date().toISOString(),
            milestones: [
              { 
                name: "Workflow Analysis", 
                status: "completed", 
                date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                notes: "Completed comprehensive analysis of existing workflows"
              },
              { 
                name: "Tool Selection", 
                status: "completed", 
                date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                notes: "Selected automation tools based on requirements"
              },
              { 
                name: "Proof of Concept", 
                status: "in-progress", 
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                notes: "Building initial prototype for key workflows"
              },
              { 
                name: "User Acceptance Testing", 
                status: "planned", 
                date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                notes: "Scheduled for next month"
              },
              { 
                name: "Full Deployment", 
                status: "planned", 
                date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                notes: "Target date may be adjusted based on UAT results"
              }
            ],
            recentUpdates: [
              {
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                message: "Completed initial automation scripts for invoice processing"
              },
              {
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                message: "Integration with CRM system successfully tested"
              },
              {
                date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                message: "Updated project timeline based on new requirements"
              }
            ]
          };
          
          setProgressData(mockProgressData);
        } else {
          // Real API call would go here
          const response = await fetch('/api/client/progress-tracker');
          if (!response.ok) {
            throw new Error('Failed to fetch progress data');
          }
          const data = await response.json();
          setProgressData(data);
        }
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Unable to load progress data. Please try again later.');
        // Fallback to mock data in case of error
        const fallbackProgressData = {
          overallProgress: 42,
          lastUpdated: new Date().toISOString(),
          milestones: [
            { 
              name: "Workflow Analysis", 
              status: "completed", 
              date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
              notes: "Completed analysis of workflows"
            },
            { 
              name: "Tool Selection", 
              status: "in-progress", 
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              notes: "Evaluating options"
            }
          ],
          recentUpdates: [
            {
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              message: "Completed initial automation scripts"
            }
          ]
        };
        
        setProgressData(fallbackProgressData);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [useMockData]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full">
        <div className="text-center text-gray-500">
          <AlertCircle className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          <p>No progress data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
          Implementation Progress
        </h2>
        {usedMockData && (
          <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">
            Preview Data
          </span>
        )}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium text-gray-700">Overall Progress</h3>
          <span className="text-md font-semibold text-purple-700">{progressData.overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-purple-600 h-3 rounded-full" 
            style={{ width: `${progressData.overallProgress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Last updated: {new Date(progressData.lastUpdated).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">Milestones</h3>
          <div className="space-y-4">
            {progressData.milestones.map((milestone: any, index: number) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4 relative">
                <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-0 ${
                  milestone.status === 'completed' ? 'bg-green-500' :
                  milestone.status === 'in-progress' ? 'bg-blue-500' :
                  'bg-gray-300'
                }`}></div>
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{milestone.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                    milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(milestone.date).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-600 mt-1">{milestone.notes}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">Recent Updates</h3>
          <div className="space-y-4">
            {progressData.recentUpdates.map((update: any, index: number) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{update.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(update.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 