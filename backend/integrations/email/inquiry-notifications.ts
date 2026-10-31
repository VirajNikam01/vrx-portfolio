import "server-only";

import { Resend } from "resend";


let resend: Resend | undefined;

function getResend() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error("RESEND_API_KEY is required to send inquiry emails.");
    }

    resend ??= new Resend(apiKey);

    return resend;
}

export async function sendEmail(message: Parameters<Resend["emails"]["send"]>[0]) {
    await getResend().emails.send(message);
}
