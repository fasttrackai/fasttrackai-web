import { auth, db, storage, database } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  ref as dbRef, 
  push as dbPush, 
  set as dbSet, 
  get as dbGet,
  update as dbUpdate,
  query as dbQuery,
  orderByChild,
  equalTo,
} from "firebase/database";

// Auth functions
export const logoutUser = () => {
  if (!auth) throw new Error('Firebase authentication not initialized');
  return signOut(auth);
};

export const signInWithGoogle = async () => {
  if (!auth) throw new Error('Firebase authentication not initialized');
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) => {
  if (!db) throw new Error('Firebase Firestore not initialized');
  return addDoc(collection(db, collectionName), data);
};

export const getDocuments = async (collectionName: string) => {
  if (!db) throw new Error('Firebase Firestore not initialized');
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) => {
  if (!db) throw new Error('Firebase Firestore not initialized');
  return updateDoc(doc(db, collectionName, id), data);
};

export const deleteDocument = (collectionName: string, id: string) => {
  if (!db) throw new Error('Firebase Firestore not initialized');
  return deleteDoc(doc(db, collectionName, id));
};

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  if (!storage) throw new Error('Firebase Storage not initialized');
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Realtime Database functions
export const saveLead = async (leadData: any) => {
  if (!database) throw new Error('Firebase Realtime Database not initialized');
  
  // Create a reference to the leads collection
  const leadsRef = dbRef(database, 'leads');
  
  // Push a new lead with auto-generated key
  const newLeadRef = dbPush(leadsRef);
  
  // Set the lead data
  await dbSet(newLeadRef, {
    ...leadData,
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  return newLeadRef.key;
};

export const getLeads = async (status?: string) => {
  if (!database) throw new Error('Firebase Realtime Database not initialized');
  
  let leadsQuery;
  if (status) {
    // Query leads by status
    leadsQuery = dbQuery(dbRef(database, 'leads'), orderByChild('status'), equalTo(status));
  } else {
    // Get all leads
    leadsQuery = dbRef(database, 'leads');
  }
  
  const snapshot = await dbGet(leadsQuery);
  const leads: any[] = [];
  
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      leads.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
  }
  
  return leads;
};

export const updateLeadStatus = async (leadId: string, status: string) => {
  if (!database) throw new Error('Firebase Realtime Database not initialized');
  
  const leadRef = dbRef(database, `leads/${leadId}`);
  
  return dbUpdate(leadRef, {
    status,
    updatedAt: new Date().toISOString()
  });
};
