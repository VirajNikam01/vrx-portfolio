# PRD: Bookshelf

Status: Approved for implementation on 2026-10-31. See `bookshelf-implementation.md` for delivery and validation notes.
Date: 2026-10-31
Route: `/bookshelf`

## 1. Product goal

Create a dedicated space on Viraj's portfolio for books, papers, articles, movies, videos, and courses that shaped his thinking. Visitors should be able to browse visually, narrow the collection by type, and read personal notes without losing their browsing context.

The experience should feel like a personal collection rather than a store or a generic recommendation feed. Its visual language must belong to the existing portfolio.

## 2. Reference and interpretation

The six supplied screenshots are the reference for this draft:

- The default Bookshelf view displays a compact, mixed collection of covers, posters, document previews, and typography-based fallback covers.
- Books, Papers, Blogs, Movies, and Videos each have a searchable list.
- Category views use category navigation, an item list, and a right-hand notes panel.
- The notes panel initially says to select an item.

The screenshots do not show selected notes, mobile behavior, search results, or content management. Requirements for those areas below are proposed behavior, not claims about the reference website. Reference titles and artwork are examples only; they are not the portfolio's launch content.

## 3. Scope and boundaries

### Included in the first release

- Dedicated `/bookshelf` entry point and a visible link from the portfolio.
- An All items cover grid and category-specific list views.
- Books, Papers, Articles, Movies, Videos, and Courses.
- Search by title, creator, and tags within the active category.
- Personal notes, optional published topic notes, and an external source link.
- Shareable item URLs, browser history, responsive layouts, and accessible controls.
- Existing theme support, server-rendered public content, and route metadata.
- Reuse of the existing recommendation content and backend ownership structure.

Use **Articles** for externally authored blog posts and essays so visitors can distinguish these from Viraj's own `/blogs` writing. Courses are included because the existing recommendation model already supports them.

### Outside the first release

- Accounts, public submissions, comments, likes, ratings, purchases, and affiliate features.
- Admin dashboard, scraping, automatic cover lookup, imports, and third-party catalog integrations.
- Reading progress, completion dates, reading goals, and recommendation algorithms.
- Embedded video playback or PDF readers; visitors open the original source instead.
- Redesigning the existing recommendations pages or migrating their URLs.

## 4. Primary visitor journeys

1. Open Bookshelf from the portfolio, scan the cover grid, and select an interesting item.
2. Choose Papers, search for a title or author, and open the matching notes.
3. Read an item's summary and personal notes, follow a topic, or visit its original source.
4. Share an item URL; the recipient lands directly on its notes with the correct item selected.
5. Return from notes on a phone and continue with the same category, search, and scroll position.

## 5. Information architecture and URL behavior

| URL | Behavior |
| --- | --- |
| `/bookshelf` | All items, cover grid, no item selected |
| `/bookshelf?type=book` | Books list with an unselected notes panel |
| `/bookshelf?type=paper&q=attention` | Search within Papers |
| `/bookshelf/[slug]` | Item notes; on desktop, retain the browsing shell beside the reader |
| `/bookshelf/[slug]?type=book&q=example` | Same item with browsing context retained |

- Category values are `book`, `paper`, `article`, `movie`, `video`, and `course`. No `type` means All.
- Category selection switches to the list presentation and automatically opens the first matching item when available; All returns to the cover grid.
- Search is available in both presentations. It combines with the active category.
- Selecting an item pushes a history entry. Category changes also push an entry; typing in search replaces the current entry after a short debounce to avoid a history entry per keystroke.
- Switching category closes the selected item and preserves the search text. A clear-search control resets only the query.
- Back/Forward restore category, query, and selection. Returning to the collection restores its scroll position where possible.
- Invalid category values normalize to All. Unknown or hidden item slugs return a real not-found page.
- Opening an item from a fresh URL defaults to its category list, with the item selected.
- Item URLs remain stable if titles change. Slugs are unique across all content types.

## 6. Page layout and visual requirements

### Shared shell

- Reuse the portfolio's site header, logo, typography, and footer.
- Add a clearly labeled Bookshelf navigation link accessible on desktop and mobile, plus an entry from the home recommendations area.
- Page heading: **Bookshelf**. Supporting copy: **Books, ideas, and stories worth keeping.**
- Respect the fixed header with sufficient top spacing; sticky controls and anchor targets must not sit underneath it.
- Use existing `background`, `foreground`, `card`, `muted`, `border`, `primary`, and `ring` tokens. Respect both light/dark mode and the selected accent palette.
- Use current rounded corners, restrained borders, and subtle shadows. Avoid introducing the reference's serif typography or hardcoded orange accents.
- Keep the reading area visually quiet. No animated star canvas or new decorative animation is required.

### Desktop, at least 1200px wide

