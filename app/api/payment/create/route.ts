import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const { userId, email, paket } = await req.json();

  const harga = paket === "tahunan" ? 490000 : 49000;
  const orderId = `CD-${userId.slice(0, 8)}-${Date.now()}`;

  await dbAdmin.collection("transactions").doc(orderId).set({
    userId, orderId, amount: harga, status: "pending", paket,
    createdAt: new Date().toISOString(),
  });

  const midtransAuth = Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString("base64");
  const midtransUrl = process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  const response = await fetch(midtransUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${midtransAuth}` },
    body: JSON.stringify({
      transaction_details: { order_id: orderId, gross_amount: harga },
      customer_details: { email },
      callbacks: { finish: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` },
    }),
  });

  const data = await response.json();

  if (!data.token) {
    return NextResponse.json({ error: "Gagal membuat transaksi pembayaran" }, { status: 500 });
  }

  return NextResponse.json({ token: data.token, redirect_url: data.redirect_url });
    }
