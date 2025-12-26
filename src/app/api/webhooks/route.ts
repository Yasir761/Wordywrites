
import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/app/api/utils/db";
import { UserModel } from "@/app/models/user";
import { TransactionModel } from "@/app/models/transaction";

function verifyPaddleSignature(
  rawBody: string,
  paddleSignature: string,
  secret: string
) {
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
      console.error("Missing Paddle signature or secret");
      return NextResponse.json({ received: true });
    }

    const rawBody = await req.text();

    if (!verifyPaddleSignature(rawBody, paddleSignature, secretKey)) {
      console.error("Invalid Paddle signature");
      return NextResponse.json({ received: true });
    }

    const event = JSON.parse(rawBody);
    const { event_type, data, id: eventId } = event;

    await connectDB();

    // Idempotency check
    const alreadyProcessed = await TransactionModel.findOne({
      paddleEventId: eventId,
    });

    if (alreadyProcessed) {
      console.log("Duplicate Paddle event ignored:", eventId);
      return NextResponse.json({ received: true });
    }

    // Extract shared fields
    const userId = data?.custom_data?.userId;
    const paddleCustomerId = data?.customer_id;
    const subscriptionId = data?.id;
    const productId = data?.items?.[0]?.price?.product_id;

    // If we cannot map user, acknowledge and exit
    if (!userId) {
      console.warn("Webhook received without userId");
      return NextResponse.json({ received: true });
    }

    switch (event_type) {
      case "transaction.completed": {
        await TransactionModel.create({
          email: data?.customer?.email,
          plan: data?.items?.[0]?.price?.name,
          amount: data?.totals?.grand_total
            ? data.totals.grand_total / 100
            : 0,
          paddleEventId: eventId,
          orderId: data?.id,
          createdAt: new Date(),
        });

        await UserModel.findOneAndUpdate(
          { userId },
          {
            ...(paddleCustomerId && { paddleCustomerId }),
            checkoutInProgress: false,
          }
        );

        console.log("Transaction completed for user:", userId);
        break;
      }

      case "subscription.activated": {
        await TransactionModel.create({
          email: data?.customer?.email,
          plan: "Pro",
          amount: 0,
          paddleEventId: eventId,
          orderId: subscriptionId,
          createdAt: new Date(),
        });

        await UserModel.findOneAndUpdate(
          { userId },
          {
            plan:
              productId === "pro_01k3drvrme1ccrvxs07fyw5q7d" ? "Pro" : "Free",
            credits:
              productId === "pro_01k3drvrme1ccrvxs07fyw5q7d" ? 999 : 5,
            paddleSubscriptionId: subscriptionId || null,
            checkoutInProgress: false,
          }
        );

        console.log("Subscription activated for user:", userId);
        break;
      }

      case "subscription.canceled": {
        await TransactionModel.create({
          email: data?.customer?.email,
          plan: "Free",
          amount: 0,
          paddleEventId: eventId,
          orderId: subscriptionId,
          createdAt: new Date(),
        });

        await UserModel.findOneAndUpdate(
          { userId },
          {
            plan: "Free",
            credits: 5,
            paddleSubscriptionId: null,
            checkoutInProgress: false,
          }
        );

        console.log("Subscription canceled for user:", userId);
        break;
      }

      default:
        console.log("Unhandled Paddle event:", event_type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);

    // Never return non-200 to Paddle
    return NextResponse.json({ received: true });
  }
}
