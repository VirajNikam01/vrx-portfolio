import "server-only";
import { inquiriesRepository } from "@/backend/repository/inquiries";
import { visitorsService } from "./visitors";
import { resumeService } from "./resume";
import { notificationsService } from "./notifications";
import { validateInquiryEmail } from "@/backend/validation/inquiry-email";
import { ValidationError } from "@/backend/errors/validation-error";
import type { InquirySubmissionType } from "@/shared/contracts/inquiries-schema";

type InquiryContext = { visitorId?: string; metadata: Record<string, string | undefined> };

async function submit(submission: InquirySubmissionType, context: InquiryContext) {
    const emailValidation = await validateInquiryEmail(submission.email);
    if (!emailValidation.valid) {
        throw new ValidationError("Invalid email address.", {
            email: [emailValidation.message ?? "This email address could not be validated."],
        });
    }
    const { visitorId } = context;
    if (!visitorId) {
        throw new ValidationError("Visitor identity is missing.", {
            visitorId: ["Unable to identify the visitor for this inquiry."],
        });
    }
    await visitorsService.ensureVisitor(visitorId);
    const resumeUrl = submission.source === "resume_download" ? await resumeService.createSignedUrl() : undefined;
    const inquiry = await inquiriesRepository.createInquiry({
        ...submission, visitorId,
        metadata: { ...context.metadata, ...(resumeUrl ? { resumeSignedUrlCreated: true } : {}) },
    });
    await notificationsService.sendInquiryNotification({
        ...submission, id: inquiry.id, createdAt: inquiry.createdAt, resumeUrl,
    });
    // Requester email remains disabled; the browser opens the signed URL.
    return { id: inquiry.id, ...(resumeUrl ? { resumeUrl } : {}) };
}

export const inquiriesService = { submit };
