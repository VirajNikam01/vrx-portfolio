import { createInquiry } from "@/features/inquiries/repository";
import { collectInquiryRequestMetadata } from "@/features/inquiries/request-metadata";
import { validateInquiryEmail } from "@/features/inquiries/email-validation";
import { inquirySubmissionSchema, type InquirySubmissionType } from "@/features/inquiries/schema";
import { visitorsRepository } from "@/features/visitors";
import { createResumeSignedUrl } from "@/features/resume/storage";
import {
    sendInquiryNotification,
    // sendResumeDownloadEmail,
} from "@/lib/email/inquiry-notifications";

const VISITOR_ID_HEADER = "x-client-fp";

export async function POST(request: Request) {
    const payload = await readJsonBody(request);
    const parsedPayload = inquirySubmissionSchema.safeParse(payload);

    if (!parsedPayload.success) {
        return validationErrorResponse(
            "Invalid inquiry submission.",
            parsedPayload.error.flatten().fieldErrors,
        );
    }

    try {
        return await submitInquiry(request, parsedPayload.data);
    } catch (error) {
        console.error("Failed to submit inquiry", error);
        return serverErrorResponse(error);
    }
}

async function submitInquiry(request: Request, submission: InquirySubmissionType) {
    const emailValidation = await validateInquiryEmail(submission.email);
    if (!emailValidation.valid) {
        return validationErrorResponse("Invalid email address.", {
            email: [emailValidation.message ?? "This email address could not be validated."],
        });
    }

    const visitorId = request.headers.get(VISITOR_ID_HEADER)?.trim();
    if (!visitorId) {
        return validationErrorResponse("Visitor identity is missing.", {
            visitorId: ["Unable to identify the visitor for this inquiry."],
        });
    }

    await visitorsRepository.upsert({ fingerprintHash: visitorId });

    const resumeUrl = await createResumeUrlIfRequested(submission);

    const inquiry = await createInquiry({
        ...submission,
        visitorId,
        metadata: buildInquiryMetadata(request, resumeUrl),
    });

    await sendInquiryNotification({
        ...submission,
        id: inquiry.id,
        createdAt: inquiry.createdAt,
        resumeUrl,
    });

    // Requester email is intentionally disabled — the browser opens the
    // signed preview URL immediately after a successful submission.
    // if (resumeUrl) {
    //     await sendResumeDownloadEmail({ email: submission.email, name: submission.name, resumeUrl });
    // }

    return Response.json({ data: { id: inquiry.id, resumeUrl } }, { status: 201 });
}

async function readJsonBody(request: Request): Promise<unknown> {
    return request.json().catch(() => null);
}


async function createResumeUrlIfRequested(submission: InquirySubmissionType) {
    return submission.source === "resume_download"
        ? createResumeSignedUrl()
        : undefined;
}

function buildInquiryMetadata(request: Request, resumeUrl: string | undefined) {
    return {
        ...collectInquiryRequestMetadata(request),
        ...(resumeUrl ? { resumeSignedUrlCreated: true } : {}),
    };
}

function validationErrorResponse(
    error: string,
    issues: Record<string, string[] | undefined>,
) {
    return Response.json({ error, issues }, { status: 400 });
}

function serverErrorResponse(error: unknown) {
    const message =
        error instanceof Error ? error.message : "Unable to submit inquiry right now.";
    return Response.json({ error: message }, { status: 500 });
}