import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"  // enable if you want Clerk auth

export async function POST(req: Request) {
    try {
     
    // ✅ (Optional) require auth
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, email, message } = await req.json()

    // ✅ (Optional) simple anti-spam: block empty or too-long submissions
    if (!name || !email || !message || message.length > 2000) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
    }

    // Forward to Formspree (or another provider)
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
