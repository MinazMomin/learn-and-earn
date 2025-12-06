"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    async function load() {
      const snapshot = await getDocs(collection(db, "payouts"));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPayouts(list);
    }
    load();
  }, []);

  async function approve(id) {
    await updateDoc(doc(db, "payouts", id), { status: "approved" });
    alert("Approved");
  }

  async function reject(id) {
    await updateDoc(doc(db, "payouts", id), { status: "rejected" });
    alert("Rejected");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Payout Requests</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {payouts.length === 0 && <tr><td colSpan="4">No payouts found</td></tr>}

          {payouts.map((p) => (
            <tr key={p.id}>
              <td>{p.userId}</td>
              <td>${p.amount}</td>
              <td>{p.status}</td>
              <td>
                <button onClick={() => approve(p.id)}>Approve</button>
                <button onClick={() => reject(p.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
