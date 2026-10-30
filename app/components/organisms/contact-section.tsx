"use client";

import { MailIcon, SendIcon } from "lucide-react";

import { InquiryForm } from "@/app/components/organisms/inquiry-form";

export function ContactSection() {
    return (
        <section id="contact" className="px-6 py-20">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
                {/* Header block */}
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                        <MailIcon className="size-4" />
                        Contact Me
                    </div>
                    <h2 className="text-3xl font-semibold text-primary sm:text-4xl">
                        Have a role, project, or collaboration in mind?
                    </h2>
                    <p className="text-base leading-7 text-foreground/80">
                        Send the details here and I&apos;ll reply from my inbox. Share
                        enough context to make the first response useful.
                    </p>
                </div>

                {/* Form — full width, single column */}
                <InquiryForm
                    id="contact-me-form"
                    source="contact_me"
                    className="w-full"
                    bodyClassName="space-y-5"
                    footerClassName="mt-6 flex justify-start"
                    buttonClassName="h-11 min-w-40 gap-2 px-6"
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
