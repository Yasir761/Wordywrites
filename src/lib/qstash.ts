import { Client } from "@upstash/qstash";

export const client = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await client.publishJSON({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/workers/orchestrator`,
      body: body,
      retries: 3, // Retry up to 3 times on failure
    });

    return Response.json({ 
      status: "queued", 
      message: "Blog generation queued successfully." 
    });
  } catch (error) {
    console.error("QStash publish error:", error);
    return Response.json(
      { status: "error", message: "Failed to queue blog generation" },
      { status: 500 }
    );
  }
}