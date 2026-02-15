# Premium Feature — Production Launch Checklist

## Current Status
Premium features are **hidden in production** behind a feature flag (`lib/flags.ts`).
All infrastructure (Stripe API routes, database schema, webhooks) is deployed and functional.
Currently using Stripe **Sandbox** (test mode) keys.

## Pre-Launch Steps

### 1. Stripe: Switch to Live Mode
- [ ] Go to Stripe Dashboard → switch from Sandbox to your **live account**
- [ ] Create product: "SCP Reader Premium", one-time payment, $20 (or chosen price)
- [ ] Copy the new live `price_` ID
- [ ] Copy your live API secret key (`sk_live_...`) from Developers → API keys

### 2. Stripe: Create Live Webhook
- [ ] Go to Developers → Webhooks → Add endpoint
- [ ] Endpoint URL: `https://scp-reader.co/api/stripe/webhook`
- [ ] Events: select only `checkout.session.completed`
- [ ] Copy the signing secret (`whsec_...`)

### 3. Vercel: Update Environment Variables
Replace the sandbox values with live values:
- [ ] `STRIPE_SECRET_KEY` → `sk_live_...`
- [ ] `STRIPE_WEBHOOK_SECRET` → live `whsec_...`
- [ ] `NEXT_PUBLIC_STRIPE_PRICE_ID` → live `price_...`

### 4. Fix Image Loading (Prerequisite)
Image Safe Mode is the flagship premium feature, but SCP CDN images
are currently not loading. This must be resolved before launching premium.
- [ ] Investigate and fix image loading from `scp-wiki.wdfiles.com`
- [ ] Verify Image Safe Mode works end-to-end with real images

### 5. Enable Feature Flag
In `lib/flags.ts`, change:
```ts
premiumEnabled: true,
```

### 6. Deploy & Verify
- [ ] Push changes and deploy to Vercel
- [ ] Test checkout with a real card (small amount recommended)
- [ ] Verify webhook fires and premium activates
- [ ] Verify Image Safe Mode works on live site
- [ ] Verify duplicate purchase guard works

### 7. Post-Launch
- [ ] Roll sandbox API keys (they were exposed during development)
- [ ] Monitor Stripe webhook dashboard for failed deliveries
- [ ] Consider adding cookie consent (GDPR) before marketing push

## Maintenance & Degraded Mode

### Full Maintenance (site down)
Set `NEXT_PUBLIC_MAINTENANCE_MODE=true` in Vercel → Redeploy.
All pages rewrite to an SCP-themed maintenance page. API routes remain accessible (Stripe webhooks still work).
To restore: set to `false` or remove the variable → Redeploy.

### Degraded Mode (partial issues, e.g. images broken)
Set `NEXT_PUBLIC_DEGRADED_MODE=true` in Vercel → Redeploy.
A warning banner appears at the top of all pages. Site remains fully functional.
To restore: set to `false` or remove the variable → Redeploy.

### Architecture
- Feature flags: `lib/flags.ts` (`maintenanceMode`, `degradedMode`)
- Maintenance page: `app/maintenance/page.tsx` (fully self-contained, no external dependencies)
- Proxy: `proxy.ts` (Next.js 16 convention; rewrites all non-API, non-static routes to `/maintenance` when `NEXT_PUBLIC_MAINTENANCE_MODE=true`)
- Degraded banner: `components/ui/degraded-banner.tsx` (renders in `app/layout.tsx` when `NEXT_PUBLIC_DEGRADED_MODE=true`)

### Testing locally
1. Add `NEXT_PUBLIC_MAINTENANCE_MODE=true` to `.env.local`
2. Restart dev server (`npm run dev`)
3. Verify all routes show maintenance page except `/maintenance` itself and `/api/*`
4. For degraded mode: set `NEXT_PUBLIC_DEGRADED_MODE=true` instead, verify banner appears

## Security Notes
- Stripe sandbox keys were shared in a Claude chat during development — roll them after launch
- `SUPABASE_SERVICE_ROLE_KEY` was also visible — consider rolling after launch
- Never commit `.env.local` or any secrets to the repository

## Architecture Reference

### Premium & Stripe
- Feature flag: `lib/flags.ts` (`premiumEnabled`, `maintenanceMode`, `degradedMode`)
- Stripe checkout: `app/api/stripe/checkout/route.ts`
- Stripe webhook: `app/api/stripe/webhook/route.ts`
- Premium hook: `lib/hooks/use-premium.ts`
- Preferences hook: `lib/hooks/use-preferences.ts`
- Upgrade modal: `components/ui/upgrade-modal.tsx`
- Premium gate: `components/ui/premium-gate.tsx`
- Settings page: `app/settings/settings-content.tsx`
- Image safe mode: `lib/hooks/use-image-safe-mode.ts`
- DB migrations: `supabase/migrations/20260215_create_user_profiles_table.sql`, `supabase/migrations/20260215_add_preferences_and_update_rpc.sql`

### Maintenance & Degraded Mode
- `proxy.ts` — maintenance rewrite logic (runs before Supabase session refresh)
- `app/maintenance/page.tsx` — SCP-themed full-page lockdown
- `components/ui/degraded-banner.tsx` — warning banner
- `app/layout.tsx` — conditionally renders DegradedBanner, hides nav/analytics when maintenance
