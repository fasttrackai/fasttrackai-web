"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebase';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  // Add any additional user data fields
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user for development
const mockUser = {
  uid: 'mock-user-id',
  email: 'demo@example.com',
  displayName: 'Demo User',
  photoURL: null,
  emailVerified: true
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    
    if (process.env.NODE_ENV === 'development') {
      // For development, use mock user
      const timer = setTimeout(() => {
        setUser(mockUser as unknown as User);
        setUserData({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          photoURL: mockUser.photoURL
        });
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // For production, use real Firebase authentication
      if (!auth) {
        console.error('Firebase authentication not initialized');
        setLoading(false);
        return () => {};
      }
      
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        
        if (user) {
          if (!db) {
            console.error('Firebase database not initialized');
            setLoading(false);
            return;
          }
          
          const userDocRef = doc(db, 'users', user.uid);
          const userDataUnsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              setUserData({ ...doc.data(), uid: user.uid } as UserData);
            } else {
              setUserData({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
              });
            }
          });
          
          return () => userDataUnsubscribe();
        } else {
          setUserData(null);
        }
        
        setLoading(false);
      });
      
      return () => unsubscribe();
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (process.env.NODE_ENV === 'development') {
      // Mock sign in for development
      if (email === 'demo@example.com' && password === 'password123') {
        setUser(mockUser as unknown as User);
        setUserData({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName,
          photoURL: mockUser.photoURL
        });
        return;
      }
      throw new Error('Invalid email or password');
    }
    
    if (!auth) throw new Error('Firebase authentication not initialized');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    if (process.env.NODE_ENV === 'development') {
      // Mock sign up for development
      setUser(mockUser as unknown as User);
      setUserData({
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        photoURL: mockUser.photoURL
      });
      return;
    }
    
    if (!auth) throw new Error('Firebase authentication not initialized');
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (process.env.NODE_ENV === 'development') {
      // Mock sign out for development
      setUser(null);
      setUserData(null);
      return;
    }
    
    if (!auth) throw new Error('Firebase authentication not initialized');
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    if (process.env.NODE_ENV === 'development') {
      // Mock password reset for development
      console.log(`Password reset email sent to ${email}`);
      return;
    }
    
    if (!auth) throw new Error('Firebase authentication not initialized');
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, signUp, signOut, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
