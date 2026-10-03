import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SkillItemType } from "../types";

type SkillCardProps = {
    skill: SkillItemType;
    className?: string;
};

const proficiencyVariantMap: Record<
    NonNullable<SkillItemType["proficiency"]>,
    "default" | "secondary" | "outline"
> = {
    Expert: "default",
    Advanced: "secondary",
    Intermediate: "outline",
    Exploring: "outline",
};

export function SkillCard({ skill, className }: SkillCardProps) {
    return (
        <div
            className={cn(
                "group relative flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/50 p-3.5 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-muted/40 hover:shadow-sm",
                skill.highlight && "border-primary/30 bg-primary/5",
                className
            )}
        >
            <div className="flex items-center gap-2.5 min-w-0">
                <span className="truncate text-sm font-medium text-foreground transition-colors">
                    {skill.name}
                </span>
            </div>

            {skill.proficiency && (
                <Badge
                    variant={proficiencyVariantMap[skill.proficiency]}
                    className="shrink-0 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 hidden sm:visible"
                >
                    {skill.proficiency}
                </Badge>
            )}
        </div>
    );
}
