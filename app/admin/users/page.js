"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const snapshot = await getDocs(collection(db, "users"));
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(list);
    }
    loadUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Users</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>UserID</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr><td colSpan="3">No users found</td></tr>
          )}
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role || "worker"}</td>
              <td>{u.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
