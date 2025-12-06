"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    async function loadWorkers() {
      const workersCollection = collection(db, "workers");
      const snapshot = await getDocs(workersCollection);

      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setWorkers(list);
    }

    loadWorkers();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Workers</h2>

      <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>User ID</th>
          </tr>
        </thead>

        <tbody>
          {workers.length === 0 ? (
            <tr>
              <td colSpan={3}>No workers found</td>
            </tr>
          ) : (
            workers.map((w) => (
              <tr key={w.id}>
                <td>{w.email}</td>
                <td>{w.name}</td>
                <td>{w.id}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
