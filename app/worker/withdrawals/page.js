"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";

export default function WithdrawalList() {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      // Query should match Firestore — accept BOTH userID and userid
      const colRef = collection(db, "withdrawals");
      const q = query(colRef, where("userid", "==", user.uid));

      const snap = await getDocs(q);

      let items = [];

      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      // If userID did not match, try userid
      if (items.length === 0) {
        const q2 = query(colRef, where("userid", "==", user.uid));
        const snap2 = await getDocs(q2);

        snap2.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
      }

      setList(items);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (list.length === 0) return <p>No withdrawals found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Withdrawals</h2>

      {list.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "10px",
            cursor: "pointer"
          }}
          onClick={() => router.push(`/worker/withdrawals/${item.id}`)}
        >
          <p><strong>Amount:</strong> ${item.amount}</p>
          <p><strong>Status:</strong> {item.status}</p>
          <p><strong>Method:</strong> {item.method}</p>

          {item.date && item.date.seconds && (
            <p><strong>Date:</strong> {new Date(item.date.seconds * 1000).toLocaleString()}</p>
          )}
        </div>
      ))}
    </div>
  );
}
