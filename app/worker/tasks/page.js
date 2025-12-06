"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function WorkerTasksList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      const snap = await getDocs(collection(db, "tasks"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(list);
    }
    loadTasks();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Available Tasks</h2>

      {tasks.map((task) => (
        <Link
          key={task.id}
          href={`/worker/tasks/${task.id}`}
          style={{
            display: "block",
            padding: 15,
            marginTop: 15,
            border: "1px solid #ccc",
            borderRadius: 6,
            textDecoration: "none",
            color: "black",
          }}
        >
          <h3>{task.title}</h3>
          <p>Reward: {task.reward}</p>
        </Link>
      ))}
    </div>
  );
}
