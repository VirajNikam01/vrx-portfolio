import { z } from "zod";

import { inquirySubmissionSchema } from "@/features/inquiries/schema";

const introductionLinkActionSchema = z.object({
    label: z.string(),
    href: z.string(),
});

const introductionResumeActionSchema = z.object({
    label: z.string(),
    fileUrl: z.string(),
});

const introductionStatementSegmentSchema = z.object({
    text: z.string(),
    emphasis: z.enum(["solid", "accent", "duration"]).optional(),
});

const introductionImageSchema = z.object({
    src: z.string(),
    alt: z.string(),
});

export const introductionContentSchema = z.object({
    eyebrow: z.string(),
    headline: z.string(),
    intro: z.string(),
    image: introductionImageSchema,
    statement: z.array(introductionStatementSegmentSchema),
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

export const resumeDownloadRequestSchema = inquirySubmissionSchema.omit({
    source: true,
});

export type ResumeDownloadRequestType = z.infer<
    typeof resumeDownloadRequestSchema
>;
