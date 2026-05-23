import type { IntroductionContentType } from "../types";
import { IntroductionActions } from "./introduction-actions";

const segmentClassName = {
    solid:
        "inline-block rounded-none bg-primary px-3 py-1 font-semibold text-primary-foreground",
    accent: "font-semibold text-primary",
    duration: "font-semibold text-primary",
} as const;

export function Introduction({
    content,
    experienceDurationLabel,
}: {
    content: IntroductionContentType;
    experienceDurationLabel: string;
}) {
    return (
        <section
            id="top"
            className="flex min-h-dvh items-center justify-center px-5 py-28 sm:px-8"
        >
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-16 text-center">
                <p className="text-xs font-medium tracking-[0.32em] uppercase text-muted-foreground">
                    {content.eyebrow}
                </p>
                <h1 className="max-w-6xl text-4xl leading-tight font-medium text-balance text-foreground sm:text-5xl lg:text-6xl">
                    {content.statement.map((segment, index) => {
                        const text =
                            segment.emphasis === "duration"
                                ? experienceDurationLabel
                                : segment.text;

                        if (!segment.emphasis) {
                            return text;
                        }

                        return (
                            <span
                                className={segmentClassName[segment.emphasis]}
                                key={`${segment.emphasis}-${index}`}
                            >
                                {text}
                            </span>
                        );
                    })}
                </h1>
                <p className="sr-only">
                    {content.headline}
                </p>
                <p className="sr-only">
                    {content.intro}
                </p>
                <IntroductionActions actions={content.actions} />
            </div>
        </section>
    );
}
