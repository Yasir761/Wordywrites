// import { NextRequest, NextResponse } from "next/server";
// import { WordPressPostSchema } from "./schema";
// import { publishBlogToWordPress } from "./publish";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     // 🔍 Validate input with Zod schema
//     const parsed = WordPressPostSchema.safeParse(body);
//     if (!parsed.success) {
//       return NextResponse.json(
//         { error: "Invalid input", issues: parsed.error.flatten() },
//         { status: 400 }
//       );
//     }

//     // 📝 Optional: Additional runtime validations
//     if (parsed.data.content.trim().length < 100) {
//       return NextResponse.json(
//         { error: "Content too short. Must be at least 100 characters." },
//         { status: 422 }
//       );
//     }

//     const result = await publishBlogToWordPress(parsed.data);

//     return NextResponse.json(
//       { message: "✅ Post published successfully", result },
//       { status: 200 }
//     );

//   } catch (err: any) {
//     console.error("❌ WordPress publish failed:", err);

//     return NextResponse.json(
//       { error: err?.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
