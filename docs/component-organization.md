# Component organization

UI uses a lightweight Atomic Design structure inside the App Router.

```text
app/
  components/
    atoms/
      icons/
      button.tsx
      input.tsx
      badge.tsx
      ...
    molecules/
      theme-toggle.tsx
      skill-card.tsx
      fun-project-card.tsx
      ...
    organisms/
      site-header.tsx
      site-footer.tsx
      inquiry-form.tsx
      introduction.tsx
      ...
  home-page-client.tsx
  main-content.tsx
  page.tsx
  blogs/
    components/
      organisms/
        blog-section.tsx
    blogs-page-client.tsx
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
    recommendations-page-client.tsx
    page.tsx
    [slug]/...
```

## Choosing a level

- Atoms are the existing UI primitives and animated icons. The Dialog, Tooltip,
  and Collapsible modules remain intact as primitive APIs; their Radix wrappers
  are not split into extra files just to satisfy a category.
- Molecules combine primitives into focused cards and controls, such as a skill
  card, recommendation card, theme toggle, or notes code block.
- Organisms assemble larger sections and workflows, such as a header, inquiry
  form, resume dialog, introduction, skills section, or topic detail. Introduction
  actions belong here because they include the resume dialog workflow.
- Page composition belongs beside the route's `page.tsx`, including client entry
  components. The homepage's `main-content.tsx` assembles its sections.

Shared and homepage UI lives under `app/components/`. Blog and recommendation
components stay with their routes even when the homepage reuses them. A route
does not need empty atoms or molecules folders when it has no such components.

There is no separate `elements` folder because it would overlap with atoms.
Templates can be introduced when a reusable page layout actually emerges.

## Dependencies and naming

Atoms may use other atoms. Molecules may use atoms and other molecules.
Organisms may use any of these levels. Lower levels must not import higher levels;
`npm run check:architecture` checks this across both shared and route-specific UI.
Backend ownership and frontend/server boundary checks remain active.

Keep descriptive component names and direct imports. Do not add wrapper components
or barrel files only to create another Atomic Design level. Hooks remain in
`hooks/`, browser API clients in `lib/api/`, and contracts in `shared/contracts/`.

The component generator's `ui` alias points to `app/components/atoms`. Review new
composite components and place them in molecules or organisms when appropriate.

This change moves 39 existing component files: 12 atoms, 6 molecules, 17 organisms,
and 4 page-composition files. Component implementations, exports, API routes,
backend behavior, and visual styles are preserved.

## Validation

- Production build and TypeScript: passed.
- Architecture checks, including invalid upward UI imports: passed.
- Component lint: no errors; existing warnings remain.
- Full unit/integration suite: 45 passed, with the same 5 pre-existing failures
  documented in `backend-frontend-separation.md`.
- All 4 browser smoke checks passed using the installed Chromium browser. Contact
  and resume responses were mocked to avoid external writes.
- Existing invalid database configuration still causes build-time reads to use
  their established fallbacks; no live database verification was added.
