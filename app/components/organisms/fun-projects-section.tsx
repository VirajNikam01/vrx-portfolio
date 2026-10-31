"use client";

import { cn } from "@/lib/utils";
import type { FunProjectItemType } from "@/shared/contracts/fun-projects";
import { FunProjectCard } from "@/app/components/molecules/fun-project-card";

type FunProjectsSectionProps = {
    projects?: FunProjectItemType[];
    heading?: string;
    description?: string;
    className?: string;
};

export function FunProjectsSection({
    projects = [],
    heading = "Fun Learning Projects",
    description = "Projects built while learning, experimenting, and working with different technologies",
    className,
}: FunProjectsSectionProps) {

    const visibleProjects = projects.filter((p) => p.isVisible);

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

                {/* Projects Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {visibleProjects.map((project) => (
                        <FunProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
