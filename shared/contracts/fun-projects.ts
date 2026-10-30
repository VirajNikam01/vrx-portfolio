export type FunProjectCategory =
    | "Web Application"
    | "Full-Stack Application"
    | "Desktop Application"
    | "Mobile Application"
    | "CLI Tool"
    | "Library/Package"
    | "Game Development";

export type FunProjectItemType = {
    id: string;
    title: string;
    tagline: string;
    description: string;
    category: FunProjectCategory;
    techStack: string[];
    thumbnailUrl?: string;
    demoUrl?: string;
    githubUrl?: string;
    articleUrl?: string;
    featured?: boolean;
    isVisible: boolean;
};
