import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const mainFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_MAIN_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_MAIN_FIREBASE_AUTH_DOMAIN || "vrgc-main.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_MAIN_FIREBASE_PROJECT_ID || "vrgc-main",
  storageBucket: process.env.NEXT_PUBLIC_MAIN_FIREBASE_STORAGE_BUCKET || "vrgc-main.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_MAIN_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_MAIN_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_MAIN_FIREBASE_MEASUREMENT_ID || "",
};

// Use named app to avoid collision with default app
const mainApp = getApps().find((a) => a.name === "vrgc-main") || initializeApp(mainFirebaseConfig, "vrgc-main");
const mainDb = getFirestore(mainApp);

export { mainApp, mainDb };

