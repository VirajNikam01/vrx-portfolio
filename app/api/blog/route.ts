import "server-only";
import { blogService } from "@/backend/services/blog";

export async function GET() {
    const posts = await blogService.getBlogPosts();

    return Response.json({ data: posts });
}
