"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

export default function SubmissionDetail() {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmission() {
      try {
        const docRef = doc(db, "submissions", submissionId);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setSubmission(snap.data());
        }
      } catch (err) {
        console.error("Error loading submission:", err);
      }
      setLoading(false);
    }

    if (submissionId) fetchSubmission();
  }, [submissionId]);

  // Approve Submission
  async function approve() {
    try {
      await updateDoc(doc(db, "submissions", submissionId), {
        status: "approved",
        reviewedAt: serverTimestamp(),
      });

      alert("Submission approved!");
    } catch (err) {
      console.error("Approve error:", err);
      alert("Failed to approve.");
    }
  }

  // Reject Submission
  async function reject() {
    try {
      await updateDoc(doc(db, "submissions", submissionId), {
        status: "rejected",
        reviewedAt: serverTimestamp(),
      });

      alert("Submission rejected!");
    } catch (err) {
      console.error("Reject error:", err);
      alert("Failed to reject.");
    }
  }

  if (loading) return <p>Loading submission...</p>;
  if (!submission) return <p>Submission not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Submission Details</h1>

      <p><strong>User ID:</strong> {submission.userId}</p>
      <p><strong>Task ID:</strong> {submission.taskId}</p>
      <p><strong>Status:</strong> {submission.status}</p>
      <p><strong>Submitted At:</strong>
        {submission.submittedAt?.toDate?.().toLocaleString() || "N/A"}
      </p>

      {submission.imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Submitted Image:</h3>
          <img
            src={submission.imageUrl}
            alt="Submission"
            style={{ width: "300px", borderRadius: "8px" }}
          />
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={approve}
          style={{ marginRight: "10px", padding: "10px 15px", background: "green", color: "white", border: 0 }}
        >
          Approve
        </button>

        <button
          onClick={reject}
          style={{ padding: "10px 15px", background: "red", color: "white", border: 0 }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
