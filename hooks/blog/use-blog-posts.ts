"use client";

import { useQuery } from "@tanstack/react-query";

import { defaultBlogPosts } from "@/config/blog";
import { blogApi } from "@/lib/api/blog";
import { queryKeys } from "@/data/query-keys";

export function useBlogPosts() {
    return useQuery({
        queryKey: queryKeys.blogPosts,
        queryFn: blogApi.fetchBlogPosts,
        placeholderData: defaultBlogPosts,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}
