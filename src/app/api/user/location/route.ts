import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "";

    // Localhost/bogon fallback
    if (!ip || ip === "::1" || ip === "127.0.0.1") {
      return NextResponse.json({
        country: "United States",
        country_code: "US",
      });
    }

    const apiKey = process.env.IPGEOLOCATION_API_KEY!;
    const url = ip
      ? `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`
      : `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`;

    const geoRes = await fetch(url, { cache: "no-store" });
    const data = await geoRes.json();

    console.log("IPGEO_DATA:", data);

    // Bogon IP fallback
    if (data.message && data.message.includes("bogon")) {
      return NextResponse.json({
        country: "United States",
        country_code: "US",
      });
    }

    if (!data || !data.country_code2) {
      return NextResponse.json({
        country: "United States",
        country_code: "US",
      });
    }

    return NextResponse.json({
      country: data.country_name,
      country_code: data.country_code2,
    });
  } catch (e) {
    console.error("GEO_ERROR:", e);
    return NextResponse.json({
      country: "United States",
      country_code: "US",
    });
  }
}
