import { DownloadIcon, MessageSquareTextIcon } from "lucide-react";

import { Button } from "@/app/components/atoms/button";
import type { IntroductionContentType } from "@/shared/contracts/introduction";
import { ResumeDownloadDialog } from "@/app/components/organisms/introduction/resume-download-dialog";

type IntroductionActionsProps = {
    actions: IntroductionContentType["actions"];
};

export function IntroductionActions({ actions }: IntroductionActionsProps) {
    return (
        <div className="flex flex-col items-stretch justify-center gap-4 pt-1 sm:flex-row sm:items-center">
            <ResumeDownloadDialog resume={actions.resume}>
                <Button className="h-12 min-w-60 gap-3 rounded-xl px-7 text-base font-semibold">
                    {actions.resume.label}
                    <DownloadIcon />
                </Button>
            </ResumeDownloadDialog>

            <Button
                asChild
                variant="outline"
                className="h-12 min-w-60 gap-3 rounded-xl border-border/80 bg-background px-7 text-base font-semibold text-primary hover:bg-primary/10 hover:text-primary dark:border-white/25 dark:bg-transparent"
            >
                <a href="#contact">
                    {actions.connect.label}
                    <MessageSquareTextIcon />
                </a>
            </Button>
        </div>
    );
}
