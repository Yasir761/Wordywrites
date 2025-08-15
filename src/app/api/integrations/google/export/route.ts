// import { NextRequest, NextResponse } from "next/server";
// import { createGoogleDoc } from "../docs";
// import { GoogleTokenData } from "../types";
// import { auth } from "@clerk/nextjs/server";
// import { checkAndConsumeCredit } from "@/app/api/utils/useCredits";

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { title, content, tokens } = body;

//   if (!title || !content || !tokens || !tokens.access_token) {
//     return NextResponse.json({ error: "Missing title, content, or valid tokens" }, { status: 400 });
//   }

//   try {
//     // 🔐 Authenticate user
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // 📧 Fetch user email from Clerk
//     const userRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
//       headers: {
//         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
//       },
//     });

//     const user = await userRes.json();
//     const email = user?.email_addresses?.[0]?.email_address;

//     if (!email) {
//       return NextResponse.json({ error: "User email not found" }, { status: 403 });
//     }

//     // ✅ Allow only Starter or Pro users
//     const userData = await checkAndConsumeCredit(email, { allowOnly: ["Starter", "Pro"] });

//     if (userData.plan === "Free") {
//       return NextResponse.json({
//         error: "Upgrade to Starter or Pro to use Google Docs export",
//       }, { status: 403 });
//     }

//     const docId = await createGoogleDoc(tokens as GoogleTokenData, title, content);

//     if (!docId) {
//       return NextResponse.json({ error: "Failed to create Google Doc" }, { status: 502 });
//     }

//     return NextResponse.json({ success: true, documentId: docId });
//   } catch (err: any) {
//     console.error("🚨 Google Docs export error:", err?.message || err);
//     return NextResponse.json({ error: "Failed to export to Google Docs", detail: err.message }, { status: 500 });
//   }
// }
