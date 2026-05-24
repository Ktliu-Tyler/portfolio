# Development Workflow

Last updated: 2026-05-24

## 1. Local Setup

```bash
npm install
npm run dev
```

Open the local preview:

```text
http://127.0.0.1:3000
```

## 2. Before Editing

1. Check the branch and working tree.

```bash
git status --short --branch
```

2. Review the relevant files before changing them.
3. Keep unrelated work intact. Do not reset or revert user changes unless explicitly requested.

## 3. Content Update Workflow

Use this flow when adding or revising blog content:

1. Add article metadata and sections in `lib/articles.ts`.
2. Confirm the generated route under `/blog/[slug]`.
3. If the article is based on GitHub work, add the relevant repository links in `sourceRepos`.
4. Keep claims grounded in public repository evidence unless manually verified.
5. Run the verification checklist before committing.

## 4. Project Timeline Workflow

Use this flow when updating the Projects page:

1. Check the repository creation dates and pushed dates.
2. Group projects by the most defensible timeline stage.
3. Prefer professional descriptions that explain:
   - problem context
   - technical role
   - tooling or protocol
   - engineering value
4. Avoid overclaiming if the repository does not contain enough evidence.
5. Keep project links pointing to the public GitHub repositories.

## 5. Verification Checklist

Run:

```bash
npm run lint
npm run build
```

Then manually or automatically inspect:

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

Expected result:

- Pages render with a visible heading.
- No Next.js runtime error overlay appears.
- Light and dark themes keep readable contrast.
- English is the default language for a fresh browser session.

## 6. Build And Dev Server Note

If `npm run build` fails with an `.next/trace` permission error on Windows, stop the running dev server first. The development server can lock files inside `.next`.

## 7. Commit And Push

After verification:

```bash
git add .
git commit -m "Enhance portfolio content and technical articles"
git push origin main
```

Vercel should then pick up the pushed `main` branch and deploy automatically.
