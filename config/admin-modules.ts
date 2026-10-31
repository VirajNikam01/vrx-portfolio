type AdminModule = {
    id: string;
    title: string;
    description: string;
    href: string;
    tables: readonly string[];
    revalidate: readonly { path: string; type?: "page" | "layout" }[];
};

// Registration describes a module; its routes and owner services enforce access.
// Register working modules only, rather than showing navigation to future pages.
export const adminModules = [
    {
        id: "bookshelf", title: "Bookshelf", href: "/admin/bookshelf",
        description: "Manage your collection, original notes, and chapter notes.",
        tables: ["recommendations", "recommendation_topics"],
        revalidate: [
            { path: "/bookshelf", type: "layout" }, { path: "/recommendations" },
            { path: "/recommendations/[slug]", type: "page" },
            { path: "/recommendations/[slug]/[topicSlug]", type: "page" }, { path: "/sitemap.xml" },
        ],
    },
    {
        id: "feature-flags", title: "Feature flags", href: "/admin/settings/feature-flags",
        description: "Control which sections appear on the homepage.",
        tables: ["content_configs"],
        revalidate: [{ path: "/" }, { path: "/api/content/landing-page" }],
    },
] as const satisfies readonly AdminModule[];

export type AdminModuleId = typeof adminModules[number]["id"];

export function isAdminDestination(value: string) {
    if (!value.startsWith("/") || value.startsWith("//") || /[\\\r\n]/.test(value)) return false;
    const url = new URL(value, "https://admin.invalid");
    return url.origin === "https://admin.invalid" && (url.pathname === "/admin" || adminModules.some(module => url.pathname === module.href || url.pathname.startsWith(`${module.href}/`)));
}
