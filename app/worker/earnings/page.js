"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function WorkerEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [approvedTasks, setApprovedTasks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      await loadEarnings(user.uid);
      setLoading(false);
    });
  }, []);

  async function loadEarnings(uid) {
    try {
      // Load all approved submissions for earnings
      const tasksQuery = query(
        collection(db, "submissions"),
        where("userId", "==", uid),
        where("status", "==", "Approved")
      );

      const taskSnap = await getDocs(tasksQuery);

      let total = 0;
      let approvedList = [];

      taskSnap.forEach((doc) => {
        const data = doc.data();
        total += data.reward || 0;
        approvedList.push(data);
      });

      setApprovedTasks(approvedList);
      setEarnings(total);

      // Load withdrawals
      const wQuery = query(
        collection(db, "withdrawals"),
        where("userId", "==", uid)
      );

      const withdrawSnap = await getDocs(wQuery);

      let withdrawalList = [];
      withdrawSnap.forEach((doc) => withdrawalList.push(doc.data()));

      setWithdrawals(withdrawalList);

    } catch (err) {
      console.error("Error loading earnings:", err);
    }
  }

  if (loading) return <p className="p-4">Loading earnings...</p>;

  return (
    <div className="p-6 space-y-6">

      <h2 className="text-2xl font-bold">Your Earnings</h2>

      <div className="p-4 bg-green-100 border rounded-lg">
        <p className="text-lg">
          <strong>Total Earned:</strong> ${earnings.toFixed(2)}
        </p>
      </div>

      <h3 className="text-xl font-semibold mt-6">Approved Tasks</h3>
      {approvedTasks.length === 0 ? (
        <p>No approved tasks yet.</p>
      ) : (
        <ul className="space-y-3">
          {approvedTasks.map((task, i) => (
            <li key={i} className="border p-3 rounded-lg">
              <p><strong>{task.taskTitle}</strong></p>
              <p>Earned: ${task.reward}</p>
              <p>Status: {task.status}</p>
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-xl font-semibold mt-6">Withdrawal History</h3>
      {withdrawals.length === 0 ? (
        <p>No withdrawals yet.</p>
      ) : (
        <ul className="space-y-3">
          {withdrawals.map((w, i) => (
            <li key={i} className="border p-3 rounded-lg">
              <p><strong>Amount:</strong> ${w.amount}</p>
              <p><strong>Status:</strong> {w.status}</p>
              <p><strong>Date:</strong> {w.date || "N/A"}</p>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
