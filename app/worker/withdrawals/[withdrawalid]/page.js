"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function WithdrawalDetails({ params }) {
  const { withdrawalId } = params;

  const [withdrawal, setWithdrawal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const ref = doc(db, "withdrawals", withdrawalId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setWithdrawal(snap.data());
        } else {
          setWithdrawal(null);
        }
      } catch (e) {
        console.error(e);
      }

      setLoading(false);
    }

    load();
  }, [withdrawalId]);

  if (loading) return <p>Loading...</p>;
  if (!withdrawal) return <p>Withdrawal not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Withdrawal Details</h2>
      <p><strong>Amount:</strong> {withdrawal.amount}</p>
      <p><strong>Status:</strong> {withdrawal.status}</p>
      <p><strong>Method:</strong> {withdrawal.method}</p>
      <p><strong>Date:</strong> {withdrawal.date?.toDate().toLocaleString()}</p>
    </div>
  );
}
