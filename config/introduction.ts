import type { IntroductionContentType } from "@/features/introduction";

export const introductionContent = {
    eyebrow: "Software Developer",
    headline: "I build polished, reliable web experiences.",
    intro:
        "I'm Viraj, a frontend-focused developer who cares about clean architecture, thoughtful interaction design, and interfaces that feel fast, clear, and dependable in real use.",
    actions: {
        connect: {
            label: "Connect",
            href: "mailto:hello@example.com",
        },
        resume: {
            label: "Download resume",
            fileUrl: "/resume.pdf",
        },
    },
} satisfies IntroductionContentType;
