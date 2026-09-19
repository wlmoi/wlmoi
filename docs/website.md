# Portfolio Website Guide

This document covers the implementation, local development, database setup, deployment, and maintenance details for William Anthony's portfolio website.

## What this project is

This is a single-page Vite application with a dedicated print-friendly resume route. It is designed around this engineering narrative:

**Architecture -> RTL -> Verification -> Physical implementation -> Embedded intelligence -> Measurable outcomes**

The interface uses:

- React + Vite + TypeScript (strict mode)
- Tailwind CSS with local shadcn-style UI primitives
- GSAP / ScrollTrigger for structured motion
- React Three Fiber / Drei for a restrained silicon visualization
- Supabase for the public contact workflow
- Vercel for static production deployment

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
npm run preview
```

Node 20.19+ is required by the project configuration.

## Supabase

The portfolio is configured for the intended Supabase project:

- Project URL: `https://sqgtzozlukfhfhrieuws.supabase.co`
- Project ref: `sqgtzozlukfhfhrieuws`
- Client key type: **publishable key**

The browser client accepts environment variables and falls back to the supplied publishable key. Publishable keys are intended for browser applications when Row Level Security and least-privilege grants are enforced. Secret and service-role keys must never be shipped to the browser.

### Database setup

The migration lives in:

```text
supabase/migrations/20260919000000_contact_messages.sql
```

For direct SQL Editor setup, use:

```text
supabase/contact_messages.sql
```

The `contact_messages` table contains:

```text
id
created_at
name
email
subject
category
message
status
```

RLS is enabled. Anonymous clients receive only the required INSERT privilege on public contact fields. No anonymous SELECT, UPDATE, or DELETE access is granted. Database constraints and the RLS policy enforce the same shape, length, and category rules as the client form.

The form also includes a honeypot and a one-minute client-side cooldown. These reduce casual abuse but are not authoritative rate limiting. For higher traffic, add an Edge Function, Vercel Edge Middleware, Turnstile, or another server-side abuse-prevention layer.

### Supabase CLI

After installing the Supabase CLI and authenticating:

```bash
supabase login
supabase link --project-ref sqgtzozlukfhfhrieuws
supabase db push
```

The repository already contains `supabase/config.toml` with the project ref.

## Vercel deployment

This is a standard Vite static application. The repository's `vercel.json` defines:

```text
Build Command: npm run build
Output Directory: dist
```

Configure these environment variables in Vercel:

```env
VITE_SUPABASE_URL=https://sqgtzozlukfhfhrieuws.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SITE_URL=https://wlmoi.vercel.app
```

`VITE_SUPABASE_ANON_KEY` remains supported as a backwards-compatible alias, but `VITE_SUPABASE_PUBLISHABLE_KEY` is preferred.

Vercel installs dependencies from `package.json` automatically during deployment. Do not commit `.env` files containing private credentials.

## Content integrity

The portfolio is conservative with evidence. Public claims, project metrics, project links, and ongoing targets are presented only where supplied or verifiable. Ongoing targets remain labeled as targets.

The main featured case study is the **Signed INT8 GAN Accelerator, from RTL to GDSII**, including the reported 4x4 PE array, SRAM buffers, complete RTL-to-GDSII path, post-route bit-exact verification, and stated physical-signoff metrics.

## Accessibility and performance

- Semantic landmarks and heading hierarchy
- Skip-to-content link
- Keyboard-accessible mobile menu with Escape support and focus return
- Visible focus states and 44px-class touch targets
- Reduced-motion mode pauses the hero video and disables transform-heavy motion
- WebGL is lazy-loaded, suspended while offscreen, simplified on mobile and low-power devices, and hidden from assistive technology
- Hero video uses `preload="metadata"` and remains outside the JavaScript bundle
- Print-friendly resume route: `/resume?print=1`

## Security note

The supplied publishable Supabase key is browser-safe under RLS, but this repository intentionally does not contain the database password or any secret/service-role credential. Never add a Postgres connection string to a frontend environment variable. Keep direct database credentials on trusted servers and tools only.
