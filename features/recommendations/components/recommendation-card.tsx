import Link from "next/link";
import { ArrowUpRightIcon, BookOpenIcon, GraduationCapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RecommendationItem } from "../types";

type RecommendationCardProps = {
    item: RecommendationItem;
    className?: string;
};

const categoryLabels: Record<string, string> = {
    tech: "Tech",
    philosophy: "Philosophy",
    other: "Other",
};

const categoryColors: Record<string, string> = {
    tech: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    philosophy:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    other: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

function LetterAvatar({ title }: { title: string }) {
    const initial = title.trim()[0]?.toUpperCase() ?? "?";
    const colors = [
        "from-blue-500 to-indigo-600",
        "from-purple-500 to-pink-600",
        "from-emerald-500 to-teal-600",
        "from-orange-500 to-amber-600",
        "from-rose-500 to-red-600",
    ];
    // Stable color from title char code
    const color = colors[title.charCodeAt(0) % colors.length];
    return (
        <div
            className={cn(
                "flex h-16 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-xl font-bold text-white shadow-sm",
                color,
            )}
        >
            {initial}
        </div>
    );
}

export function RecommendationCard({ item, className }: RecommendationCardProps) {
    const TypeIcon = item.type === "book" ? BookOpenIcon : GraduationCapIcon;

    return (
        <div
            className={cn(
                "group flex flex-col gap-4 rounded-xl border border-border/60 bg-background p-5 shadow-sm transition-shadow hover:shadow-md",
                className,
            )}
        >
            <div className="flex items-start gap-4">
                {item.coverImageUrl ? (
                    <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="h-16 w-12 shrink-0 rounded-md object-cover shadow-sm"
                    />
                ) : (
                    <LetterAvatar title={item.title} />
                )}

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                        {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{item.author}</p>
                </div>
            </div>

            {/* Description */}
            <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
                {item.notes && (
                    <Button asChild size="sm" variant="default" className="h-8 gap-1 text-xs">
                        <Link href={`/recommendations/${item.slug}`}>
                            View notes
                            <ArrowUpRightIcon className="size-3" />
                        </Link>
                    </Button>
                )}
                {item.externalUrl && (
                    <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1 text-xs"
                    >
                        <Link
                            href={item.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {item.type === "book" ? "Get book" : "Enroll"}
                            <ArrowUpRightIcon className="size-3" />
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
