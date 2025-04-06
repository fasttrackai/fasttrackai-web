'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { getTrainingPathWithModules, getUserProgress, checkPrerequisites, TrainingPath, TrainingModule, UserProgress } from '@/lib/firebase/trainingUtils';
import { Loader2, CheckCircle, Lock, ArrowLeft, Clock, BookOpen, BarChart } from 'lucide-react';
import { User } from 'firebase/auth';
import { useParams, useRouter } from 'next/navigation';

interface TrainingPathWithModules extends Omit<TrainingPath, 'modules'> {
  modules: TrainingModule[];
}

export default function TrainingPathPage() {
  const { user } = useAuth() || { user: null };
  const params = useParams();
  const router = useRouter();
  const pathId = params.id as string;
  
  const [pathData, setPathData] = useState<TrainingPathWithModules | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prerequisitesLocked, setPrerequisitesLocked] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        if (user?.uid) {
          // Check if prerequisites are met
          const prerequisitesMet = await checkPrerequisites(user.uid, pathId);
          setPrerequisitesLocked(!prerequisitesMet);
          
          if (!prerequisitesMet) {
            setError('You need to complete the prerequisite courses before accessing this path.');
            setLoading(false);
            return;
          }
        }
        
        const path = await getTrainingPathWithModules(pathId);
        setPathData(path);
        
        if (user?.uid) {
          try {
            const progress = await getUserProgress(user.uid);
            setUserProgress(progress);
          } catch (progressErr) {
            console.error('Error fetching user progress:', progressErr);
            // Don't set error for progress issues
          }
        }
      } catch (err) {
        console.error('Error fetching training path:', err);
        setError('Failed to load training path. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (pathId) {
      fetchData();
    }
  }, [pathId, user?.uid]);

  const isModuleCompleted = (moduleId: string): boolean => {
    if (!userProgress || !userProgress.completedModules) return false;
    return !!userProgress.completedModules[moduleId]?.completed;
  };

  const isModuleLocked = (module: TrainingModule, index: number): boolean => {
    if (index === 0) return false;
    if (!module.locked) return false;
    return !isModuleCompleted(pathData?.modules[index - 1].id || '');
  };

  const getPathProgress = (): number => {
    if (!pathData || !userProgress || !userProgress.completedModules) return 0;
    
    const totalModules = pathData.modules.length;
    if (totalModules === 0) return 0;
    
    const completedModules = pathData.modules.filter(m => isModuleCompleted(m.id)).length;
    
    return Math.round((completedModules / totalModules) * 100);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
        <div className="container mx-auto max-w-4xl py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-4xl font-bold mb-4">Please Sign In</h1>
            <p className="text-xl text-muted-foreground">
              You need to be signed in to access the training content.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
        <div className="container mx-auto max-w-4xl py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-xl text-muted-foreground">Loading training path...</p>
          </div>
        </div>
      </div>
    );
  }

  if (prerequisitesLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
        <div className="container mx-auto max-w-4xl py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Lock className="h-16 w-16 text-amber-500 mb-4" />
            <h1 className="text-4xl font-bold text-amber-500 mb-4">Prerequisites Required</h1>
            <p className="text-xl text-muted-foreground mb-4">
              You need to complete the prerequisite courses before accessing this path.
            </p>
            <button
              onClick={() => router.push('/training-portal')}
              className="mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium"
            >
              Go to Training Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pathData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
        <div className="container mx-auto max-w-4xl py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-xl text-muted-foreground">
              {error || 'Training path not found.'}
            </p>
            <button
              onClick={() => router.push('/training-portal')}
              className="mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
      <div className="container mx-auto max-w-4xl py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <button
            onClick={() => router.push('/training-portal')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Training Portal
          </button>

          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-video w-full relative">
              <img
                src={pathData.thumbnail}
                alt={pathData.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{pathData.title}</h1>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {pathData.duration}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {pathData.modules.length} Modules
                  </div>
                  <div className="px-2 py-1 rounded-full bg-primary/20 text-primary-foreground text-sm">
                    {pathData.level}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground mb-6">{pathData.description}</p>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{getPathProgress()}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${getPathProgress()}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Modules</h2>
          <div className="grid gap-6">
            {pathData.modules.map((module, index) => {
              const isCompleted = isModuleCompleted(module.id);
              const isLocked = isModuleLocked(module, index);

              return (
                <motion.div
                  key={module.id}
                  whileHover={!isLocked ? { scale: 1.01 } : undefined}
                  whileTap={!isLocked ? { scale: 0.99 } : undefined}
                  className={`bg-card rounded-lg shadow-md overflow-hidden ${
                    !isLocked ? 'cursor-pointer' : 'opacity-75'
                  }`}
                  onClick={() => {
                    if (!isLocked) {
                      router.push(`/training-portal/module/${module.id}`);
                    }
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-500'
                          : isLocked
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : isLocked ? (
                          <Lock className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {module.title}
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          {module.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {module.duration}
                          </div>
                          {module.quiz && (
                            <div className="flex items-center">
                              <BarChart className="h-4 w-4 mr-1" />
                              Quiz Included
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          isCompleted
                            ? 'bg-green-100 text-green-700'
                            : isLocked
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {isCompleted ? 'Completed' : isLocked ? 'Locked' : 'Start'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 