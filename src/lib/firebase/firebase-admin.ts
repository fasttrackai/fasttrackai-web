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
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Missing Firebase Admin credentials (ID, Email, or Key)');
      console.log('Project ID found:', !!projectId);
      console.log('Client Email found:', !!clientEmail);
      console.log('Private Key found:', !!privateKey);
      return null;
    }

    return { 
        type: "service_account",
        project_id: projectId, 
        private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
        private_key: privateKey, 
        client_email: clientEmail,
        client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${clientEmail.replace('@', '%40')}`
    };
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
       console.log("Firebase Admin already initialized.");
      return apps[0];
    }

    const serviceAccount = getCredentials();
    if (!serviceAccount) {
       console.error("Could not retrieve valid service account credentials for Firebase Admin.");
      return null;
    }
    
    console.log("Initializing Firebase Admin with retrieved credentials...");
    return initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    const creds = getCredentials();
    console.error('Credentials used (check environment variables):', { 
        projectId: creds?.project_id,
        clientEmail: creds?.client_email,
        privateKeyExists: !!creds?.private_key 
    });
    return null;
  }
}

// Initialize the app
const app = initAdmin();

// Export the admin instances
export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app ? getFirestore(app) : null; 