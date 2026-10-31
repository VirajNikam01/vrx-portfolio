# PRD: Bookshelf content management

Status: Approved for implementation on 2026-10-31.
Date: 2026-10-31
Entry point: `/admin/bookshelf`

## 1. Goal

Allow Viraj to create, edit, organize, preview, publish, and hide Bookshelf content through a private interface. Routine content updates must not require JSON seeding, SQL, a deployment, or a developer tool.

The existing database remains the source of truth. The public Bookshelf and existing recommendation detail/topic routes continue reading the same records.

## 2. Owner and initial login

There is one owner account in the first release, with the initial credentials explicitly requested by the owner:

- Email: `virajnikam@gmail.com`
- Temporary password: the initial password supplied privately in the chat; configure its hash only in the local server environment.

These are bootstrap requirements, not credentials to embed in browser code or a production source file. During implementation, configure the email and a password hash through private server configuration. Do not commit a plaintext password, prefill it into the login form, include it in a `NEXT_PUBLIC_*` variable, log it, or expose the stored hash through an API.

The temporary password is accepted as requested; there is no mandatory password-change interruption in this release. Provide a documented way for the owner to replace the private email/password-hash configuration later. A credential-version change must invalidate existing sessions. Changing credentials through an account-settings screen is deferred.

No public registration, additional accounts, email verification, password-reset email, social login, or role-management UI is included.

## 3. First-release scope

- Owner login, session expiry, and logout.
- Content dashboard with search, type/status filters, and editorial ordering.
- Create and edit all six media types: books, papers, articles, movies, videos, and courses.
- Cover image URL entry with preview and fallback.
- Personal notes editor with Markdown preview.
- Create/edit/order/publish chapter or topic notes for existing book/course content.
- Explicit draft, publish, save changes, and hide actions.
- Validation, save errors, unsaved-change protection, and stale-edit conflict handling.
- Responsive UI using the portfolio's existing typography, theme, accent colors, and components.

Deferred: image/file uploads, a rich-text editor, autosave, scheduled publishing, revision history, bulk import, permanent deletion, multiple owners, and admin management of unrelated portfolio sections.

Cover URLs meet the initial artwork requirement without adding an upload/storage workflow. Uploads can be added later using a separate authenticated integration; owners must be able to manage content fully without them.

## 4. Routes and access

| Route | Purpose |
| --- | --- |
| `/admin/login` | Owner email/password login |
| `/admin/bookshelf` | Searchable content dashboard |
| `/admin/bookshelf/new` | Create an unpublished item |
| `/admin/bookshelf/[id]/edit` | Edit item fields and personal notes |
| `/admin/bookshelf/[id]/topics/new` | Create a book/course topic |
| `/admin/bookshelf/[id]/topics/[topicId]/edit` | Edit a topic and its publication state |

- Use stable IDs for admin editing so title/slug changes cannot accidentally target another record.
- Unauthenticated page requests redirect to login; a successful login returns to a validated, same-origin admin destination.
- Unauthenticated API requests return `401` JSON, not an HTML redirect.
- Validate authentication on every protected server page and API operation. Hiding controls in the browser does not authorize a write.
- Login is reachable directly; do not add a public homepage login call-to-action. The owner dashboard has a persistent logout control and a public Bookshelf link.
- Add `noindex, nofollow` metadata and `Cache-Control: no-store` to private responses. Exclude admin pages and admin APIs from public discovery/sitemaps. Robots directives are supplementary to authentication.

## 5. Login and sessions

### Login form

- Fields: Email and Password, with appropriate autocomplete attributes and an optional show-password control.
- Submit button shows a pending state and prevents duplicate submissions.
- Trim and normalize email casing; compare the password exactly as entered.
- Failed login displays one generic message: “Email or password is incorrect.” Do not reveal which field matched.
- A service/database failure displays “Unable to sign in right now. Please try again.” It must not create a session.
- Rate-limit repeated failures using a shared, persistent mechanism that works across server instances; a process-local counter is insufficient. Proposed policy: five failed attempts per account/IP window over 15 minutes, with `429` and a retry interval when limited.

### Session behavior

- Use a server-validated, expiring session. Proposed lifetime: eight hours, without a Remember me option.
- Prefer opaque random session tokens. Store only token hashes and expiry/revocation information in the database; keep the raw token in an HttpOnly cookie.
- Cookies use `Secure` in HTTPS deployments, `SameSite=Lax` or stricter, and an appropriate restricted path. Local HTTP development may omit `Secure`.
- Rotate the session at login. Logout revokes the server session and clears the cookie. Expired/revoked sessions cannot authorize writes.
- Never store credentials or session tokens in localStorage, URLs, or analytics.
- State-changing requests require server-side CSRF protection, including strict same-origin checks and a suitable token mechanism where needed. Use POST for logout.
- If session validation is unavailable, fail closed; do not authorize using cached frontend state.
- If a session expires while editing, preserve the in-memory form and show a sign-in action that can open in another tab. Retrying Save after login uses the same entered values. Do not silently replace them with freshly loaded database content.

