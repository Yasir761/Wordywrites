import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/app/api/utils/db";
import { UserModel } from "@/app/models/user";

function verifyPaddleSignature(rawBody: string, paddleSignature: string, secret: string) {
  const parts = Object.fromEntries(
    paddleSignature.split(";").map((p) => p.split("="))
  );

  const ts = parts["ts"];
  const h1 = parts["h1"];
  if (!ts || !h1) return false;

  const signedPayload = `${ts}:${rawBody}`;
  const computed = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(computed, "hex"),
    Buffer.from(h1, "hex")
  );
}

export async function POST(req: Request) {
  try {
    const paddleSignature = req.headers.get("paddle-signature") || "";
    const secretKey = process.env.PADDLE_WEBHOOK_SECRET;

    if (!paddleSignature || !secretKey) {
      console.error("❌ Missing signature or secret key");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await req.text();

    const valid = verifyPaddleSignature(rawBody, paddleSignature, secretKey);
    if (!valid) {
      console.error("❌ Invalid Paddle signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const { event_type, data } = event;

    console.log("✅ Verified Paddle webhook:", event_type);
    console.log("🔎 Webhook data:", JSON.stringify(data, null, 2));

    await connectDB();

    // Clerk userId (from custom_data)
    const userId = data?.custom_data?.userId;
    const paddleCustomerId = data?.customer_id;
    const subscriptionId = data?.id;
    const productId = data?.items?.[0]?.price?.product_id;

    switch (event_type) {
      case "transaction.completed": {
        if (!userId) {
          console.error("⚠️ No Clerk userId in custom_data, cannot map user.");
          break;
        }

        // ✅ Save only Paddle CustomerId here
        await UserModel.findOneAndUpdate(
          { userId },
          { ...(paddleCustomerId && { paddleCustomerId }) },
          { new: true }
        );

        console.log(`💰 Transaction completed for user: ${userId}`);
        break;
      }

      case "subscription.activated": {
        if (!userId) {
          console.error("⚠️ No Clerk userId in subscription webhook.");
          break;
        }

        const user = await UserModel.findOneAndUpdate(
          { userId },
          {
            plan: productId === "pro_01k3drvrme1ccrvxs07fyw5q7d" ? "Pro" : "Free",
            credits: productId === "pro_01k3drvrme1ccrvxs07fyw5q7d" ? 999 : 5,
            ...(subscriptionId && { paddleSubscriptionId: subscriptionId }),
          },
          { new: true }
        );

        if (user) {
          console.log(`🎉 Subscription activated: ${user.email} → ${user.plan}`);
        }
        break;
      }

      case "subscription.canceled": {
        if (!userId) {
          console.error("⚠️ No Clerk userId in cancel webhook.");
          break;
        }

        await UserModel.findOneAndUpdate(
          { userId },
          { plan: "Free", credits: 5, paddleSubscriptionId: null },
          { new: true }
        );

        console.log(`🔒 Subscription canceled. User downgraded: ${userId}`);
        break;
      }

      default:
        console.log("ℹ️ Unhandled event:", event_type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
