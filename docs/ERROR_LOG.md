# Error Log

Last updated: 2026-05-24

## 1. Vercel Build Type Error: Unused Import

- Location: `app/projects/page.tsx`
- Symptom: `Type error: 'Link' is declared but its value is never read.`
- Cause: `Link` was imported but not used.
- Fix: Removed the unused import.
- Verification: `npm run build` passed afterward.

## 2. Three.js Background Ref Error

- Location: `components/ThreeDBackground.tsx`
- Symptom: `Block-scoped variable 'container' used before its declaration.`
- Cause: A local variable shadowed the container ref.
- Fix: Replaced the invalid reference with `const container = containerRef.current`.
- Verification: `npm run build` passed and browser canvas checks confirmed rendering.

## 3. Framer Motion Easing Runtime Error

- Location: `components/TypewriterEffect.tsx`
- Symptom: Next.js runtime overlay showed `Invalid easing type 'steps(2)'`.
- Cause: Framer Motion did not accept CSS-style `steps(2)` as an easing value.
- Fix: Changed the cursor animation easing to `linear`.
- Verification: `/projects`, `/blog`, and article pages rendered without runtime overlays.

## 4. Light Theme Contrast Problems

- Locations:
  - `components/GlassCard.tsx`
  - `app/globals.css`
  - `app/projects/page.tsx`
  - article tag styles
- Symptom: White or very light text appeared on white card backgrounds.
- Cause: Some components used dark-mode-oriented text colors while the theme switch only removed `dark` without consistently applying a `light` state.
- Fix:
  - Synchronized `dark`, `light`, and `data-theme`.
  - Added light-theme readability fallbacks.
  - Adjusted badge and tag colors for light/dark mode separately.
- Verification: Browser contrast checks passed for key pages in both themes.

## 5. Build Failure While Dev Server Was Running

- Location: `.next/trace`
- Symptom: `EPERM: operation not permitted, open 'D:\My web\portfolio\.next\trace'`
- Cause: Windows file lock from an active Next.js dev server.
- Fix: Stopped the dev server before running `npm run build`.
- Verification: Production build passed after stopping the server.

## 6. Terminal Encoding Noise

- Location: PowerShell output for Chinese text files.
- Symptom: Some terminal output appeared as mojibake.
- Cause: Console decoding/display issue, not necessarily file corruption.
- Fix: Used targeted file reads and browser rendering checks instead of trusting noisy terminal display.
- Verification: The app rendered English defaults correctly in browser checks.

## 7. WebGL Pixel Read False Negative

- Location: Three.js canvas verification.
- Symptom: Direct pixel reads from the WebGL canvas returned blank samples.
- Cause: Transparent WebGL buffer behavior can make direct `readPixels` or copied canvas sampling unreliable.
- Fix: Used visual screenshot differencing by comparing canvas-visible and canvas-hidden screenshots.
- Verification: Desktop and mobile screenshots showed measurable visual differences.

## 8. Dev Server Browser Navigation Timeout

- Location: Playwright smoke test against `next dev`.
- Symptom: Waiting for `networkidle` or `domcontentloaded` sometimes timed out during dev mode.
- Cause: Next.js dev server and HMR can keep connections active or delay navigation readiness.
- Fix: Used HTTP checks and Playwright `commit` navigation plus heading assertions.
- Verification: All key routes returned HTTP 200 and rendered headings without runtime error overlays.

## 9. Git Dubious Ownership Warning In Sandboxed Environment

- Location: local repository access from the sandboxed shell.
- Symptom: `fatal: detected dubious ownership in repository at 'D:/My web/portfolio'`.
- Cause: The repository is owned by the normal Windows user, while the shell command was executed as a sandbox user.
- Fix: Used a command-scoped Git safe directory option instead of changing global Git configuration.
- Verification: `git -c safe.directory='D:/My web/portfolio' status --short --branch` returned the expected branch state.

## 10. Home Page Role Label Review

- Location: `app/page.tsx`
- Symptom: The home-page typewriter rotation included a role label related to NTU Racing lead work.
- Cause: The typewriter used every role key from the hero translation group.
- Fix: Removed the third role from the home-page typewriter list so the cover no longer cycles through that label.
- Verification: The remaining typewriter list contains software development, embedded systems, and IoT systems roles.
