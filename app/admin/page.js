"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    workers: 0,
    tasks: 0,
    submissions: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const workersSnap = await getDocs(collection(db, "workers"));
        const tasksSnap = await getDocs(collection(db, "tasks"));
        const submissionsSnap = await getDocs(collection(db, "submissions"));

        setStats({
          users: usersSnap.size,
          workers: workersSnap.size,
          tasks: tasksSnap.size,
          submissions: submissionsSnap.size,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    }

    loadStats();
  }, []);

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2>Users</h2>
          <p>{stats.users}</p>
        </div>

        <div style={styles.card}>
          <h2>Workers</h2>
          <p>{stats.workers}</p>
        </div>

        <div style={styles.card}>
          <h2>Tasks</h2>
          <p>{stats.tasks}</p>
        </div>

        <div style={styles.card}>
          <h2>Submissions</h2>
          <p>{stats.submissions}</p>
        </div>
      </div>
    </main>
  );
}

const styles = {
  container: {
    padding: "30px",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "32px",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  card: {
    background: "#f5f5f5",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
};
