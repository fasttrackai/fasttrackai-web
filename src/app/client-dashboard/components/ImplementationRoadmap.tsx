'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';

interface Phase {
  id: string;
  name: string;
  description: string;
  completion: number;
  tasks: {
    id: string;
    name: string;
    description: string;
    status: 'completed' | 'in-progress' | 'pending';
    estimatedTime: string;
    dependencies: string[];
  }[];
}

// Mock implementation progress data for development
const mockImplementationProgress = {
  phases: [
    {
      id: "phase-1",
      name: "Discovery & Assessment",
      description: "Initial assessment of AI readiness and opportunity identification",
      completion: 100,
      tasks: [
        {
          id: "task-1-1",
          name: "Business Process Analysis",
          description: "Analyze current business processes to identify automation opportunities",
          status: "completed" as const,
          estimatedTime: "2 weeks",
          dependencies: []
        },
        {
          id: "task-1-2",
          name: "Data Readiness Assessment",
          description: "Evaluate data quality, accessibility, and governance",
          status: "completed" as const,
          estimatedTime: "1 week",
          dependencies: ["task-1-1"]
        },
        {
          id: "task-1-3",
          name: "Opportunity Prioritization",
          description: "Rank AI implementation opportunities by ROI and feasibility",
          status: "completed" as const,
          estimatedTime: "3 days",
          dependencies: ["task-1-1", "task-1-2"]
        }
      ]
    },
    {
      id: "phase-2",
      name: "Planning & Design",
      description: "Detailed planning and solution architecture",
      completion: 75,
      tasks: [
        {
          id: "task-2-1",
          name: "Solution Architecture",
          description: "Design technical architecture for AI implementations",
          status: "completed" as const,
          estimatedTime: "2 weeks",
          dependencies: ["task-1-3"]
        },
        {
          id: "task-2-2",
          name: "Data Pipeline Design",
          description: "Design data flows and integration points",
          status: "in-progress" as const,
          estimatedTime: "1 week",
          dependencies: ["task-2-1"]
        },
        {
          id: "task-2-3",
          name: "Implementation Roadmap",
          description: "Create detailed implementation timeline and resource plan",
          status: "pending" as const,
          estimatedTime: "1 week",
          dependencies: ["task-2-1", "task-2-2"]
        }
      ]
    },
    {
      id: "phase-3",
      name: "Implementation",
      description: "Development and deployment of AI solutions",
      completion: 10,
      tasks: [
        {
          id: "task-3-1",
          name: "Data Infrastructure Setup",
          description: "Set up data warehousing and processing infrastructure",
          status: "in-progress" as const,
          estimatedTime: "3 weeks",
          dependencies: ["task-2-2"]
        },
        {
          id: "task-3-2",
          name: "AI Model Development",
          description: "Develop and train AI models",
          status: "pending" as const,
          estimatedTime: "4 weeks",
          dependencies: ["task-3-1"]
        }
      ]
    }
  ]
};

export default function ImplementationRoadmap() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Set a timeout to ensure we don't get stuck in loading state
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout reached, using mock data");
        setPhases(mockImplementationProgress.phases);
        setIsLoading(false);
      }
    }, 2000); // 2 seconds timeout

    async function fetchRoadmapData() {
      try {
        // For development, always use mock data
        console.log("Using mock implementation data for development");
        setPhases(mockImplementationProgress.phases);
        setIsLoading(false);
        return;

        // The code below is commented out for development
        // In production, uncomment this code to fetch real data
        /*
        // Try to get real data if user is authenticated
        if (user) {
          try {
            const token = await user.getIdToken();
            const response = await fetch('/api/client/dashboard', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (!response.ok) {
              throw new Error('Failed to fetch roadmap data');
            }

            const result = await response.json();
            
            if (!result.success) {
              throw new Error(result.error || 'Failed to fetch roadmap data');
            }

            setPhases(result.data.implementationProgress.phases);
          } catch (err) {
            console.warn("API call failed, using mock data:", err);
            // Fallback to mock data if API call fails
            setPhases(mockImplementationProgress.phases);
          }
        } else {
          // No user, use mock data
          setPhases(mockImplementationProgress.phases);
        }
        */
      } catch (err) {
        console.error("Error in fetchRoadmapData:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Still use mock data even if there's an error
        setPhases(mockImplementationProgress.phases);
      } finally {
        setIsLoading(false);
      }
    }

    // Always fetch data immediately, don't wait for auth
    fetchRoadmapData();

    return () => clearTimeout(timeoutId);
  }, []); // Remove user and authLoading dependencies

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-300 rounded"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && phases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-purple-700 hover:text-purple-800 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Implementation Roadmap</h2>
      <div className="space-y-8">
        {phases.map((phase, phaseIndex) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: phaseIndex * 0.1 }}
            className="relative bg-gray-50 p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-center mb-4">
              {getStatusIcon(phase.completion === 100 ? 'completed' : phase.completion > 0 ? 'in-progress' : 'pending')}
              <h3 className="ml-2 text-lg font-medium text-gray-900">{phase.name}</h3>
              <span className={`ml-auto px-3 py-1 text-xs font-medium rounded-full ${
                getStatusColor(phase.completion === 100 ? 'completed' : phase.completion > 0 ? 'in-progress' : 'pending')
              }`}>
                {phase.completion}% Complete
              </span>
            </div>
            <p className="text-gray-600 mb-4">{phase.description}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className={`h-2.5 rounded-full ${phase.completion === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
                style={{ width: `${phase.completion}%` }}
              ></div>
            </div>
            <div className="ml-6 border-l-2 border-gray-200 pl-6 space-y-4">
              {phase.tasks.map((task, taskIndex) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (phaseIndex * 0.1) + (taskIndex * 0.05) }}
                  className="relative"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <h4 className="text-base font-medium text-gray-900">{task.name}</h4>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor(task.status)}`}>
                          {task.status === 'completed' ? 'Completed' : task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                      <div className="mt-1 text-xs text-gray-500">
                        Estimated time: {task.estimatedTime}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 