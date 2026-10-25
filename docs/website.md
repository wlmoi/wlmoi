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

## Resume and portfolio content

- `/resume` uses a single-column, three-page A4 engineering resume with dated roles, standard section headings, selectable text, and a checked-in downloadable PDF. Page one prioritizes Junior Edge AI, Microelectronics, and the Alcon internship; Tiny Tapeout is a compact additional-experience entry.
- `src/data/portfolio.ts` is the source for experience, projects, recognitions, and the complete certificate list. Additional projects were confirmed completed by William; UCIe remains in progress. Do not invent performance numbers for entries without measurements.
- The IGOR gallery uses the supplied `ROBOT1.jpeg` and `ROBOT2.jpeg`, stored under `public/projects/igor/`. Its expandable entry links the final presentation PDF. FPGA neural inference and the ASIC I/O-engine proof of concept are described separately.
- Per William's explicit placement instruction, `Presentation.pptx` is linked only in the IGOR project entry. The APSIPA GAN accelerator PPTX is linked in the GAN case study. Files are published as supplied; their slide contents are unchanged.
- The certificate library supports search, categories, and expanding the full list. Expiry labels reproduce the supplied dates; historical certificates are retained.
- Scroll reveals, project transitions, and hover motion respect reduced-motion preferences. Gallery images support keyboard activation, Escape, focus containment, and focus return.
- Community experience is stored in `organizationGroups`: 18 roles and activities across 12 organizations, including the 16 newly supplied entries and two earlier volunteering entries. Tutor roles in October 2024 and January 2025 remain separate; TPB is labeled as study. HME and OSKM dates are kept separately instead of one merged employment entry. The section links the supplied Investment Festival certificate and the LinkedIn experience record.
- The IGOR project entry also links William's supplied Google Drive archive. The site does not change its access permissions or mirror the archive.

## Spatial visual refresh

