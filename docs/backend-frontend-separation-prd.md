# PRD: Separate backend logic from frontend features

Status: Approved and implemented. See `backend-frontend-separation.md` for validation results.
Date: 2026-10-31

## Approved layout revision

The user's subsequent instruction supersedes the folder layout in this original
PRD: HTTP handlers live directly in `app/api/**/route.ts`, with route-specific
helpers beside them. There is no separate `backend/handlers/` layer. Frontend
feature folders are removed; UI is under `app/components/` and the blog and
recommendation routes' `components/` folders. Browser clients live in `lib/api/`,
hooks in `hooks/`, and shared schemas/types in `shared/contracts/`. Repository
ownership, service composition, and public behavior requirements remain in force.
See `backend-frontend-separation.md` for the implemented layout.

The subsequently approved Atomic Design organization divides component folders
into atoms, molecules, and organisms, while page-composition files stay beside
their routes. See `component-organization.md` for the current UI structure.

## Objective

Separate backend persistence, business logic, and request handling from frontend features. Establish explicit table ownership so every database operation belongs to exactly one repository and only its owning service can access it.

This is a structural refactor within the existing Next.js application, not a new backend deployment or separate application. Frontend components, hooks, and HTTP clients remain organized by feature.

## Current findings

- Five tables exist: `content_configs`, `inquiries`, `visitors`, `recommendations`, and `recommendation_topics`.
- Backend repositories currently live inside frontend feature folders.
- `features/recommendations/repository.ts` accesses both recommendations and recommendation topics, including joins between them.
- The inquiry route performs email validation, visitor persistence, resume URL creation, inquiry persistence, and notification orchestration.
- Routes, server-rendered recommendation pages, metadata/static-generation functions, and the sitemap access repositories directly.
- Feature barrel exports expose repositories alongside frontend exports.
- RSS, email, storage, and visitor-tracking code are spread between `lib` and `features`.

## Required architecture

```text
Frontend feature → HTTP client → API route → handler → service → owned repository → database
                                                        ↓
                                                   other service
                                                        ↓
                                                  its repository

Server page / metadata / sitemap → service
Service → external integration adapter
```

### Repository rules

1. Store all runtime database queries in `backend/repository/`.
2. Create exactly one repository per table. The filename must exactly match the physical database table name, with `.ts` appended; do not add a `.repository` suffix.
3. A repository can access only its own table. It cannot query or join another table, import another repository, call services, or perform external API calls.
4. Only the designated owner service may import and call a repository. Handlers, pages, middleware, frontend code, and other services cannot bypass this owner.
5. Repositories implement persistence mechanics: queries, inserts, conflict handling, atomic database increments, ordering, limits, and filters supplied by the service. Business decisions, response mapping, fallback policy, and workflow orchestration belong to services.
6. Database failures propagate to the service, which preserves the existing public fallback/error behavior.
7. Database client initialization and schema definitions are infrastructure, not repositories. Foreign-key declarations in schemas are permitted; runtime cross-table queries are not.

### Service rules

1. Store business logic in `backend/services/`.
2. Each table has one designated owner service. An owner service accesses only its own repository directly.
3. Services may call other services through their public methods. Service dependencies must remain acyclic.
4. Cross-table workflows must use service-to-service calls, never cross-repository calls or direct foreign repository imports.
5. Services accept plain validated data and request context, not Next.js `Request` or `Response` objects. They return results or application errors; handlers map these to HTTP responses.
6. Services own business validation, visibility/publication policy, featured-item selection policy, fallback decisions, DTO mapping, and side-effect sequencing. Repositories may execute SQL filters/order/limits to implement those policies efficiently.
7. Services without a database table, such as blog, resume, and notification services, do not receive artificial repositories.

### Handler rules

1. Store request handling in `backend/handlers/`.
2. Handlers parse bodies, query strings, route parameters, and request headers; validate request shape using shared contracts; call services; and map outcomes to existing HTTP status codes and response shapes.
3. `app/api/**/route.ts` files remain Next.js entry points and delegate to handlers. They retain any framework-required route configuration or signatures.
4. Handlers do not import repositories, database clients, Drizzle tables, or integration SDKs.
5. Server components, metadata functions, static-parameter generation, and sitemap generation call services directly rather than making HTTP calls to their own application.

