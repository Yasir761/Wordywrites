

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
 import { UserModel } from "@/app/models/user";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId } = await req.json();
    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }


   

const user = await UserModel.findOne({ userId });

if (user?.plan === "Pro") {
  return NextResponse.json(
    { error: "User already has an active subscription" },
    { status: 400 }
  );
}

//  Prevent duplicate checkout
const locked = await UserModel.findOneAndUpdate(
  {
    userId,
    checkoutInProgress: { $ne: true },
  },
  {
    checkoutInProgress: true,
  },
  { new: true }
);

if (!locked) {
  return NextResponse.json(
    { error: "Checkout already in progress" },
    { status: 409 }
  );
}



    //  PROPER GEO IP DETECTION
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      undefined;

   
    const lookupUrl = `https://api.paddle.com/prices/lookup?price_id=${priceId}${
      ip ? `&customer_ip_address=${ip}` : ""
    }`;

    const priceLookupRes = await fetch(lookupUrl, {
      headers: {
        Authorization: `Bearer ${process.env.PADDLE_PRODUCTION_API}`,
      },
    });

    const lookupJson = await priceLookupRes.json();
    const price = lookupJson?.data?.[0];

    if (!price) {
      Sentry.captureException(new Error("Paddle price lookup failed"), {
        extra: lookupJson,
      });
      return NextResponse.json(
        { error: "Failed to fetch localized Paddle pricing" },
        { status: 500 }
      );
    }

    //  CREATE TRANSACTION WITH CORRECT LOCALIZED CURRENCY
    const transactionRes = await fetch("https://api.paddle.com/transactions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PADDLE_PRODUCTION_API}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            price_id: priceId,
            quantity: 1,
            currency_code: price.currency_code, // ₹ / £ / € etc.
          },
        ],
        customer_ip_address: ip,
        custom_data: { userId },
        success_url: "https://wordywrites.app/dashboard",
      }),
    });

    const json = await transactionRes.json();

    if (!transactionRes.ok) {
      Sentry.captureException(new Error("Paddle checkout failed"), {
        extra: json,
      });
      return NextResponse.json({ error: json }, { status: 500 });
    }

    const checkoutUrl = json.data?.checkout?.url;
    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "Checkout URL missing from Paddle" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      transactionId: json.data.id,
      checkoutUrl,
      status: json.data.status,
    });
  } catch (err: any) {
    Sentry.captureException(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
