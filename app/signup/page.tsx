"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "profiles", cred.user.uid), {
        email,
        isPremium: false,
        premiumUntil: null,
        pemakaianGratisHariIni: 0,
        tanggalReset: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message.includes("email-already") ? "Email sudah terdaftar." : err.message);
    }
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 380, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Daftar Akun</h1>
      <form onSubmit={handleSignup}>
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          style={{ display: "block", width: "100%", padding: 10, marginBottom: 10 }}
        />
        <input
          type="password" placeholder="Kata sandi" value={password}
          onChange={(e) => setPassword(e.target.value)} required minLength={6}
          style={{ display: "block", width: "100%", padding: 10, marginBottom: 10 }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 12 }}>
          {loading ? "Memproses..." : "Buat Akun"}
        </button>
      </form>
    </main>
  );
    }
