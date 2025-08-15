// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { checkAndConsumeCredit } from "@/app/api/utils/useCredits";
// import { publishTwitterThread } from "../publish";
// import { TwitterTokenData } from "../types";

// export async function POST(req: NextRequest) {
//   const { content, tokens } = await req.json();

//   if (!content || !tokens) {
//     return NextResponse.json({ error: "Missing content or tokens" }, { status: 400 });
//   }

//   try {
//     // ✅ Clerk auth
//     const { userId } = await auth();
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     // ✅ Get user email via Clerk
//     const userRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
//       headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
//     });
//     const user = await userRes.json();
//     const email = user?.email_addresses?.[0]?.email_address;
//     if (!email) return NextResponse.json({ error: "User email not found" }, { status: 403 });

//     // ✅ Only allow Pro users to publish to Twitter
//     const currentUser = await checkAndConsumeCredit(email, { allowOnly: ["Pro"] });

//     // ✅ Publish Twitter thread
//     const tweetIds = await publishTwitterThread(tokens as TwitterTokenData, content);

//     return NextResponse.json({ success: true, tweetIds });
//   } catch (err: any) {
//     console.error("💥 Twitter Export Error:", err?.message || err);
//     return NextResponse.json({ error: "Failed to export to Twitter", detail: err.message }, { status: 500 });
//   }
// }
