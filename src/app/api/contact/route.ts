// import { NextResponse } from "next/server"

// export async function POST(req: Request) {
//   try {
//     const { name, email, message, website } = await req.json()

//     //  Honeypot check
//     if (website) {
//       return NextResponse.json({ error: "Spam detected" }, { status: 400 })
//     }

//     //  Validate fields
//     if (!name || !email || !message || message.length > 2000) {
//       return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
//     }

//     // Forward to Formspree
//     const res = await fetch("https://formspree.io/f/mblkoqwq", {
//       method: "POST",
//       headers: { Accept: "application/json" },
//       body: JSON.stringify({ name, email, message }),
//     })

//     if (!res.ok) {
//       return NextResponse.json({ error: "Formspree error" }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (err) {
//     console.error(err)
//     return NextResponse.json({ error: "Server error" }, { status: 500 })
//   }
// }







import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: Request) {
  const span = Sentry.startSpan({ name: "contact.form.submit" }, (s) => s);

  try {
    const { name, email, message, website } = await req.json();

    // 🛡️ Honeypot check
    if (website) {
      Sentry.captureMessage("Spam bot triggered honeypot field", "warning");
      return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    // 🧪 Validation errors (log soft breadcrumbs)
    if (!name || !email || !message || message.length > 2000) {
      Sentry.addBreadcrumb({
        category: "validation",
        message: "Invalid contact form submission",
        level: "warning",
        data: { name, email, msgLength: message?.length },
      });

      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    // 🌐 Forward to Formspree
    const res = await fetch("https://formspree.io/f/mblkoqwq", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (!res.ok) {
      Sentry.captureException(new Error("Formspree API error"), {
        extra: {
          status: res.status,
          bodyText: await res.text(),
        },
      });

      return NextResponse.json({ error: "Formspree error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    span.end();
  }
}
