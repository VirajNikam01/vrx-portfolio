import type { BlogPostType } from "@/shared/contracts/blog";

export async function fetchBlogPosts(): Promise<BlogPostType[]> {
    const response = await fetch("/api/blog", {
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        return [];
    }

    const payload = (await response.json()) as { data?: BlogPostType[] };
    return payload.data ?? [];
}

export const blogApi = {
    fetchBlogPosts,
};
