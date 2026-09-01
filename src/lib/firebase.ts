import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Validate if a real, valid Firebase API key is provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig &&
  typeof firebaseConfig.apiKey === 'string' &&
  firebaseConfig.apiKey.length > 20 &&
  !firebaseConfig.apiKey.includes('Demo') &&
  !firebaseConfig.apiKey.includes('MY_') &&
  !firebaseConfig.apiKey.includes('dummy') &&
  !firebaseConfig.apiKey.includes('Development')
);

let app: any = null;
let auth: any = null;
let googleProvider: any = null;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    db = firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization skipped (invalid or missing configuration):', err);
    app = null;
    auth = null;
    googleProvider = null;
    db = null;
  }
}

export { app, auth, googleProvider, db };
export default app;

