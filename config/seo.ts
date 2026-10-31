export const seoConfig = {
    name: "Viraj Nikam",
    handle: "virajnikam",
    title: "Viraj Nikam | Software Engineer",
    shortTitle: "Viraj Nikam",
    description:
        "Viraj Nikam is a frontend-focused software developer building fast, SEO-friendly websites and polished product interfaces with React, Next.js, TypeScript, Tailwind CSS, Tauri, and PostgreSQL.",
    siteUrl:
        process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.VERCEL_PROJECT_PRODUCTION_URL ??
        "https://virajnikam.in",
    email: "virajnikam.connect@gmail.com",
    locale: "en_IN",
    language: "en-IN",
    socialImage: "/opengraph-image.jpg",
    image: "/images/intro/vrx-image.png",
    sameAs: ["https://www.linkedin.com/in/virajnikam"],
};

export const seoPages = {
    home: { path: "/", title: seoConfig.title, description: seoConfig.description },
    blogs: {
        path: "/blogs", title: "Blog",
        description: "Selected notes, experiments, and longer-form thinking from Viraj Nikam.",
    },
    recommendations: {
        path: "/recommendations", title: "Recommendations & Book Notes",
        description: "Hand-picked recommendations and detailed chapter-by-chapter notes on engineering, software architecture, philosophy, and productivity books & courses.",
    },
    bookshelf: {
        path: "/bookshelf", title: "Bookshelf",
        description: "Books, papers, articles, original notes, movies, videos, and courses from Viraj Nikam's personal collection.",
    },
} as const;
