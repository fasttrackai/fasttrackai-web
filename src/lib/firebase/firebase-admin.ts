import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Helper to check if we're in a server context
const isServer = typeof window === 'undefined';

function getServiceAccount(): ServiceAccount | null {
  if (!isServer) {
    console.warn('[AdminInit] Attempted on client side. Skipping.');
    return null;
  }
  console.log('[AdminInit] Attempting to get credentials on server...');

  try {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    // Log presence of variables BEFORE processing key
    console.log(`[AdminInit] Env Var Check: PROJECT_ID ${projectId ? 'FOUND' : 'MISSING'}`);
    console.log(`[AdminInit] Env Var Check: CLIENT_EMAIL ${clientEmail ? 'FOUND' : 'MISSING'}`);
    console.log(`[AdminInit] Env Var Check: PRIVATE_KEY ${privateKeyRaw ? 'FOUND (length: ' + privateKeyRaw.length + ')' : 'MISSING'}`);

    if (!projectId || !clientEmail || !privateKeyRaw) {
      console.error('[AdminInit] CRITICAL: One or more required Firebase Admin ENV VARS are missing!');
      return null;
    }

    // Decode the private key carefully
    const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
    console.log('[AdminInit] Private key processed (newlines replaced).');

    const serviceAccount: ServiceAccount = { 
        projectId: projectId, 
        clientEmail: clientEmail,
        privateKey: privateKey, 
    }; 
    console.log('[AdminInit] Service Account object created successfully.');
    return serviceAccount;

  } catch (error) {
    console.error('[AdminInit] Error processing Firebase Admin credentials:', error);
    return null;
  }
}

let adminApp: App | null = null;

function initializeFirebaseAdmin() {
  if (!isServer) return;
  if (adminApp) { // Check if already initialized
    // console.log("[AdminInit] Already initialized.");
    return adminApp;
  }

  console.log("[AdminInit] Starting initialization...");
  try {
    const apps = getApps();
    if (apps.length > 0) {
       console.log("[AdminInit] Found existing app instance.");
       adminApp = apps[0];
       return adminApp;
    }

    const serviceAccount = getServiceAccount();
    if (!serviceAccount) {
       console.error("[AdminInit] CRITICAL: Could not get valid service account object.");
       return null;
    }
    
    console.log("[AdminInit] Calling initializeApp()...");
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
    console.log("[AdminInit] SUCCESS: Firebase Admin initialized.");
    return adminApp;

  } catch (error) {
    console.error('[AdminInit] FATAL ERROR during initializeApp():', error);
    // Log details ONLY if in development for security
    if (process.env.NODE_ENV === 'development') {
        const creds = getServiceAccount();
        console.error('[AdminInit] Credentials Used:', { 
            projectId: creds?.projectId,
            clientEmail: creds?.clientEmail,
            privateKeyExists: !!creds?.privateKey 
        });
    }
    return null; // Return null on failure
  }
}

// Initialize on module load
initializeFirebaseAdmin(); 

// Export auth and db instances, handling potential null from failed init
let authInstance = null;
let dbInstance = null;

try {
    if (adminApp) {
        authInstance = getAuth(adminApp);
        dbInstance = getFirestore(adminApp);
        console.log('[AdminInit] Auth and DB instances obtained.');
    } else {
        console.error('[AdminInit] Cannot get Auth/DB instances because adminApp is null.');
    }
} catch (error) {
    console.error('[AdminInit] Error getting Auth/DB instances:', error);
}

export const adminAuth = authInstance;
export const adminDb = dbInstance; 