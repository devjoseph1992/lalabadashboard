// Import necessary Firebase services
import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Firebase config object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services after app initialization
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

// Connect to Firebase emulators in development mode
if (
  import.meta.env.MODE === "development" ||
  window.location.hostname === "localhost"
) {
  console.log("Connecting to Firebase emulators...");

  // Connect Firestore Emulator
  connectFirestoreEmulator(db, "localhost", 8080);
  console.log("Connected to Firestore Emulator at localhost:8080");

  // Connect Functions Emulator
  connectFunctionsEmulator(functions, "localhost", 5001);
  console.log("Connected to Functions Emulator at localhost:5001");

  // Connect Auth Emulator
  connectAuthEmulator(auth, "http://localhost:9099");
  console.log("Connected to Auth Emulator at http://localhost:9099");
}

// Export the initialized services for use elsewhere
export { app, db, auth, functions };
