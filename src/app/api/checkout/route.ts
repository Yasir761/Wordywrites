// import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server"
// export async function POST(req: Request) {
//   try {
//     const { userId } = await auth()
//      if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     const body = await req.json();
//     const { priceId } = body;

//     console.log("Received request body:", body);

//     if (!priceId) {
//       return NextResponse.json(
//         { error: "Price ID is required" },
//         { status: 400 }
//       );
//     }

//     console.log("Creating transaction with price ID:", priceId);

//     const transactionRes = await fetch("https://api.paddle.com/transactions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.PADDLE_PRODUCTION_API}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
        
//         items: [
//           {
//             price_id: priceId,
//             quantity: 1,
//           },
//         ],
//         custom_data:{
//           userId: String(userId)
//         },
//         //  Redirect URLs (make sure these routes exist in your Next.js app)
//         success_url: "http://wordywrites.app/dashboard",
//         // cancel_url: "http://localhost:3000/cancel",
//       }),
//     });

//     const transactionData = await transactionRes.json();
//     console.log("Paddle Transaction API response:", transactionData);

//     if (!transactionRes.ok) {
//       console.error(" Paddle Transaction API error:");
//       console.error("Status:", transactionRes.status);
//       console.error("Response:", JSON.stringify(transactionData, null, 2));
//       if (transactionData.error?.errors) {
//         console.error(
//           "Detailed errors:",
//           JSON.stringify(transactionData.error.errors, null, 2)
//         );
//       }
//       return NextResponse.json({ error: transactionData }, { status: 500 });
//     }

//     const transaction = transactionData.data;
//     console.log(
//       " Transaction created:",
//       transaction.id,
//       "Status:",
//       transaction.status
//     );

//     const checkoutUrl = transaction.checkout?.url;

//     if (!checkoutUrl) {
//       console.error(" No checkout URL in transaction:", transaction);
//       return NextResponse.json(
//         { error: "No checkout URL available" },
//         { status: 500 }
//       );
//     }

//     console.log(" Checkout URL:", checkoutUrl);

//     return NextResponse.json({
//       transactionId: transaction.id,
//       checkoutUrl,
//       status: transaction.status,
//     });
//   } catch (err: any) {
//     console.error(" Checkout API error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }





import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: Request) {
  const transactionSpan = Sentry.startSpan({ name: "paddle.transaction.create" }, (span) => span);

  try {
    const { userId } = await auth();
    if (!userId) {
      Sentry.captureMessage("Unauthorized payment attempt", "warning");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { priceId } = body;

    Sentry.addBreadcrumb({
      category: "payment",
      message: "Starting Paddle transaction",
      data: { priceId, userId },
      level: "info",
    });

    if (!priceId) {
      Sentry.captureMessage("Missing priceId in Paddle checkout");
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    const res = await fetch("https://api.paddle.com/transactions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PADDLE_PRODUCTION_API}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }],
        custom_data: { userId },
        success_url: "https://wordywrites.app/dashboard",
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      Sentry.captureException(new Error("Paddle transaction failed"), {
        extra: {
          status: res.status,
          response: json,
        },
      });

      return NextResponse.json({ error: json }, { status: 500 });
    }

    const checkoutUrl = json.data?.checkout?.url;
    if (!checkoutUrl) {
      Sentry.captureException(new Error("Missing checkout URL in Paddle response"), {
        extra: json,
      });

      return NextResponse.json(
        { error: "No checkout URL available" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      transactionId: json.data.id,
      checkoutUrl,
      status: json.data.status,
    });
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  } finally {
    transactionSpan.end();
  }
}
