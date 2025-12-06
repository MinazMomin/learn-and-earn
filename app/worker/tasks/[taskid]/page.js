"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/firebase/firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function WorkerTaskDetail({ params }) {
  const router = useRouter();
  const { taskid } = params;

  const [task, setTask] = useState(null);
  const [proof, setProof] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadTask() {
      const snap = await getDoc(doc(db, "tasks", taskid));
      if (snap.exists()) {
        setTask({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    }
    loadTask();
  }, [taskid]);

  async function submitTask() {
    if (!proof.trim()) return alert("Please enter your task proof!");

    setSubmitting(true);

    await addDoc(collection(db, "submissions"), {
      workerId: auth.currentUser.uid,
      taskId: taskid,
      proof,
      reward: task.reward,
      status: "pending",
      timestamp: serverTimestamp(),
    });

    setSubmitting(false);
    alert("Task submitted for review!");
    router.push("/worker");
  }

  if (loading) return <p>Loading...</p>;
  if (!task) return <p>Task not found.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{task.title}</h2>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Reward:</strong> {task.reward}</p>

      <div style={{ marginTop: 20 }}>
        <h3>Submit your proof</h3>
        <textarea
          value={proof}
          onChange={(e) => setProof(e.target.value)}
          placeholder="Enter your proof or link"
          style={{ width: "100%", height: 120, padding: 10 }}
        />

        <button
          onClick={submitTask}
          disabled={submitting}
          style={{
            marginTop: 15,
            padding: "10px 20px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit Task"}
        </button>
      </div>
    </div>
  );
}
