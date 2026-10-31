import { z } from "zod";

export const skillCategorySchema = z.enum([
    "Core & Languages",
    "Frontend & Frameworks",
    "Design & 3D",
    "Backend & DB",
    "Tools & DevOps",
]);

export const skillItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: skillCategorySchema,
    icon: z.string().optional(),
    proficiency: z.enum(["Expert", "Advanced", "Intermediate", "Exploring"]).optional(),
    highlight: z.boolean().optional(),
    isVisible: z.boolean(),
});

export const skillsSchema = z.array(skillItemSchema);
