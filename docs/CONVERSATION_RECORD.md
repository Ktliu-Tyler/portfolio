# Conversation Record

Last updated: 2026-05-24

This document summarizes the recovery and hardening work requested during the portfolio completion process. It is intended to make future debugging, content review, and deployment follow-up easier.

## Request Timeline

1. The project was identified as the `Ktliu-Tyler/portfolio` repository, intended for Vercel deployment on a custom domain.
2. The initial implementation had stopped mid-progress, so the recovery work continued from `implementation_plan.md`.
3. A local preview was requested so the current state could be inspected in the browser.
4. Broken blog and project/development-history pages were reported, including a runtime error from the typewriter cursor animation.
5. Light theme contrast issues were reported where white text appeared on white or very light backgrounds.
6. A site-wide professional review was requested, with English as the default language and more mature technical wording.
7. Blog and development-history articles were requested based on public GitHub repository records.
8. Implementation, documentation, workflow notes, error records, verification, commit, and GitHub push were requested.
9. A later correction requested removing the NTU Racing lead role from the home-page typewriter rotation.
10. A follow-up requested newest-to-oldest project ordering and cleaner, more professional article layout and wording.

## Completed Recovery Decisions

- English is the default user-facing experience.
- Chinese remains available as an optional locale.
- The homepage positions the site as a software, embedded systems, vehicle telemetry, IoT, and data tooling portfolio.
- Projects are organized as a chronological technical timeline rather than a casual project gallery.
- Blog content is stored through a shared article metadata layer and rendered through both listing and dynamic article routes.
- Technical writing focuses on repository-backed work to avoid unsupported claims.
- Maintenance records are kept under `docs/` so future errors can be traced without relying on chat history.

## Key Fixes Already Applied

- Removed an unused import that caused a Vercel/TypeScript build failure.
- Fixed a Three.js background ref-shadowing issue.
- Replaced an invalid Framer Motion easing value that caused a runtime overlay.
- Reworked light/dark theme handling and card text colors for contrast.
- Added dynamic blog article routing and regenerated blog listing content from shared metadata.
- Added technical articles for vehicle telemetry, CAN decoding, GPS acquisition, hardware protocols, IoT control, and stock analysis tooling.
- Added work log, development workflow, and error log documentation.
- Removed the NTU Racing lead role from the homepage typewriter rotation while leaving the role represented in the profile section.
- Reordered the project timeline from newest to oldest and consolidated article pages into one structured dynamic renderer.

## Traceability Notes

- If a future build fails on Windows with `.next/trace` permission errors, stop any running Next.js server before rebuilding.
- If Git reports dubious repository ownership inside a sandboxed environment, use a command-scoped safe directory flag:

```bash
git -c safe.directory='D:/My web/portfolio' status --short --branch
```

- If runtime overlays reappear, first check animated components and third-party animation easing values.
- If white-on-white text reappears, inspect both the Tailwind light-mode classes and the `light` or `data-theme` attributes applied by the theme provider.

## Current Expected Verification Flow

```bash
npm run lint
npm run build
```

Then verify the primary routes:

```text
/
/projects
/blog
/blog/vehicle-telemetry-stack
/blog/dbc-can-decoder
/blog/gps-data-acquisition
/blog/hardware-communication-protocols
/blog/iot-control-system
/blog/stock-analysis-dashboard
/blog/racing-team
/blog/can-protocol
/blog/dev-journey
```
