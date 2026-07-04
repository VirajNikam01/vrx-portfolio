"use client";

import Link from "next/link";
import { ArrowUpRightIcon, CalendarDaysIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPostType } from "../types";
import { cn } from "@/lib/utils";
import { useBlogPosts } from "../useBlogPosts";
import { formatPublishedDate } from "../utils";

type BlogSectionProps = {
    className?: string;
    heading?: string;
    description?: string;
};


const BLOG_URL = "https://blog.virajnikam.in";
const VISIBLE_POST_COUNT = 4;



function padIndex(index: number): string {
    return String(index + 1).padStart(2, "0");
}


function SectionHeader({ heading, description }: Pick<BlogSectionProps, "heading" | "description">) {
    return (
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold tracking-tight text-primary">
                    {heading}
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>

            <Button asChild variant="ghost" size="sm" className="w-fit gap-1.5 text-sm font-medium">
                <Link href={BLOG_URL} target="_blank" rel="noreferrer">
                    All posts
                    <ArrowUpRightIcon className="size-3.5" />
                </Link>
            </Button>
        </div>
    );
}

function PostRow({ post, index }: { post: BlogPostType; index: number }) {
    return (
        <>
            <li>
                <Link
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col gap-2 py-6 md:flex-row md:items-start md:gap-8"
                >
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground/50 md:w-6 md:pt-0.5">
                        {padIndex(index)}
                    </span>

                    <div className="flex-1 space-y-1.5">
                        <h3 className="text-base font-medium text-foreground transition-colors group-hover:text-primary">
                            {post.title}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {post.brief ?? "Open the article to read the full post."}
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground md:pt-0.5">
                        <span className="inline-flex items-center gap-1">
                            <CalendarDaysIcon className="size-3" />
                            {formatPublishedDate(post.publishedAt)}
                        </span>
                        <ArrowUpRightIcon className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </div>
                </Link>
            </li>
            <Separator />
        </>
    );
}

function PostList({ posts }: { posts: BlogPostType[] }) {
    return (
        <ul className="divide-y-0">
            <Separator />
            {posts.map((post, index) => (
                <PostRow key={post.url} post={post} index={index} />
            ))}
        </ul>
    );
}

function PostListSkeleton() {
    return (
        <ul className="divide-y-0">
            <Separator />
            {Array.from({ length: VISIBLE_POST_COUNT }).map((_, i) => (
                <>
                    <li key={i} className="flex gap-8 py-6">
                        <Skeleton className="h-4 w-5 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-4 w-20 shrink-0" />
                    </li>
                    <Separator />
                </>
            ))}
        </ul>
    );
}

function EmptyState() {
    return (
        <p className="py-8 text-sm text-muted-foreground">
            Nothing here yet. Check back soon or{" "}
            <Link
                href={BLOG_URL}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
            >
                visit the blog directly
            </Link>
            .
        </p>
    );
}


export function BlogSection({
    className,
    heading = "Latest Writing",
    description = "Selected notes, experiments, and longer-form thinking.",
}: BlogSectionProps) {
    const { data: posts = [], isLoading } = useBlogPosts();
    const visiblePosts = posts.slice(0, VISIBLE_POST_COUNT);

    return (
        <section id="blog" className={cn("px-6 py-20", className)}>
            <div className="mx-auto w-full max-w-5xl">
                <SectionHeader heading={heading} description={description} />

                {isLoading ? (
                    <PostListSkeleton />
                ) : visiblePosts.length > 0 ? (
                    <PostList posts={visiblePosts} />
                ) : (
                    <EmptyState />
                )}
            </div>
        </section>
    );
}
