"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminMessagesPage() {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    async function load() {
      const snapshot = await getDocs(collection(db, "messages"));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setThreads(list);
    }
    load();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Message Threads</h1>

      {threads.length === 0 && <p>No message threads yet.</p>}

      <ul>
        {threads.map((t) => (
          <li key={t.id}>
            Thread: <strong>{t.id}</strong> — {t.lastMessage || "No messages"}
          </li>
        ))}
      </ul>
    </div>
  );
}
