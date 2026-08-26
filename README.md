# Tyler Liu Portfolio

Personal technical portfolio for software, embedded systems, vehicle telemetry, IoT, and data tooling work.

The site is built with Next.js, TypeScript, Tailwind CSS, Framer Motion, Three.js, and lucide-react. It is intended to deploy from GitHub to Vercel.
https://portfolio-5wie.vercel.app/

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Verification

```bash
npm run lint
npm run build
```

## Main Routes

- `/` - portfolio home page
- `/projects` - chronological project and development timeline
- `/blog` - technical writing index
- `/blog/[slug]` - generated technical articles
- `/admin/publisher` - private draft workbench for turning PDFs, images, GitHub repos, and notes into MDX posts

## Personal Publishing Agent

The publisher reads uploaded sources, generates a categorized article draft, and exports MDX that the blog can read from `content/blog/*.mdx`.

Optional environment variables:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.2
PUBLISHER_AUTH_TOKEN=
GITHUB_TOKEN=
PUBLISHER_GITHUB_OWNER=
PUBLISHER_GITHUB_REPO=
PUBLISHER_GITHUB_BASE_BRANCH=main
```

Without `OPENAI_API_KEY`, the workbench still creates a local heuristic draft. With GitHub configuration, the `Open PR` action creates a branch and pull request instead of pushing directly to production.

## Maintenance Documents

- [Work Log](docs/WORK_LOG.md)
- [Development Workflow](docs/DEVELOPMENT_WORKFLOW.md)
- [Error Log](docs/ERROR_LOG.md)
- [Conversation Record](docs/CONVERSATION_RECORD.md)

## Deployment

The repository remote is configured for:

```text
git@github.com:Ktliu-Tyler/portfolio.git
```

Pushes to `main` are expected to be picked up by Vercel.
