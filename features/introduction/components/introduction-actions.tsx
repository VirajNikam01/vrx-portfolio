import { DownloadIcon, MessageSquareTextIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { IntroductionContentType } from "../types";
import { ResumeDownloadDialog } from "./resume-download-dialog";

type IntroductionActionsProps = {
    actions: IntroductionContentType["actions"];
};

export function IntroductionActions({ actions }: IntroductionActionsProps) {
    return (
        <div className="flex flex-col items-stretch justify-center gap-4 pt-1 sm:flex-row sm:items-center">
            <ResumeDownloadDialog resume={actions.resume}>
                <Button className="h-14 min-w-64 gap-3 rounded-xl px-8 text-lg font-semibold">
                    {actions.resume.label}
                    <DownloadIcon />
                </Button>
            </ResumeDownloadDialog>

            <Button
                asChild
                variant="outline"
                className="h-14 min-w-64 gap-3 rounded-xl border-border/80 bg-background/20 px-8 text-lg font-semibold text-primary backdrop-blur-sm hover:bg-primary/10 hover:text-primary dark:border-white/25"
            >
                <a href={actions.connect.href}>
                    {actions.connect.label}
                    <MessageSquareTextIcon />
                </a>
            </Button>
        </div>
    );
}
