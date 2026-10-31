"use client";

import { cn } from "@/lib/utils";
import type { SkillItemType } from "@/shared/contracts/skills";
import { SkillCard } from "@/app/components/molecules/skill-card";

type SkillsSectionProps = {
    skills?: SkillItemType[];
    heading?: string;
    description?: string;
    className?: string;
};

export function SkillsSection({
    skills = [],
    heading = "Tech Stack",
    description = "overview of the languages, frameworks, tools, and development practices that have shaped the way I build, solve problems, and think about software.",
    className,
}: SkillsSectionProps) {

    const visibleSkills = skills.filter((s) => s.isVisible);

    if (visibleSkills.length === 0) return null;

    return (
        <section
            id="skills"
            className={cn(
                "relative border-y border-border/60 bg-transparent px-6 py-10 sm:py-20",
                className
            )}
        >
            <div className="mx-auto w-full max-w-5xl space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl space-y-3">
                        <h2 className="text-3xl font-semibold text-primary uppercase tracking-tight">
                            {heading}
                        </h2>
                        <p className="tracking-tight text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {visibleSkills.map((skill) => (
                        <SkillCard key={skill.id} skill={skill} />
                    ))}
                </div>
            </div>
        </section>
    );
}
