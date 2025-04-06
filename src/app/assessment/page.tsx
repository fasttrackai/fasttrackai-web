'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, AlertCircle, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  category: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

const questions: Question[] = [
  {
    id: 'data_readiness',
    category: 'Data Infrastructure',
    question: 'How would you describe your organization\'s data collection and storage practices?',
    options: [
      { value: 'no_data', label: 'We don\'t collect much digital data', score: 1 },
      { value: 'basic', label: 'Basic digital records and spreadsheets', score: 2 },
      { value: 'structured', label: 'Structured databases and regular collection', score: 3 },
      { value: 'advanced', label: 'Advanced data warehouse with real-time collection', score: 4 }
    ]
  },
  {
    id: 'tech_stack',
    category: 'Technology Stack',
    question: 'What technology systems do you currently use?',
    options: [
      { value: 'minimal', label: 'Basic office software', score: 1 },
      { value: 'standard', label: 'Standard business software (CRM, accounting)', score: 2 },
      { value: 'integrated', label: 'Integrated systems with some automation', score: 3 },
      { value: 'advanced', label: 'Advanced systems with APIs and integrations', score: 4 }
    ]
  },
  {
    id: 'team_readiness',
    category: 'Team Readiness',
    question: 'How would you rate your team\'s technical capabilities?',
    options: [
      { value: 'basic', label: 'Basic computer skills', score: 1 },
      { value: 'intermediate', label: 'Comfortable with business software', score: 2 },
      { value: 'advanced', label: 'Some technical expertise', score: 3 },
      { value: 'expert', label: 'Strong technical team', score: 4 }
    ]
  },
  {
    id: 'business_needs',
    category: 'Business Needs',
    question: 'What are your primary motivations for implementing AI?',
    options: [
      { value: 'exploring', label: 'Exploring possibilities', score: 1 },
      { value: 'specific', label: 'Addressing specific challenges', score: 2 },
      { value: 'strategic', label: 'Strategic advantage', score: 3 },
      { value: 'transformation', label: 'Digital transformation', score: 4 }
    ]
  },
  {
    id: 'budget',
    category: 'Investment Readiness',
    question: 'What resources can you allocate to AI implementation?',
    options: [
      { value: 'minimal', label: 'Minimal budget', score: 1 },
      { value: 'moderate', label: 'Moderate investment possible', score: 2 },
      { value: 'significant', label: 'Significant budget allocated', score: 3 },
      { value: 'strategic', label: 'Strategic investment priority', score: 4 }
    ]
  }
];