Visual direction references [ladunjexa/reactjs18-3d-portfolio](https://github.com/ladunjexa/reactjs18-3d-portfolio): a spatial hero, dark star field, pointer-responsive cards, and image-led work highlights. The compute-board model, CSS fallback, layout, and pointer interactions are original implementations; no reference-repository models, textures, dependencies, or personal content were copied.

- The hero's 4 × 4 compute-board sculpture is illustrative, not an actual project layout or hardware measurement. Three.js loads lazily on capable devices with a fine pointer. Orbit controls support dragging and a visible button pauses animation.
- Mobile, coarse pointers, low-core devices, reduced motion, and render failures use a CSS chip illustration. Offscreen hero rendering pauses; reduced motion disables the decorative floating and tilt effects.
- Expertise cards open their corresponding capability entry. Project highlights reveal the matching complete project entry and return filters to All work. All 15 project records, 29 certificates, 18 organization activities, resume, and the requested PPTX placements are retained.
- Scroll progress indicates position, and the navigation observer uses a zero intersection threshold so long sections can become active.

## Interactive skills keyboard

The supplied [Txemalon/3d-portfolio](https://github.com/Txemalon/3d-portfolio) and screenshot inform the white mechanical keycaps and blue case. The model, skill legends, key interaction, and CSS counterpart are implemented locally without copying reference code, models, sounds, or logo assets.

- The hero defaults to a five-column, three-row keyboard. All 15 keys represent William's skills; clicking a 3D key, choosing its dropdown option, or using its displayed shortcut updates the skill explanation and expertise link.
- Shortcuts work only inside the focused hero stage and do not intercept form fields or modified key combinations. The native dropdown supplies an accessible alternative to raycast selection. Mobile and reduced-motion views use actual HTML key buttons.
- Keys depress and return using frame-rate-independent damping. Textures use local canvas legends with no font or texture downloads. The existing silicon scene remains selectable, with its pause, offscreen suspension, and WebGL fallback behavior preserved.

## Keyboard sound

Keycap clicks and focused physical-key shortcuts synthesize a short mechanical click with Web Audio: filtered switch noise, a low body transient, and a quieter return click. Audio initializes only on a deliberate key press; page load, hover, dropdown selection, and enabling sound do not play it. The visible Sound on/off control persists the `wa_keyboard_sound` preference. Muting silences the master gain immediately. Missing audio support, blocked storage, or a rejected audio-context resume leave keyboard interaction functional. Audio nodes disconnect when finished and the context closes when the hero unmounts.


## Interactive circuit and fluid studies

The hero remains a skills keyboard. Its semantic heading has a GSAP Canvas2D particle layer with pointer response; text remains readable if rendering is unavailable. The layer stops drawing outside the viewport or in a hidden tab and is omitted for reduced motion.

Engineering, GAN, recognition and contact share `FluidShowcase`. Real `three-fluid-fx` velocity/density textures deform original GLSL lattice, trefoil, vortex and combined particles. Effect tabs, flow strength, pulse, pause and GAN narrative stage controls are native HTML. The simulation is lazy loaded, disposed offscreen, and disabled for reduced motion or unsupported float render targets, with SVG fallbacks. Compact scenes lower particle count and simulation resolution. A narrowly scoped package override shares the app's Three.js types with three-fluid-fx. Production license notices are in `public/licenses`.

The circuit atlas contains 15 supplied EL5013 LTspice ASC files and parsed wire, symbol and net-label metadata. Wire coordinates are preserved; raised component blocks are illustrative and do not represent silicon layout or a simulation. ScrollTrigger drives Three.js rotation. Native component buttons provide inspection on mobile and keyboard, and pause/reduced motion retain a stable view. Original ASC files are downloadable.

Mechanical key sound uses an original normalized WAV and a small HTMLAudio voice pool initiated by click or physical key gesture. A WebAudio fallback handles playback rejection. Volume and mute persist locally; Test sound explicitly enables and previews a key. No sound starts on page load or hover.


### Interaction follow-up

Particle viewports accept click/tap and Enter/Space to send a pulse, alongside the dedicated Pulse control. Paused and unsupported states explain why live controls are unavailable. The circuit atlas offers manual left/right/front rotation and clickable, keyboard-accessible SVG component selection when WebGL is unavailable. Project highlights, profile photos and experience photos use native buttons for the image viewer. Circuit atlas navigation is available on desktop and mobile.

The hero title also scatters its particles on click/tap or keyboard button activation; reduced-motion keeps the plain heading. Contact validation focuses the first invalid field, announces status changes and recovers to the email fallback after network/storage failures.


## October 2026 career and evidence update

- The interactive keyboard remains the default hero. It is also shown in the 1200 x 630 PNG social preview (`og-engineering.png`), with its SVG source retained. Award badges use a wrapping flex row with a real 14 px gap and matching padding.
- Career highlight links select the matching detailed experience and navigate to its stable anchor. Experience data now includes the supplied Edge AI, Microelectronics, laboratory, teaching and internship details; Digital Systems course and laboratory roles remain distinct. Tiny Tapeout is a collapsed supplemental entry on the portfolio.
- `/resume` presents a three-page detailed resume. The document itself has no columns, photographs, icons, charts or decorative skill ratings. Native headings, dated entries, bullet points and real text retain a logical reading order. The sidebar and export toolbar are excluded from print.
- `public/resume/William-Anthony-Resume.pdf` is a static, tagged A4 export of the same route. Regenerate it after resume content changes using Chromium print with CSS page size, backgrounds enabled and browser headers/footers off. Render and inspect all pages and verify extracted text before replacing the download.
- `#evidence` is an in-page archive, with native category filters, first-page image previews and original PDF links. PDFs and the GDS source load only after deliberate navigation/download; preview images are lazy loaded. These are user-supplied source files, not instructions. The recommendation letters support an APSIPA grant application; they are not presented as a grant award.
- The IRIS GDS top cell is `rf_energy_harvester$1`: 82,036 polygons, 20 layer/datatype pairs and a 287.07 x 290.71 micrometres bounding box (1 micrometre GDS unit). The preview is an outline rendering of the actual geometry with display colours; no foundry or fabrication claim is inferred.
- The winter-school certificate confirms 72 academic hours and March 17-28, 2025. This corrects the older event date in the credential library.

Asset integrity and source-document descriptions are recorded in [evidence.md](evidence.md).


## Planar CMOS device study

`#planar-inverter`, within the circuit atlas, is an original procedural teaching model. NMOS n+ source/drain regions sit in a p-type body; PMOS p+ source/drain regions sit in an n-well. Separate p+ body and n+ well taps connect to GND and VDD. The poly gate input is common, while metal joins the two drains at Y. Oxide, poly, contacts and metal have separate layer offsets for the exploded view. Dimensions are conceptual, not a process layout or transistor simulation. The associated LTspice example records Wp=5 um, Wn=2 um, L=0.18 um.

Native controls set input LOW/HIGH, select six structure groups, change separation, hide metal, choose isometric/top/front cross-section views, reset the scene and opt into auto rotation. Input LOW enables PMOS and yields HIGH; input HIGH enables NMOS and yields LOW. Highlighting denotes the available pull-up/down connection; no continuous static supply-to-ground current is animated.

The scene is lazy-loaded near the viewport, unmounted offscreen/in hidden tabs, and normally renders on demand. Auto rotation is opt-in and respects reduced motion. A clickable and keyboard-accessible SVG cross-section preserves input logic, layer selection and separation when WebGL is unavailable. Local CanvasTexture labels require no remote fonts or assets. The source-schematic action selects Cell_INV in the retained 15-schematic atlas. The keyboard hero, resume and evidence archive remain intact.


The original schematic atlas is retained in `#schematic-library`. Every `nmos*` and `pmos*` symbol now renders as an illustrative layered transistor (body or well, diffusion regions, oxide, gate, contacts, and terminal leads), with its original 2D symbol position and wire endpoints preserved. Other symbols retain their existing block representation. SVG fallback symbols expose the same NMOS/PMOS colours. Detail zoom and a context panel link the selected source device into the larger device study. The schematic library has its own visibility boundary and scroll trigger, independent of the added model. The original schematic canvas remains first in the circuit atlas; the larger transistor study sits below it. A native NMOS / PMOS example action selects Cell_INV without removing any catalog entry. Initial URL hashes also navigate after React mounts.
