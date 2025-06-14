// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjOJJ9uLc8RMlrwZywj1SyDjbwdTNn0IQ", // IMPORTANT: Keep your API keys secure and consider using environment variables.
  authDomain: "idream-kstw2.firebaseapp.com",
  projectId: "idream-kstw2",
  storageBucket: "idream-kstw2.appspot.com", // Corrected from .firebasestorage.app
  messagingSenderId: "114098999206",
  appId: "1:114098999206:web:15222a3c9b2daaf8ebc967",
  measurementId: "G-H0MGDV582F"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };
