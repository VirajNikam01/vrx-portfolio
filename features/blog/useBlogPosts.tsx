
import { useQuery } from "@tanstack/react-query";

import { blogAction } from "./api";
import type { BlogPostType } from "./types";
import { queryKeys } from "@/data/query-keys";

export function useBlogPosts() {
    return useQuery({
        queryKey: queryKeys.blogPosts,
        queryFn: blogAction.fetchBlogPosts,
        placeholderData: [] as BlogPostType[],
        staleTime: Infinity,
        gcTime: Infinity,
    });
}
