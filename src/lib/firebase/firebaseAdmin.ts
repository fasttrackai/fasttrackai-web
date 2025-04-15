import { adminAuth, adminDb } from './firebase-admin';

/**
 * Returns initialized Firebase Admin SDK instances
 */
export function getFirebaseAdmin() {
  return {
    auth: adminAuth,
    db: adminDb
  };
} 