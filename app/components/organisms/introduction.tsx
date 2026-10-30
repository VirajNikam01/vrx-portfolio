import Image from "next/image";

import type {
    IntroductionContentType,
    IntroductionImageType,
    IntroductionStatementSegmentType,
} from "@/shared/contracts/introduction";
import { IntroductionActions } from "@/app/components/organisms/introduction-actions";
import { cn } from "@/lib/utils";

type IntroductionProps = {
    content: IntroductionContentType;
    experienceDurationLabel: string;
};

type IntroductionStatementProps = {
    experienceDurationLabel: string;
    segments: IntroductionStatementSegmentType[];
};

type IntroductionStatementSegmentProps = {
    experienceDurationLabel: string;
    segment: IntroductionStatementSegmentType;
};

type IntroductionMediaProps = {
    eyebrow: string;
    image: IntroductionImageType;
};

const INTRODUCTION_IMAGE_SIZE = 112;

const sectionClassName =
    "flex flex-col px-6 pt-28 pb-20 sm:pt-32";

const contentClassName =
    "mx-auto flex w-full max-w-5xl flex-col align-center justify-center gap-6 text-left sm:gap-7";

const segmentClassNameByEmphasis = {
    solid:
        "inline-block rounded-none bg-primary px-3 py-1 font-semibold text-primary-foreground",
    accent: "font-semibold text-primary",
    duration: "font-semibold text-primary",
} as const;

function getSegmentText(
    segment: IntroductionStatementSegmentType,
    experienceDurationLabel: string,
) {
    return segment.emphasis === "duration"
        ? experienceDurationLabel
        : segment.text;
}

export function Introduction({
    content,
    experienceDurationLabel,
}: IntroductionProps) {
    return (
        <section id="top" className={sectionClassName}>
            <div className={contentClassName}>
                <IntroductionMedia
                    eyebrow={content.eyebrow}
                    image={content.image}
                />
                <IntroductionStatement
                    segments={content.statement}
                    experienceDurationLabel={experienceDurationLabel}
                />
                <IntroductionActions actions={content.actions} />
            </div>
        </section>
    );
}

function IntroductionMedia({ eyebrow, image }: IntroductionMediaProps) {
    console.log("image.src", image.src)
    return (
        <span className="w-full flex items-center justify-center">
            < Image
                priority
                src={image.src}
                alt={image.alt}
                width={INTRODUCTION_IMAGE_SIZE}
                height={INTRODUCTION_IMAGE_SIZE}
                className="size-54 border-b border-primary object-cover"
            />
        </span >
    );
}

function IntroductionStatement({
    experienceDurationLabel,
    segments,
}: IntroductionStatementProps) {
    return (
        <h1 className="w-full text-base leading-relaxed font-medium text-center text-foreground sm:text-lg lg:text-xl">
            {segments.map((segment, index) => (
                <IntroductionStatementSegment
                    key={`${segment.emphasis ?? "plain"}-${segment.text}-${index}`}
                    segment={segment}
                    experienceDurationLabel={experienceDurationLabel}
                />
            ))}
        </h1>
    );
}

function IntroductionStatementSegment({
    experienceDurationLabel,
    segment,
}: IntroductionStatementSegmentProps) {
    const text = getSegmentText(segment, experienceDurationLabel);

    if (!segment.emphasis) {
        return <span>{text}</span>;
    }

    return (
        <span className={cn(segmentClassNameByEmphasis[segment.emphasis])}>
            {text}
        </span>
    );
}
