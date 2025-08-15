// import OAuth from "oauth-1.0a";
// import crypto from "crypto";

// const consumerKey = process.env.X_API_KEY!;
// const consumerSecret = process.env.X_API_SECRET!;
// const callbackUrl = process.env.TWITTER_CALLBACK_URL!;

// // Validate required envs at runtime (fail fast in dev)
// if (!consumerKey || !consumerSecret || !callbackUrl) {
//   throw new Error("Missing Twitter API credentials or callback URL in environment variables.");
// }

// const oauth = new OAuth({
//   consumer: { key: consumerKey, secret: consumerSecret },
//   signature_method: "HMAC-SHA1",
//   hash_function(base: string, key: string) {
//     return crypto.createHmac("sha1", key).update(base).digest("base64");
//   },
// });

// type OAuthToken = { key: string; secret: string };

// // Generates OAuth 1.0a Auth Header for Twitter API request
// export function getTwitterAuthHeader(
//   url: string,
//   method: "GET" | "POST",
//   token?: OAuthToken
// ) {
//   const oauthToken = token || { key: "", secret: "" };
//   const oauthData = oauth.authorize({ url, method }, oauthToken);
//   return oauth.toHeader(oauthData);
// }
