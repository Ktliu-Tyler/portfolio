# Work Log

Last updated: 2026-05-24

## Project Recovery

- Continued the portfolio implementation from `implementation_plan.md`.
- Confirmed the actual Next.js project root is `d:\My web\portfolio`.
- Verified the repository remote is `git@github.com:Ktliu-Tyler/portfolio.git`.
- Recovered the app from an incomplete intermediate state and made it suitable for Vercel deployment.

## Core Site Implementation

- Added bilingual site structure with a client-side language provider.
- Set English as the default language and kept Chinese as an optional language.
- Added a fixed responsive navigation bar, language switcher, theme toggle, and footer.
- Added shared UI components for glass cards, animated sections, count-up stats, typewriter text, bento grids, timelines, and blog article layout.
- Added a Three.js background for the home page and verified that the canvas renders on desktop and mobile.
- Added light/dark theme support with readability fixes for white card backgrounds.
- Updated SEO metadata to position the site as a software and embedded systems portfolio.

## Content Improvements

- Rewrote the public-facing English copy toward a more professional technical portfolio tone.
- Reframed the home page around software, embedded systems, telemetry, IoT, data tooling, and modern web applications.
- Reorganized the Projects page into a more accurate technical timeline based on public GitHub repository records.
- Added project entries for:
  - Pixy Line Tracking Car
  - NTU Racing Remote Monitor
  - MakeNTU NXP AVNET
  - CANdecoder
  - GPS tooling
  - Raspberry Pi CAN monitor
  - IoT controller projects
  - Stock Analysis Taiwan

## Blog And Technical Writing

- Created a shared article data layer in `lib/articles.ts`.
- Updated the blog listing page to render from shared article metadata.
- Added a dynamic article route at `app/blog/[slug]/page.tsx`.
- Added repository references to the blog article layout.
- Added six technical articles based on public GitHub repository records:
  - `vehicle-telemetry-stack`
  - `dbc-can-decoder`
  - `gps-data-acquisition`
  - `hardware-communication-protocols`
  - `iot-control-system`
  - `stock-analysis-dashboard`
- Kept the existing three articles available:
  - `racing-team`
  - `can-protocol`
  - `dev-journey`

## Verification Completed

- `npm run lint` passed.
- `npm run build` passed.
- Static generation confirmed for 15 routes.
- Browser smoke checks confirmed that the following routes render with headings and no runtime error overlay:
  - `/`
  - `/projects`
  - `/blog`
  - `/blog/vehicle-telemetry-stack`
  - `/blog/dbc-can-decoder`
  - `/blog/gps-data-acquisition`
  - `/blog/hardware-communication-protocols`
  - `/blog/iot-control-system`
  - `/blog/stock-analysis-dashboard`
  - `/blog/racing-team`
  - `/blog/can-protocol`
  - `/blog/dev-journey`

## Remaining Editorial Work

- Add real screenshots, architecture diagrams, and sample outputs for the strongest projects.
- Add per-article SEO metadata and Open Graph images.
- Professionalize the Chinese translation content; the current default experience is English.
- Add a resume/CV download and LinkedIn link when the final assets are ready.
- Consider migrating from `next lint` to the ESLint CLI before Next.js 16.
