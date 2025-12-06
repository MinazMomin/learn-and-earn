"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AdminWorkerDetails({ params }) {
  const { workerid } = params;
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorker() {
      const ref = doc(db, "workers", workerid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setWorker({ id: snap.id, ...snap.data() });
      } else {
        setWorker(null);
      }

      setLoading(false);
    }

    loadWorker();
  }, [workerid]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!worker) return <p style={{ padding: 20 }}>Worker not found.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Worker Details</h2>

      <p><strong>Email:</strong> {worker.email}</p>
      <p><strong>Name:</strong> {worker.name}</p>
      <p><strong>User ID:</strong> {worker.id}</p>
      <p><strong>Joined:</strong> {worker.createdAt || "N/A"}</p>
    </div>
  );
} 
