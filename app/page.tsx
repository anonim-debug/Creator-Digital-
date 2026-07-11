import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 480, margin: "100px auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>Creator Digital</h1>
      <p>Tools AI, portofolio, dan website builder — otomatis.</p>
      <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
        <Link href="/login"><button style={{ padding: "10px 20px" }}>Masuk</button></Link>
        <Link href="/signup"><button style={{ padding: "10px 20px" }}>Daftar Gratis</button></Link>
      </div>
    </main>
  );
      }