- Use a centered shell up to approximately 1440px wide with comfortable page gutters.
- All view: approximately 160px category rail and a flexible cover grid.
- Category/item view: category rail, approximately 320–400px searchable item list, and a flexible reader with a readable text width around 65–75 characters.
- Let the document scroll; use sticky category navigation and list controls below the header where space allows. Avoid three independently scrolling columns.
- Show an obvious active category and selected list item using both styling and accessible state.

### Tablet, 768–1199px

- Replace the category rail with a wrapping row of category controls.
- Use a fluid grid for All and a two-column list/reader layout only when both remain readable; otherwise use the mobile navigation pattern.

### Mobile, below 768px

- Use one column with category controls followed by search and collection content.
- Aim for two cover columns at 360px, increasing columns when space permits. Support 320px without page overflow.
- Selecting an item opens the item route as a full-width reader. Provide a visible “Back to bookshelf” link that restores category and search even when there is no prior browser history.
- Keep source links and back navigation easy to reach; controls have at least 44px touch targets.

## 7. Collection behavior

### Cover grid

- Use consistent portrait slots near a 2:3 ratio; keep original artwork proportions within the slot rather than cropping important content.
- Book covers, movie posters, and paper/video previews all use the same grid rhythm. Nonportrait artwork may be letterboxed.
- Items without usable artwork display a designed text cover with title, creator, and a small type label using theme tokens.
- Broken images fall back to the same text-cover treatment without changing card dimensions.
- Every item exposes title and creator visibly, or through an always-visible compact caption; essential information cannot depend on hover.
- Hover/focus may add a subtle lift or border change. Respect reduced-motion preferences.
- All visible items appear in editorial order: `sortOrder` ascending, then stable ID ascending. Apply the same order after filtering.

### Category lists and search

- Each row includes title, creator, and an optional short description. Selected rows have a clear active treatment.
- Category counts reflect all publicly visible items in that category, independently of search. Show a separate filtered result count.
- Search is case-insensitive, trims surrounding whitespace, and matches title, creator, or tags. Multiple query words must each match at least one of those fields.
- Do not search full notes in the first release. Show no-results text and a clear-query action.
- Empty categories remain available with an honest “Nothing here yet” state.
- For the initial collection, load a compact public catalog once and filter locally. Target validation with at least 200 entries; revisit pagination/server search if the collection outgrows that scale.
- Do not preload every item's full notes with the catalog.

## 8. Reader behavior

- Show title, creator, content type, optional cover, short description, personal notes, and an optional source link.
- Render authored Markdown with headings, lists, quotations, links, and existing code-block styling. Do not allow arbitrary executable HTML.
- Use clear source labels: “View book”, “Read paper”, “Read article”, “View movie”, “Watch video”, or “View course”. External links use safe HTTP(S) URLs and open in a new tab with an accessible indication.
- Reuse existing published topic notes where an item has them; link to the existing topic routes in the first release rather than duplicating their content or building new topic routes.
- Missing notes display “Personal notes coming soon.” Available source links remain usable.
- A populated category automatically selects its first matching item, including direct category URLs and newly matched search results. Empty categories/searches show a single empty state without a reader compartment. The reference's idle selection prompt is intentionally omitted.
- Back to Bookshelf returns to the All items cover grid, so category auto-selection cannot immediately reopen the reader. Chapter back links open their parent Bookshelf item.
- An item with neither notes nor a source still displays its description and the missing-notes state.
- Source pages are never automatically embedded or fetched in the visitor's browser.

## 9. Content model and existing Recommendations integration

### Proposed decision

Use the existing recommendations records as the shared collection. Bookshelf is a new browsing experience over that collection, not a second independent content store. Existing `/recommendations`, `/recommendations/[slug]`, topic routes, and APIs remain available. Per the owner's later direction, remove the homepage recommendation preview and use the dedicated Bookshelf navigation instead.

The current model supports `book` and `course`, title, author, description, cover, external link, notes, visibility, featured state, and sort order. Extend it deliberately for the additional content types and tags. Keep the existing subject category (`tech`, `philosophy`, `other`) separate from media type.

| Field | Requirement |
| --- | --- |
| ID and slug | Stable identity and unique shareable slug |
| Type | Book, paper, article, movie, video, or course |
| Title | Required plain text |
| Author | Existing storage field; presented as creator, author, or director as appropriate |
| Description | Required short context or reason for inclusion |
| Cover image URL | Optional; missing or failed image uses text fallback |
| External URL | Optional validated HTTP(S) source |
| Notes | Optional authored Markdown |
| Tags | Optional normalized strings used for search |
| Subject category | Existing tech/philosophy/other classification |
| Visibility | Hidden items excluded from every public listing, detail route, API, metadata lookup, and sitemap |
| Featured state | Existing home-preview behavior remains intact |
| Sort order | Editorial sequence with deterministic tie-breaking |
| Topic relationship | Existing published topic notes remain available |

