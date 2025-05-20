// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNgBwmaM-3_DG07Wpk-3twPv0E-3jUiUI",
  authDomain: "habit-island-30b07.firebaseapp.com",
  projectId: "habit-island-30b07",
  storageBucket: "habit-island-30b07.firebasestorage.app",
  messagingSenderId: "855301428711",
  appId: "1:855301428711:web:27b644343648cc7dc35942",
  measurementId: "G-058D92RKSE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
