import { z } from "zod";

const introductionLinkActionSchema = z.object({
    label: z.string(),
    href: z.string(),
});

const introductionResumeActionSchema = z.object({
    label: z.string(),
    fileUrl: z.string(),
});

export const introductionContentSchema = z.object({
    eyebrow: z.string(),
    headline: z.string(),
    intro: z.string(),
    actions: z.object({
        connect: introductionLinkActionSchema,
        resume: introductionResumeActionSchema,
    }),
});

export const introductionContentResponseSchema = z.union([
    introductionContentSchema,
    z.object({
        data: introductionContentSchema,
    }),
]);

export const resumeDownloadRequestSchema = z.object({
    name: z.string().min(2, "Please enter your name."),
    email: z.email("Please enter a valid email address."),
    reason: z
        .string()
        .min(12, "Please share a little more context.")
        .max(500, "Please keep this under 500 characters."),
});

export type ResumeDownloadRequestType = z.infer<
    typeof resumeDownloadRequestSchema
>;
