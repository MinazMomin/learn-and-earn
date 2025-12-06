"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminSubmissionsPage() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    async function load() {
      const snapshot = await getDocs(collection(db, "submissions"));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSubs(list);
    }
    load();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Submissions</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>User</th>
            <th>Task</th>
            <th>Answer</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {subs.length === 0 && (
            <tr><td colSpan="4">No submissions found</td></tr>
          )}

          {subs.map((s) => (
            <tr key={s.id}>
              <td>{s.userId}</td>
              <td>{s.taskId}</td>
              <td>{s.answer}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
