"use client";

import { createContext, useEffect, useState } from "react";
import { auth } from "@/firebase/firebase.js";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export default function Providers({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}
