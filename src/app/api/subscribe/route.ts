import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEWS_LETTER_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        groups: ["163248113107076228"],
        fields: {
          source: "footer_newsletter",
          product: "wordywrites",
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Already subscribed → treat as success
      if (res.status === 409) {
        return NextResponse.json({
          success: true,
          alreadySubscribed: true,
        });
      }

      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("MailerLite error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
