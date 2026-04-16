import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdv1enX-rL9cIDiX4DlOimvhHGs7gAx2A",
  authDomain: "smart-medicine-reminder-b9860.firebaseapp.com",
  projectId: "smart-medicine-reminder-b9860",
  storageBucket: "smart-medicine-reminder-b9860.firebasestorage.app",
  messagingSenderId: "73547943975",
  appId: "1:73547943975:web:fdc12622b822af27c3fe02",
  measurementId: "G-SD5VBGDC8W"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics conditionally (client-side only)
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export { app, db };
