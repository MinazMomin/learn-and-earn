"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);

  // Load withdrawals
  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "withdrawals"));
      const items = [];
      snap.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setWithdrawals(items);
    }
    load();
  }, []);

  // Approve function
  const approveWithdrawal = async (id) => {
    await updateDoc(doc(db, "withdrawals", id), {
      status: "approved",
    });
    alert("Withdrawal Approved");
    window.location.reload();
  };

  // Reject function
  const rejectWithdrawal = async (id) => {
    await updateDoc(doc(db, "withdrawals", id), {
      status: "rejected",
    });
    alert("Withdrawal Rejected");
    window.location.reload();
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin — Manage Withdrawals</h2>

      {withdrawals.length === 0 ? (
        <p>No withdrawals found.</p>
      ) : (
        withdrawals.map((w) => (
          <div
            key={w.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <p><strong>ID:</strong> {w.id}</p>
            <p><strong>Amount:</strong> ${w.amount}</p>
            <p><strong>Status:</strong> {w.status}</p>
            <p><strong>Method:</strong> {w.method}</p>
            <p><strong>UserID:</strong> {w.userID}</p>

            <button
              onClick={() => approveWithdrawal(w.id)}
              style={{
                padding: "8px 12px",
                marginRight: "10px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Approve
            </button>

            <button
              onClick={() => rejectWithdrawal(w.id)}
              style={{
                padding: "8px 12px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}
