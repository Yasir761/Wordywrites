import { NextRequest, NextResponse } from "next/server";

const LEMON_API_KEY = process.env.LEMON_API_KEY;
const STORE_ID = process.env.LEMON_STORE_ID;

export async function POST(req: NextRequest) {
  try {
    const { variantId, userId } = await req.json();

    if (!variantId || !userId) {
      return NextResponse.json({ error: "Missing variantId or userId" }, { status: 400 });
    }

    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LEMON_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: { custom: { userId } },
            checkout_options: { embed: false },
          },
          relationships: {
            store: { data: { type: "stores", id: '203600' } },
            variant: { data: { type: "variants", id: '951884' } },
          },
        },
      }),
    });

    const data = await res.json().catch(() => null); // prevent JSON parse error

    if (!res.ok || !data?.data?.attributes?.url) {
      console.error("Lemon Squeezy API error:", data);
      return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
    }

    return NextResponse.json({ url: data.data.attributes.url });

  } catch (err) {
    console.error("Checkout route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
 

// error ko sahi krna ik baar server run krkr