import { z } from "zod";

export const funProjectCategorySchema = z.enum([
    "Web Application",
    "Full-Stack Application",
    "Desktop Application",
    "Mobile Application",
    "CLI Tool",
    "Library/Package",
    "Game Development",
]);

export const funProjectItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    category: funProjectCategorySchema,
    techStack: z.array(z.string()),
    thumbnailUrl: z.string().optional(),
    demoUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    articleUrl: z.string().optional(),
    featured: z.boolean().optional(),
    isVisible: z.boolean(),
});

export const funProjectsSchema = z.array(funProjectItemSchema);
