import { NextResponse } from "next/server";
import crypto from "crypto";

function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  
  if (!secret) {
    console.error("❌ PADDLE_WEBHOOK_SECRET not set");
    return false;
  }

  try {
    // Extract the signature from the header (format: "ts=timestamp;h1=signature")
    const signatureMatch = signature.match(/h1=([^;]+)/);
    const extractedSignature = signatureMatch ? signatureMatch[1] : signature;
    
    // Create HMAC
    const hmac = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");
    
    return crypto.timingSafeEqual(
      Buffer.from(hmac, 'hex'),
      Buffer.from(extractedSignature, 'hex')
    );
  } catch (error) {
    console.error("❌ Signature verification error:", error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature") || "";

    console.log("🔔 Webhook received, verifying signature...");

    if (!verifySignature(rawBody, signature)) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    console.log("✅ Verified Paddle webhook:", event.event_type);
    console.log("📦 Event data:", JSON.stringify(event.data, null, 2));

    // Handle different event types
    switch (event.event_type) {
      case 'transaction.completed':
        console.log("💰 Payment completed for transaction:", event.data.id);
        // Handle successful payment - update user subscription, send confirmation email, etc.
        break;
        
      case 'transaction.payment_failed':
        console.log("❌ Payment failed for transaction:", event.data.id);
        // Handle failed payment
        break;
        
      case 'subscription.created':
        console.log("🔄 Subscription created:", event.data.id);
        // Handle new subscription
        break;
        
      default:
        console.log("ℹ️ Unhandled event type:", event.event_type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}