### Frontend and shared contract rules

1. `features/` contains frontend components, hooks, browser-side helpers, and HTTP client functions.
2. Existing `actions/` modules that make browser HTTP requests move into the corresponding feature's client API module; hooks consume those modules. They are HTTP clients, not backend services.
3. Move schemas and DTOs used by both frontend and backend into `shared/contracts/`. Do not expose database row types or server dependencies through these contracts.
4. Backend code must not import frontend feature modules. Browser modules must not import `backend/`, database code, secret configuration, DNS code, or server integration adapters, including through barrel exports.
5. Frontend-only utilities, such as experience duration formatting and display helpers, remain in frontend features.
6. Mark backend runtime modules as server-only where supported, and enforce import boundaries with lint rules or architecture checks.

## Proposed structure

```text
backend/
  db/
    client.ts
    schema.ts
    schema/
  repository/
    content_configs.ts
    inquiries.ts
    visitors.ts
    recommendations.ts
    recommendation_topics.ts
  services/
    content-configs.ts
    inquiries.ts
    visitors.ts
    recommendations.ts
    recommendation-topics.ts
    blog.ts
    resume.ts
    notifications.ts
  handlers/
    landing-page.ts
    inquiries.ts
    visitors.ts
    recommendations.ts
    recommendation-topics.ts
    blog.ts
  integrations/
    email/
    storage/
    blog/
  validation/
    inquiry-email.ts
    disposable-email-domains.ts
  middleware/
    with-visitor-tracking.ts
  errors/
shared/
  contracts/
    inquiries.ts
    visitors.ts
    landing-page.ts
    recommendations.ts
    recommendation-topics.ts
    blog.ts
features/
  <feature>/
    components/
    api.ts
    hooks or existing hook files
    frontend-only types and helpers
app/
  api/**/route.ts
  existing pages and layouts
```

Keep existing shared configuration and default content where appropriate, provided they import only shared contracts and contain no frontend/server runtime dependency. Move database infrastructure from `lib/db` into `backend/db`, update Drizzle configuration and seed-data type references, and retain existing migration history in `drizzle/`.

## Table ownership

| Physical table | Sole repository | Sole owner service |
| --- | --- | --- |
| `content_configs` | `backend/repository/content_configs.ts` | `backend/services/content-configs.ts` |
| `inquiries` | `backend/repository/inquiries.ts` | `backend/services/inquiries.ts` |
| `visitors` | `backend/repository/visitors.ts` | `backend/services/visitors.ts` |
| `recommendations` | `backend/repository/recommendations.ts` | `backend/services/recommendations.ts` |
| `recommendation_topics` | `backend/repository/recommendation_topics.ts` | `backend/services/recommendation-topics.ts` |

Use explicit grouped exports such as `visitorsRepository.upsert(...)` and `visitorsService.recordVisit(...)`. Avoid broad backend barrel exports that obscure ownership or allow frontend imports.

## Workflow requirements

### Inquiry and resume submission

- Handler parses and validates the submission and extracts visitor identity/request metadata.
- Inquiry service performs business email validation and preserves the existing rejection messages.
- Inquiry service calls visitor service to ensure/update the visitor before inserting the inquiry.
- For resume submissions, inquiry service calls resume service to create the signed URL; other sources do not create one.
- Inquiry service inserts through only `inquiries.ts`, then calls notification service.
- Preserve the existing order of side effects and current failure behavior, including a notification failure after persistence. Do not introduce a transaction, retry policy, or requester email as part of this refactor.
- Preserve signed URL settings, expiry defaults, notification recipients, and browser download behavior.

### Recommendation and topic reads

