# Inquiry And Gated Resume Pipeline

This document covers the inquiry endpoint, email notifications, Supabase
Postgres persistence, Drizzle migrations, and the gated CV download flow.

## Flow

The resume download dialog posts to `POST /api/inquiries` with:

```json
{
  "source": "resume_download",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "reason": "I want to review your profile for a frontend role."
}
```

The handler and inquiry service:

1. Validates the request body with Zod.
2. Rejects disposable or unreachable email domains.
3. Creates a private Supabase Storage signed URL when `source` is
   `resume_download`.
4. Stores the inquiry in Supabase Postgres via Drizzle.
5. Sends the site owner an email with the inquiry details.
6. Returns the inquiry id and signed CV URL to the browser.
7. The browser opens the signed CV URL.

Requester CV emails are intentionally disabled for now in
`backend/services/inquiries.ts`. The helper still exists in
`backend/services/notifications.ts` so it can be restored later.

## Important Files

- `app/api/inquiries/route.ts`: request parsing, shape validation, service calls, and HTTP responses.
- `backend/services/inquiries.ts`: inquiry workflow and service orchestration.
- `shared/contracts/inquiries-schema.ts`: request validation schema and allowed sources.
- `backend/validation/inquiry-email.ts`: disposable-domain and MX checks.
- `backend/validation/disposable-email-domains.ts`: maintained disposable list.
- `backend/repository/inquiries.ts`: Drizzle insert helper.
- `lib/api/inquiries.ts`: browser-side submit helper and typed errors.
- `backend/integrations/storage/resume.ts`: Supabase Storage signed CV URL creation.
- `backend/db/client.ts`: Drizzle/Postgres singleton client.
- `backend/db/schema.ts`: Drizzle table definitions.
- `backend/services/notifications.ts`: Resend email helpers.
- `backend/integrations/storage/supabase.ts`: server-only Supabase service-role client.
- `drizzle/`: generated SQL migrations and Drizzle metadata.

## Environment Variables

Required:

```bash
DATABASE_URL="postgresql://..."
RESEND_API_KEY="re_..."
INQUIRY_FROM_EMAIL="Viraj Portfolio <noreply@virajnikam.in>"
INQUIRY_NOTIFICATION_EMAIL="your-email@example.com"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="..."
RESUME_STORAGE_BUCKET="private-assets"
RESUME_STORAGE_PATH="resume/viraj-nikam-cv.pdf"
```

Optional:

```bash
RESUME_SIGNED_URL_EXPIRES_SECONDS="86400"
```

`SUPABASE_SERVICE_ROLE_KEY` must remain server-only. Never expose it with a
`NEXT_PUBLIC_` prefix.

## Supabase Postgres And Drizzle

Install dependencies are already present:

- `drizzle-orm`
- `postgres`
- `drizzle-kit`

Generate a migration from `backend/db/schema.ts`:

```bash
npm run db:generate
```

Apply migrations to Supabase Postgres:

```bash
npm run db:migrate
```

Useful local commands:

```bash
npm run db:push
npm run db:studio
```

Use `db:migrate` for production because it applies reviewed migration files.
Use `db:push` only for quick development syncing.

## Supabase Storage Setup

1. Open Supabase Dashboard.
2. Go to Storage.
3. Create a private bucket, for example `private-assets`.
4. Upload the CV to the configured path, for example:

```text
resume/viraj-nikam-cv.pdf
```

5. Set:

```bash
RESUME_STORAGE_BUCKET="private-assets"
RESUME_STORAGE_PATH="resume/viraj-nikam-cv.pdf"
```

The signed URL is generated on the server with the service role key. The
current implementation uses `download: true`, so the signed URL starts a direct
download instead of an inline preview.

## Resend Setup

1. Verify the sending domain in Resend, for example `virajnikam.in`.
2. Add the DNS records Resend gives you.
3. Wait until Resend marks the domain as verified.
4. Use a verified sender:

```bash
INQUIRY_FROM_EMAIL="Viraj Portfolio <noreply@virajnikam.in>"
```

5. Set the owner notification inbox:

```bash
INQUIRY_NOTIFICATION_EMAIL="your-email@example.com"
```

Do not use `onboarding@resend.dev` for production. That test sender is limited
and can prevent delivery to other recipients.

## Email Validation

The endpoint validates email in two layers:

1. Zod email syntax validation.
2. Server-side inquiry email validation:
   - rejects known disposable email domains;
   - rejects subdomains of those disposable domains;
   - checks that the domain has MX records.

This is a good first line of defense, but it is not the same as proving the
visitor owns the email inbox. For stricter verification later, add OTP or magic
link verification before generating the signed CV URL.

## Request Metadata

Inquiry rows store a small `metadata` JSON object for operational context and
basic abuse debugging. The app collects:

- `userAgent`
- `referer`
- `acceptLanguage`
- `country`
- `region`
- `city`
- `timezone`

The raw IP address is not stored, and the app does not store IP hashes. That
keeps this portfolio flow simpler and more privacy-friendly. Add IP-based abuse
controls only if spam or repeated automated submissions become a real problem.

Location fields come from hosting/provider headers such as Vercel's
`x-vercel-ip-country`, `x-vercel-ip-country-region`, `x-vercel-ip-city`, and
`x-vercel-ip-timezone`. These fields may be missing locally or on providers
that do not send them.

## Server Error UX

`lib/api/inquiries.ts` preserves server field errors from responses like:

```json
{
  "error": "Invalid email address.",
  "issues": {
    "email": ["Please use a non-temporary email address."]
  }
}
```

The resume dialog maps those errors into React Hook Form with `setError`, so
messages appear below the correct field.

## Adding Future Forms

Reuse `POST /api/inquiries` for future forms. Supported `source` values live in
`shared/contracts/inquiries-schema.ts`:

- `resume_download`
- `collaboration`
- `hiring_contact`
- `general_contact`

For a new form, submit the same shape with a different `source`. Only
`resume_download` creates a signed CV URL.

## Operational Checklist

Before deploying:

1. Confirm all environment variables are set in the hosting provider.
2. Run `npm run db:migrate` against the production Supabase database.
3. Confirm the Supabase Storage bucket is private.
4. Confirm the CV exists at `RESUME_STORAGE_PATH`.
5. Confirm Resend domain verification is complete.
6. Submit a real test inquiry.
7. Check:
   - database row exists in `inquiries`;
   - owner email arrives;
   - signed CV URL opens/downloads;
   - requester email is still disabled if that is desired.

## Current Intentional Choices

- The CV is not stored in `public/`.
- The CV is stored privately in Supabase Storage.
- The user receives the signed CV URL in the browser response.
- Requester email delivery is disabled for now.
- Owner notification email remains enabled.
- Signed CV URL currently forces direct download.
