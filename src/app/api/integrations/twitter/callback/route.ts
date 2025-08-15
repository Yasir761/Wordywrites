// import { NextRequest, NextResponse } from "next/server";
// import OAuth from "oauth-1.0a";
// import crypto from "crypto";

// const consumerKey = process.env.X_API_KEY!;
// const consumerSecret = process.env.X_API_SECRET!;
// const callbackUrl = process.env.TWITTER_CALLBACK_URL!;

// const oauth = new OAuth({
//   consumer: { key: consumerKey, secret: consumerSecret },
//   signature_method: "HMAC-SHA1",
//   hash_function(base: string, key: string) {
//     return crypto.createHmac("sha1", key).update(base).digest("base64");
//   },
// });

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const oauthToken = searchParams.get("oauth_token");
//   const oauthVerifier = searchParams.get("oauth_verifier");

//   if (!oauthToken || !oauthVerifier) {
//     return NextResponse.json({ error: "Missing oauth_token or oauth_verifier" }, { status: 400 });
//   }

//   const res = await fetch("https://api.twitter.com/oauth/access_token", {
//     method: "POST",
//     headers: {
//       ...oauth.toHeader(
//         oauth.authorize(
//           {
//             url: "https://api.twitter.com/oauth/access_token",
//             method: "POST",
//           },
//           { key: oauthToken, secret: "" }
//         )
//       ),
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       oauth_verifier: oauthVerifier,
//       oauth_token: oauthToken,
//     }),
//   });

//   if (!res.ok) {
//     console.error("Twitter OAuth Callback Error:", await res.text());
//     return NextResponse.json({ error: "Failed to obtain access token" }, { status: 500 });
//   }

//   const text = await res.text();
//   const params = new URLSearchParams(text);

//   const oauthTokenFinal = params.get("oauth_token");
//   const oauthTokenSecret = params.get("oauth_token_secret");
//   const userId = params.get("user_id");
//   const screenName = params.get("screen_name");

//   if (!oauthTokenFinal || !oauthTokenSecret || !screenName) {
//     return NextResponse.json({ error: "Incomplete Twitter response" }, { status: 500 });
//   }

//   // Optionally save to DB or session here

//   return NextResponse.redirect(
//     `http://localhost:3000/dashboard?twitter_token=${oauthTokenFinal}&screen_name=${screenName}`
//   );
// }
