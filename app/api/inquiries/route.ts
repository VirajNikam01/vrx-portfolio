import { createInquiry } from "@/features/inquiries/repository";
import { collectInquiryRequestMetadata } from "@/features/inquiries/request-metadata";
import { validateInquiryEmail } from "@/features/inquiries/email-validation";
import { inquirySubmissionSchema } from "@/features/inquiries/schema";
import { createResumeSignedUrl } from "@/features/resume/storage";
import {
    sendInquiryNotification,
    // sendResumeDownloadEmail,
} from "@/lib/email/inquiry-notifications";

export const runtime = "nodejs";

export async function POST(request: Request) {
    const payload = await request.json().catch(() => null);
    const parsedPayload = inquirySubmissionSchema.safeParse(payload);

    if (!parsedPayload.success) {
        return Response.json(
            {
                error: "Invalid inquiry submission.",
                issues: parsedPayload.error.flatten().fieldErrors,
            },
            { status: 400 },
        );
    }

    try {
        const emailValidation = await validateInquiryEmail(parsedPayload.data.email);

        if (!emailValidation.valid) {
            return Response.json(
                {
                    error: "Invalid email address.",
                    issues: {
                        email: [emailValidation.message],
                    },
                },
                { status: 400 },
            );
        }

        const resumeUrl =
            parsedPayload.data.source === "resume_download"
                ? await createResumeSignedUrl()
                : undefined;

        const inquiry = await createInquiry({
            ...parsedPayload.data,
            metadata: {
                ...collectInquiryRequestMetadata(request),
                ...(resumeUrl ? { resumeSignedUrlCreated: true } : {}),
            },
        });

        await sendInquiryNotification({
            ...parsedPayload.data,
            id: inquiry.id,
            createdAt: inquiry.createdAt,
            resumeUrl,
        });

        // Keep requester email disabled for now. The browser opens the signed
        // preview URL immediately after a successful submission.
        // if (resumeUrl) {
        //     await sendResumeDownloadEmail({
        //         email: parsedPayload.data.email,
        //         name: parsedPayload.data.name,
        //         resumeUrl,
        //     });
        // }

        return Response.json(
            { data: { id: inquiry.id, resumeUrl } },
            { status: 201 },
        );
    } catch (error) {
        console.error("Failed to submit inquiry", error);

        return Response.json(
            { error: "Unable to submit inquiry right now." },
            { status: 500 },
        );
    }
}
