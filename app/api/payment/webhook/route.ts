import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { dbAdmin } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id, status_code, gross_amount, signature_key, transaction_status } = body;

  const expectedSignature = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY)
    .digest("hex");

  if (signature_key !== expectedSignature) {
    return NextResponse.json({ error: "Signature tidak valid" }, { status: 403 });
  }

  const transRef = dbAdmin.collection("transactions").doc(order_id);
  const transSnap = await transRef.get();

  if (!transSnap.exists) {
    return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
  }

  const transaksi = transSnap.data()!;

  if (transaction_status === "settlement" || transaction_status === "capture") {
    const lamaHari = transaksi.paket === "tahunan" ? 365 : 30;
    const premiumUntil = new Date();
    premiumUntil.setDate(premiumUntil.getDate() + lamaHari);

    await dbAdmin.collection("profiles").doc(transaksi.userId).update({
      isPremium: true,
      premiumUntil: premiumUntil.toISOString(),
    });

    await transRef.update({ status: "success" });
  }

  if (["deny", "cancel", "expire"].includes(transaction_status)) {
    await transRef.update({ status: "failed" });
  }

  return NextResponse.json({ received: true });
    }
