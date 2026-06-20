"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InquirySubmissionError, submitInquiry } from "@/features/inquiries/api";
import {
    resumeDownloadRequestSchema,
    type ResumeDownloadRequestType,
} from "../schema";
import type { IntroductionResumeActionType } from "../types";
import { DownloadIcon } from "lucide-react";
import { useScrollIntoView } from "@/hooks/use-scroll-into-view";

type ResumeDownloadDialogProps = {
    children: React.ReactNode;
    resume: IntroductionResumeActionType;
};

export function ResumeDownloadDialog({
    children,
    resume,
}: ResumeDownloadDialogProps) {
    const [open, setOpen] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const form = useForm<ResumeDownloadRequestType>({
        resolver: zodResolver(resumeDownloadRequestSchema),
        defaultValues: {
            name: "",
            email: "",
            reason: "",
        },
    });
    const submissionErrorRef = useScrollIntoView(submissionError);


    function applyServerErrors(error: unknown) {
        if (error instanceof InquirySubmissionError) {
            const { issues } = error;

            if (issues) {
                for (const field of ["name", "email", "reason"] as const) {
                    const message = issues[field]?.[0];

                    if (message) {
                        form.setError(field, {
                            type: "server",
                            message,
                        });
                    }
                }
            }

            setSubmissionError(
                issues
                    ? null
                    : error.message ||
                    "I couldn't submit your details right now. Please try again.",
            );
            return;
        }

        setSubmissionError(
            "I couldn't submit your details right now. Please try again.",
        );
    }

    async function handleValidSubmit(values: ResumeDownloadRequestType) {
        setSubmissionError(null);

        console.log(values)
        try {
            const response = await submitInquiry({
                ...values,
                source: "resume_download",
            });
            window.open(
                response.data.resumeUrl ?? resume.fileUrl,
                "_blank",
                "noopener,noreferrer",
            );
            form.reset();
            setOpen(false);
        } catch (error) {
            applyServerErrors(error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="flex h-[550px] w-full max-w-xl flex-col gap-0 overflow-hidden border-primary/20 bg-popover/95 p-0 shadow-lg">
                <DialogHeader className="shrink-0 border-b border-primary/10 px-6 py-4">
                    <DialogTitle className="text-2xl font-bold text-primary">
                        Download CV
                    </DialogTitle>
                    <DialogDescription className="text-[14px] leading-7 text-foreground">
                        Would you like to share a quick message before downloading my CV?
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="resume-download-form"
                    className="flex flex-1 flex-col overflow-hidden"
                    onSubmit={form.handleSubmit(handleValidSubmit, () =>
                        setSubmissionError(null),
                    )}
                >
                    <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
                        <FormField
                            label="Full Name"
                            error={form.formState.errors.name?.message}
                        >
                            <Input
                                autoComplete="name"
                                placeholder="Enter your full name here"
                                className="h-12 border-primary/15 bg-muted/70 px-2 text-[14px] placeholder:font-normal placeholder:text-foreground/55 focus-visible:border-primary focus-visible:ring-primary/25 aria-invalid:border-primary aria-invalid:focus-visible:border-primary aria-invalid:focus-visible:ring-primary/25"
                                aria-invalid={Boolean(form.formState.errors.name)}
                                {...form.register("name")}
                            />
                        </FormField>

                        <FormField
                            label="Email Address"
                            error={form.formState.errors.email?.message}
                        >
                            <Input
                                type="email"
                                autoComplete="email"
                                placeholder="Enter your email address here"
                                className="h-12 border-primary/15 bg-muted/70 px-2 text-[14px] placeholder:font-normal placeholder:text-foreground/55 focus-visible:border-primary focus-visible:ring-primary/25 aria-invalid:border-primary aria-invalid:focus-visible:border-primary aria-invalid:focus-visible:ring-primary/25"
                                aria-invalid={Boolean(form.formState.errors.email)}
                                {...form.register("email")}
                            />
                        </FormField>

                        <FormField
                            label="Message"
                            error={form.formState.errors.reason?.message}
                        >
                            <Textarea
                                aria-invalid={Boolean(form.formState.errors.reason)}
                                placeholder="Please share your message or let me know why you'd like to download my CV."
                                className="min-h-32 border-primary/15 bg-muted/70 px-2 text-[14px] placeholder:font-normal placeholder:text-foreground/55 focus-visible:border-primary focus-visible:ring-primary/25 aria-invalid:border-primary aria-invalid:focus-visible:border-primary aria-invalid:focus-visible:ring-primary/25"
                                {...form.register("reason")}
                            />
                        </FormField>

                        {submissionError && (
                            <p ref={submissionErrorRef} role="alert" className="text-sm font-medium text-destructive pb-2">
                                {submissionError}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="shrink-0 border-t border-primary/10 px-6 py-2">
                        <Button
                            type="submit"
                            form="resume-download-form"
                            className="px-3 py-1"
                            disabled={form.formState.isSubmitting}
                            onClick={() => setSubmissionError(null)}
                        >
                            {form.formState.isSubmitting
                                ? "Submitting..."
                                : "Download CV"}{" "}
                            <DownloadIcon className="ml-2" />
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function FormField({
    children,
    error,
    label,
}: {
    children: React.ReactNode;
    error?: string;
    label: string;
}) {
    return (
        <label
            className={`grid gap-2 text-sm font-semibold ${error ? "text-primary" : "text-foreground"
                }`}
        >
            <span>{label}</span>
            {children}
            {error && <span className="text-xs text-primary">{error}</span>}
        </label>
    );
}