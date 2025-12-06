"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "@/firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function WorkerDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      // Load worker profile from Firestore
      const snap = await getDoc(doc(db, "workers", user.uid));

      if (snap.exists()) {
        setUserData(snap.data());
      }

      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Worker Dashboard</h1>

      <div className="space-y-1">
        <p><strong>Name:</strong> {userData?.name || "Not set"}</p>
        <p><strong>Email:</strong> {userData?.email}</p>
        <p><strong>Earnings:</strong> ${userData?.earnings || 0}</p>
      </div>

      <div className="grid gap-4 mt-4">
        <button
          className="bg-blue-600 text-white p-3 rounded-lg"
          onClick={() => router.push("/worker/profile")}
        >
          Profile
        </button>

        <button
          className="bg-green-600 text-white p-3 rounded-lg"
          onClick={() => router.push("/worker/tasks")}
        >
          Tasks
        </button>

        <button
          className="bg-purple-600 text-white p-3 rounded-lg"
          onClick={() => router.push("/worker/messages")}
        >
          Messages
        </button>

        <button
          className="bg-yellow-500 text-white p-3 rounded-lg"
          onClick={() => router.push("/worker/withdrawals")}
        >
          Withdrawal History
        </button>

        <button
          className="bg-red-600 text-white p-3 rounded-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
