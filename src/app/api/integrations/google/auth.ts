
// import { google } from "googleapis";

// if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
//   throw new Error("❌ Google OAuth ENV vars missing. Check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI");
// }

// // 🔐 OAuth Client Setup
// export const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );

// // 📌 Scopes
// const SCOPES = [
//   "https://www.googleapis.com/auth/documents",     // Google Docs
//   "https://www.googleapis.com/auth/drive.file",    // Create/edit files created by your app
//   "openid",
//   "email",
//   "profile"
// ];

// // 🔗 Get Auth URL
// export function getGoogleAuthURL() {
//   return oauth2Client.generateAuthUrl({
//     access_type: "offline",         // To receive refresh_token
//     prompt: "consent",              // Always show consent screen to get refresh_token
//     scope: SCOPES
//   });
// }

// // 🎟️ Exchange Code for Tokens
// export async function getTokensFromCode(code: string) {
//   try {
//     const { tokens } = await oauth2Client.getToken(code);

//     if (!tokens || !tokens.access_token) {
//       throw new Error("❌ Failed to get valid Google tokens");
//     }

//     return tokens;
//   } catch (err: any) {
//     console.error("⚠️ Error exchanging code for tokens:", err.message || err);
//     throw new Error("Failed to exchange code for tokens");
//   }
// }