- Recommendation service owns visibility, featured selection, sorting, limit of three featured items, and existing list/detail fallbacks.
- Topic service owns publication filtering and topic ordering.
- To resolve a topic by parent slug, topic service asks recommendation service for the visible parent, then queries only its own repository using the parent ID and topic slug.
- To build sitemap slug pairs, topic service obtains visible parents through recommendation service and batch-loads published topics through its own repository. Combine the results in the service; avoid a query per parent.
- The dependency direction is topic service → recommendation service. Recommendation service must not call topic service; callers needing both compose their results at the handler/server entry point.
- Preserve route-specific missing-parent versus missing-topic responses, metadata, static-generation output, and sitemap visibility rules.

### Landing page

- Content-configs service loads the landing-page record through `content_configs.ts`.
- Default content and database-error fallback decisions live in the service.
- Preserve existing configuration lookup behavior; do not add an active-record filter or change response nesting during the refactor.

### Visitors

- Visitor service owns identity-to-record mapping and first/last-seen/visit-count semantics.
- Repository implements atomic upsert and increment mechanics for the visitors table.
- Visitor route and visitor-tracking middleware call visitor service, never the repository.
- Preserve each entry point's existing identity-header handling unless a separate behavior change is approved.

### External integrations

- Blog service calls an RSS adapter; resume service calls a storage adapter; notification service calls an email adapter.
- Keep SDK initialization, credentials, and transport details inside backend integrations.
- Preserve existing RSS fallback, email behavior, storage behavior, and environment variable names. Caching and performance changes are outside this refactor.

## Compatibility and exclusions

- Preserve public API URLs, HTTP methods, response bodies, status codes, validation messages, query keys, and frontend behavior.
- Preserve table definitions, foreign keys, persisted data, migrations, existing visibility/publication rules, and fallback values.
- No UI redesign, star-background optimization, dependency cleanup, framework upgrade, new deployment, or new product feature.
- No database migration is expected.
- Migration files and database tooling may define/apply schema outside repositories; they must not become an alternate runtime data-access path. If executable seed scripts exist or are added, their application data writes must follow the owner-service/repository path.
- Test mocks may reference repositories for isolated testing; this does not authorize production callers to bypass ownership.

## Implementation sequence after approval

1. Record the current endpoint and server-rendered behavior in existing tests, adding focused coverage for untested behavior affected by the move.
2. Extract shared contracts and establish server-only backend infrastructure and import-boundary enforcement.
3. Create the five table repositories and their owner services; split the existing combined recommendation repository.
4. Extract inquiry orchestration and external integrations into services and adapters.
5. Extract handlers and update every API route, server page, metadata/static-generation function, sitemap, and middleware caller.
6. Update feature HTTP clients/hooks and remove obsolete repository exports and moved backend files from `features/` and `lib/`.
7. Run validation and report behavior parity and any remaining limitations.

Read the installed Next.js guides in `node_modules/next/dist/docs/` before implementation, as required by the project's AGENTS.md. If dependencies are absent, install the locked dependencies first. Preserve unrelated working-tree changes, including the existing `package-lock.json` modification.

## Acceptance criteria

- Exactly five runtime repository files exist, with names matching the five physical table names.
- Each repository queries only its own table; no cross-table joins or repository-to-repository dependencies remain.
- Each repository has exactly one production caller module: its designated owner service.
- Services access no foreign repository and perform no direct database operations.
- API handlers and routes contain no persistence calls or business workflow orchestration.
- Backend runtime code no longer lives in frontend feature folders, and backend modules do not depend on frontend features.
- Browser import graphs contain no backend, database, secret, DNS, or server SDK modules.
- Server pages, metadata/static-generation functions, sitemap, and middleware consume services.
- Architecture checks enforce the ownership matrix and detect direct or re-exported boundary violations.
- Tests verify inquiry validation/side-effect ordering, visitor increments, landing fallback, visible recommendations, published topics, parent/topic not-found behavior, and sitemap output.
- Existing relevant unit/integration tests, lint, type checks, and production build pass; browser smoke tests verify homepage, recommendation/topic navigation, contact submission, and resume flow where credentials are available. Report baseline failures or unavailable credentials separately.
- No unintended API, database, or visible UI behavior changes occur.

## Approval gate

Approval of this PRD authorizes implementing the structure and rules above. Until approval, only this planning document is added; no application implementation is changed.
