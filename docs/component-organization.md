# Component organization

UI uses Atomic Design inside the App Router. Shared components are grouped by
level, and related components share a domain folder when that improves navigation.

```text
app/
  components/
    atoms/
      icons/
      initial-avatar.tsx
      button.tsx
      input.tsx
      ...
    molecules/
      theme/
        theme-toggle.tsx
        primary-color-picker.tsx
      skill-card.tsx
      fun-project-card.tsx
    organisms/
      layout/
        site-header.tsx
        site-footer.tsx
      introduction/
        introduction.tsx
        introduction-actions.tsx
        resume-download-dialog.tsx
      stars-background.tsx
      inquiry-form.tsx
      skills-section.tsx
      ...
    pages/
      home/
        home-page.tsx
        home-content.tsx
  styles/
    globals.css
  blogs/
    components/organisms/blog-section.tsx
    page.tsx
  recommendations/
    components/
      molecules/
        recommendation-card.tsx
        notes-code-block.tsx
      organisms/
        recommendations-grid.tsx
        recommendations-preview.tsx
        recommendation-notes.tsx
        topic-list.tsx
        topic-detail.tsx
    page.tsx
    [slug]/...
  layout.tsx
  page.tsx
```

## Choosing a level

- Atoms are UI primitives and icons. Dialog, Tooltip, and Collapsible remain intact
  as primitive APIs rather than being split into extra wrapper files.
- Molecules combine primitives into focused cards and controls.
- Organisms assemble larger sections and workflows. Introduction actions belong
  here because they contain the resume dialog workflow.
- Pages compose organisms into a complete screen. The homepage lives in
  `app/components/pages/home/`; `app/page.tsx` remains the Next.js route entry.
  Blog and recommendation routes render their existing organisms directly rather
  than using wrappers that add no logic.

Blog and recommendation components stay with their routes even when the homepage
reuses them. There is no separate elements folder, and no empty level folders.
Introduce templates only when an actual reusable page layout emerges.

## Naming and placement

- Source filenames use kebab-case, such as `home-page.tsx`,
  `stars-background.tsx`, and `use-blog-posts.ts`.
- React component symbols use PascalCase; functions and hooks use camelCase.
- Component names describe their UI responsibility. The `"use client"` directive
  expresses the rendering boundary; do not add a `-client` suffix automatically.
- Files containing no JSX use `.ts`; React view files use `.tsx`.
- Preserve framework filenames such as `page.tsx`, `layout.tsx`, `route.ts`,
  `sitemap.ts`, `robots.ts`, and `manifest.ts`.
- Repository filenames are an explicit exception: they match physical table names
  exactly, including underscores. Generated migration names are also preserved.
- Keep direct imports; do not add barrel files or one-component wrapper folders
  only to add another layer. Related groups such as layout, theme, and introduction
  have their own folders.

Hooks live in `hooks/<domain>/`. Browser clients live in `lib/api/` and share
`apiClient` from `lib/api/client.ts`; exported domain groups use the `Api`
suffix. Shared contracts remain in `shared/contracts/`. Flat configuration and
query-key modules replace directories that previously contained only an index file.

The component generator points to `app/components/atoms` and
`app/styles/globals.css`. New compound UI should be placed in its appropriate
higher level after generation.

## Dependency rules

Atoms may use atoms. Molecules may use atoms and molecules. Organisms may use
these levels and other organisms. Pages may compose any UI level. Lower levels
must not import higher levels. `npm run check:architecture` enforces this along
with kebab-case source filenames and the existing frontend/backend ownership rules.

## Cleanup

Removed the redundant blog/recommendation page wrappers, unused HTTP transport
and query-client factory, inactive filter state and commented controls, unused
imports/constants, and an introduction debug log. Reused one initial-avatar atom
for both recommendation presentations while retaining their original sizes/styles.

Visible content, styling, public routes, backend workflows, and repository ownership
are preserved. Existing validation limitations are documented in
`backend-frontend-separation.md` and `seo-organization.md`.

## Validation after naming cleanup

- Production build, TypeScript, and architecture checks passed.
- Full-project lint has no errors; 6 existing warnings remain, down from 31.
- Unit/integration tests: 52 passed, with the same 5 pre-existing failures.
- All 8 browser checks passed, including stylesheet/font loading, navigation,
  contact submission, resume flow, and SEO output. External submission responses
  are mocked; the existing database configuration limitation remains unchanged.
