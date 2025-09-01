import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, email, message, website } = await req.json()

    // 🚨 Honeypot check
    if (website) {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 })
    }

    // 🚨 Validate fields
    if (!name || !email || !message || message.length > 2000) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
    }

    // Forward to Formspree
    const res = await fetch("https://formspree.io/f/mblkoqwq", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: JSON.stringify({ name, email, message }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Formspree error" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
