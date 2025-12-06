"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function WorkerProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      // Load worker profile from Firestore
      const ref = doc(db, "workers", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUserData(snap.data());
      } else {
        setUserData({
          name: "Unknown",
          email: user.email,
          country: "Not set",
          earnings: 0,
          tasks: 0,
        });
      }

      setLoading(false);
    });
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Worker Profile</h2>

      <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Country:</strong> {userData.country}</p>
        <p><strong>Earnings:</strong> ${userData.earnings || 0}</p>
        <p><strong>Tasks Completed:</strong> {userData.tasks || 0}</p>
      </div>
    </div>
  );
}
