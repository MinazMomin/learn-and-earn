"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";

export default function WorkerSubmissionDetail() {
  const { submissionid } = useParams(); // read URL param
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const ref = doc(db, "submissions", submissionid);
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          setSubmission(snapshot.data());
        }
      } catch (err) {
        console.error("Error loading submission:", err);
      }
      setLoading(false);
    }

    loadData();
  }, [submissionid]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!submission) return <p className="p-4 text-red-600">Submission not found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Submission Details</h2>

      <div className="border p-4 rounded-lg space-y-2">
        <p><strong>Task:</strong> {submission.taskTitle || "Unknown Task"}</p>
        <p><strong>Status:</strong> {submission.status}</p>
        <p><strong>Submitted Link:</strong></p>
        <a
          className="text-blue-600 underline"
          href={submission.link}
          target="_blank"
        >
          {submission.link}
        </a>
        <p><strong>Submitted At:</strong> {submission.createdAt || "N/A"}</p>
        {submission.adminMessage && (
          <p className="text-red-600">
            <strong>Admin Note:</strong> {submission.adminMessage}
          </p>
        )}
      </div>
    </div>
  );
}
