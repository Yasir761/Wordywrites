import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const event = await req.json();

  console.log("LemonSqueezy Webhook Event:", event.type);

  if (event.type === "subscription_created" || event.type === "subscription_updated") {
    const userId = event.data.attributes.checkout_data.custom.userId;
    const variantId = event.data.relationships.variant.data.id;

    // Map variant ID to plan
    const plan = variantId === process.env.LEMON_VARIANT_PRO ? "pro" : "free";

    // Update your DB
    // await updateUserPlan(userId, plan);
  }

  return NextResponse.json({ received: true });
}
