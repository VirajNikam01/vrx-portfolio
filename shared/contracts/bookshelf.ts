export const bookshelfTypes = ["book", "paper", "article", "note", "movie", "video", "course"] as const;
export type BookshelfType = typeof bookshelfTypes[number];

// Keep stored types compatible while offering only the currently enabled categories.
export const enabledBookshelfTypes = ["book", "note", "video", "course"] as const satisfies readonly BookshelfType[];

export const bookshelfLabels: Record<BookshelfType, string> = {
    book: "Books", paper: "Papers", article: "Articles", note: "Notes", movie: "Movies", video: "Videos", course: "Courses",
};

export const bookshelfSourceLabels: Record<BookshelfType, string> = {
    book: "View book", paper: "Read paper", article: "Read article", note: "View source", movie: "View movie", video: "Watch video", course: "View course",
};

export type BookshelfSummary = {
    id: number;
    slug: string;
    type: BookshelfType;
    title: string;
    author: string;
    description: string;
    coverImageUrl: string | null;
    tags: string[];
};

export type BookshelfItem = BookshelfSummary & {
    notes: string | null;
    externalUrl: string | null;
};
