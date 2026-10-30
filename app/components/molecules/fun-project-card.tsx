import React from "react";
import { ExternalLinkIcon, CodeXmlIcon, BookOpenIcon, BoxIcon } from "lucide-react";
import { Badge } from "@/app/components/atoms/badge";
import { Button } from "@/app/components/atoms/button";
import { cn } from "@/lib/utils";
import type { FunProjectItemType } from "@/shared/contracts/fun-projects";

type FunProjectCardProps = {
    project: FunProjectItemType;
    className?: string;
};

export function FunProjectCard({ project, className }: FunProjectCardProps) {
    return (
        <article
            className={cn(
                "group relative flex flex-col justify-between rounded-xl border border-border/60 bg-background/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-muted/30 hover:shadow-md",
                project.featured && "border-primary/40 bg-primary/[0.02]",
                className
            )}
        >
            <div className="space-y-4">
                {/* Header Badge & Category */}
                <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[11px] font-semibold uppercase tracking-wider text-primary border-primary/30">
                        <BoxIcon className="mr-1 size-3" />
                        {project.category}
                    </Badge>

                    {project.featured && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                            Featured
                        </span>
                    )}
                </div>

                {/* Title & Tagline */}
                <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-xs font-medium text-primary/80">
                        {project.tagline}
                    </p>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {project.description}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.techStack.map((tech) => (
                        <span
                            key={tech}
                            className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* Action Links */}
            <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-border/40">
                {project.demoUrl && (
                    <Button
                        variant="default"
                        size="sm"
                        className="h-8 text-xs font-medium gap-1.5"
                        asChild
                    >
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            <span>Live Demo</span>
                            <ExternalLinkIcon className="size-3.5" />
                        </a>
                    </Button>
                )}

                {project.githubUrl && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-medium gap-1.5"
                        asChild
                    >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <CodeXmlIcon className="size-3.5" />
                            <span>Code</span>
                        </a>
                    </Button>
                )}

                {project.articleUrl && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs font-medium gap-1.5 text-muted-foreground hover:text-foreground"
                        asChild
                    >
                        <a href={project.articleUrl} target="_blank" rel="noopener noreferrer">
                            <BookOpenIcon className="size-3.5" />
                            <span>Read Notes</span>
                        </a>
                    </Button>
                )}
            </div>
        </article>
    );
}
