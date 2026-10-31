import { z } from "zod";

export const editableFeatureFlags = [
    { key: "showIntroduction", label: "Introduction", description: "Show your introduction and primary actions." },
    { key: "showBlog", label: "Blog", description: "Show the latest writing on the homepage." },
    { key: "showSkills", label: "Skills", description: "Show the skills section when skills are configured." },
    { key: "showWorkExperience", label: "Work experience", description: "Show the work experience timeline." },
    { key: "showFunProjects", label: "Fun projects", description: "Show the projects section when projects are configured." },
] as const;

export const editableFlagsSchema = z.object({ showIntroduction: z.boolean(), showBlog: z.boolean(), showSkills: z.boolean(), showWorkExperience: z.boolean(), showFunProjects: z.boolean() }).strict();
export const featureFlagsUpdateSchema = z.object({ flags: editableFlagsSchema, version: z.number().int().min(0) }).strict();
export type FeatureFlagsSettings = z.infer<typeof featureFlagsUpdateSchema>;
