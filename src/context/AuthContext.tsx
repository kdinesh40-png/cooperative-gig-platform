'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase';
import { UserRole } from '@/types/cooperative';
import { demoStore } from '@/lib/demo-store';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  cooperativeId: string;
  createdAt: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, pass: string, role: UserRole, fullName: string, phone: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    const firebaseAuth = getFirebaseAuth();
    if (!isFirebaseConfigured() || !firebaseAuth) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      setUser(fbUser);

      if (fbUser) {
        try {
          const db = getFirebaseDb();
          if (db) {
            const userDocRef = doc(db, 'users', fbUser.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
              const data = userSnap.data() as UserProfile;
              setProfile(data);
              demoStore.setRole(data.role);
            } else {
              // Create default profile document if missing
              const fallbackRole: UserRole = fbUser.email?.includes('worker') || fbUser.email?.includes('provider') ? 'provider' : 'customer';
              const newProfile: UserProfile = {
                uid: fbUser.uid,
                email: fbUser.email || '',
                fullName: fbUser.displayName || (fallbackRole === 'provider' ? 'Ramesh Kumar' : 'Priya Sharma'),
                phone: '+91 98765 43210',
                role: fallbackRole,
                cooperativeId: 'coop-delhi',
                createdAt: new Date().toISOString()
              };
              await setDoc(userDocRef, newProfile);
              setProfile(newProfile);
              demoStore.setRole(newProfile.role);
            }
          }
        } catch (err: unknown) {
          console.error('[AuthContext] Error loading user profile doc:', err);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, pass: string, role: UserRole, fullName: string, phone: string) => {
    setError(null);
    setLoading(true);
    const firebaseAuth = getFirebaseAuth();
    const db = getFirebaseDb();

    if (!firebaseAuth || !db) {
      setLoading(false);
      setError('Firebase authentication service unavailable');
      throw new Error('Firebase Auth unavailable');
    }

    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, pass);
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: email.trim(),
        fullName: fullName.trim() || (role === 'provider' ? 'Ramesh Kumar' : 'Priya Sharma'),
        phone: phone.trim() || '+91 98765 43210',
        role,
        cooperativeId: 'coop-delhi',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setProfile(newProfile);
      demoStore.setRole(role);
      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
      throw err;
    }
  };

  const login = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    const firebaseAuth = getFirebaseAuth();
    const db = getFirebaseDb();

    if (!firebaseAuth || !db) {
      setLoading(false);
      setError('Firebase authentication service unavailable');
      throw new Error('Firebase Auth unavailable');
    }

    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, pass);
      const userDocRef = doc(db, 'users', cred.user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setProfile(data);
        demoStore.setRole(data.role);
      } else {
        const fallbackRole: UserRole = email.includes('worker') || email.includes('provider') ? 'provider' : 'customer';
        const newProfile: UserProfile = {
          uid: cred.user.uid,
          email: email.trim(),
          fullName: fallbackRole === 'provider' ? 'Ramesh Kumar' : 'Priya Sharma',
          phone: '+91 98765 43210',
          role: fallbackRole,
          cooperativeId: 'coop-delhi',
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
        demoStore.setRole(newProfile.role);
      }
      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Invalid email or password';
      setError(msg);
      throw err;
    }
  };

  const logout = async () => {
    const firebaseAuth = getFirebaseAuth();
    if (firebaseAuth) {
      await signOut(firebaseAuth);
    }
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile, 
        loading, 
        error, 
        signup, 
        login, 
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
