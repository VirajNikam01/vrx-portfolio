import Image from "next/image";

import type {
    IntroductionContentType,
    IntroductionImageType,
    IntroductionStatementSegmentType,
} from "../types";
import { IntroductionActions } from "./introduction-actions";

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
    "flex min-h-dvh items-center justify-center px-5 pt-32 pb-16 sm:px-8 lg:pt-40";

const contentClassName =
    "mx-auto flex w-full max-w-5xl flex-col items-center gap-6 text-center sm:gap-7";

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
    return (
        <div className="flex flex-col items-center gap-3">
            <Image
                priority
                src={image.src}
                alt={image.alt}
                width={INTRODUCTION_IMAGE_SIZE}
                height={INTRODUCTION_IMAGE_SIZE}
                className="size-28 rounded-full border border-primary/20 object-cover shadow-lg shadow-primary/10"
            />
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
                {eyebrow}
            </p>
        </div>
    );
}

function IntroductionStatement({
    experienceDurationLabel,
    segments,
}: IntroductionStatementProps) {
    return (
        <h1 className="max-w-5xl text-xl leading-tight font-medium text-balance text-foreground sm:text-2xl lg:text-[1.75rem]">
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
        return text;
    }

    return (
        <span className={segmentClassNameByEmphasis[segment.emphasis]}>
            {text}
        </span>
    );
}
