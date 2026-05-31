"use client";

import {
    BriefcaseBusinessIcon,
    ChevronsDownUpIcon,
    ChevronsUpDownIcon,
    CodeXmlIcon,
    DraftingCompassIcon,
    GraduationCapIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import type {
    ExperienceItemType,
    ExperiencePositionItemType,
} from "../types";
import {
    getPositionPeriodLabel,
    getPositionDurationLabel,
} from "../experience-duration";
import { cn } from "@/lib/utils";

const iconMap = {
    code: CodeXmlIcon,
    design: DraftingCompassIcon,
    business: BriefcaseBusinessIcon,
    education: GraduationCapIcon,
} as const;

export function WorkExperience({
    className,
    description = "Work that shaped the craft. A concise timeline of practical engineering, UI work, and the technologies used along the way.",
    experiences,
    heading = "Experience",
}: {
    className?: string;
    description?: string;
    experiences: ExperienceItemType[];
    heading?: string;
}) {
    return (
        <section
            id="experience"
            className={cn(
                "relative border-y border-border/60 bg-transparent px-6 py-20",
                className
            )}
        >
            <div className="mx-auto w-full max-w-5xl">
                <div className=" mb-2 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className=" max-w-2xl space-y-3">
                        <h2 className="text-3xl font-semibold text-primary uppercase">
                            {heading}
                        </h2>
                        <p className="tracking-tight text-muted-foreground">
                            {description}
                        </p>
                    </div>

                </div>

                <div className="divide-y divide-border">
                    {experiences.map((experience) => (
                        <ExperienceItem key={experience.id} experience={experience} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ExperienceItem({
    experience,
}: {
    experience: ExperienceItemType;
}) {
    return (
        <article className="space-y-4 py-6">
            <div className="not-prose flex items-center gap-3">
                <div
                    className="flex size-fit shrink-0 items-center justify-center"
                    aria-hidden
                >
                    {experience.companyLogo ? (
                        <Image
                            src={experience.companyLogo}
                            alt={experience.companyName}
                            width={24}
                            height={24}
                            quality={100}
                            className="bg-cover bg-center object-cover"
                            unoptimized
                        />
                    ) : (
                        <span className="flex size-2 rounded-full bg-muted-foreground/50" />
                    )}
                </div>

                <h3 className="text:xl sm:text-2xl leading-snug font-semibold text-foreground">
                    {experience.companyName}
                </h3>

                {experience.isCurrentEmployer && (
                    <span className="relative flex items-center justify-center">
                        <span className="absolute inline-flex size-3 animate-ping rounded-full bg-primary opacity-40" />
                        <span className="relative inline-flex size-2 rounded-full bg-primary" />
                        <span className="sr-only">Current Employer</span>
                    </span>
                )}
            </div>

            <div className="relative space-y-4 before:absolute before:left-3 before:h-full before:w-px before:bg-border">
                {experience.positions.map((position) => (
                    <ExperiencePositionItem key={position.id} position={position} />
                ))}
            </div>
        </article>
    );
}

export function ExperiencePositionItem({
    position,
}: {
    position: ExperiencePositionItemType;
}) {
    const ExperienceIcon = iconMap[position.icon || "business"];
    const durationLabel = getPositionDurationLabel(position);
    const periodLabel = getPositionPeriodLabel(position);

    return (
        <Collapsible defaultOpen={position.isExpanded} asChild>
            <div className="relative">
                <CollapsibleTrigger
                    className={cn(
                        "group/experience not-prose block w-full text-left select-none",
                        "relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded-md hover:before:bg-muted/50"
                    )}
                >
                    <div className="relative z-1 mb-1 flex items-center gap-3">
                        <div
                            className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                            aria-hidden
                        >
                            <ExperienceIcon className="size-4" />
                        </div>

                        <h4 className="flex-1 text-base font-medium text-balance text-foreground">
                            {position.title}
                        </h4>

                        <div
                            className="shrink-0 text-muted-foreground [&_svg]:size-4"
                            aria-hidden
                        >
                            <ChevronsDownUpIcon className="hidden group-data-[state=open]/experience:block" />
                            <ChevronsUpDownIcon className="hidden group-data-[state=closed]/experience:block" />
                        </div>
                    </div>

                    <div className="relative z-1 flex items-center gap-2 pl-9 text-sm text-muted-foreground">
                        <dl>
                            <dt className="sr-only">Employment Period</dt>
                            <dd>{periodLabel}</dd>
                        </dl>

                        <Separator
                            className="data-[orientation=vertical]:h-4"
                            orientation="vertical"
                        />

                        <dl>
                            <dt className="sr-only">Duration</dt>
                            <dd className="text-primary">{durationLabel}</dd>
                        </dl>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="overflow-hidden duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    {Array.isArray(position.description) &&
                        position.description.length > 0 && (
                            <DescriptionList className="mt-2 ml-9">
                                {position.description.map((descriptionPoint) => (
                                    <li key={descriptionPoint}>{descriptionPoint}</li>
                                ))}
                            </DescriptionList>
                        )}

                    {Array.isArray(position.skills) && position.skills.length > 0 && (
                        <ul className="not-prose flex flex-wrap gap-1.5 pt-2 pl-9">
                            {position.skills.map((skill, index) => (
                                <li key={index} className="flex">
                                    <Skill>{skill}</Skill>
                                </li>
                            ))}
                        </ul>
                    )}
                </CollapsibleContent>
            </div>
        </Collapsible>
    );
}

function DescriptionList({
    className,
    ...props
}: React.ComponentProps<"ul">) {
    return (
        <ul
            className={cn(
                "max-w-2xl list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground marker:text-primary/70",
                className
            )}
            {...props}
        />
    );
}

function Skill({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground",
                className
            )}
            {...props}
        />
    );
}