Authentication library and hashing choices must be verified against current official guidance during implementation. Use a maintained password-hashing implementation rather than designing a custom scheme.

## 6. Dashboard

- Heading: **Manage bookshelf**, with a primary **Add item** action.
- Search title, creator, and tags; filter by media type and visibility.
- Rows/cards show cover thumbnail, title, creator, type, Draft/Published status, featured state where applicable, and editorial order.
- Default order matches the public collection: `sortOrder` ascending, then stable ID ascending.
- Actions: Edit, Preview, Publish/Hide. Opening Preview for a draft shows the authenticated editor preview, not a public URL that bypasses visibility.
- Published items also offer “View on bookshelf”.
- Show explicit loading, no-content, no-search-results, and load-error states with retry.
- Use a table on larger screens and readable cards or stacked rows on mobile. Every action must work without hover or drag-and-drop.
- Start with numeric order inputs; provide accessible move-up/move-down actions if convenient. Do not require dragging.

## 7. Item editor

| Field | Behavior |
| --- | --- |
| Media type | Required choice of Book, Paper, Article, Movie, Video, Course |
| Title | Required; trimmed; 1–250 characters |
| Creator | Required; existing `author` field; author/director/creator label follows media type; 1–250 characters |
| Slug | Required unique lowercase URL segment, 1–120 characters; letters, digits, hyphens |
| Description | Required short introduction or reason for inclusion; 1–2,000 characters |
| Subject | Existing Tech/Philosophy/Other category, separate from media type |
| Cover URL | Optional HTTPS/HTTP URL or supported same-site `/images/...` path; live preview and broken-artwork fallback |
| Source URL | Optional absolute HTTPS/HTTP URL; label follows media type |
| Tags | Optional chips or comma-separated input; normalize case, trim, deduplicate; up to 20 tags of 40 characters each |
| Personal notes | Optional Markdown, up to 100,000 characters; Edit/Preview controls |
| Editorial order | Nonnegative integer; default after current last item |
| Featured | Available for books/courses only; preserves existing recommendation consumers |
| Visibility | Controlled through explicit Save draft/Publish/Hide actions |

- New titles suggest a slug until the owner manually edits it. Changing a title does not change an existing saved slug.
- Published slugs are read-only in this release to preserve shared links and topic URLs. Draft slugs may be edited with uniqueness validation.
- New items default to unpublished and unfeatured, regardless of existing database defaults.
- Show inline validation beside fields and a form-level error for unsuccessful requests. Validate the same rules on the server.
- Use safe URL validation: reject executable/data URLs, protocol-relative URLs, and malformed paths. Do not fetch arbitrary server-side URLs merely to validate a cover.
- Show a preview using the same cover and Markdown rendering behavior as the public page; raw executable HTML is disabled.
- Pending saves disable repeat submission. A successful save shows confirmation and returns the saved item/version; failed saves retain all entered values.
- Once a draft is saved, its edit URL supports reload. Unsaved values require a leave-page confirmation where supported, plus a browser refresh/close warning. This is not autosave.

## 8. Publication and editing semantics

- **Save draft:** create/update an unpublished item with `isVisible=false`.
- **Publish:** validate all required fields, save the record, and set `isVisible=true` in one operation.
- **Save changes:** update a published record immediately. Clearly label that the changes will be public after saving.
- **Hide:** set `isVisible=false` after a confirmation naming the item. Keep its notes, topics, ID, and other data intact.
- Hidden items disappear from the public catalog, public detail endpoints, legacy recommendation routes, and discovery outputs after cache refresh; direct public access returns not found.
- There is no separate working copy for published content in this release. Saving a published edit is a live update; an unsaved preview is private.
- Before changing a book/course with topics to another media type, require the owner to remove that dependency through a later explicit migration workflow. Block the type change for now rather than making topics unreachable.
- Clear featured state when changing to a media type that cannot be featured; explain this in the editor before saving.
- No permanent delete action in this release. Hide is the reversible removal mechanism.
- Use `updatedAt` or an equivalent record version for optimistic concurrency. A stale save returns `409` and preserves entered content, with an explicit Reload latest action. Never silently overwrite newer edits.

## 9. Chapter and topic notes

