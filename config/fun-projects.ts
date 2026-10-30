import type { FunProjectItemType } from "@/shared/contracts/fun-projects";

export const defaultFunProjects: FunProjectItemType[] = [
    {
        id: "lunchbox",
        title: "LunchBox",
        tagline: "A responsive web application built with React and Vite",
        description:
            "A frontend web application developed with a focus on responsive UI, reusable components, and a modern Vite-based development setup.",
        category: "Web Application",
        techStack: ["React", "Vite", "JavaScript", "CSS"],
        demoUrl: "",
        githubUrl: "https://github.com/VirajNikam01/LunchBox",
        featured: true,
        isVisible: true,
    },
    {
        id: "devsync",
        title: "DevSync",
        tagline: "A developer-focused collaboration and productivity platform",
        description:
            "A full-stack developer application featuring authentication, API-driven functionality, database operations, and a deployed web experience.",
        category: "Full-Stack Application",
        techStack: ["Next.js", "React", "JavaScript", "Database", "Vercel"],
        demoUrl: "https://devsync-zeta.vercel.app",
        githubUrl: "https://github.com/VirajNikam01/DevSync",
        featured: true,
        isVisible: true,
    },
    {
        id: "apna-management",
        title: "Apna Management",
        tagline: "A cross-platform task and management application",
        description:
            "A desktop-oriented management application with task handling, user preferences, API integration, and a Tauri-based native application layer.",
        category: "Desktop Application",
        techStack: ["React", "TypeScript", "Tailwind CSS", "Tauri", "Rust"],
        demoUrl: "",
        githubUrl: "https://github.com/VirajNikam01/apna-management",
        featured: true,
        isVisible: true,
    },
];
