# SCP Reader

Next.js 16 + Supabase + TypeScript + Tailwind. Phase 3: Authentication.

**Capabilities:** Browse SCP by series, mark read, bookmark, track progress. Premium tier (feature-flagged) with Image Safe Mode. Maintenance and degraded modes for incident response.

## Getting Started

1. Copy `.env.example` to `.env.local` and add your Supabase URL and anon key.
2. Run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Supabase

- **Migrations**: `supabase/migrations/` — run with `supabase db push` after linking
- **Seed SCP data**: `npm run seed` (requires `.env.local`; fetches from scp-data.tedivm.com)
- **Link runbook**: `docs/supabase-link-runbook.md`

## SCP Content Reliability

SCP article content is fetched **directly from the SCP-Data API** by the browser via `useScpContent`. There is no server-side proxy.

> ⚠️ **Do not re-introduce a server-side content proxy.** A previous `/api/scp-content/` route proxied articles through Vercel serverless functions, which generated 32 GB of origin transfer in 2 days from a single user. The upstream API is public and CORS-enabled — there is no reason to proxy it.

## Safe Change Workflow

- **Playbook**: `docs/SAFE-OPERATIONS.md`
- **Customer-facing features**: `docs/FEATURES.md`
- **Verification command**: `npm run verify` (lint + build + auth smoke test)
- **Auth smoke only**: `npm run smoke:auth`

## Environment Variables

For full functionality (including premium flow and maintenance):

- **Supabase:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`
- **Stripe (premium):** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PRICE_ID` — required for checkout; use test keys locally
- **Incident response:** `NEXT_PUBLIC_MAINTENANCE_MODE=true` (full-page lockdown) or `NEXT_PUBLIC_DEGRADED_MODE=true` (warning banner)

See `lib/env.ts` for server-side validation.

## Maintenance & Degraded Mode

- **Maintenance:** Set `NEXT_PUBLIC_MAINTENANCE_MODE=true` → all pages rewrite to SCP-themed lockdown. API routes stay reachable (Stripe webhooks continue).
- **Degraded:** Set `NEXT_PUBLIC_DEGRADED_MODE=true` → warning banner appears; site remains usable.

Details in `docs/PREMIUM_LAUNCH.md`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
