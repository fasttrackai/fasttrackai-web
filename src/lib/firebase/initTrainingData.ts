import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { TrainingPath, TrainingModule } from './trainingUtils';

const sampleTrainingPaths: TrainingPath[] = [
  {
    id: 'ai-fundamentals',
    title: 'AI Fundamentals',
    description: 'Learn the basics of artificial intelligence and machine learning.',
    thumbnail: '/images/training/ai-fundamentals.jpg',
    modules: ['ai-intro', 'ml-basics', 'neural-networks'],
    level: 'beginner',
    category: 'AI & ML',
    duration: '3 hours'
  },
  {
    id: 'business-ai',
    title: 'AI for Business',
    description: 'Discover how to implement AI solutions in your business.',
    thumbnail: '/images/training/business-ai.jpg',
    modules: ['ai-strategy', 'implementation', 'roi-analysis'],
    prerequisites: ['ai-fundamentals'],
    level: 'intermediate',
    category: 'Business',
    duration: '4 hours'
  }
];

const sampleTrainingModules: TrainingModule[] = [
  {
    id: 'ai-intro',
    title: 'Introduction to AI',
    description: 'Understanding the basics of artificial intelligence.',
    duration: '1 hour',
    videoUrl: 'training/videos/ai-intro.mp4',
    content: `# Introduction to Artificial Intelligence

## What is AI?
Artificial Intelligence (AI) refers to systems or machines that mimic human intelligence...

## Key Concepts
1. Machine Learning
2. Neural Networks
3. Deep Learning

## Applications
- Business automation
- Data analysis
- Customer service
- And more...`,
    order: 1,
    pathId: 'ai-fundamentals',
    thumbnail: '/images/training/ai-intro.jpg',
    quiz: {
      questions: [
        {
          question: 'What is artificial intelligence?',
          options: [
            'A type of computer hardware',
            'Systems that mimic human intelligence',
            'A programming language',
            'A database system'
          ],
          correctAnswer: 1
        }
      ]
    }
  },
  {
    id: 'ml-basics',
    title: 'Machine Learning Basics',
    description: 'Learn the fundamentals of machine learning.',
    duration: '1 hour',
    videoUrl: 'training/videos/ml-basics.mp4',
    content: `# Machine Learning Fundamentals

## Types of Machine Learning
1. Supervised Learning
2. Unsupervised Learning
3. Reinforcement Learning

## Key Concepts
- Training Data
- Model Selection
- Evaluation Metrics`,
    order: 2,
    pathId: 'ai-fundamentals',
    thumbnail: '/images/training/ml-basics.jpg',
    quiz: {
      questions: [
        {
          question: 'What are the main types of machine learning?',
          options: [
            'Fast and Slow',
            'Big and Small',
            'Supervised, Unsupervised, and Reinforcement',
            'Simple and Complex'
          ],
          correctAnswer: 2
        }
      ]
    }
  }
];

export async function initializeTrainingData() {
  try {
    if (!db) {
      console.error('Firebase Firestore not initialized');
      return;
    }

    // Add training paths
    for (const path of sampleTrainingPaths) {
      await setDoc(doc(db, 'trainingPaths', path.id), path);
    }

    // Add training modules
    for (const module of sampleTrainingModules) {
      await setDoc(doc(db, 'trainingModules', module.id), module);
    }

    console.log('Training data initialized successfully');
  } catch (error) {
    console.error('Error initializing training data:', error);
  }
} 