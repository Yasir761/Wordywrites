// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     const priceId = req.nextUrl.searchParams.get("priceId");

//     if (!priceId) {
//       return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
//     }

//     const clientIp =
//       req.headers.get("x-forwarded-for")?.split(",")[0] ||
//       req.headers.get("x-real-ip") ||
//       "1.1.1.1";

//     const res = await fetch(
//       `https://api.paddle.com/prices/${priceId}?customer_ip_address=${clientIp}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PADDLE_PRODUCTION_API}`,
//           "Content-Type": "application/json",
//         },
//         cache: "no-store",
//       }
//     );

//     const json = await res.json();

//     console.log(" PADDLE PRICE RAW RESPONSE:", JSON.stringify(json, null, 2));

//     if (!res.ok || !json?.data) {
//       return NextResponse.json(
//         { error: "Failed to fetch localized price", details: json },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(json.data);
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }








// import { NextRequest, NextResponse } from "next/server";
// import { LOCAL_PRICES, DEFAULT_PRICE } from "@/lib/localPricing";

// export async function GET(req: NextRequest) {
//   try {
//     const priceId = req.nextUrl.searchParams.get("priceId");
//     if (!priceId) {
//       return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
//     }

//     const clientIp =
//       req.headers.get("x-forwarded-for")?.split(",")[0] ||
//       req.headers.get("x-real-ip") ||
//       "1.1.1.1";

//     const res = await fetch(
//       `https://api.paddle.com/prices/${priceId}?customer_ip_address=${clientIp}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PADDLE_PRODUCTION_API}`,
//           "Content-Type": "application/json",
//         },
//         cache: "no-store",
//       }
//     );

//     const json = await res.json();
//     console.log("PADDLE PRICE RAW RESPONSE:", JSON.stringify(json, null, 2));

//     if (!res.ok || !json?.data) {
//       return NextResponse.json(
//         { error: "Failed to fetch localized price", details: json },
//         { status: 500 }
//       );
//     }

//     const data = json.data;

//     // Paddle price shape: adjust if your response nests under unit_price
//     const amountMinor = data.unit_price?.amount ?? data.amount; // e.g. 999
//     const currency = data.unit_price?.currency_code ?? data.currency_code; // e.g. "USD"

//     // Country from Paddle (if present) or fallback API
//     const country = data?.customer_country || data?.country || "US";

//     // Use Paddle amount if present, otherwise your LOCAL_PRICES table
//     let symbol = "$";
//     let formatted = `$${(amountMinor / 100).toFixed(2)}`;

//     const localConfig =
//       LOCAL_PRICES[country as keyof typeof LOCAL_PRICES] ?? DEFAULT_PRICE;

//     if (!amountMinor || !currency) {
//       // fallback: from your own lookup
//       symbol = localConfig.symbol;
//       formatted =
//         currency === "INR"
//           ? `${symbol}${localConfig.amount.toFixed(0)}`
//           : `${symbol}${localConfig.amount.toFixed(2)}`;
//     } else {
//       // format based on currency
//       symbol = localConfig.symbol || "$";
//       if (currency === "INR" || currency === "JPY") {
//         formatted = `${symbol}${Math.round(amountMinor / 1).toString()}`;
//       } else {
//         formatted = `${symbol}${(amountMinor / 100).toFixed(2)}`;
//       }
//     }

//     return NextResponse.json({
//       formatted,     // this is what the UI expects
//       currency,
//       country,
//       raw: data,     // optional, for debugging
//     });
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }




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
    let formatted =
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


