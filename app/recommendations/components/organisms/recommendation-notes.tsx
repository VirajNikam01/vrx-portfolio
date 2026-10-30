"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import { NotesCodeBlock } from "@/app/recommendations/components/molecules/notes-code-block";

type RecommendationNotesProps = {
    notes: string;
};

export function RecommendationNotes({ notes }: RecommendationNotesProps) {
    return (
        <div className="space-y-1">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={customComponents}
            >
                {notes}
            </ReactMarkdown>
        </div>
    );
}


const customComponents: Components = {
    h1: ({ children }) => (
        <h1 className="mt-8 text-2xl font-bold tracking-tight text-foreground">
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <h2 className="mt-8 text-lg font-semibold tracking-tight text-foreground">
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 className="mt-6 text-base font-semibold tracking-tight text-foreground">
            {children}
        </h3>
    ),
    h4: ({ children }) => (
        <h4 className="mt-4 text-sm font-semibold tracking-tight text-foreground">
            {children}
        </h4>
    ),

    // ── Paragraph ─────────────────────────────────────────────────────────
    p: ({ children }) => (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {children}
        </p>
    ),

    // ── Lists ─────────────────────────────────────────────────────────────
    ul: ({ children }) => (
        <ul className="mt-3 space-y-1.5 pl-5 list-disc text-sm text-muted-foreground">
            {children}
        </ul>
    ),
    ol: ({ children }) => (
        <ol className="mt-3 space-y-1.5 pl-5 list-decimal text-sm text-muted-foreground">
            {children}
        </ol>
    ),
    li: ({ children }) => (
        <li className="leading-relaxed">{children}</li>
    ),

    strong: ({ children }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => (
        <em className="italic">{children}</em>
    ),

    mark: ({ children }) => (
        <mark className="rounded px-0.5 bg-yellow-200/70 dark:bg-yellow-400/25 text-foreground not-italic">
            {children}
        </mark>
    ),

    code: ({ node, className, children, ...props }) => {
        const isInline = !className;

        if (isInline) {
            return (
                <code
                    className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground"
                    {...props}
                >
                    {children}
                </code>
            );
        }

        return (
            <code className={className} {...props}>
                {children}
            </code>
        );
    },

    pre: ({ children }) => {
        const codeEl = (children as React.ReactElement<{ className?: string; children?: React.ReactNode }>);
        const className = codeEl?.props?.className ?? "";
        const language = className.replace(/^language-/, "") || "plaintext";
        const rawText = extractText(codeEl?.props?.children);

        return (
            <NotesCodeBlock language={language} code={rawText}>
                <pre className="p-4 leading-relaxed">{children}</pre>
            </NotesCodeBlock>
        );
    },

    blockquote: ({ children }) => (
        <blockquote className="mt-4 border-l-2 border-primary/40 pl-4 italic text-muted-foreground">
            {children}
        </blockquote>
    ),

    hr: () => <hr className="my-6 border-border/60" />,

    img: ({ src, alt }) => (
        <figure className="my-6">
            <a href={src as string | undefined} target="_blank" rel="noreferrer">
                <img
                    src={src as string | undefined}
                    alt={alt ?? ""}
                    className="rounded-xl max-w-full shadow-md transition-opacity hover:opacity-90"
                    loading="lazy"
                />
            </a>
            {alt && (
                <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                    {alt}
                </figcaption>
            )}
        </figure>
    ),

    a: ({ href, children }) => (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
            {children}
        </a>
    ),

    table: ({ children }) => (
        <div className="my-4 overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full text-sm">{children}</table>
        </div>
    ),
    thead: ({ children }) => (
        <thead className="bg-muted/60 text-foreground font-semibold">{children}</thead>
    ),
    tbody: ({ children }) => (
        <tbody className="divide-y divide-border/40">{children}</tbody>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
        <th className="px-4 py-2 text-left text-xs font-semibold tracking-wide">
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td className="px-4 py-2 text-muted-foreground">{children}</td>
    ),
};

function extractText(node: React.ReactNode): string {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (node && typeof node === "object" && "props" in (node as object)) {
        const el = node as React.ReactElement<{ children?: React.ReactNode }>;
        return extractText(el.props.children);
    }
    return "";
}
