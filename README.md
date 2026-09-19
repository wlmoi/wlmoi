# William Anthony | Engineering Portfolio

A cinematic, recruiter-focused portfolio for **William Anthony**, an Electrical and Electronics Engineering student at Institut Teknologi Bandung working across **ASIC, FPGA, RTL verification, Edge AI, embedded systems, DSP, and engineering software**.

> Engineering intelligence from RTL to real-world systems.

The portfolio keeps the technical story front and center while retaining a little of the personality behind the GitHub profile: **Always Learning**. William’s public GitHub README is informal by design, with Instagram `@wlmoi`, STEI-R’23, a playful hobby ranking, and the line **“Code, Create, Connect.”** The portfolio translates that same personality into a sharper engineering interface without making it feel corporate or anonymous.

##  _Stats_
[![My GitHub Streak](https://streak-stats.demolab.com/?user=wlmoi&theme=dracula)](https://git.io/streak-stats)
![My GitHub stats](https://github-readme-stats.vercel.app/api?username=wlmoi&layout=compact&theme=dracula) <!--Add Indonesian version-->
[![GitHub Streak](https://streak-stats.demolab.com?user=wlmoi&theme=material-palenight&border_radius=5&locale=id&date_format=j%20M%5B%20Y%5D&card_width=250&card_height=100)](https://git.io/streak-stats)
[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=wlmoi&layout=compact&theme=dracula)](https://github.com/wlmoi)


## What this project is

This is a single-page Vite application with a dedicated print-friendly résumé route. It is designed around a simple engineering narrative:

**Architecture → RTL → Verification → Physical implementation → Embedded intelligence → Measurable outcomes**

The interface uses:

- React + Vite + TypeScript (strict mode)
- Tailwind CSS with shadcn-style local UI primitives
- GSAP / ScrollTrigger for structured cinematic motion
- React Three Fiber / Drei for one restrained silicon visualization
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

Node 20.19+ is required by the project configuration. The project is intentionally dependency-explicit so a fresh checkout can be installed and built without relying on the state of a developer machine.

## Supabase: already wired to the intended project

The portfolio is configured for the supplied Supabase project:

- Project URL: `https://sqgtzozlukfhfhrieuws.supabase.co`
- Project ref: `sqgtzozlukfhfhrieuws`
- Client key type: **publishable key**

The browser client falls back to the supplied publishable key, while environment variables can override it for a different deployment. Supabase explicitly documents publishable keys as safe for browser applications when Row Level Security and least-privilege grants are enforced. Secret/service-role keys must never be shipped to the browser.

### Database setup

The migration lives in:

```text
supabase/migrations/20260919000000_contact_messages.sql
```

For a direct SQL Editor setup, the equivalent script is:

```text
supabase/contact_messages.sql
```

Schema:

```text
contact_messages
├── id
├── created_at
├── name
├── email
├── subject
├── category
├── message
└── status
```

RLS is enabled. Anonymous clients receive only the required INSERT privilege on public contact fields. No anonymous SELECT, UPDATE, or DELETE access is granted. Database constraints and the RLS policy enforce the same shape/length/category rules as the client form.

The form also includes a honeypot and a one-minute client-side cooldown. Those controls reduce casual abuse but are **not authoritative rate limiting**. For production hardening under high traffic, add an Edge Function, Vercel Edge Middleware, Turnstile, or another server-side abuse-prevention layer.

### Supabase CLI

After installing the Supabase CLI and authenticating:

```bash
supabase login
supabase link --project-ref sqgtzozlukfhfhrieuws
supabase db push
```

The repository already contains `supabase/config.toml` with the project ref, so the project can be linked without manually re-entering the ref.

## Vercel: deploy directly

This is a standard Vite static application. Vercel settings are already defined in `vercel.json`:

```text
Build Command: npm run build
Output Directory: dist
```

Recommended environment variables in Vercel:

```env
VITE_SUPABASE_URL=https://sqgtzozlukfhfhrieuws.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SITE_URL=https://wlmoi.vercel.app
```

`VITE_SUPABASE_ANON_KEY` is also accepted as a backwards-compatible alias, but the new `VITE_SUPABASE_PUBLISHABLE_KEY` name is preferred.

The public publishable key can appear in the client bundle by design. A secret key or database password must not.

## Personal layer

William’s original GitHub profile is intentionally human and informal. It introduces him as an Electrical Engineering student, links Instagram as `@wlmoi`, references STEI-R’23, and closes with “Code, Create, Connect”. The current portfolio keeps that warmth in restrained places instead of turning the site into a generic corporate template.

Public profiles:

- LinkedIn: https://www.linkedin.com/in/wlmoi/
- GitHub: https://github.com/wlmoi
- Instagram: https://www.instagram.com/wlmoi/
- Portfolio: https://wlmoi.vercel.app/
- Source repository: https://github.com/wlmoi/wlmoi

## Content integrity

The portfolio is intentionally conservative with evidence. Public claims, project metrics, project links, and ongoing targets are only presented where supplied or verifiable. Ongoing targets remain labeled as targets.

The main featured case study is the supplied **Signed INT8 GAN Accelerator, from RTL to GDSII**, including the reported 4×4 PE array, SRAM buffers, complete RTL-to-GDSII path, post-route bit-exact verification, and stated physical-signoff metrics.

## Accessibility and performance

- Semantic landmarks and heading hierarchy
- Skip-to-content link
- Keyboard-accessible mobile menu with Escape support and focus return
- Visible focus states and 44px-class touch targets
- Reduced-motion mode pauses the hero video and disables transform-heavy motion
- WebGL is lazy-loaded, suspended while offscreen, simplified on mobile/low-power devices, and hidden from assistive technology
- Hero video uses `preload="metadata"` and remains outside the JavaScript bundle
- Print-friendly résumé route: `/resume?print=1`

## Important deployment note

The supplied publishable Supabase key is browser-safe under RLS, but the repository intentionally does **not** contain the database password or any secret/service-role credential. Do not add the provided Postgres connection string to a frontend environment variable. Supabase recommends keeping direct database credentials on trusted servers/tools only.


