import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const DEFAULT_PROJECT_ID = 'cooperative-gig-platform-61581';
const DEFAULT_API_KEY = 'AIzaSyCooperativeGigPlatformKey2026';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || DEFAULT_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '100820260001',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:100820260001:web:cooperativegig2026',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export function isFirebaseConfigured(): boolean {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID;
  return Boolean(
    projectId &&
    projectId !== 'your_project_id'
  );
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (app) return app;
  if (!isFirebaseConfigured()) return null;
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    return app;
  } catch (error) {
    console.error('[Firebase] Failed to initialize App:', error);
    return null;
  }
}

export function getFirebaseDb(): Firestore | null {
  if (db) return db;
  const currentApp = getFirebaseApp();
  if (!currentApp) return null;
  try {
    db = getFirestore(currentApp);
    return db;
  } catch (error) {
    console.error('[Firebase] Failed to initialize Firestore:', error);
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  if (auth) return auth;
  const currentApp = getFirebaseApp();
  if (!currentApp) return null;
  try {
    auth = getAuth(currentApp);
    return auth;
  } catch (error) {
    console.error('[Firebase] Failed to initialize Auth:', error);
    return null;
  }
}

// Eager initialization if configured
if (typeof window !== 'undefined' || isFirebaseConfigured()) {
  getFirebaseApp();
  getFirebaseDb();
  getFirebaseAuth();
}

export { app, db, auth };

