"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function load() {
      const snapshot = await getDocs(collection(db, "tasks"));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(list);
    }
    load();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tasks</h1>
     
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Reward</th>
            <th>Description</th>
            <th>Task ID</th>
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 && (
            <tr><td colSpan="4">No tasks found</td></tr>
          )}

          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>${task.reward}</td>
              <td>{task.description}</td>
              <td>{task.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
