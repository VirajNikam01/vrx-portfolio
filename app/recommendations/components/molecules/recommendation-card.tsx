import { InitialAvatar } from "@/app/components/atoms/initial-avatar";
import { cn } from "@/lib/utils";
import type { RecommendationItem } from "@/shared/contracts/recommendations";

type RecommendationCardProps = {
    item: RecommendationItem;
    className?: string;
};

export function RecommendationCard({ item, className }: RecommendationCardProps) {

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
                    <InitialAvatar title={item.title} className="h-16 w-12 shrink-0 rounded-md text-xl shadow-sm" />
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
        </div>
    );
}
