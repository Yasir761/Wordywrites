
import { NextResponse } from "next/server";
import crypto from "crypto";

function verifySignature(body: string, signature: string) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return hmac === signature;
}









export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("paddle-signature") || "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  console.log("✅ Verified Paddle webhook:", event.type);
}
