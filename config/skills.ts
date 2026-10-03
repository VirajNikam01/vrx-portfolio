import type { SkillItemType } from "@/features/skills";

export const defaultSkills: SkillItemType[] = [
    // Core & Languages
    { id: "js", name: "JavaScript", category: "Core & Languages", proficiency: "Expert", highlight: true, isVisible: true },
    { id: "ts", name: "TypeScript", category: "Core & Languages", proficiency: "Intermediate", highlight: true, isVisible: true },
    { id: "rs", name: "Rust", category: "Core & Languages", proficiency: "Intermediate", highlight: true, isVisible: true },

    // Frontend & Frameworks
    { id: "react", name: "React", category: "Frontend & Frameworks", proficiency: "Expert", highlight: true, isVisible: true },
    { id: "nextjs", name: "Next.js", category: "Frontend & Frameworks", proficiency: "Expert", highlight: true, isVisible: true },
    { id: "tailwind", name: "Tailwind CSS", category: "Frontend & Frameworks", proficiency: "Intermediate", highlight: true, isVisible: true },
    { id: "state", name: "Zustand & React Query", category: "Frontend & Frameworks", proficiency: "Expert", isVisible: true },

    // Backend & DB
    { id: "nodejs", name: "Node.js", category: "Backend & DB", proficiency: "Advanced", isVisible: true },
    { id: "hono", name: "Hono", category: "Backend & DB", proficiency: "Advanced", isVisible: true },
    { id: "postgres", name: "PostgreSQL", category: "Backend & DB", proficiency: "Advanced", isVisible: true },
    { id: "drizzle", name: "Drizzle ORM", category: "Backend & DB", proficiency: "Expert", highlight: true, isVisible: true },

    // Tools & DevOps
    { id: "git", name: "Git & GitHub Actions", category: "Tools & DevOps", proficiency: "Intermediate", isVisible: true },
];
