"use client";

import React, { useState } from "react";
import { RocketIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FunProjectCategory, FunProjectItemType } from "@/shared/contracts/fun-projects";
import { FunProjectCard } from "@/app/components/molecules/fun-project-card";

type FunProjectsSectionProps = {
    projects?: FunProjectItemType[];
    heading?: string;
    description?: string;
    className?: string;
};

const categories: ("All" | FunProjectCategory)[] = [
    "All",
    "Web Application",
    "Desktop Application"
];

export function FunProjectsSection({
    projects = [],
    heading = "Fun Learning Projects",
    description = "Projects built while learning, experimenting, and working with different technologies",
    className,
}: FunProjectsSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<"All" | FunProjectCategory>("All");

    const visibleProjects = projects.filter((p) => p.isVisible);
    const filteredProjects =
        selectedCategory === "All"
            ? visibleProjects
            : visibleProjects.filter((p) => p.category === selectedCategory);

    if (visibleProjects.length === 0) return null;

    return (
        <section
            id="fun-projects"
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
                                ? visibleProjects.length
                                : visibleProjects.filter((p) => p.category === category).length;

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

                {/* Projects Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {filteredProjects.map((project) => (
                        <FunProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
