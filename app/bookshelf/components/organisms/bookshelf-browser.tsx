"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeftIcon, ArrowUpRightIcon, BookOpenIcon, SearchIcon, XIcon } from "lucide-react";
import { bookshelfLabels, enabledBookshelfTypes, type BookshelfSummary } from "@/shared/contracts/bookshelf";
import { bookshelfCategoryHref, bookshelfHref, filterBookshelf, parseBookshelfType } from "@/lib/bookshelf";
import { BookshelfCover } from "@/app/bookshelf/components/molecules/bookshelf-cover";
import { BookshelfLinkStatus } from "@/app/bookshelf/components/atoms/bookshelf-link-status";
import { cn } from "@/lib/utils";
import { NavigationLink } from "@/app/components/molecules/navigation-link";

const focusStyle = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function BookshelfBrowser({ items, children }: { items: BookshelfSummary[]; children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const params = useSearchParams();
    const selected = items.find(item => `/bookshelf/${encodeURIComponent(item.slug)}` === pathname);
    const type = params.has("type") ? parseBookshelfType(params.get("type")) : selected?.type ?? null;
    const query = params.get("q") ?? "";
    const [search, setSearch] = useState({ urlQuery: query, value: query });
    if (search.urlQuery !== query) setSearch({ urlQuery: query, value: query });
    const input = useRef<HTMLInputElement>(null);
    const searchTimer = useRef<number | undefined>(undefined);
    const visible = filterBookshelf(items, type, search.value);
    const collectionHref = bookshelfHref(null, search.value);
    const listView = Boolean(type || selected);
    const showReader = Boolean(selected && visible.some(item => item.id === selected.id));

    useEffect(() => {
        if (pathname !== "/bookshelf" || !type || search.value !== query) return;
        const target = bookshelfCategoryHref(items, type, query);
        if (target.startsWith("/bookshelf/")) router.replace(target, { scroll: false });
    }, [pathname, type, query, search.value, items, router]);

    useEffect(() => {
        if (search.value === query) return;
        searchTimer.current = window.setTimeout(() => {
            const matches = filterBookshelf(items, type, search.value);
            if (listView && matches.length && !matches.some(item => item.id === selected?.id)) {
                router.replace(bookshelfHref(type, search.value, matches[0].slug), { scroll: false });
                return;
            }
            if (selected && !matches.length) {
                router.replace(bookshelfHref(type, search.value), { scroll: false });
                return;
            }
            const next = new URLSearchParams(window.location.search);
            if (search.value.trim()) next.set("q", search.value.trim());
            else next.delete("q");
            window.history.replaceState(null, "", `${pathname}${next.size ? `?${next}` : ""}`);
        }, 250);
        return () => window.clearTimeout(searchTimer.current);
    }, [search.value, query, pathname, items, type, selected, listView, router]);

    useEffect(() => {
        if (selected) {
            if (window.matchMedia("(max-width: 767px)").matches) {
                document.getElementById("bookshelf-reader-title")?.focus({ preventScroll: true });
                window.scrollTo({ top: 0 });
            }
            return;
        }
        try {
            const saved = JSON.parse(sessionStorage.getItem("bookshelf:return") ?? "null");
            if (saved?.href === bookshelfHref(type, query)) {
                const frame = requestAnimationFrame(() => {
                    document.getElementById(`shelf-${saved.slug}`)?.focus({ preventScroll: true });
                    window.scrollTo({ top: saved.scroll });
                });
                return () => cancelAnimationFrame(frame);
            }
        } catch { /* Storage is optional in private browsing. */ }
    }, [pathname, selected, type, query]);

    function rememberItem(slug: string) {
        window.clearTimeout(searchTimer.current);
        try {
            sessionStorage.setItem("bookshelf:return", JSON.stringify({ href: collectionHref, slug, scroll: window.scrollY }));
        } catch { /* Navigation still works without storage. */ }
    }

    if (pathname !== "/bookshelf" && !selected) return <div>{children}</div>;

    return (
        <div className="space-y-8">
            <div className={cn("space-y-3", showReader && "hidden md:block")}>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary"><BookOpenIcon aria-hidden className="size-4" /> A personal collection</div>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Bookshelf<span className="text-primary">.</span></h1>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">Books, ideas, and stories worth keeping.</p>
            </div>

            <div className="grid min-w-0 gap-8 min-[75rem]:grid-cols-[160px_minmax(0,1fr)]">
                <nav aria-label="Bookshelf categories" className={cn(showReader && "hidden md:block")}>
                    <div className="flex flex-wrap gap-1.5 min-[75rem]:sticky min-[75rem]:top-36 min-[75rem]:flex-col">
                        {([null, ...enabledBookshelfTypes] as const).map(category => {
                            const count = category ? items.filter(item => item.type === category).length : items.length;
                            const active = type === category;
                            const href = bookshelfCategoryHref(items, category, search.value);
                            return <NavigationLink key={category ?? "all"} href={href} scroll={false} active={active} variant="filled"
                                onClick={event => {
                                    window.clearTimeout(searchTimer.current);
                                    if (pathname === "/bookshelf" && !href.startsWith("/bookshelf/") && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                                        event.preventDefault();
                                        window.history.pushState(null, "", href);
                                    }
                                }}
                                className={cn("inline-flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 text-sm transition-colors motion-reduce:transition-none", focusStyle, !active && "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                                <span>{category ? bookshelfLabels[category] : "All items"}</span><span className="text-xs tabular-nums">{count}</span>
                            </NavigationLink>;
                        })}
                    </div>
                </nav>

                <div className={cn("grid min-w-0 gap-8", showReader && "md:grid-cols-[minmax(230px,0.8fr)_minmax(0,1.3fr)] min-[75rem]:grid-cols-[340px_minmax(0,1fr)]")}>
                    <section aria-label="Collection" className={cn("min-w-0", showReader && "hidden md:block")}>
                        <div className="mb-6 space-y-3">
                            <div className="relative">
                                <SearchIcon aria-hidden className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
                                <label htmlFor="bookshelf-search" className="sr-only">Search title, creator, or tags</label>
                                <input ref={input} id="bookshelf-search" type="search" value={search.value} onChange={event => setSearch({ urlQuery: query, value: event.target.value })}
                                    placeholder={type ? `Search ${bookshelfLabels[type].toLowerCase()}…` : "Search the collection…"}
                                    className={cn("h-11 w-full min-w-0 rounded-xl border border-input bg-background pl-10 pr-12 text-sm placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none", focusStyle)} />
                                {search.value && <button type="button" aria-label="Clear search" onClick={() => { setSearch({ urlQuery: query, value: "" }); input.current?.focus(); }} className={cn("absolute right-0 top-0 flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground", focusStyle)}><XIcon aria-hidden className="size-4" /></button>}
                            </div>
                            <p role="status" aria-live="polite" className="text-xs text-muted-foreground">{filterBookshelf(items, type, query).length} {filterBookshelf(items, type, query).length === 1 ? "item" : "items"}{query ? ` matching “${query}”` : " on the shelf"}</p>
                        </div>

                        {visible.length === 0 ? <div className="px-5 py-12 text-center">
                            <p className="text-sm text-muted-foreground">{search.value.trim() ? "No items match your search." : "Nothing here yet."}</p>
                            {search.value.trim() && <button type="button" onClick={() => setSearch({ urlQuery: query, value: "" })} className={cn("mt-3 min-h-11 rounded-lg px-3 text-sm text-primary", focusStyle)}>Clear search</button>}
                        </div> : <ul className={listView ? "divide-y divide-border" : "grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 min-[87.5rem]:grid-cols-6"}>
                            {visible.map(item => <li key={item.id} className="min-w-0">
                                <Link id={`shelf-${item.slug}`} href={bookshelfHref(type, search.value, item.slug)} prefetch={false} scroll={false} onClick={() => rememberItem(item.slug)}
                                    aria-current={selected?.id === item.id ? "page" : undefined}
                                    className={cn("group block rounded-lg", focusStyle, listView ? "min-h-20 px-3 py-5 hover:bg-muted/50" : "motion-safe:transition-transform motion-safe:hover:-translate-y-1", selected?.id === item.id && "bg-primary/10 ring-1 ring-primary/20")}>
                                    {!listView && <BookshelfCover item={item} />}
                                    <div className={listView ? "space-y-2" : "mt-3 space-y-1"}>
                                        <p className="line-clamp-2 text-sm font-medium leading-6 group-hover:text-primary">{item.title}{listView && <ArrowUpRightIcon aria-hidden className="ml-1 inline size-3.5 text-muted-foreground" />}</p>
                                        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{item.author}</p>
                                        {listView && <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{item.description}</p>}
                                        <BookshelfLinkStatus />
                                    </div>
                                </Link>
                            </li>)}
                        </ul>}
                    </section>

                    {showReader && <div aria-label="Item notes" className="min-w-0 rounded-2xl border border-border bg-card/60 p-5 sm:p-7">
                        {selected && <Link href={collectionHref} scroll={false} onClick={() => window.clearTimeout(searchTimer.current)} className={cn("mb-8 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-primary", focusStyle)}><ArrowLeftIcon aria-hidden className="size-4" />Back to bookshelf</Link>}
                        {children}
                    </div>}
                </div>
            </div>
            {pathname === "/bookshelf" && children}
        </div>
    );
}

