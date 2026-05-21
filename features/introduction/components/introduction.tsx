import type { IntroductionContentType } from "../types";
import { IntroductionActions } from "./introduction-actions";

export function Introduction({
    content,
}: {
    content: IntroductionContentType;
}) {
    return (
        <section id="top" className="flex min-h-dvh items-center justify-center px-6 py-28">
            <div className="w-full max-w-xl space-y-4">
                <p className="text-sm tracking-widest uppercase text-muted-foreground">
                    {content.eyebrow}
                </p>
                <h1 className="text-5xl font-medium tracking-tight">
                    {content.headline}
                </h1>
                <p className="text-base leading-relaxed text-muted-foreground">
                    {content.intro}
                </p>
                <IntroductionActions actions={content.actions} />
            </div>
        </section>
    );
}