- Add media types through a non-destructive database migration; preserve existing records and IDs.
- Existing recommendation consumers must explicitly retain their current book/course scope when the shared collection gains other media types. Do not silently add movies or papers to the existing book recommendations UI.
- Keep existing recommendation API contracts compatible; introduce a bookshelf-specific public catalog contract where appropriate.
- Content is maintained through the project's existing seed/database workflow in the first release. No browser write endpoints or admin authentication are required.
- Launch with the owner's actual curated entries. Do not publish copied example entries, invented personal notes, or unapproved seed content.

## 10. Architecture and SEO requirements

- Follow the current repository/service ownership rules: database queries belong to the recommendations repository; its owning service handles visibility, sorting policy, and public response mapping.
- Server pages and metadata call services directly. Browser interactions use hooks and API clients only when remote requests are necessary.
- Keep bookshelf components in the established Atomic Design structure and put shared transport types in `shared/contracts`.
- Server-render the initial collection and selected item's text. Search and selection interactions may use client components without moving all content loading into browser-only effects.
- Use Next.js metadata exports for the collection and generated metadata for item routes, including canonical URLs and social previews.
- Canonical collection URL is `/bookshelf`; query variants use that canonical and stay out of the sitemap. Item canonicals omit browsing query parameters.
- Include the collection and visible item URLs in the sitemap. Keep existing recommendation SEO behavior intact; where identical notes appear on both routes, use the existing recommendation detail as the item's canonical until a separate migration is explicitly agreed.
- If structured data is added, it must describe actual visible content and use the existing safely serialized JSON-LD component. Do not duplicate metadata into hidden divs.
- Read the installed Next.js documentation before implementing framework-dependent routing, metadata, or rendering behavior.

## 11. Accessibility, performance, and failure states

- All categories, items, back links, and source actions work with the keyboard. Use real links for navigable destinations and labeled controls for filters.
- Expose current navigation state, provide visible focus, label search, and announce result counts without announcing every keystroke.
- After mobile navigation, focus the reader heading; returning restores focus to the originating item where possible.
- Decorative cover images can use empty alt text when the same link already contains the visible title. Avoid repetitive accessible names.
- Maintain readable contrast across supported themes and accent palettes.
- Reserve image dimensions; lazy-load offscreen artwork and avoid loading all full-size originals at once.
- No new 3D libraries or heavy collection UI dependencies.
- Loading placeholders preserve layout. A failed catalog request shows an error with retry, not an empty collection. A failed detail request offers retry or return to the shelf.
- No private or hidden content may be serialized into the browser payload and merely filtered out visually.

## 12. Acceptance criteria

1. `/bookshelf` is discoverable from the portfolio and displays only visible collection entries in the specified order.
2. All six media categories work, with counts, active state, and a correct empty-category state.
3. All uses the mixed cover grid; choosing a category displays its searchable list and desktop reader placeholder.
4. Search matches the specified fields and word rules, combines with category selection, and supports clearing and no-results states.
5. Selecting an item shows the correct notes and updates to a shareable URL. Refresh and direct navigation preserve the selected item.
6. Browser Back/Forward and mobile back navigation restore the documented browsing context.
7. Missing artwork, broken artwork, missing notes, and missing source links have deliberate layouts with no broken controls.
8. Hidden/unknown items return not-found responses and never leak through public data or SEO outputs.
9. Published existing topics remain reachable; unpublished topics remain excluded.
10. The page works at 320px, 768px, 1024px, and 1440px without horizontal page overflow or controls obscured by the header.
11. Light/dark mode and every existing accent choice style the bookshelf consistently; keyboard access and reduced motion work.
12. Existing recommendations pages, APIs, featured previews, and topic links retain their current book/course behavior after new media types are added.
13. Initial HTML contains the collection or item text and correct metadata; canonical handling follows section 10.
14. Validate filtering, visibility, URL restoration, migration compatibility, and failure handling with focused tests. Perform responsive visual review and the project's applicable lint, architecture, type, and build checks.

## 13. Implementation sequence after review

1. Finalize the shared-content decision and launch collection; confirm migration impact on existing consumers.
2. Extend schema/contracts and owning services; add focused compatibility and visibility checks.
3. Build the themed browsing shell, cover fallback, categories, and search.
4. Add item reader routes, context restoration, and existing topic links.
5. Connect navigation, metadata, sitemap, and failure states.
6. Validate responsive layouts, themes, accessibility, and existing recommendations behavior.

## 14. Decisions adopted for the first release

The following defaults were adopted when implementation was requested:

- Keep Recommendations working and share its content store with Bookshelf.
- Include Courses alongside the five reference media categories.
- Label externally authored blogs as Articles.
- Use a full-width mobile reader route rather than a modal.
- Maintain content through the existing database/seed workflow; defer an admin UI.
- Use only the owner's curated launch content; sourcing titles, covers, and personal notes is a content prerequisite for publication.

