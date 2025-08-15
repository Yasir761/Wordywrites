import { NextRequest, NextResponse } from "next/server";

const LEMON_API_KEY = process.env.LEMON_API_KEY;
const STORE_ID = process.env.LEMON_STORE_ID;

export async function POST(req: NextRequest) {
  const { variantId, userId } = await req.json();

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
          checkout_data: { custom: { userId } }
        },
        relationships: {
          store: { data: { type: "stores", id: STORE_ID } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
  });

  const data = await res.json();
  return NextResponse.json({ url: data.data.attributes.url });
}
