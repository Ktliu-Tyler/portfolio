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
