"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminReportsPage() {
  const [users, setUsers] = useState(0);
  const [tasks, setTasks] = useState(0);
  const [payouts, setPayouts] = useState(0);

  useEffect(() => {
    async function load() {
      setUsers((await getDocs(collection(db, "users"))).size);
      setTasks((await getDocs(collection(db, "tasks"))).size);
      setPayouts((await getDocs(collection(db, "payouts"))).size);
    }
    load();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reports</h1>

      <div style={{ fontSize: "18px", marginTop: "20px" }}>
        <p><strong>Total Users:</strong> {users}</p>
        <p><strong>Total Tasks:</strong> {tasks}</p>
        <p><strong>Total Payout Requests:</strong> {payouts}</p>
      </div>
    </div>
  );
}
