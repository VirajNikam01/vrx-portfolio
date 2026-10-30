This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Inquiry Submissions

Backend business logic lives in `backend/services/` and accesses only owned table
repositories in `backend/repository/`. HTTP handlers live directly in
`app/api/**/route.ts`. UI is colocated in `app/components/`,
`app/blogs/components/`, and `app/recommendations/components/`;
browser clients live in `lib/api/`, hooks in `hooks/`, and shared DTOs and schemas
in `shared/contracts/`.

UI is organized into atoms, molecules, and organisms. Page composition stays
beside its route. See [component organization](docs/component-organization.md)
for placement examples and dependency rules.

SEO settings live in `config/seo.ts`; metadata, structured data, and crawler
helpers live in `lib/seo/`. See [SEO organization](docs/seo-organization.md)
for responsibilities, cleanup details, and validation.

Run `npm run check:architecture` to check table ownership, frontend/backend
boundaries, and service dependency cycles. These checks also run before linting.
See [the architecture PRD](docs/backend-frontend-separation-prd.md) for the rules.

The resume download form posts to `/api/inquiries`. The same endpoint can be reused by future collaboration, hiring, and contact forms by changing the `source` field.

See [docs/inquiries-and-gated-resume.md](docs/inquiries-and-gated-resume.md)
for the full setup and operations guide covering Supabase Postgres, Drizzle
migrations, Resend, Supabase Storage, signed CV URLs, and server-side email
validation.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
