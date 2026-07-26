import { z } from "zod";

export const inquirySourceSchema = z.enum([
    "resume_download",
    "contact_me",
    "collaboration",
    "hiring_contact",
    "general_contact",
]);

export const inquirySubmissionSchema = z.object({
    source: inquirySourceSchema,
    name: z.string().min(2, "Please enter your name."),
    email: z.email("Please enter a valid email address."),
    reason: z
        .string()
        .min(12, "Please share a little more context.")
        .max(500, "Please keep this under 500 characters."),
});

export type InquirySourceType = z.infer<typeof inquirySourceSchema>;
export type InquirySubmissionType = z.infer<typeof inquirySubmissionSchema>;

export const inquiryRequestSchema = inquirySubmissionSchema.omit({
    source: true,
});

export type InquiryRequestType = z.infer<typeof inquiryRequestSchema>;
