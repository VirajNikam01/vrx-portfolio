import { getBlogPosts } from "@/lib/hashnode";

export async function GET() {
    const posts = await getBlogPosts();

    return Response.json({ data: posts });
}
