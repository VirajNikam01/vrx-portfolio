# Theme Setup, SSR, and `useMounted`

This note explains why theme handling in this project needs a mounted check, how `next-themes` works with Next.js App Router, and what the current setup is doing.

## The important SSR idea

In Next.js App Router, even Client Components can be involved in the initial server/pre-rendered output.

That means this file:

```tsx
"use client";
```

does not mean "only render in the browser from the beginning."

It means:

- The component can use hooks like `useState`, `useEffect`, and browser event handlers.
- The component is hydrated in the browser.
- But the initial HTML can still be generated before browser-only values exist.

So any value that only exists in the browser is not reliable during the first render.

Examples:

```tsx
window
document
localStorage
matchMedia
resolvedTheme from next-themes
```

This matters for theme because the server cannot know the user's saved theme from `localStorage`, and it cannot fully resolve the browser's live theme preference in the same way the client can.

## Why theme can look wrong initially

The project uses `next-themes`:

```tsx
<NextThemesProvider
  attribute="class"
  defaultTheme="system"
  enableColorScheme
>
  {children}
</NextThemesProvider>
```

With `attribute="class"`, `next-themes` applies the selected theme class to the `<html>` element:

```html
<html class="dark">
```

or:

```html
<html class="light">
```

But during SSR/pre-rendering, the real value may not be known yet. After the page loads in the browser, `next-themes` reads the saved/system theme and updates the `<html>` class.

If a component reads `resolvedTheme` too early and falls back to `"light"`, it can render the wrong initial UI.

This was the issue in `Stars`:

```tsx
const resolvedTheme = themeContext.resolvedTheme ?? "light";
```

That line forced light mode before `next-themes` had resolved the real theme.

## Why `suppressHydrationWarning` is used

`next-themes` intentionally changes the `<html>` element on the client.

Because of that, the root layout uses:

```tsx
<html suppressHydrationWarning>
```

This tells React that a small difference on this element is expected during hydration.

This is recommended by `next-themes` when using it with the App Router, because the theme class is applied on the client.

## Why `useMounted` exists

The `useMounted` hook gives a safe way to know whether the code is running after client hydration.

Current implementation:

```tsx
"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
}
```

This means:

- On the server/pre-render: `mounted` is `false`
- In the browser: `mounted` is `true`

So theme-dependent UI can wait until the browser has resolved the real theme:

```tsx
const mounted = useMounted();
const { resolvedTheme } = useTheme();

if (!mounted) {
  return null;
}
```

This is not needed in every Client Component. It is only needed when the first render depends on browser-only values.

Good cases for `useMounted`:

```tsx
useTheme()
localStorage
window.innerWidth
matchMedia
document
```

Not needed:

```tsx
function Button() {
  return <button>Click</button>;
}
```

## Why `useSyncExternalStore` instead of `useEffect`

The common mounted pattern is:

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);
```

That pattern is common in `next-themes` examples, but this project's React 19 lint rules warn against synchronous state updates inside effects.

So this project uses `useSyncExternalStore`.

It gives React separate server and client snapshots without disabling lint rules.

This is a clean React-compatible way to express:

```tsx
server: false
client: true
```

## Current project setup

### 1. Package installation

Install `next-themes`:

```bash
npm install next-themes
```

This project already has it in `package.json`:

```json
"next-themes": "^0.4.6"
```

### 2. Theme provider

File:

```txt
components/theme/theme-provider.tsx
```

Setup:

```tsx
"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  );
}
```

Meaning:

- `attribute="class"` applies `light` or `dark` on `<html>`.
- `defaultTheme="system"` follows the user's system preference by default.
- `enableColorScheme` lets browser UI, such as form controls, understand the active color scheme.

### 3. Root layout

File:

```txt
app/layout.tsx
```

Important parts:

```tsx
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};
```

This is the Next.js way to create theme-color meta tags.

The layout also wraps the app with the provider:

```tsx
<html suppressHydrationWarning>
  <body>
    <ThemeProvider>{children}</ThemeProvider>
  </body>
</html>
```

### 4. Tailwind theme classes

File:

```txt
app/globals.css
```

The project uses CSS variables for theme tokens:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

And Tailwind maps those variables:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

So classes like this automatically follow the active theme:

```tsx
className="bg-background text-foreground"
```

### 5. Theme toggle

File:

```txt
components/theme/theme-toogle.tsx
```

The toggle waits for mount before using `resolvedTheme`:

```tsx
const { resolvedTheme, setTheme } = useTheme();
const mounted = useMounted();

const switchTheme = useCallback(() => {
  if (!mounted || !resolvedTheme) {
    return;
  }

  setTheme(resolvedTheme === "dark" ? "light" : "dark");
}, [mounted, resolvedTheme, setTheme]);
```

This prevents actions based on an unknown theme.

### 6. Stars canvas

File:

```txt
components/3d/Stars.tsx
```

The canvas waits until mount:

```tsx
const mounted = useMounted();
const { resolvedTheme } = useTheme();

if (!mounted) {
  return <div className="fixed inset-0 bg-background" />;
}
```

Then it derives the active theme safely:

```tsx
const activeTheme = resolvedTheme === "dark" ? "dark" : "light";
```

This avoids the earlier problem where the component forced light mode before the real theme was available.

## Rule of thumb

Do not add `useMounted` to every Client Component.

Only use it when initial rendering depends on data that only exists in the browser.

For theme:

- Styling through CSS variables is safe.
- Reading `resolvedTheme` in React render needs care.
- Components that render different markup, colors, canvas state, or icons based on `resolvedTheme` should wait until mounted.

## Final mental model

Client Component does not mean "browser-only initial render."

It means "this component can hydrate and run client behavior."

When the first render needs browser-only data, wait for mount. That is why this project uses `useMounted` for theme-sensitive UI.
