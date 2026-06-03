import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCk2ZztwRwZbO6FcILWtDWp9ZeQCy3EkVY",
  authDomain: "intervixai.firebaseapp.com",
  projectId: "intervixai",
  storageBucket: "intervixai.firebasestorage.app",
  messagingSenderId: "39517462752",
  appId: "1:39517462752:web:f6f2f2cd18a402e98a7085",
  measurementId: "G-6KX5VQLE91"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);