import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const priceId = req.nextUrl.searchParams.get("priceId");

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing priceId" },
        { status: 400 }
      );
    }

    // Get client IP for region-based price
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.ip ||
      "1.1.1.1"; // fallback

    const res = await fetch(
      `https://api.paddle.com/prices/${priceId}?customer_ip_address=${clientIp}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PADDLE_PRODUCTION_API}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok || !json?.data) {
      return NextResponse.json(
        { error: "Failed to fetch localized price", details: json },
        { status: 500 }
      );
    }

    const price = json.data;

    return NextResponse.json({
      currency: price.currency_code,                     // ex: INR
      amount: price.unit_price / 100,                    // convert cents → full currency
      formatted: price.formatted_price.unit_price,       // ex: ₹799
      country: price.country,                            // ex: IN
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
