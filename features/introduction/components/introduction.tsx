import Image from "next/image";

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
            className="flex min-h-dvh items-center justify-center px-5 pt-36 pb-16 sm:px-8 lg:pt-40"
        >
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 text-center sm:gap-7">
                <h1 className="max-w-5xl text-xl leading-tight font-medium text-balance text-foreground sm:text-2xl lg:text-[1.75rem]">
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
