// import { NextRequest, NextResponse } from "next/server";
// import { getTokensFromCode } from "../auth";

// export async function GET(req: NextRequest) {
//   const url = new URL(req.url);
//   const code = url.searchParams.get("code");

//   if (!code) {
//     console.warn("❌ No authorization code in callback URL");
//     return NextResponse.json({ error: "Authorization code not found in URL" }, { status: 400 });
//   }

//   try {
//     const tokens = await getTokensFromCode(code);

//     if (!tokens || !tokens.access_token) {
//       return NextResponse.json({ error: "Failed to obtain Google tokens" }, { status: 401 });
//     }

//     // TODO: Save tokens in DB/session associated with user

//     return NextResponse.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard?google=connected`);
//   } catch (err) {
//     console.error("⚠️ OAuth Callback Error:", err);
//     return NextResponse.json({ error: "OAuth callback failed" }, { status: 500 });
//   }
// }
