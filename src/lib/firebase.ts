import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
  type Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  getDocFromServer,
  collection,
  addDoc,
  type Firestore 
} from 'firebase/firestore';
import type { UserProfile, ActivityLog } from '../types';
import firebaseConfigData from '../../firebase-applet-config.json';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

const firebaseConfig = {
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || firebaseConfigData.projectId,
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || firebaseConfigData.appId,
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || firebaseConfigData.apiKey,
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || firebaseConfigData.authDomain,
  firestoreDatabaseId: (import.meta.env.VITE_FIRESTORE_DATABASE_ID as string) || firebaseConfigData.firestoreDatabaseId,
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || firebaseConfigData.storageBucket,
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || firebaseConfigData.messagingSenderId,
};

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
} catch (error) {
  console.warn('Firebase initialization note:', error);
}

export { app, auth, db };

// Connection test mandated by Firebase Integration Skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    if (!db) return false;
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.info('Client is running in offline or cached mode.');
    }
    return false;
  }
}

// Local storage key for persistent fallback/offline state
const LOCAL_USER_KEY = 'quorvane_operator_profile';

export function getLocalFallbackProfile(): UserProfile {
  const stored = localStorage.getItem(LOCAL_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback to default below
    }
  }
  const defaultProfile: UserProfile = {
    id: 'demo-operator-01',
    email: 'operator@quorvane.sec',
    username: 'GhostCipher',
    role: 'operator',
    xp: 650,
    level: 2,
    completedLabs: ['lab-password', 'lab-recon'],
    completedModules: ['mod-fundamentals', 'mod-passwords'],
    completedStages: ['stage-1', 'stage-2'],
    achievements: ['ach-first-lab', 'ach-pwd-specialist', 'ach-recon-beginner'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(defaultProfile));
  return defaultProfile;
}

export function saveLocalProfile(profile: UserProfile): void {
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
}

// User Profile Firestore helpers
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    if (!db) return null;
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.error('Error fetching user profile from Firestore:', err);
    return null;
  }
}

export async function createUserProfileInDb(profile: UserProfile): Promise<void> {
  saveLocalProfile(profile);
  try {
    if (!db) return;
    const docRef = doc(db, 'users', profile.id);
    await setDoc(docRef, profile);
  } catch (err) {
    console.warn('Could not write profile to remote Firestore (saved locally):', err);
  }
}

export async function syncUserProfile(profile: UserProfile): Promise<void> {
  saveLocalProfile(profile);
  try {
    if (!db) return;
    const docRef = doc(db, 'users', profile.id);
    await setDoc(docRef, profile, { merge: true });
  } catch (err) {
    console.warn('Could not sync profile to remote Firestore (cached locally):', err);
  }
}

export async function updateUserProfileInDb(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const current = getLocalFallbackProfile();
    const merged = { ...current, ...updates, updatedAt: new Date().toISOString() };
    saveLocalProfile(merged);
    if (!db) return;
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn('Could not update profile to remote Firestore (cached locally):', err);
  }
}

export async function logUserActivity(log: Omit<ActivityLog, 'id'>): Promise<void> {
  try {
    if (!db) return;
    const colRef = collection(db, 'users', log.userId, 'activities');
    await addDoc(colRef, {
      ...log,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    // Non-blocking telemetry
  }
}
