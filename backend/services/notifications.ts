import "server-only";
import { sendEmail } from "@/backend/integrations/email/inquiry-notifications";
import type { InquirySubmissionType } from "@/shared/contracts/inquiries-schema";

function getRequiredEnv(name: string) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is required to send inquiry emails.`);
    }

    return value;
}

function formatSource(source: InquirySubmissionType["source"]) {
    return source
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

async function sendInquiryNotification(
    inquiry: InquirySubmissionType & {
        id: number;
        createdAt: Date;
        resumeUrl?: string;
    },
) {
    const source = formatSource(inquiry.source);
    const ownerEmail = getRequiredEnv("INQUIRY_NOTIFICATION_EMAIL");
    const fromEmail = getRequiredEnv("INQUIRY_FROM_EMAIL");

    await sendEmail({
        from: fromEmail,
        to: ownerEmail,
        replyTo: inquiry.email,
        subject: `New ${source} inquiry from ${inquiry.name}`,
        text: [
            `Source: ${source}`,
            `Inquiry ID: ${inquiry.id}`,
            `Submitted: ${inquiry.createdAt.toISOString()}`,
            `Name: ${inquiry.name}`,
            `Email: ${inquiry.email}`,
            "",
            "Reason / Message:",
            inquiry.reason,
            ...(inquiry.resumeUrl
                ? ["", "Resume preview URL:", inquiry.resumeUrl]
                : []),
        ].join("\n"),
    });
}

async function sendResumeDownloadEmail({
    email,
    name,
    resumeUrl,
}: {
    email: string;
    name: string;
    resumeUrl: string;
}) {
    const fromEmail = getRequiredEnv("INQUIRY_FROM_EMAIL");

    await sendEmail({
        from: fromEmail,
        to: email,
        subject: "Viraj Nikam CV download link",
        text: [
            `Hi ${name},`,
            "",
            "Thanks for your interest. You can download my CV using this secure link:",
            resumeUrl,
            "",
            "The link is time-limited, so please download it soon.",
            "",
            "Regards,",
            "Viraj Nikam",
        ].join("\n"),
    });
}

export const notificationsService = { sendInquiryNotification, sendResumeDownloadEmail };
