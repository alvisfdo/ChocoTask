// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "leadsimplified-b95b4.firebaseapp.com",
  projectId: "leadsimplified-b95b4",
  storageBucket: "leadsimplified-b95b4.firebasestorage.app",
  messagingSenderId: "279940087197",
  appId: "1:279940087197:web:d1bae25f089211b8f2c374",
  measurementId: "G-GFQVE5MRG9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);