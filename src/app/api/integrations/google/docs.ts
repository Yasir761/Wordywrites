
// import { google } from "googleapis";
// import { GoogleTokenData } from "./types";

// export async function createGoogleDoc(tokens: GoogleTokenData, title: string, content: string) {
//   if (!tokens || !tokens.access_token) {
//     throw new Error("❌ Invalid or missing access token.");
//   }

//   const auth = new google.auth.OAuth2();
//   auth.setCredentials(tokens);

//   const docs = google.docs({ version: "v1", auth });

//   try {
//     // 📝 1. Create empty document with title
//     const doc = await docs.documents.create({
//       requestBody: {
//         title,
//       },
//     });

//     const documentId = doc.data.documentId;
//     if (!documentId) {
//       throw new Error("❌ Failed to create document — missing documentId.");
//     }

//     // ✏️ 2. Insert content into the new document
//     const insertRes = await docs.documents.batchUpdate({
//       documentId,
//       requestBody: {
//         requests: [
//           {
//             insertText: {
//               location: { index: 1 },
//               text: content,
//             },
//           },
//         ],
//       },
//     });

//     // Optionally validate insertRes.status or insertRes.data.replies

//     return {
//       documentId,
//       link: `https://docs.google.com/document/d/${documentId}/edit`,
//     };
//   } catch (err: any) {
//     console.error("💥 Google Docs API Error:", err.message || err);
//     throw new Error("Failed to create and write to Google Doc");
//   }
// }
