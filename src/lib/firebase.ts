import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log Firebase configuration for debugging (without sensitive values)
console.log("Firebase configuration:", {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  apiKeyLength: firebaseConfig.apiKey ? firebaseConfig.apiKey.length : 0,
  appIdLength: firebaseConfig.appId ? firebaseConfig.appId.length : 0
});

// Check if any required configuration is missing
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error("Missing required Firebase configuration. Check your .env.local file.");
}

let app;
let auth: Auth;
let db;
let storage;

try {
  // Initialize Firebase
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log("Firebase initialized successfully");
  console.log("Auth domain:", auth.config.authDomain);
  console.log("Current user:", auth.currentUser ? auth.currentUser.email : "No user");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error; // Re-throw to make the error visible
}

// Connect to Auth Emulator if in development and emulator URL is provided
if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL && process.env.NODE_ENV === 'development') {
  try {
    connectAuthEmulator(auth, process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL);
    console.log("Connected to Firebase Auth Emulator");
  } catch (error) {
    console.error("Error connecting to Auth Emulator:", error);
  }
}

export { app, auth, db, storage };
