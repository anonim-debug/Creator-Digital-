"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch {
      setError("Email atau kata sandi salah.");
    }
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 380, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Masuk</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          style={{ display: "block", width: "100%", padding: 10, marginBottom: 10 }}
        />
        <input
          type="password" placeholder="Kata sandi" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          style={{ display: "block", width: "100%", padding: 10, marginBottom: 10 }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 12 }}>
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </main>
  );
  }
