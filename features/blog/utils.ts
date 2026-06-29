export function formatPublishedDate(value: string | null): string {
    if (!value) return "Recent";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recent";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}