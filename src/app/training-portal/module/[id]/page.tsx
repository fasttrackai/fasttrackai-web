'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { getTrainingModule, updateUserProgress, TrainingModule, UserProgress } from '@/lib/firebase/trainingUtils';
import { Loader2, CheckCircle, ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { User } from 'firebase/auth';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function ModulePage() {
  const { user } = useAuth() || { user: null };
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id as string;
  
  const [moduleData, setModuleData] = useState<TrainingModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const module = await getTrainingModule(moduleId);
        setModuleData(module);
        
        if (module.quiz) {
          setQuizAnswers(new Array(module.quiz.questions.length).fill(-1));
        }
      } catch (err) {
        console.error('Error fetching module:', err);
        setError('Failed to load module content. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (moduleId) {
      fetchData();
    }
  }, [moduleId]);

  const handleQuizSubmit = async () => {
    if (!moduleData?.quiz || !user) return;

    const totalQuestions = moduleData.quiz.questions.length;
    const correctAnswers = quizAnswers.reduce((acc, answer, index) => {
      return acc + (answer === moduleData.quiz?.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 70) {
      try {
        await updateUserProgress(user.uid, moduleId, moduleData.pathId, score);
      } catch (err) {
        console.error('Error updating progress:', err);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
        <div className="container mx-auto max-w-4xl py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-4xl font-bold mb-4">Please Sign In</h1>
            <p className="text-xl text-muted-foreground">
              You need to be signed in to access the module content.
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
            <p className="mt-4 text-xl text-muted-foreground">Loading module content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !moduleData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
        <div className="container mx-auto max-w-4xl py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-xl text-muted-foreground">
              {error || 'Module not found.'}
            </p>
            <button
              onClick={() => router.back()}
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
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Path
          </button>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{moduleData.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mb-8">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {moduleData.duration}
              </div>
              {moduleData.quiz && (
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Includes Quiz
                </div>
              )}
            </div>
          </div>

          {moduleData.videoUrl && !videoError && (
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg">
              <video
                src={moduleData.videoUrl}
                controls
                className="w-full h-full"
                poster={moduleData.thumbnail}
                onError={() => setVideoError(true)}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {(videoError || !moduleData.videoUrl) && moduleData.thumbnail && (
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg relative">
              <img 
                src={moduleData.thumbnail} 
                alt={moduleData.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-white text-center px-4">
                  {videoError ? 'Video could not be loaded' : 'No video available for this module'}
                </p>
              </div>
            </div>
          )}

          <div className="bg-card rounded-lg p-6 shadow-md prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{moduleData.content}</ReactMarkdown>
          </div>

          {moduleData.quiz && (
            <div className="bg-card rounded-lg p-6 shadow-md space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Module Quiz</h2>
              
              {moduleData.quiz.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="space-y-4">
                  <p className="font-medium">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          quizAnswers[questionIndex] === optionIndex
                            ? 'bg-primary/10 border-primary'
                            : 'hover:bg-muted/50'
                        } ${
                          quizSubmitted
                            ? optionIndex === question.correctAnswer
                              ? 'bg-green-500/10 border-green-500'
                              : quizAnswers[questionIndex] === optionIndex
                              ? 'bg-red-500/10 border-red-500'
                              : ''
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          value={optionIndex}
                          checked={quizAnswers[questionIndex] === optionIndex}
                          onChange={() => {
                            if (!quizSubmitted) {
                              const newAnswers = [...quizAnswers];
                              newAnswers[questionIndex] = optionIndex;
                              setQuizAnswers(newAnswers);
                            }
                          }}
                          className="hidden"
                          disabled={quizSubmitted}
                        />
                        <span>{option}</span>
                        {quizSubmitted && optionIndex === question.correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={quizAnswers.includes(-1)}
                  className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              ) : (
                <div className="text-center py-4 bg-card border rounded-lg">
                  <p className="text-2xl font-semibold mb-2">
                    Your Score: {quizScore}%
                  </p>
                  {quizScore !== null && (
                    <p className="text-muted-foreground">
                      {quizScore >= 70 ? (
                        <span className="text-green-500 font-medium">
                          Congratulations! You've passed the quiz.
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          You need 70% to pass. Please try again.
                        </span>
                      )}
                    </p>
                  )}
                  {quizScore !== null && quizScore < 70 && (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizScore(null);
                        setQuizAnswers(new Array(moduleData.quiz!.questions.length).fill(-1));
                      }}
                      className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium"
                    >
                      Retry Quiz
                    </button>
                  )}
                  {quizScore !== null && quizScore >= 70 && (
                    <button
                      onClick={() => router.back()}
                      className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium"
                    >
                      Continue Learning
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 