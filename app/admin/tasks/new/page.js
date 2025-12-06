"use client";

import { useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function NewTaskPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [reward, setReward] = useState("");
  const [desc, setDesc] = useState("");
  const [instructions, setInstructions] = useState("");

  async function createTask(e) {
    e.preventDefault();

    try {
      await addDoc(collection(db, "tasks"), {
        title,
        reward: Number(reward),
        description: desc,
        instructions,
        createdAt: serverTimestamp(),
      });

      alert("Task created!");
      router.push("/admin/tasks");
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Failed to create task.");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Create New Task</h1>

      <form onSubmit={createTask} style={{ marginTop: 20 }}>

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={input}
          required
        />

        <input
          type="number"
          placeholder="Reward amount"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          style={input}
          required
        />

        <textarea
          placeholder="Short description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={textarea}
          required
        />

        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          style={textarea}
          required
        />

        <button type="submit" style={button}>Create Task</button>
      </form>
    </div>
  );
}

const input = {
  display: "block",
  width: "300px",
  padding: "10px",
  marginBottom: "10px",
};

const textarea = {
  display: "block",
  width: "300px",
  height: "120px",
  padding: "10px",
  marginBottom: "10px",
};

const button = {
  padding: "10px 20px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "4px",
};