- Book/course edit pages include a Topics section listing both published and unpublished topics with their order.
- Fields: title, stable slug unique within the parent, editorial order, Markdown content, publication state.
- A new topic defaults to unpublished. Require a title and nonempty content to publish.
- Support Save draft, Publish, Save changes, and Unpublish. Permanent topic deletion is deferred.
- Published topic slugs are read-only; changing a title preserves its existing URL.
- Saving a topic does not automatically publish its parent. A hidden parent makes all of its topics unavailable publicly, even if individual topics remain marked published.
- Admin reads may access unpublished topics only after authentication. Public endpoints retain their current published-parent/published-topic rules.
- Use the existing `recommendation_topics` records and owner service. Do not introduce a parallel notes store.

## 10. Data and architecture

- Keep content in the existing `recommendations` and `recommendation_topics` tables. Do not maintain a second JSON catalog or seed on application startup.
- Add authenticated write methods through the existing owner services/repositories, with separate admin DTOs. Public DTOs must not acquire private session or editing data.
- Admin pages may read through services on the server. Browser mutations go through authenticated API handlers, services, and owned repositories.
- Auth/session/rate-limit persistence must have explicitly owned repositories and services, with corresponding architecture checks updated. Authentication orchestration calls those services rather than bypassing repository ownership.
- Session issuance, CSRF checks, input validation, and authorization run before content mutations.
- All content mutations update timestamps and return the stored version. Slug uniqueness must be enforced by the database as well as form validation.
- Where a mutation involves several records, apply a deliberate atomic transaction strategy that preserves the project's table ownership rules.
- Save to the database before reporting success. Do not fall back to local JSON or optimistic success on database errors.
- Audit existing public caching and invalidate/revalidate affected collection, item, legacy detail/topic, and sitemap outputs after successful changes. Existing open clients may need refresh; fresh public requests must reflect changes without a rebuild.
- Resolve the already documented migration-history mismatch before using a full migration runner for new auth tables. Do not replay older table-creation migrations against existing tables.

## 11. API outline

| Endpoint | Behavior |
| --- | --- |
| `POST /api/admin/auth/login` | Validate credentials; issue session |
| `POST /api/admin/auth/logout` | Revoke session and clear cookie |
| `GET /api/admin/bookshelf` | List published and draft items for owner |
| `POST /api/admin/bookshelf` | Create an item with explicit publication intent |
| `GET /api/admin/bookshelf/[id]` | Retrieve editable item and record version |
| `PATCH /api/admin/bookshelf/[id]` | Validate and save changes/visibility with version check |
| `GET, POST /api/admin/bookshelf/[id]/topics` | List or create parent topics |
| `GET, PATCH /api/admin/bookshelf/[id]/topics/[topicId]` | Retrieve or update a topic with version check |

Use consistent JSON responses: `401` unauthenticated, `403` unauthorized/failed CSRF, `404` missing target, `409` stale version or duplicate slug, `422` invalid fields, `429` rate limited, and `503` unavailable dependencies. Error responses must not include credentials, connection strings, or stack traces.

## 12. Acceptance criteria

1. The specified initial owner credentials work when privately configured; incorrect credentials and missing server configuration cannot create a session.
2. Direct admin pages and every admin API enforce authentication, including unpublished-content reads and all mutations.
3. Logout, expiry, and credential rotation invalidate sessions; repeated failed logins are rate-limited across instances.
4. The owner can create, save, reload, edit, preview, publish, and hide each media type entirely through the UI.
5. Draft content stays private, including direct public URLs, legacy routes, topic routes, APIs, and sitemaps.
6. A successful publish/edit/hide becomes visible in fresh public requests without seeding, rebuilding, or redeploying.
7. Cover URL previews, artwork fallbacks, notes Markdown, tags, and source links match the public reader's behavior.
8. Unique slugs, stable published URLs, topic dependencies, and book/course featured scope are enforced on the server.
9. Published and draft chapter notes can be maintained through the UI; hiding a parent prevents public topic access.
10. Failed or conflicting saves retain entered values, display useful feedback, and do not overwrite newer versions.
11. Editing and login work on mobile and desktop, in light/dark mode and all existing accent palettes, with keyboard access and labeled fields.
12. Credentials/tokens do not enter frontend bundles, public payloads, browser storage, logs, or repository configuration.
13. Focused authentication, CSRF, authorization, visibility, concurrency, and publication tests pass, along with relevant type, lint, architecture, build, and browser checks.

## 13. Implementation order

1. Confirm current framework/auth APIs and reconcile migration history; establish privately configured owner credentials, sessions, and rate limiting.
2. Add protected admin reads and versioned write operations through the owning services.
3. Build login and the dashboard, then item editor and private preview.
4. Add book/course topic management and dependency validation.
5. Wire publication cache refresh, error recovery, and unsaved-change handling.
6. Verify the complete create-to-publish-to-hide workflow, including unauthorized and expired-session cases.

Implementation was authorized by the owner's subsequent request. See `bookshelf-admin-implementation.md` for setup and validation.
