import { auth } from "@clerk/nextjs/server"
import { connectDB } from "@/app/api/utils/db"
import { BlogModel } from "@/app/models/blog"

export const GET = async () => {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    await connectDB()
    const blogs = await BlogModel.find({ userId })
      .sort({ createdAt: -1 })
      .select("+blogAgent.blog") 

    return new Response(JSON.stringify(blogs), { status: 200 })
  } catch (err) {
    console.error("Failed to fetch blogs:", err)
    return new Response("Server Error", { status: 500 })
  }
}
