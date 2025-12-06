"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth } from "@/firebase/firebase.js";
import Link from "next/link";

export default function WorkerSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubmissions() {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "submissions"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSubmissions(list);
      } catch (err) {
        console.error("Error loading submissions:", err);
      }

      setLoading(false);
    }

    loadSubmissions();
  }, []);

  if (loading) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Submissions</h2>

      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <ul className="space-y-3">
          {submissions.map((sub) => (
            <li
              key={sub.id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <p><strong>Task:</strong> {sub.taskTitle || "Unknown"}</p>
                <p><strong>Status:</strong> {sub.status}</p>
              </div>

              <Link
                href={`/worker/submissions/${sub.id}`}
                className="bg-blue-600 text-white py-1 px-3 rounded"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
