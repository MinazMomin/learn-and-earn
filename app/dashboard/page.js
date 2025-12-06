"use client";

import { auth } from "../../firebase/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Worker Dashboard</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