export default function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const router = useRouter();

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    let total = 0;
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.value === answer);
      if (option) {
        total += option.score;
      }
    });
    return (total / (questions.length * 4)) * 100;
  };

  const getRecommendations = (score: number) => {
    if (score >= 75) {
      return {
        title: 'Advanced AI Ready',
        description: 'Your organization is well-positioned for advanced AI implementation.',
        nextSteps: [
          'Schedule a consultation to discuss advanced AI solutions',
          'Begin planning full-scale AI transformation',
          'Consider AI integration across multiple departments'
        ]
      };
    } else if (score >= 50) {
      return {
        title: 'AI Growth Ready',
        description: 'You have a good foundation for AI implementation with room for growth.',
        nextSteps: [
          'Identify key areas for initial AI implementation',
          'Develop a phased approach to AI adoption',
          'Begin with pilot projects in strongest areas'
        ]
      };
    } else {
      return {
        title: 'AI Foundation Building',
        description: 'Focus on building core capabilities before full AI implementation.',
        nextSteps: [
          'Strengthen data collection and management practices',
          'Invest in basic automation and digital transformation',
          'Develop team technical capabilities'
        ]
      };
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare the assessment data
      const score = calculateScore();
      const recommendations = getRecommendations(score);
      
      const assessmentData = {
        score,
        recommendations,
        answers,
        completedAt: new Date().toISOString(),
      };
      
      // Submit to the API
      const response = await fetch('/api/client/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save assessment');
      }
      
      const result = await response.json();
      
      // Store the assessment ID for future reference
      setAssessmentId(result.assessmentId);
      
      console.log('Assessment submitted successfully', result);
      
      // You could redirect to results or dashboard here
      // For now, we'll just show the results
      setShowResults(true);
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit assessment');
      // Still show results even if submission fails
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add header
      pdf.setFillColor(249, 250, 251); // Light gray background
      pdf.rect(0, 0, 210, 40, 'F');
      
      // Add title and date
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(147, 51, 234); // Purple
      pdf.setFontSize(20);
      pdf.text('AI Readiness Assessment Report', 30, 20);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(107, 114, 128); // Gray
      pdf.setFontSize(10);
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(`Generated on: ${currentDate}`, 30, 30);
      
      // Add decorative line
      pdf.setDrawColor(147, 51, 234); // Purple
      pdf.setLineWidth(0.5);
      pdf.line(10, 45, 200, 45);
      
      // Assessment Results
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Assessment Results', 10, 55);
      
      // Score
      const score = Math.round(calculateScore());
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(12);
      pdf.text(`Your AI Readiness Score: ${score}%`, 15, 65);
      
      // Score visualization
      pdf.setDrawColor(229, 231, 235); // Light gray
      pdf.setFillColor(229, 231, 235); // Light gray
      pdf.roundedRect(15, 70, 180, 10, 5, 5, 'F');
      
      pdf.setFillColor(147, 51, 234); // Purple
      pdf.roundedRect(15, 70, 180 * (score / 100), 10, 5, 5, 'F');
      
      // Recommendations
      const recommendations = getRecommendations(score);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Readiness Assessment', 10, 95);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(147, 51, 234); // Purple
      pdf.setFontSize(12);
      pdf.text(recommendations.title, 15, 105);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(10);
      const descriptionLines = pdf.splitTextToSize(recommendations.description, 180);
      pdf.text(descriptionLines, 15, 115);
      
      // Next Steps
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Recommended Next Steps', 10, 130);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(10);
      
      let yPosition = 140;
      recommendations.nextSteps.forEach((step, index) => {
        pdf.text(`${index + 1}. ${step}`, 15, yPosition);
        yPosition += 10;
      });
      
      // Detailed Assessment
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Detailed Assessment by Category', 10, yPosition + 10);
      
      yPosition += 20;
      
      // Add each question and answer
      questions.forEach((question, index) => {
        const answer = answers[question.id];
        const option = question.options.find(o => o.value === answer);
        
        if (!option) return;
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text(`${question.category}`, 15, yPosition);
        yPosition += 5;
        
        pdf.setFont('helvetica', 'normal');
        const questionLines = pdf.splitTextToSize(question.question, 180);
        pdf.text(questionLines, 15, yPosition);
        yPosition += questionLines.length * 5;
        
        pdf.setTextColor(147, 51, 234); // Purple
        pdf.text(`Your response: ${option.label}`, 15, yPosition);
        yPosition += 10;
        
        // Add a new page if we're running out of space
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
      });
      
      // Add footer
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(107, 114, 128); // Gray
      pdf.setFontSize(8);
      pdf.text('This assessment is provided by FastTrackAI to help organizations understand their AI readiness.', 15, 280);
      pdf.text('For a detailed consultation, please contact our team at contact@fasttrackai.com', 15, 285);
      
      // Save the PDF
      pdf.save('AI-Readiness-Assessment.pdf');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('There was an error generating your report. Please try again later.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (!showResults) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-900 to-black py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-2">
              <div 
                className="bg-purple-600 h-2 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-medium text-gray-500">
                  Question {currentQuestion + 1} of {questions.length}
                </h3>
                <span className="text-sm text-gray-500">
                  {questions[currentQuestion].category}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {questions[currentQuestion].question}
              </h2>
              
              <div className="space-y-4 mb-8">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(questions[currentQuestion].id, option.value)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      answers[questions[currentQuestion].id] === option.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex-shrink-0 ${
                        answers[questions[currentQuestion].id] === option.value
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300'
                      }`}>
                        {answers[questions[currentQuestion].id] === option.value && (
                          <Check className="w-3 h-3 text-white m-auto" />
                        )}
                      </div>
                      <span className="ml-3">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center text-gray-600 disabled:text-gray-300"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Previous
                </button>
                
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                    disabled={!answers[questions[currentQuestion].id]}
                    className="flex items-center text-purple-600 font-medium disabled:text-gray-300"
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={submitAssessment}
                    disabled={!answers[questions[currentQuestion].id] || isSubmitting}
                    className="flex items-center text-purple-600 font-medium disabled:text-gray-300"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Submitting</span>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5"
                        >
                          <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        Complete Assessment
                        <ChevronRight className="w-5 h-5 ml-1" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-black py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Your AI Readiness Assessment</h1>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadReport}
                disabled={isGeneratingReport}
                className="flex items-center text-purple-600 font-medium"
              >
                {isGeneratingReport ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </motion.div>
                    Generating...
                  </div>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download Report
                  </>
                )}
              </motion.button>
            </div>
            
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <p>{submitError}</p>
                </div>
                <p className="mt-2 text-sm">Don't worry, your assessment results are still available.</p>
              </div>
            )}
            
            {assessmentId && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <p>Assessment saved successfully!</p>
                </div>
                <p className="mt-2 text-sm">You can access this assessment in your dashboard later.</p>
              </div>
            )}
            
            {/* Rest of the results section */}
            {/* ... */}
          </div>
        </div>
      </div>
    </main>
  );
} 