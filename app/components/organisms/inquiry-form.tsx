"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/app/components/atoms/button";
import { Input } from "@/app/components/atoms/input";
import { Textarea } from "@/app/components/atoms/textarea";
import { useScrollIntoView } from "@/hooks/use-scroll-into-view";
import { InquirySubmissionError, submitInquiry } from "@/lib/api/inquiries";
import {
    inquiryRequestSchema,
    type InquiryRequestType,
    type InquirySourceType,
} from "@/shared/contracts/inquiries-schema";

type InquiryFormProps = {
    id: string;
    source: InquirySourceType;
    submitLabel: string;
    submittingLabel: string;
    messagePlaceholder: string;
    className?: string;
    bodyClassName?: string;
    footerClassName?: string;
    buttonClassName?: string;
    buttonIcon?: React.ReactNode;
    successMessage?: string;
    onSuccess?: (
        response: { data: { id: number; resumeUrl?: string } },
        values: InquiryRequestType,
    ) => void;
};

export function InquiryForm({
    id,
    source,
    submitLabel,
    submittingLabel,
    messagePlaceholder,
    className,
    bodyClassName,
    footerClassName,
    buttonClassName,
    buttonIcon,
    successMessage = "Thanks, your message has been sent.",
    onSuccess,
}: InquiryFormProps) {
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
    const form = useForm<InquiryRequestType>({
        resolver: zodResolver(inquiryRequestSchema),
        defaultValues: {
            name: "",
            email: "",
            reason: "",
        },
    });
    const submissionNoticeRef = useScrollIntoView(
        submissionError ?? submissionSuccess,
    );

    function applyServerErrors(error: unknown) {
        if (error instanceof InquirySubmissionError) {
            const { issues } = error;
            let hasFieldError = false;

            if (issues) {
                for (const field of ["name", "email", "reason"] as const) {
                    const message = issues[field]?.[0];

                    if (message) {
                        hasFieldError = true;
                        form.setError(field, {
                            type: "server",
                            message,
                        });
                    }
                }
            }

            setSubmissionError(
                issues && hasFieldError
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

    async function handleValidSubmit(values: InquiryRequestType) {
        setSubmissionError(null);
        setSubmissionSuccess(null);

        try {
            const response = await submitInquiry({
                ...values,
                source,
            });

            onSuccess?.(response, values);
            form.reset();

            if (!onSuccess) {
                setSubmissionSuccess(successMessage);
            }
        } catch (error) {
            applyServerErrors(error);
        }
    }

    return (
        <form
            id={id}
            className={className}
            onSubmit={form.handleSubmit(handleValidSubmit, () => {
                setSubmissionError(null);
                setSubmissionSuccess(null);
            })}
            onChangeCapture={() => {
                if (submissionSuccess) {
                    setSubmissionSuccess(null);
                }
            }}
            noValidate
        >
            <div className={bodyClassName}>
                <FormField label="Full Name" error={form.formState.errors.name?.message}>
                    <Input
                        autoComplete="name"
                        placeholder="Enter your full name here"
                        className="h-12 border-primary/15 bg-muted/70 px-2 text-[14px] placeholder:font-normal placeholder:text-foreground/55 focus-visible:border-primary focus-visible:ring-primary/25 aria-invalid:border-primary aria-invalid:focus-visible:border-primary aria-invalid:focus-visible:ring-primary/25"
                        aria-invalid={Boolean(form.formState.errors.name)}
                        disabled={form.formState.isSubmitting}
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
                        disabled={form.formState.isSubmitting}
                        {...form.register("email")}
                    />
                </FormField>

                <FormField
                    label="Message"
                    error={form.formState.errors.reason?.message}
                >
                    <Textarea
                        aria-invalid={Boolean(form.formState.errors.reason)}
                        placeholder={messagePlaceholder}
                        className="min-h-32 border-primary/15 bg-muted/70 px-2 text-[14px] placeholder:font-normal placeholder:text-foreground/55 focus-visible:border-primary focus-visible:ring-primary/25 aria-invalid:border-primary aria-invalid:focus-visible:border-primary aria-invalid:focus-visible:ring-primary/25"
                        disabled={form.formState.isSubmitting}
                        {...form.register("reason")}
                    />
                </FormField>

                {submissionError && (
                    <p
                        ref={submissionNoticeRef}
                        role="alert"
                        className="pb-2 text-sm font-medium text-destructive"
                    >
                        {submissionError}
                    </p>
                )}

                {submissionSuccess && (
                    <p
                        ref={submissionNoticeRef}
                        role="status"
                        className="pb-2 text-sm font-medium text-primary"
                    >
                        {submissionSuccess}
                    </p>
                )}
            </div>

            <div className={footerClassName}>
                <Button
                    type="submit"
                    form={id}
                    className={buttonClassName}
                    disabled={form.formState.isSubmitting}
                    onClick={() => {
                        setSubmissionError(null);
                        setSubmissionSuccess(null);
                    }}
                >
                    {form.formState.isSubmitting ? submittingLabel : submitLabel}
                    {buttonIcon}
                </Button>
            </div>
        </form>
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
