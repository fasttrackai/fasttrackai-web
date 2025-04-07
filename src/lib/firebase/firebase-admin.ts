import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Helper to check if we're in a server context
const isServer = typeof window === 'undefined';

// Get Firebase credentials
function getCredentials() {
  if (!isServer) {
    console.warn('Attempted to initialize Firebase Admin on client side');
    return null;
  }

  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Missing Firebase Admin credentials');
      return null;
    }

    return { projectId, clientEmail, privateKey };
  } catch (error) {
    console.error('Error getting Firebase Admin credentials:', error);
    return null;
  }
}

// Initialize Firebase Admin
function initAdmin() {
  if (!isServer) {
    return null;
  }

  try {
    const apps = getApps();
    if (apps.length > 0) {
      return apps[0];
    }

    const credentials = getCredentials();
    if (!credentials) {
      return null;
    }

    return initializeApp({
      credential: cert(credentials),
      projectId: credentials.projectId,
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    return null;
  }
}

// Initialize the app
const app = initAdmin();

// Export the admin instances
export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app ? getFirestore(app) : null; 