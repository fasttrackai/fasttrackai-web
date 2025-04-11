import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { ServiceAccount } from 'firebase-admin/app';

// Helper to check if we're in a server context
const isServer = typeof window === 'undefined';

// Get Firebase credentials in the format expected by cert()
function getServiceAccount(): ServiceAccount | null {
  if (!isServer) {
    console.warn('Attempted to initialize Firebase Admin on client side');
    return null;
  }

  try {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    // Decode the private key correctly
    const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Missing Firebase Admin credentials (PROJECT_ID, CLIENT_EMAIL, or PRIVATE_KEY)');
      // Log which specific variables are missing
      !projectId && console.warn('- FIREBASE_ADMIN_PROJECT_ID is missing');
      !clientEmail && console.warn('- FIREBASE_ADMIN_CLIENT_EMAIL is missing');
      !privateKey && console.warn('- FIREBASE_ADMIN_PRIVATE_KEY is missing');
      return null;
    }

    // Return the essential ServiceAccount object
    return { 
        projectId: projectId, 
        clientEmail: clientEmail,
        privateKey: privateKey, 
    }; 
  } catch (error) {
    console.error('Error processing Firebase Admin credentials:', error);
    return null;
  }
}

// Initialize Firebase Admin
function initAdmin() {
  if (!isServer) return null;

  try {
    const apps = getApps();
    if (apps.length > 0) {
       console.log("Firebase Admin already initialized.");
      return apps[0];
    }

    const serviceAccount = getServiceAccount();
    if (!serviceAccount) {
       console.error("Could not retrieve valid service account credentials for Firebase Admin.");
       return null;
    }
    
    console.log("Initializing Firebase Admin with processed service account...");
    return initializeApp({
      credential: cert(serviceAccount), // Pass the simplified object
    });
  } catch (error) {
    console.error('Fatal Error initializing Firebase Admin:', error);
    // Log details ONLY if in development for security
    if (process.env.NODE_ENV === 'development') {
        const creds = getServiceAccount();
        console.error('Credentials used (check environment variables):', { 
            projectId: creds?.projectId,
            clientEmail: creds?.clientEmail,
            privateKeyExists: !!creds?.privateKey 
        });
    }
    return null;
  }
}

// Initialize the app
const app = initAdmin();

// Export the admin instances
export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app ? getFirestore(app) : null; 