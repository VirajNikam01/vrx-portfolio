import type { IntroductionContentType } from "@/features/introduction";

export const introductionContent = {
    eyebrow: "Software Developer",
    headline: "I build polished, reliable web experiences.",
    intro:
        "I'm Viraj, a frontend-focused developer who cares about clean architecture, thoughtful interaction design, and interfaces that feel fast, clear, and dependable in real use.",
    statement: [
        { text: "A passionate " },
        { text: "Frontend Developer", emphasis: "solid" },
        { text: " with " },
        { text: "", emphasis: "duration" },
        { text: " of experience building " },
        { text: "clean, reliable web applications", emphasis: "accent" },
        { text: " using React, Next.js, TypeScript, and Tailwind CSS." },
    ],
    actions: {
        connect: {
            label: "Contact Me",
            href: "mailto:hello@example.com",
        },
        resume: {
            label: "Download CV",
            fileUrl: "/resume.pdf",
        },
    },
} satisfies IntroductionContentType;
