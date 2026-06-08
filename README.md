# pathfinder

[![CI](https://github.com/ahmifte/pathfinder/actions/workflows/ci.yml/badge.svg)](https://github.com/ahmifte/pathfinder/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)

A self-hostable, open-source **course platform** with Stripe one-time payments, gated MDX lessons, and per-lesson progress tracking. Keep ~97% of revenue instead of handing half to a marketplace.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ahmifte/pathfinder)

## Why this project?

Course marketplaces take a huge cut and own your audience. pathfinder is the
self-hosted alternative: you own the platform, the customer relationship, and the
margin. It is production-ready and easy to extend — a new course is a registry
entry plus a few MDX files.

## Features

- Course catalog with free intro lessons as the funnel
- One-time Stripe Checkout granting lifetime access (idempotent webhook)
- Gated MDX lessons — free lessons public, the rest paywalled
- Per-lesson progress tracking and a "My learning" dashboard
- GitHub auth via NextAuth + Prisma
- Account/data deletion endpoint (privacy compliance)
- Centralized, validated env config in [`lib/env.ts`](lib/env.ts)

## Adding a course

1. Add an entry to [`lib/courses.ts`](lib/courses.ts) with its lessons, `amount`, and a stable `lookupKey`.
2. Create `content/courses/<courseId>/<lessonSlug>.mdx` for each lesson.
3. Run `pnpm stripe:sync` to provision the one-time Price in Stripe.

## Getting started

```bash
pnpm install                 # runs `prisma generate`
cp .env.example .env.local   # fill in DATABASE_URL, auth, Stripe
pnpm db:push                 # create the schema
pnpm dev
```

Set a Stripe webhook to `/api/stripe/webhook` and configure `STRIPE_WEBHOOK_SECRET`. All variables are documented in [`.env.example`](.env.example).

### Stripe products & prices (code as source of truth)

Courses define their price in code ([`lib/courses.ts`](lib/courses.ts)) via `amount` + a stable `lookupKey`. Provision them with:

```bash
pnpm stripe:sync
```

This idempotently creates/updates the Products and one-time Prices in whatever account `STRIPE_SECRET_KEY` belongs to (run it with **your** key). At runtime the app resolves the live price ID by `lookupKey` via [`lib/stripe-prices.ts`](lib/stripe-prices.ts) — no price IDs in env or code.

## Monetization

One-time course sales ($99–$299) with bundle potential. Because it is
self-hosted, you keep almost everything after Stripe fees.

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm lint` / `pnpm typecheck`
- `pnpm db:push`
- `pnpm stripe:sync` — provision Stripe products/prices from `lib/courses.ts`

## License

MIT — see [LICENSE](./LICENSE).
