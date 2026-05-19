# Work Experience Section

This note explains how the work experience section is wired into the landing page, where its data lives, and how its background interacts with the `Stars` canvas.

## Files

Main component:

```txt
components/pages/landing-page/sections/work-experience/work-experience.tsx
```

Export file:

```txt
components/pages/landing-page/sections/work-experience/index.ts
```

Data file:

```txt
config/work-experience.ts
```

Landing integration:

```txt
components/splash/main-content.tsx
```

## Data setup

The experience content is kept outside the UI component:

```tsx
import type { ExperienceItemType } from "@/components/pages/landing-page/sections/work-experience";

export const workExperiences = [
  {
    id: "independent-projects",
    companyName: "Independent Projects",
    isCurrentEmployer: true,
    positions: [
      {
        id: "frontend-developer",
        title: "Frontend Developer",
        employmentPeriod: "2024 - Present",
        employmentType: "Project Work",
        icon: "code",
        isExpanded: true,
        description: "Building polished web interfaces...",
        skills: ["Next.js", "React", "TypeScript"],
      },
    ],
  },
] satisfies ExperienceItemType[];
```

This is better than hardcoding content inside the component because:

- The component stays reusable.
- The content can be updated without touching layout logic.
- TypeScript verifies that the data matches the expected shape.

## Rendering setup

The section is rendered inside `MainContent`:

```tsx
import { WorkExperience } from "@/components/pages/landing-page/sections/work-experience";
import { workExperiences } from "@/config/work-experience";

export function MainContent() {
  return (
    <motion.div className="relative z-10">
      <section>
        {/* intro content */}
      </section>

      <WorkExperience experiences={workExperiences} />
    </motion.div>
  );
}
```

The intro and the work experience section are part of the same animated content block. This keeps the splash transition clean because the whole landing content enters together after the splash exits.

## Background behavior

The app uses a fixed `Stars` canvas behind the page:

```tsx
<Canvas
  style={{
    height: "100vh",
    position: "fixed",
    top: "0",
    left: "0",
    background: backgroundColor,
  }}
>
```

Because the canvas is fixed, it stays behind the landing content while the page scrolls.

For the work experience section to show the stars behind it, the section must be transparent:

```tsx
<section
  id="experience"
  className="relative border-y border-border/60 bg-transparent px-6 py-20"
>
```

The key class is:

```txt
bg-transparent
```

That allows the fixed `Stars` canvas to remain visible behind the section.

## What hides the stars

The stars become hidden when any parent or section paints an opaque background over them.

This hides the stars:

```tsx
className="bg-background"
```

Why?

`bg-background` resolves to the active theme background color from `app/globals.css`:

```css
:root {
  --background: oklch(1 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
}
```

So this:

```tsx
className="bg-background"
```

becomes a real white or dark background layer. If it is applied to the work experience section, it covers the fixed `Stars` canvas.

This also hides stars locally:

```tsx
last:before:bg-background
```

That creates a pseudo-element with an opaque background. Even if the main section is transparent, that pseudo-element paints a small block over the star field.

## Current section background rule

Use this when the stars should be visible:

```tsx
"relative border-y border-border/60 bg-transparent px-6 py-20"
```

Avoid this in the section wrapper:

```tsx
"bg-background"
```

Avoid this in timeline patches:

```tsx
"before:bg-background"
```

## Child element backgrounds

Small child backgrounds are still okay when they are intentional UI surfaces:

```tsx
bg-muted
bg-muted/50
hover:before:bg-muted/50
```

These are used for icons, skill pills, and hover states. They do not cover the whole section, so the stars remain visible around the content.

If the design should be even more glass-like, these child fills can be reduced:

```tsx
bg-muted/30
hover:before:bg-muted/30
```

## Mental model

The `Stars` canvas is the page background.

Transparent content lets it show through.

Opaque section backgrounds hide it.

So for this portfolio:

- Use `bg-transparent` on large landing sections that should share the star field.
- Use `bg-background` only when a section intentionally needs to become a solid readable surface.
- Keep small UI element fills subtle so they do not look like pasted image blocks.
