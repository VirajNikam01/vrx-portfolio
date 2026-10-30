export type IntroductionLinkActionType = {
    label: string;
    href: string;
};

export type IntroductionResumeActionType = {
    label: string;
    fileUrl: string;
};

export type IntroductionStatementSegmentType = {
    text: string;
    emphasis?: "solid" | "accent" | "duration";
};

export type IntroductionImageType = {
    src: string;
    alt: string;
};

export type IntroductionContentType = {
    eyebrow: string;
    headline: string;
    intro: string;
    image: IntroductionImageType;
    statement: IntroductionStatementSegmentType[];
    actions: {
        connect: IntroductionLinkActionType;
        resume: IntroductionResumeActionType;
    };
};
