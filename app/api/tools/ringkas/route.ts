import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "@/lib/firebaseAdmin";

const LIMIT_GRATIS_PER_HARI = 5;

export async function POST(req: NextRequest) {
  const { text, userId } = await req.json();

  if (!text || !userId) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  const profileRef = dbAdmin.collection("profiles").doc(userId);
  const profileSnap = await profileRef.get();

  if (!profileSnap.exists) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  const profile = profileSnap.data()!;
  const hariIni = new Date().toISOString().slice(0, 10);
  let pemakaian = profile.pemakaianGratisHariIni || 0;

  if (profile.tanggalReset !== hariIni) {
    pemakaian = 0;
  }

  if (!profile.isPremium && pemakaian >= LIMIT_GRATIS_PER_HARI) {
    return NextResponse.json(
      { error: "Jatah gratis hari ini sudah habis. Upgrade ke Premium untuk pemakaian tanpa batas." },
      { status: 403 }
    );
  }

  const aiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `Ringkas teks berikut dalam Bahasa Indonesia, singkat dan jelas:\n\n${text}` },
            ],
          },
        ],
      }),
    }
  );

  const aiData = await aiResponse.json();
  const hasil = aiData?.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, terjadi kesalahan saat memproses.";

  if (!profile.isPremium) {
    await profileRef.update({ pemakaianGratisHariIni: pemakaian + 1, tanggalReset: hariIni });
  }

  return NextResponse.json({ hasil });
                             }
