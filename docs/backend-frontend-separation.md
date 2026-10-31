# Backend and frontend separation

Implemented on 2026-10-31 following approval of the architecture PRD.

## Where code belongs

| Location | Responsibility |
| --- | --- |
| `app/components/{atoms,molecules,organisms,pages}/` | Homepage sections and reusable UI, layout, theme, and 3D components |
| `app/blogs/components/organisms/` | Blog section UI |
| `app/recommendations/components/{molecules,organisms}/` | Recommendation cards, notes, lists, and topic UI |
| `app/**/page.tsx` and `app/components/pages/` | Route pages and client composition |
| `hooks/<domain>/` | Browser query and mutation hooks |
| `lib/api/` | Browser HTTP clients |
| `shared/contracts/` | Browser-safe DTOs and validation schemas |
| `app/api/**/route.ts` | HTTP handlers: parsing, shape validation, service calls, response mapping |
| `app/api/inquiries/request-metadata.ts` | Route-local request metadata extraction |
| `backend/services/` | Business rules, workflows, fallbacks, DTO mapping |
| `backend/repository/` | Table-specific persistence operations |
| `backend/db/` | Database client, schema definitions, seed data |
| `backend/integrations/` | RSS, storage, and email transport adapters |
| `backend/validation/` | Server-side email validation |
| `backend/middleware/` | Visitor tracking through the visitor service |
| `backend/responses/` | Existing generic server response/error helpers |

The former `features/` and `backend/handlers/` folders are removed. Components
are colocated within the App Router. Consumers import shared contracts, hooks,
and API clients directly rather than through feature barrels. Existing UI and
API behavior are preserved; backend services and repository ownership are unchanged.

## Repository ownership

| Table and repository filename | Only permitted owner service |
| --- | --- |
| `content_configs.ts` | `services/content-configs.ts` |
| `inquiries.ts` | `services/inquiries.ts` |
| `visitors.ts` | `services/visitors.ts` |
| `recommendations.ts` | `services/recommendations.ts` |
| `recommendation_topics.ts` | `services/recommendation-topics.ts` |

Repositories cannot import each other or query foreign tables. Cross-table joins
were replaced with service composition. The topic service obtains visible parents
from the recommendation service and batch-loads published sitemap topics through
its own repository. Inquiry submission coordinates visitor, resume, and notification
services while retaining its original persistence and notification order.

Server pages, metadata, static-parameter generation, and the sitemap call services
directly. Database schema definitions and migration history are unchanged; only
their application source location and configuration references moved.

## Checks

- `npm run check:architecture` checks repository names and ownership, persistence
  imports, browser import graphs (including re-exports), server-only guards, and
  service cycles. It also runs regression cases that intentionally break boundaries.
- `npm run lint` runs architecture checks before ESLint.
- `npm test -- --runInBand` runs unit and integration tests.
- `npm run build` checks the production build and Next.js route types.
- The browser smoke tests are in `tests/e2e/backend-separation.spec.ts`; run them
  with Playwright against the production server on port 3100.

## Validation results

- Production build: passed.
- TypeScript check: passed.
- Architecture checks and their regression cases: passed.
- Focused backend, repository, API route, inquiry, metadata, content, and architecture tests: 31 passed.
- Full unit/integration suite: 45 passed, 5 failed. The five assertions also failed
  before implementation: three resume-dialog tests still mock `fetch` while the
  existing client uses Axios, one work-experience test expects outdated content,
  and one duration test expects a different existing formatting convention.
- ESLint on new backend code, contracts, architecture script, and focused tests:
  passed. Full-project lint remains blocked by the pre-existing unescaped apostrophe
  in `app/recommendations/page.tsx`, with existing warnings elsewhere.
- Four browser smoke checks passed: homepage/recommendations navigation, contact
  submission, resume validation/opening, and live endpoint validation errors.
  Browser submission responses were mocked to avoid external writes. The local
  Playwright installation expected an unavailable browser revision; checks used
  already-installed Chromium revision 1228 via a temporary configuration.
- The configured database URL is invalid. The build exercised existing fallback
  behavior; successful live database reads/writes, populated recommendation/topic
  pages, actual signed URL generation, and live email delivery were not verified.
  Mocked service/handler tests cover those workflow contracts.
- The existing `db:seed` command already referenced a missing executable seed
  script before this refactor. Seed data was moved with the database infrastructure;
  no replacement executable or database writes were introduced.

The pre-existing `package-lock.json` changes were preserved. No database migration,
dependency upgrade, UI redesign, or performance optimization was included.
