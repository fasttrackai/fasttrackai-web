import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Get credentials from environment variables or use mock data
const getCredentials = () => {
  // Use real credentials from environment variables if available
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key comes as a string with escaped newlines,
      // so we need to replace them with actual newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }
  
  // Use mock credentials for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock Firebase Admin credentials for development');
    return {
      projectId: "mock-project-id",
      clientEmail: "mock-client@example.com",
      privateKey: "mock-private-key",
    };
  }
  
  // If no credentials are available, throw an error in production
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Firebase Admin credentials are missing in production environment');
  }
  
  // Default fallback for other environments
  return {
    projectId: "mock-project-id",
    clientEmail: "mock-client@example.com",
    privateKey: "mock-private-key",
  };
};

// Initialize Firebase Admin if not already initialized
function initAdmin() {
  if (!getApps().length) {
    try {
      initializeApp({
        credential: cert(getCredentials()),
      });
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      // In development, we can continue with limited functionality
      if (process.env.NODE_ENV !== 'development') {
        throw error;
      }
    }
  }
  return getApp();
}

const adminApp = initAdmin();
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp); 