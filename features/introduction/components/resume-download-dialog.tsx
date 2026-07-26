"use client";

import type * as React from "react";
import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { InquiryForm } from "@/features/inquiries/components/inquiry-form";
import { DownloadIcon } from "lucide-react";
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

                <InquiryForm
                    id="resume-download-form"
                    source="resume_download"
                    className="flex flex-1 flex-col overflow-hidden"
                    bodyClassName="flex-1 space-y-4 overflow-y-auto px-6 py-4"
                    footerClassName="shrink-0 border-t border-primary/10 px-6 py-2"
                    buttonClassName="px-3 py-1"
                    submitLabel="Download CV"
                    submittingLabel="Submitting..."
                    messagePlaceholder="Please share your message or let me know why you'd like to download my CV."
                    buttonIcon={<DownloadIcon className="ml-2" />}
                    onSuccess={(response) => {
                        window.open(
                            response.data.resumeUrl ?? resume.fileUrl,
                            "_blank",
                            "noopener,noreferrer",
                        );
                        setOpen(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
