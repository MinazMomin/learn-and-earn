"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function WithdrawalDetails({ params }) {
  const { withdrawalId } = params;
  const router = useRouter();

  const [withdrawal, setWithdrawal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWithdrawal() {
      try {
        const ref = doc(db, "withdrawals", withdrawalId);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
          setWithdrawal(null);
        } else {
          setWithdrawal({ id: snapshot.id, ...snapshot.data() });
        }
      } catch (error) {
        console.error("Error fetching withdrawal:", error);
      }
      setLoading(false);
    }

    loadWithdrawal();
  }, [withdrawalId]);

  const approveWithdrawal = async () => {
    await updateDoc(doc(db, "withdrawals", withdrawalId), {
      status: "approved",
    });
    alert("Withdrawal approved!");
    router.push("/admin/withdrawals");
  };

  const rejectWithdrawal = async () => {
    await updateDoc(doc(db, "withdrawals", withdrawalId), {
      status: "rejected",
    });
    alert("Withdrawal rejected!");
    router.push("/admin/withdrawals");
  };

  if (loading) return <p>Loading...</p>;
  if (!withdrawal) return <p>Withdrawal not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Withdrawal Details</h1>
      <p><strong>User ID:</strong> {withdrawal.userId}</p>
      <p><strong>Amount:</strong> ${withdrawal.amount}</p>
      <p><strong>Status:</strong> {withdrawal.status}</p>
      <p><strong>Date:</strong> {withdrawal.createdAt}</p>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={approveWithdrawal}
          style={{ padding: "10px", marginRight: "10px", background: "green", color: "white", border: "none" }}
        >
          Approve
        </button>

        <button
          onClick={rejectWithdrawal}
          style={{ padding: "10px", background: "red", color: "white", border: "none" }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
