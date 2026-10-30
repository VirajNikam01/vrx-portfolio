export type SkillCategory =
    | "Core & Languages"
    | "Frontend & Frameworks"
    | "Design & 3D"
    | "Backend & DB"
    | "Tools & DevOps";

export type SkillItemType = {
    id: string;
    name: string;
    category: SkillCategory;
    icon?: string;
    proficiency?: "Expert" | "Advanced" | "Intermediate" | "Exploring";
    highlight?: boolean;
    isVisible: boolean;
};
