
import { useQuery } from "@tanstack/react-query";

import { defaultBlogPosts } from "@/config/blog";
import { blogAction } from "./api";
import { queryKeys } from "@/data/query-keys";

export function useBlogPosts() {
    return useQuery({
        queryKey: queryKeys.blogPosts,
        queryFn: blogAction.fetchBlogPosts,
        initialData: defaultBlogPosts,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}
