import { NextRequest, NextResponse } from "next/server"
import { createPrompt } from "./prompt"
import { AnalyzeAgentSchema } from "./schema"
import {
  isWithinTokenLimit,
  splitTextByTokenLimit
} from "@/app/api/utils/tokenUtils"
import { connectDB } from "@/app/api/utils/db"

const MAX_TOKENS = 2000

export async function POST(req: NextRequest) {
  const { keyword } = await req.json()

  if (!keyword) {
    return NextResponse.json({ error: "Missing keyword" }, { status: 400 })
  }

  try {
    await connectDB()

    // 🔓 Skipping credit and plan checks for now
    // await checkAndConsumeCredit(email, { allowOnly: ["Starter", "Pro"] })

    const serpRes = await fetch(
      `https://serpapi.com/search.json?q=${encodeURIComponent(keyword)}&api_key=${process.env.SERP_API_KEY}`
    )
    const serpJson = await serpRes.json()

    if (!serpJson.organic_results || serpJson.organic_results.length === 0) {
      return NextResponse.json({ error: "No SERP data found" }, { status: 404 })
    }

    const organicResults = serpJson.organic_results.slice(0, 5)

    const prompt = createPrompt(keyword, organicResults)

    if (!isWithinTokenLimit(prompt, MAX_TOKENS)) {
      const chunks = splitTextByTokenLimit(prompt, MAX_TOKENS)
      return NextResponse.json({
        error: "Prompt too long",
        chunks,
        suggestion: "Reduce number of SERP results or truncate content."
      }, { status: 413 })
    }

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are an SEO analyst and strategist." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      })
    })

    const aiJson = await aiRes.json()

    if (!aiJson.choices?.[0]?.message?.content) {
      return NextResponse.json({ error: "No AI content returned." }, { status: 500 })
    }

    const rawOutput = aiJson.choices[0].message.content

    let parsed
    try {
      parsed = JSON.parse(rawOutput || "{}")
    } catch (err) {
      console.error("❌ JSON parse error:", err, "\nOutput:", rawOutput)
      return NextResponse.json({ error: "Failed to parse AI output", raw: rawOutput }, { status: 500 })
    }

    const validation = AnalyzeAgentSchema.safeParse(parsed)

    if (!validation.success) {
      return NextResponse.json({
        error: "Output schema validation failed",
        issues: validation.error.flatten(),
        raw: parsed
      }, { status: 422 })
    }

    return NextResponse.json({
      keyword,
      ...validation.data
    })

  } catch (err: unknown) {
    console.error("🔍 Analyze Agent Fatal Error:", err)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
