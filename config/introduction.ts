import type { IntroductionContentType } from "@/features/introduction";

export const introductionContent = {
    eyebrow: "Software Developer",
    headline: "I build polished, reliable web experiences that load fast and stay clear.",
    intro:
        "a frontend-focused developer who cares about clean architecture, thoughtful interaction design, and interfaces that feel fast, clear, and dependable in real use.",
    image: {
        src: "/images/intro/vrx-image.png",
        alt: "Viraj Nikam portrait",
    },
    statement: [
        { text: "A passionate " },
        { text: "Software Engineer", emphasis: "solid" },
        { text: " with " },
        { text: "", emphasis: "duration" },
        { text: " of experience building " },
        { text: "web and desktop applications", emphasis: "accent" },
        { text: " using Next.js, Node & Tauri." },
    ],
    actions: {
        connect: {
            label: "Contact Me",
            href: "mailto:virajnikam.connect@gmail.com",
        },
        resume: {
            label: "Download CV",
            fileUrl: "/resume.pdf",
        },
    },
} satisfies IntroductionContentType;
