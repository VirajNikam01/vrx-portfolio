# Bookshelf implementation

The dedicated `/bookshelf` experience uses the existing recommendations table. Its public catalog contains only visible entries and excludes full notes. Selected items are fetched on the server. The persistent browsing layout keeps the catalog available while navigating between items, and category/search changes filter locally using URL state.

## Behavior

- Notes is a separate category for original standalone writing. Articles represents recommended writing by others, with optional personal takeaways. Both use the existing collection table and admin editor.
- Migration 0013 extends the media enum with `note`. Publishing a note requires a non-empty Markdown body; covers and source links are optional. Notes use their own Bookshelf canonicals and stay outside legacy book/course recommendations.
- The original sample “Give a good question more time” was created through the authenticated admin API, with an inspiration credit to Nitya's essay. The note lives in the database and can be edited or hidden in the admin; no runtime sample or seed fallback was added.

- All items uses a cover grid; populated media categories automatically open the first matching item's desktop notes reader. Empty categories and searches show one empty state without an unused reader.
- Books, papers, articles, movies, videos, and courses have separate counts and searchable titles, creators, and tags.
- Item links are shareable. Browser history, mobile back navigation, and optional session scroll/focus restoration preserve browsing context.
- Back to Bookshelf opens the cover grid. Chapter back links open their parent Bookshelf item, with header spacing and pointer handling that keep links clickable.
- Missing or failed artwork uses a text cover. Notes render Markdown with raw HTML disabled.
- Existing books/courses remain available through Recommendations. Its APIs retain their existing media scope and response contracts. The homepage recommendation preview was removed at the owner's request.
- Canonicals for duplicate book/course notes point to the existing recommendation URLs. New media use Bookshelf canonicals; query variants stay out of the sitemap.
- Database failures remain errors, distinct from an empty shelf. No example collection or invented personal notes are published.

## Database

`drizzle/0010_bookshelf.sql` adds paper/article/movie/video enum values and a non-null `tags` text array with an empty-array default. These statements are additive and safe to repeat. Existing records do not need to be reseeded.

The configured database already contained recommendations and topic tables although its recorded migration history ended at migration 0007. The verified reconciliation helper now checks the pre-existing schema before recording equivalent migrations, then applies the remaining migrations normally. The database is migrated through 0012; existing published content was retained. See the admin implementation notes for the helper and owner configuration.

Subsequent admin-interface implementation verified the schema, reconciled that history, and applied migration 0011. See `bookshelf-admin-implementation.md`. The owner also requested removal of the homepage recommendation preview; the header remains the public Bookshelf entry point.

Maintain content using the existing database workflow. Keep slugs stable, set `is_visible` deliberately, use HTTP(S) source links, and supply approved cover URLs and personal notes. Tags are trimmed, lowercased, and deduplicated in public responses. No admin UI is included.

## Validation

Focused unit and integration checks cover search at 200 entries, URL encoding, database failure responses, hidden details, SQL visibility filtering, catalog payload size boundaries, legacy type scope, canonical URLs, category counts, search clearing, direct item context, and artwork fallback.

Live browser coverage is in `tests/e2e/bookshelf.spec.ts`. It reads the actual database catalog without inserting content, checks navigation and history, and captures the shelf and reader at 320, 768, 1024, and 1440 pixels in light/dark mode. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` in a local Playwright configuration if the bundled browser revision is unavailable.

The broader suite has pre-existing failures in resume-download dialog requests and experience/date-format assertions; these are outside this feature's changes.

Final verification on 2026-10-31:

- 40 focused tests passed across eight unit/integration suites.
- Both live Playwright checks passed, including history navigation, real HTTP 404s, six desktop grid columns, responsive overflow checks, and failed-artwork rendering.
- Production build and its TypeScript checks passed against the configured database.
- Architecture rules and regression checks passed; targeted ESLint passed.
- Full suite: 75 passed, five existing failures (three resume-dialog request assertions, one work-experience content assertion, and one experience-duration format assertion).
