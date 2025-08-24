// app/api/webhooks/paddle/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // 1. Get signature header + raw body
    const paddleSignature = req.headers.get("paddle-signature") || "";
    const secretKey = process.env.PADDLE_WEBHOOK_SECRET;

    if (!paddleSignature || !secretKey) {
      console.error("❌ Missing Paddle-Signature header or secret key");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await req.text();

    // 2. Extract timestamp + h1 signature
    const parts = paddleSignature.split(";");
    const signatureMap: Record<string, string> = {};
    for (const part of parts) {
      const [key, value] = part.split("=");
      signatureMap[key] = value;
    }
    const ts = signatureMap["ts"];
    const h1 = signatureMap["h1"];

    if (!ts || !h1) {
      console.error("❌ Invalid Paddle-Signature format");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Build signed payload
    const signedPayload = `${ts}:${rawBody}`;

    // 4. Generate HMAC with secret
    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(signedPayload)
      .digest("hex");

    // 5. Compare securely
    const valid = crypto.timingSafeEqual(
      Buffer.from(computedSignature, "hex"),
      Buffer.from(h1, "hex")
    );

    if (!valid) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // ✅ Signature verified
    const event = JSON.parse(rawBody);
    console.log("✅ Verified Paddle webhook:", event.event_type);
    console.log("📦 Event data:", JSON.stringify(event.data, null, 2));

    // Handle events
    switch (event.event_type) {
      case "transaction.completed":
        console.log("💰 Payment completed:", event.data.id);
        break;
      case "transaction.payment_failed":
        console.log("❌ Payment failed:", event.data.id);
        break;
      case "subscription.created":
        console.log("🔄 Subscription created:", event.data.id);
        break;
      default:
        console.log("ℹ️ Unhandled event:", event.event_type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
