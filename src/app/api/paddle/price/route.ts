


import { NextRequest, NextResponse } from "next/server";
import { LOCAL_PRICES, DEFAULT_PRICE } from "@/lib/localPricing";

export async function GET(req: NextRequest) {
  try {
    const priceId = req.nextUrl.searchParams.get("priceId");
    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    const baseUrl = process.env.APP_URL || req.nextUrl.origin;

    //  FIX: Correct domain for production
    const locationRes = await fetch(`${baseUrl}/api/user/location`, {
      headers: req.headers,
    });

    const locationData = await locationRes.json();
    const countryCode = locationData.country_code || "US";

    const priceConfig =
      LOCAL_PRICES[countryCode as keyof typeof LOCAL_PRICES] ||
      DEFAULT_PRICE;

    // Format price correctly
    const formatted =
      priceConfig.currency === "INR" || priceConfig.currency === "JPY"
        ? `${priceConfig.symbol}${Math.round(priceConfig.amount)}`
        : `${priceConfig.symbol}${priceConfig.amount.toFixed(2)}`;

    return NextResponse.json({
      formatted,
      currency: priceConfig.currency,
      country_code: countryCode,
      amount: priceConfig.amount,
      symbol: priceConfig.symbol,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message, formatted: "$9.99" },
      { status: 500 }
    );
  }
}


