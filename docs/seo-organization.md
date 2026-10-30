# SEO organization

SEO settings and generation live in one configuration file and one helper folder.
Next.js entry points remain in `app/`, where the framework requires them.

| Location | Responsibility |
| --- | --- |
| `config/seo.ts` | Site identity, origin, language, shared social image, static page titles/descriptions/paths |
| `lib/seo/metadata.ts` | Root defaults, viewport, canonical URLs, Open Graph/Twitter metadata, dynamic page metadata |
| `lib/seo/structured-data.ts` | Home, profile, person, blog list, collection, recommendation, and topic JSON-LD builders |
| `lib/seo/urls.ts` | Absolute site URLs and encoded recommendation/topic paths |
| `lib/seo/discovery.ts` | Sitemap entries, robots policy, web manifest, and `llms.txt` content |
| `lib/seo/serialize-json-ld.ts` | JSON serialization with HTML-significant `<` characters escaped |
| `app/components/atoms/json-ld.tsx` | Shared script renderer; no client-side fetching or added dependency |
| `app/opengraph-image.jpg` | Shared social card; also referenced by Twitter metadata |
| `app/favicon.ico` | Existing site favicon |

Pages import the appropriate metadata and structured-data builders. Dynamic pages
still obtain data through backend services; SEO helpers accept DTOs and never call
repositories or databases. Site metadata and structured-data builders are server-only.
The script renderer uses only the browser-safe serializer.

## Changes and cleanup

- Replaced the mixed `config/seo/index.ts` with static configuration plus focused
  helpers. Page components no longer contain repeated metadata or JSON-LD objects.
- Removed unnecessary `async` declarations from synchronous Person/ProfilePage
  builders. Previously, the homepage serialized their unresolved promises as `{}`.
- Centralized title formatting so the site owner name appears once. The homepage
  uses an absolute title; other pages use the root title template.
- Added complete per-page blog metadata, including its own canonical and social
  URL, rather than inheriting the homepage canonical.
- Corrected default social-image URLs from the nonexistent `/opengraph-image`
  to the actual `/opengraph-image.jpg` and removed incorrect hardcoded dimensions.
- Removed `app/twitter-image.jpg`, which was byte-identical to the retained shared
  social card. Both social metadata formats now reference the same asset.
- Removed unused `legalName` configuration and keyword-tag boilerplate. Google
  does not use meta keywords for indexing or ranking, per its
  [supported meta tags documentation](https://developers.google.com/search/docs/crawling-indexing/special-tags).
- Removed `/installation`, `/theme`, and `/work-experience` from the sitemap:
  their Markdown documentation files do not create Next.js pages. Existing homepage
  section anchors remain available.
- Removed arbitrary sitemap priority/frequency fields, which Google ignores, per
  its [sitemap documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
  No synthetic modification dates were introduced.
- Kept `/llms.txt`, the manifest, and robots endpoint. Centralized their content,
  added current page links, and removed the nonexistent public `/resume.pdf` link
  and repetitive summary text. The existing gated resume flow remains intact.

## Adding a page

1. Define static page text and its path in `seoPages` when applicable.
2. Use `createPageMetadata` or add a focused dynamic builder in `metadata.ts`.
3. Add structured data only when it describes actual page content, using the shared
   builder module and `<JsonLd data={structuredData} />`.
4. Keep asynchronous service calls on separate statements in the route/page.
5. Confirm canonical URLs, social metadata, and sitemap entries agree.

The existing `NEXT_PUBLIC_SITE_URL` / `VERCEL_PROJECT_PRODUCTION_URL` origin
configuration and production-domain fallback remain supported.

## Validation

- Production build, TypeScript, and architecture checks passed.
- Seven focused SEO unit tests passed; the full suite has 52 passing tests and
  the same five pre-existing failures documented in `backend-frontend-separation.md`.
- Eight browser checks passed: four SEO checks and four existing UI/API smoke
  checks. They verify rendered titles, canonical/social URLs, complete homepage
  JSON-LD, social-image delivery, sitemap/crawler endpoints, and contact/resume flows.
- Live database-backed recommendation/topic SEO remains limited by the existing
  invalid local database URL. DTO-based unit tests cover those metadata and schema
  builders; the production build uses existing empty-data fallbacks.
- SEO rendering is verified locally. External indexing and rich-result eligibility
  require separate checks after deployment.
