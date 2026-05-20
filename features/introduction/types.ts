export type IntroductionLinkActionType = {
    label: string;
    href: string;
};

export type IntroductionResumeActionType = {
    label: string;
    fileUrl: string;
};

export type IntroductionContentType = {
    eyebrow: string;
    headline: string;
    intro: string;
    actions: {
        connect: IntroductionLinkActionType;
        resume: IntroductionResumeActionType;
    };
};
