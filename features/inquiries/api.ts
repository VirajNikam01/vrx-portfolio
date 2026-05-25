import type { InquirySubmissionType } from "./schema";

type InquiryFieldErrors = Partial<
    Record<keyof InquirySubmissionType, string[]>
>;

type InquiryErrorResponse = {
    error?: string;
    issues?: InquiryFieldErrors;
};

export class InquirySubmissionError extends Error {
    issues?: InquiryFieldErrors;

    constructor(message: string, issues?: InquiryFieldErrors) {
        super(message);
        this.name = "InquirySubmissionError";
        this.issues = issues;
    }
}

export async function submitInquiry(values: InquirySubmissionType) {
    const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
    });

    if (!response.ok) {
        const payload = (await response
            .json()
            .catch(() => ({}))) as InquiryErrorResponse;

        throw new InquirySubmissionError(
            payload.error ?? "Unable to submit inquiry.",
            payload.issues,
        );
    }

    return response.json() as Promise<{
        data: {
            id: string;
            resumeUrl?: string;
        };
    }>;
}
