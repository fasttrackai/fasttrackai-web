'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, CheckCircle, Clock, BarChart, Award, BookOpen, Users, Play, Lock, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  getTrainingPaths,
  getTrainingPathWithModules,
  getUserProgress,
  TrainingPath,
  TrainingModule,
  UserProgress,
  getPathProgress,
} from '@/lib/firebase/trainingUtils';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

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

interface TrainingPathWithModules extends Omit<TrainingPath, 'modules'> {
  modules: TrainingModule[];
}

export default function TrainingPortal() {
  const router = useRouter();
  // Safely handle potentially undefined auth values
  const { user, loading: authLoading } = useAuth() || { user: null, loading: true };
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [paths, setPaths] = useState<TrainingPath[]>([]);
  const [selectedPathData, setSelectedPathData] = useState<TrainingPathWithModules | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const paths = await getTrainingPaths();
        setPaths(paths || []);
        
        if (user?.uid) {
          try {
            const progress = await getUserProgress(user.uid);
            setUserProgress(progress);
          } catch (progressErr) {
            console.error('Error fetching user progress:', progressErr);
            // Don't set error here, just log it
          }
        }
      } catch (err) {
        console.error('Error fetching training data:', err);
        setError('Failed to load training content. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchData();
    }
  }, [user?.uid, authLoading]);

  // Fetch selected path details
  useEffect(() => {
    const fetchPathDetails = async () => {
      if (!selectedPath) {
        setSelectedPathData(null);
        return;
      }

      try {
        setLoading(true);
        const pathData = await getTrainingPathWithModules(selectedPath);
        setSelectedPathData(pathData as TrainingPathWithModules);
      } catch (err) {
        console.error('Error fetching path details:', err);
        setError('Failed to load training path details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPathDetails();
  }, [selectedPath]);

  const calculatePathProgress = (pathId: string): number => {
    if (!userProgress) return 0;
    if (!userProgress.completedModules) return 0;
    
    const path = paths.find(p => p.id === pathId);
    if (!path || !path.modules || !path.modules.length) return 0;

    const completedCount = path.modules.filter(moduleId => 
      userProgress.completedModules[moduleId] && 
      userProgress.completedModules[moduleId].completed
    ).length;

    return Math.round((completedCount / path.modules.length) * 100);
  };

  const isModuleCompleted = (moduleId: string): boolean => {
    if (!userProgress) return false;
    if (!userProgress.completedModules) return false;
    return userProgress.completedModules[moduleId]?.completed || false;
  };

  if (authLoading) {
    return (
      <main className="min-h-screen gradient-primary">
        <div className="container mx-auto py-16 px-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-white" />
            <p className="mt-4 text-xl text-white">Loading authentication...</p>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen gradient-primary">
        <div className="container mx-auto py-16 px-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-white" />
            <p className="mt-4 text-xl text-white">Loading training content...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen gradient-primary">
        <div className="container mx-auto py-16 px-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <AlertTriangle className="h-16 w-16 text-amber-400 mb-4" />
            <h1 className="heading-2 text-white mb-4">Error</h1>
            <p className="body-large text-white opacity-90 mb-4">
              {error}
            </p>
            <div className="max-w-2xl mx-auto bg-purple-800/30 rounded-lg p-6 mt-6">
              <p className="text-white/80">
                This could be due to missing Firebase configuration. Please make sure your .env.local file is properly set up.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen gradient-primary">
      {/* Hero Section */}
      <motion.section 
        className="py-20"
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
            Training Portal
          </motion.h1>
          <motion.p 
            className="body-large max-w-2xl mx-auto text-white"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            Welcome to your personalized AI training journey
          </motion.p>
        </div>
      </motion.section>

      {/* Content Section */}
      <section className="py-16 gradient-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {!user ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card text-center py-12 p-8"
              >
                <h2 className="heading-3 mb-4 text-gray-900">Please Sign In</h2>
                <p className="text-gray-600 mb-6">
                  You need to be signed in to access the training portal and track your progress.
                </p>
                <motion.button 
                  onClick={() => router.push('/login')}
                  className="button-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </motion.div>
            ) : !Array.isArray(paths) || paths.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }} 
                className="card text-center py-12 p-8"
              >
                <h2 className="heading-3 mb-4 text-gray-900">No Training Paths Available</h2>
                <p className="text-gray-600">
                  There are no training paths available yet. Please check back later.
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paths.map((path) => (
                  <motion.div
                    key={path.id}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="card cursor-pointer overflow-hidden flex flex-col h-full"
                    onClick={() => router.push(`/training-portal/path/${path.id}`)}
                  >
                    <div className="aspect-video relative bg-gray-200 rounded-t-lg overflow-hidden">
                      {path.thumbnail ? (
                        <img
                          src={path.thumbnail}
                          alt={path.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-purple-100">
                          <GraduationCap className="h-16 w-16 text-purple-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="heading-3 mb-2 text-gray-900">{path.title}</h3>
                      <p className="text-gray-600 mb-4">{path.description}</p>
                      <div className="flex items-center mt-auto mb-2">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500">{path.duration || 'Self-paced'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                          {path.level || 'Beginner'}
                        </span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-700 rounded-full" 
                              style={{ width: `${calculatePathProgress(path.id)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{calculatePathProgress(path.id)}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
} 