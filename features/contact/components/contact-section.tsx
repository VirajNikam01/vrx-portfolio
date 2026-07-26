"use client";

import { MailIcon, SendIcon } from "lucide-react";

import { InquiryForm } from "@/features/inquiries/components/inquiry-form";

export function ContactSection() {
    return (
        <section id="contact" className="px-6 py-20">
            <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                        <MailIcon className="size-4" />
                        Contact Me
                    </div>
                    <h2 className="max-w-xl text-3xl font-semibold text-primary sm:text-4xl">
                        Have a role, project, or collaboration in mind?
                    </h2>
                    <p className="max-w-xl text-base leading-8 text-foreground/80">
                        Send the details here and I&apos;ll reply from my inbox. Share
                        enough context to make the first response useful.
                    </p>
                </div>

                <InquiryForm
                    id="contact-me-form"
                    source="contact_me"
                    className="border border-border/70 bg-background/85 p-5 shadow-sm backdrop-blur sm:p-6 dark:bg-background/40"
                    bodyClassName="space-y-4"
                    footerClassName="mt-5 flex justify-end"
                    buttonClassName="h-11 min-w-36 gap-2 px-5"
                    submitLabel="Send Message"
                    submittingLabel="Sending..."
                    messagePlaceholder="Tell me what you are building, hiring for, or would like to discuss."
                    buttonIcon={<SendIcon className="size-4" />}
                    successMessage="Thanks, your message has been sent. I'll get back to you soon."
                />
            </div>
        </section>
    );
}
