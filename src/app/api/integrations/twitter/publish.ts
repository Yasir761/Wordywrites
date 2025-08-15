// import OAuth from "oauth-1.0a";
// import crypto from "crypto";
// import { TwitterTokenData } from "./types";

// const consumerKey = process.env.X_API_KEY!;
// const consumerSecret = process.env.X_API_SECRET!;

// const oauth = new OAuth({
//   consumer: { key: consumerKey, secret: consumerSecret },
//   signature_method: "HMAC-SHA1",
//   hash_function(base: string, key: string) {
//     return crypto.createHmac("sha1", key).update(base).digest("base64");
//   },
// });

// export async function publishTwitterThread(
//   tokens: TwitterTokenData,
//   content: string
// ): Promise<string[]> {
//   const tweets = splitToThread(content);
//   const postedTweetIds: string[] = [];

//   let lastTweetId: string | undefined;

//   for (const tweet of tweets) {
//     const url = "https://api.twitter.com/2/tweets";
//     const requestData = {
//       url,
//       method: "POST",
//       data: {
//         text: tweet,
//         ...(lastTweetId ? { reply: { in_reply_to_tweet_id: lastTweetId } } : {}),
//       },
//     };

//     const headers = oauth.toHeader(
//       oauth.authorize(requestData, {
//         key: tokens.accessToken,
//         secret: tokens.accessSecret,
//       })
//     );

//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         ...headers,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestData.data),
//     });

//     const json = await res.json();

//     if (!res.ok || !json?.data?.id) {
//       console.error("❌ Twitter API error:", json);
//       throw new Error(`Twitter API failed: ${JSON.stringify(json)}`);
//     }

//     lastTweetId = json.data.id;
//     postedTweetIds.push(lastTweetId as string);
//   }

//   return postedTweetIds;
// }

// function splitToThread(text: string): string[] {
//   const sentences = text.split(/(?<=[.?!])\s+/);
//   const thread: string[] = [];
//   let tweet = "";

//   for (const sentence of sentences) {
//     if ((tweet + sentence).length <= 275) {
//       tweet += sentence + " ";
//     } else {
//       if (tweet.trim()) thread.push(tweet.trim());
//       tweet = sentence + " ";
//     }
//   }

//   if (tweet.trim()) thread.push(tweet.trim());
//   return thread;
// }
