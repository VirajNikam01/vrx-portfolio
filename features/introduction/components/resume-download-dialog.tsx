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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    resumeDownloadRequestSchema,
    type ResumeDownloadRequestType,
} from "../schema";
import type { IntroductionResumeActionType } from "../types";

type ResumeDownloadDialogProps = {
    children: React.ReactNode;
    resume: IntroductionResumeActionType;
};

export function ResumeDownloadDialog({
    children,
    resume,
}: ResumeDownloadDialogProps) {
    const [open, setOpen] = useState(false);
    const form = useForm<ResumeDownloadRequestType>({
        resolver: zodResolver(resumeDownloadRequestSchema),
        defaultValues: {
            name: "",
            email: "",
            reason: "",
        },
    });

    function handleValidSubmit() {
        window.open(resume.fileUrl, "_blank", "noopener,noreferrer");
        form.reset();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Resume access</DialogTitle>
                    <DialogDescription>
                        Share a few details so I can understand who is viewing the
                        resume and the context behind the request.
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="space-y-4"
                    onSubmit={form.handleSubmit(handleValidSubmit)}
                >
                    <FormField
                        label="Name"
                        error={form.formState.errors.name?.message}
                    >
                        <Input
                            autoComplete="name"
                            aria-invalid={Boolean(form.formState.errors.name)}
                            {...form.register("name")}
                        />
                    </FormField>

                    <FormField
                        label="Email"
                        error={form.formState.errors.email?.message}
                    >
                        <Input
                            type="email"
                            autoComplete="email"
                            aria-invalid={Boolean(form.formState.errors.email)}
                            {...form.register("email")}
                        />
                    </FormField>

                    <FormField
                        label="Why do you want to download the resume?"
                        error={form.formState.errors.reason?.message}
                    >
                        <Textarea
                            aria-invalid={Boolean(form.formState.errors.reason)}
                            {...form.register("reason")}
                        />
                    </FormField>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            Continue to resume
                        </Button>
                    </div>
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
        <label className="grid gap-2 text-sm font-medium">
            <span>{label}</span>
            {children}
            {error && <span className="text-xs text-destructive">{error}</span>}
        </label>
    );
}
