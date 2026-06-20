import axios from "@/config/axios";
import { isAxiosError } from "axios";
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
    try {
        console.log(values)
        const response = await axios({
            method: "POST",
            url: "/inquiries",
            data: values,
        });
        console.log(response.data)
        return response.data as { data: { id: number; resumeUrl?: string } };
    } catch (error: unknown) {
        console.log(error)
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