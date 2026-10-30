import { apiClient } from "@/lib/api/client";
import { isAxiosError } from "axios";
import type { InquirySubmissionType } from "@/shared/contracts/inquiries-schema";

type InquiryFieldErrors = Partial<
    Record<keyof InquirySubmissionType | "visitorId", string[]>
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
    try {
        const response = await apiClient({
            method: "POST",
            url: "/inquiries",
            data: values,
        });
        return response.data as { data: { id: number; resumeUrl?: string } };
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            const data = error?.response?.data as InquiryErrorResponse;
            throw new InquirySubmissionError(
                data?.error ?? "Something went wrong",
                data?.issues,
            );
        }
        throw new InquirySubmissionError("Something went wrong");
    }
}
