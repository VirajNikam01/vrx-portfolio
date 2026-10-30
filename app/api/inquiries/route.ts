import "server-only";
import { inquirySubmissionSchema } from "@/shared/contracts/inquiries-schema";
import { inquiriesService } from "@/backend/services/inquiries";
import { ValidationError } from "@/backend/errors/validation-error";
import { collectInquiryRequestMetadata } from "./request-metadata";

export async function POST(request: Request) {
    const payload = await request.json().catch(() => null);
    const parsed = inquirySubmissionSchema.safeParse(payload);
    if (!parsed.success) {
        return Response.json({ error: "Invalid inquiry submission.", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    try {
        const data = await inquiriesService.submit(parsed.data, {
            visitorId: request.headers.get("x-client-fp")?.trim(),
            metadata: collectInquiryRequestMetadata(request),
        });
        return Response.json({ data }, { status: 201 });
    } catch (error) {
        if (error instanceof ValidationError) {
            return Response.json({ error: error.message, issues: error.issues }, { status: 400 });
        }
        console.error("Failed to submit inquiry", error);
        const message = error instanceof Error ? error.message : "Unable to submit inquiry right now.";
        return Response.json({ error: message }, { status: 500 });
    }
}
