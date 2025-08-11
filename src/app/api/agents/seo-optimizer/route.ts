import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
import { checkAndConsumeCredit } from "@/app/api/utils/useCredits";
import { createPrompt } from "./prompt";
import { SEOOptimizerSchema } from "./schema";

export async function POST(req: NextRequest) {
  const { keyword, outline, tone, voice, tags } = await req.json();

  if (!keyword || !outline || !tone || !voice || !tags) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    // 🔐 Auth & get email from Clerk
    // const { userId } = await auth();

    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const userRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    //   headers: {
    //     Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    //   },
    // });

    // const user = await userRes.json();
    // const email = user?.email_addresses?.[0]?.email_address;

    // if (!email) {
    //   return NextResponse.json({ error: "User email not found" }, { status: 403 });
    // }

    // ✅ Enforce pricing (Free plan blocked after 0 credits)
    // await checkAndConsumeCredit(email, { allowOnly: ["Starter", "Pro"] });

    // 🧠 Create prompt
    const prompt = createPrompt(keyword, outline, tone, voice, tags);

    // 🤖 Call OpenAIa
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an SEO blog optimizer." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    const json = await aiRes.json();
    const output = json.choices?.[0]?.message?.content?.trim() || "";

    const validated = SEOOptimizerSchema.safeParse(JSON.parse(output));

    if (!validated.success) {
      console.error("❌ SEO validation failed:", validated.error.flatten());
      return NextResponse.json({
        error: "Validation failed",
        raw: output,
        issues: validated.error.flatten(),
      }, { status: 422 });
    }

    return NextResponse.json(validated.data);
  } catch (err) {
    console.error("💥 SEO Optimizer Agent Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
