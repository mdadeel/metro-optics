// Firebase Configuration for Metro Optics
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase project configuration - uses environment variables for security
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if Firebase is configured with required env vars
const hasFirebaseConfig = Boolean(firebaseConfig.apiKey) && Boolean(firebaseConfig.projectId);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (hasFirebaseConfig) {
    try {
        // Initialize Firebase
        app = initializeApp(firebaseConfig);

        // Initialize services
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);

        console.log('Firebase initialized successfully with project:', firebaseConfig.projectId);
    } catch (error) {
        console.warn('Firebase initialization failed:', error.message);
        // Reset to null on failure
        app = null;
        auth = null;
        db = null;
        storage = null;
    }
} else {
    console.warn(
        '%c Firebase not configured. ' +
        'Set VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in your .env file. ' +
        'See .env.example for all required variables.',
        'background: #eab308; color: black; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
    );
}

export { auth, db, storage, hasFirebaseConfig };
export default app;
