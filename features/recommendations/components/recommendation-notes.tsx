type RecommendationNotesProps = {
    notes: string;
};

export function RecommendationNotes({ notes }: RecommendationNotesProps) {
    // Parse very basic Markdown: headings, bold, inline code, paragraphs, lists
    // For v1 we render as plain text blocks preserving structure.
    // Upgrade path: replace this with a proper MDX renderer when needed.
    const lines = notes.split("\n");

    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (line.startsWith("### ")) {
            elements.push(
                <h3
                    key={i}
                    className="mt-6 text-base font-semibold tracking-tight text-foreground"
                >
                    {line.slice(4)}
                </h3>,
            );
        } else if (line.startsWith("## ")) {
            elements.push(
                <h2
                    key={i}
                    className="mt-8 text-lg font-semibold tracking-tight text-foreground"
                >
                    {line.slice(3)}
                </h2>,
            );
        } else if (line.startsWith("# ")) {
            elements.push(
                <h1
                    key={i}
                    className="text-2xl font-bold tracking-tight text-foreground"
                >
                    {line.slice(2)}
                </h1>,
            );
        } else if (line.startsWith("- ")) {
            // Collect consecutive list items
            const listItems: string[] = [];
            while (i < lines.length && lines[i].startsWith("- ")) {
                listItems.push(lines[i].slice(2));
                i++;
            }
            elements.push(
                <ul key={`list-${i}`} className="mt-3 space-y-1.5 pl-4">
                    {listItems.map((item, j) => (
                        <li
                            key={j}
                            className="list-disc text-sm leading-relaxed text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: renderInline(item) }}
                        />
                    ))}
                </ul>,
            );
            continue;
        } else if (line.trim() === "") {
            // skip blank lines (spacing handled by margins)
        } else {
            elements.push(
                <p
                    key={i}
                    className="mt-3 text-sm leading-relaxed text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: renderInline(line) }}
                />,
            );
        }

        i++;
    }

    return <div className="space-y-1">{elements}</div>;
}

/** Very lightweight inline renderer: **bold**, `code` */
function renderInline(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`(.+?)`/g, "<code class='rounded bg-muted px-1 py-0.5 text-xs font-mono'>$1</code>");
}
