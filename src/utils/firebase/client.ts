import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ── vrgc-main (primary app) ───────────────────────────────────────
const mainConfig = {
  apiKey: process.env.NEXT_PUBLIC_MAIN_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_MAIN_FIREBASE_AUTH_DOMAIN || "vrgc-main.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_MAIN_FIREBASE_PROJECT_ID || "vrgc-main",
  storageBucket: process.env.NEXT_PUBLIC_MAIN_FIREBASE_STORAGE_BUCKET || "vrgc-main.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_MAIN_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_MAIN_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_MAIN_FIREBASE_MEASUREMENT_ID || "",
};

const app = !getApps().length
  ? initializeApp(mainConfig)
  : getApp();
const db = getFirestore(app);

// ── vrgc-form (real member registrations, Samvitya passholders & live broadcast engine) ─
const formConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "vrgc-form.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "vrgc-form",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "vrgc-form.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

const FORM_APP_NAME = "vrgc-form";
const formApp =
  getApps().find((a) => a.name === FORM_APP_NAME) ??
  initializeApp(formConfig, FORM_APP_NAME);
const formDb = getFirestore(formApp);
const formAuth = getAuth(formApp);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, db, formApp, formDb, formAuth, googleProvider };

