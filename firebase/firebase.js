"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyChBu2ZmHaeUif_Np0_nVKuQXp4dm3wlf8",
  authDomain: "learnandearn-3cf07.firebaseapp.com",
  projectId: "learnandearn-3cf07",
  storageBucket: "learnandearn-3cf07.appspot.com",
  messagingSenderId: "1048482010570",
  appId: "1:1048482010570:web:5e7b0749466d21d66fab33",
  measurementId: "G-BY86QZYLQE"
};

// Prevent Firebase from initializing twice
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

