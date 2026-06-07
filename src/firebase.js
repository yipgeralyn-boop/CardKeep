import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Paste your Firebase project config here (console.firebase.google.com → Project settings → Your apps)
const firebaseConfig = {
  apiKey:            "AIzaSyBnKKd9xR3jhTA51zv7whA8ucohBwZx1ro",
  authDomain:        "cardkeep-b8af4.firebaseapp.com",
  projectId:         "cardkeep-b8af4",
  storageBucket:     "cardkeep-b8af4.firebasestorage.app",
  messagingSenderId: "589724554032",
  appId:             "1:589724554032:web:5c35d46d83d1826f9d2ef5",
  measurementId:     "G-VFN757QJR6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
