"use client";

import React, { useState } from "react";
import { SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SkillCategory, SkillItemType } from "@/shared/contracts/skills";
import { SkillCard } from "@/app/components/molecules/skill-card";

type SkillsSectionProps = {
    skills?: SkillItemType[];
    heading?: string;
    description?: string;
    className?: string;
};

const categories: ("All" | SkillCategory)[] = [
    "All",
    "Core & Languages",
    "Frontend & Frameworks",
    "Design & 3D",
    "Backend & DB",
    "Tools & DevOps",
];

export function SkillsSection({
    skills = [],
    heading = "Tech Stack",
    description = "overview of the languages, frameworks, tools, and development practices that have shaped the way I build, solve problems, and think about software.",
    className,
}: SkillsSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<"All" | SkillCategory>("All");

    const visibleSkills = skills.filter((s) => s.isVisible);
    const filteredSkills =
        selectedCategory === "All"
            ? visibleSkills
            : visibleSkills.filter((s) => s.category === selectedCategory);

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

                {/* Category Filter Tabs */}
                {/* <div className="flex flex-wrap gap-2 border-b border-border/60 pb-4">
                    {categories.map((category) => {
                        const isSelected = selectedCategory === category;
                        const count =
                            category === "All"
                                ? visibleSkills.length
                                : visibleSkills.filter((s) => s.category === category).length;

                        if (count === 0 && category !== "All") return null;

                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors select-none",
                                    isSelected
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <span>{category}</span>
                                <span
                                    className={cn(
                                        "rounded-full px-1.5 py-0.2 text-[10px]",
                                        isSelected
                                            ? "bg-primary-foreground/20 text-primary-foreground"
                                            : "bg-background text-muted-foreground"
                                    )}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div> */}

                {/* Skills Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredSkills.map((skill) => (
                        <SkillCard key={skill.id} skill={skill} />
                    ))}
                </div>
            </div>
        </section>
    );
}
