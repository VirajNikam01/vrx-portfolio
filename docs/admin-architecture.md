# Modular website administration

The admin workspace starts at `/admin`. Authentication, session handling, navigation, form styles, error handling, unsaved-change protection, and API transport are shared infrastructure. Bookshelf and Feature flags are independent active modules.

## Module registration

`config/admin-modules.ts` is the module registry. Each entry declares a stable ID, label, description, admin route, underlying table ownership, and public paths to refresh after a successful write. The overview and active navigation derive from this registry. Only working modules are registered; future modules do not appear as dead navigation links.

The registry is not a generic SQL editor or an authorization substitute. Each module supplies typed request contracts, protected pages, authenticated API handlers, and its own domain-specific UI. Services and repositories enforce actual rules.

## Shared boundaries

- `shared/contracts/admin.ts`: login validation and safe return destinations.
- `lib/admin-session.ts`: request-cached session validation and per-page access checks.
- `lib/api/admin.ts`: common browser transport and structured request errors.
- `hooks/admin/use-unsaved-changes.ts`: common navigation/refresh/logout protection.
- `app/admin/components/molecules/`: reusable form controls, save errors, and logout.
- `app/admin/components/organisms/admin-navigation.tsx`: module-aware navigation.
- `app/api/admin/request.ts`: authorization, CSRF/origin checks, body limits, error mapping, private responses, and module-based cache refresh.

Every protected page calls `requireAdminPage` before loading data. The enclosing shell reads the same request-cached session but leaves redirects to the page, preserving the exact requested module URL after login. Every admin API uses `adminRequest`. Architecture checks reject missing page/API guards and reject session bypass outside login/logout.

The original session cookie name is retained for compatibility. Authentication is site-wide and does not depend on the currently selected module or on feature flags.

## Data ownership and future modules

| Database storage | Admin responsibility | Current scope |
| --- | --- | --- |
| `recommendations` | Curated media and personal notes | Bookshelf editor |
| `recommendation_topics` | Chapter/topic notes | Bookshelf chapter editor |
| `content_configs` | Homepage content and settings, including feature flags | Feature flags editor; additional content editors can be separate projections of this same owned row |
| `inquiries` | Contact/resume requests | Future operations module, through the inquiry owner service |
| `visitors` | Visitor activity and labels | Future operations module, through the visitor owner service |
| `admin_sessions` | Session issuance, expiration, and revocation | Internal authentication infrastructure |
| `admin_login_limits` | Persistent login throttling | Internal authentication infrastructure |

Adding a module does not create another repository for an existing table. For example, introduction, skills, work experience, contact metadata, and feature flags may have different forms but continue using the `content_configs` owner service/repository. Operational records can have deliberately read-only views or narrowly defined actions rather than unrestricted CRUD. Authentication internals must not become arbitrary content-editing tables.

## Settings updates

Migration 0012 adds a version number to `content_configs`. The Feature flags module projects only supported homepage switches and performs an atomic JSONB merge into `content.featureFlags`, guarded by the row version. Other content, unknown flags, metadata, and the existing configuration remain intact. Conflicting edits return 409 and preserve the owner's form.

The old `showRecommendations` property is preserved in storage for compatibility but is not offered as an active switch: the owner explicitly removed that homepage section. A future content module must also update only its own validated fields and use the shared row version.

Saving settings refreshes public server paths and invalidates the landing-page browser query. Existing error behavior remains: the API reports database failure and the homepage's own frontend fallback handles its configured default content.

## Adding a module

1. Define its browser-safe input/output schemas and field-specific publication rules.
2. Extend the existing owner service/repository for its table, or register ownership for a genuinely new table.
3. Add guarded server pages under `app/admin/(protected)` and API handlers under `app/api/admin`.
4. Reuse common admin controls, transport, error, session, and unsaved-change behavior.
5. Register its navigation metadata and affected public paths; call `refreshAdminModule` after a committed write.
6. Verify unauthorized access, stale edits, preservation of unrelated fields, and the relevant public behavior.

## Validation

- Production build, TypeScript, focused lint, architecture checks/self-tests, and whitespace checks pass.
- Six live browser tests pass, covering admin access, draft/chapter edits, responsive themes, settings conflicts and failed saves, public navigation/history, auto-selection, empty states, and actual chapter back-link clicks.
- Full Jest run: 97 passed, 5 existing failures in resume-request assertions and work-experience content/duration assertions.
- A transaction-only database verification confirms that the feature-flag write preserves unrelated homepage fields. The transaction was rolled back, leaving the live settings values unchanged. Browser tests leave the owner's live flags unchanged and remove their own private draft fixtures.

## Bookshelf browsing revision

Populated media categories open their first matching item automatically. Empty categories/searches display a single empty state without a blank reader. All items remains the cover grid. Back to Bookshelf returns to that grid, avoiding an immediate auto-selection loop on mobile. Chapter back links target their Bookshelf item and sit below the header; the transparent header no longer intercepts content clicks.
