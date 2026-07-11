"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [inputText, setInputText] = useState("");
  const [hasil, setHasil] = useState("");
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      const snap = await getDoc(doc(db, "profiles", u.uid));
      setProfile(snap.data());
    });
    return () => unsub();
  }, []);

  async function handleRingkas() {
    setLoading(true);
    setPesan("");
    const res = await fetch("/api/tools/ringkas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText, userId: user.uid }),
    });
    const data = await res.json();
    if (data.error) setPesan(data.error);
    else setHasil(data.hasil);
    setLoading(false);
  }

  async function handleUpgrade(paket: "bulanan" | "tahunan") {
    const res = await fetch("/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid, email: user.email, paket }),
    });
    const data = await res.json();
    if (data.redirect_url) window.location.href = data.redirect_url;
  }

  if (!user || !profile) return <p style={{ padding: 40 }}>Memuat...</p>;

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h1>Dashboard</h1>
      <p>Halo, {user.email}</p>
      <p>
        Status: <b>{profile.isPremium ? "Premium ✅" : "Gratis"}</b>
        {!profile.isPremium && ` (${profile.pemakaianGratisHariIni || 0}/5 pemakaian hari ini)`}
      </p>

      {!profile.isPremium && (
        <div style={{ margin: "20px 0", display: "flex", gap: 10 }}>
          <button onClick={() => handleUpgrade("bulanan")} style={{ padding: 10 }}>
            Upgrade Bulanan — Rp49rb
          </button>
          <button onClick={() => handleUpgrade("tahunan")} style={{ padding: 10 }}>
            Upgrade Tahunan — Rp490rb
          </button>
        </div>
      )}

      <hr style={{ margin: "24px 0" }} />

      <h2>Tools: Ringkas Teks</h2>
      <textarea
        value={inputText} onChange={(e) => setInputText(e.target.value)}
        placeholder="Tempel teks di sini..."
        style={{ width: "100%", height: 120, padding: 10 }}
      />
      <button onClick={handleRingkas} disabled={loading} style={{ padding: 10, marginTop: 10 }}>
        {loading ? "Memproses..." : "Ringkas dengan AI"}
      </button>

      {pesan && <p style={{ color: "red" }}>{pesan}</p>}
      {hasil && (
        <div style={{ marginTop: 16, padding: 14, background: "#f5f5f5", borderRadius: 8 }}>
          {hasil}
        </div>
      )}
    </main>
  );
}
