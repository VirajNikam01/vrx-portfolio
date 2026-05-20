import { DownloadIcon, MailIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { IntroductionContentType } from "../types";
import { ResumeDownloadDialog } from "./resume-download-dialog";

type IntroductionActionsProps = {
    actions: IntroductionContentType["actions"];
};

export function IntroductionActions({ actions }: IntroductionActionsProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild>
                <a href={actions.connect.href}>
                    <MailIcon />
                    {actions.connect.label}
                </a>
            </Button>

            <ResumeDownloadDialog resume={actions.resume}>
                <Button variant="outline">
                    <DownloadIcon />
                    {actions.resume.label}
                </Button>
            </ResumeDownloadDialog>
        </div>
    );
}
