import { NextResponse } from 'next/server'
import type { PublisherDraft } from '@/lib/publisher'
import { validatePublisherRequest } from '@/lib/publisherAuth'

export const runtime = 'nodejs'

interface GitRefResponse {
  object?: {
    sha?: string
  }
}

interface GitContentResponse {
  sha?: string
}

interface PullRequestResponse {
  html_url?: string
  number?: number
}

function isUploadedFile(value: FormDataEntryValue): value is File {
  return typeof value !== 'string' && value.size > 0
}

function repoConfig() {
  const owner = process.env.PUBLISHER_GITHUB_OWNER ?? process.env.VERCEL_GIT_REPO_OWNER
  const repo = process.env.PUBLISHER_GITHUB_REPO ?? process.env.VERCEL_GIT_REPO_SLUG
  const baseBranch =
    process.env.PUBLISHER_GITHUB_BASE_BRANCH ??
    process.env.VERCEL_GIT_COMMIT_REF ??
    'main'
  const token = process.env.GITHUB_TOKEN

  if (!owner || !repo || !token) {
    return null
  }

  return { owner, repo, baseBranch, token }
}

function validateDraft(value: unknown): PublisherDraft {
  const draft = value as Partial<PublisherDraft>

  if (!draft || !draft.slug || !draft.title || !draft.mdx) {
    throw new Error('A complete draft is required before creating a PR.')
  }

  return draft as PublisherDraft
}

function githubHeaders(token: string) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function githubRequest<T>(
  config: NonNullable<ReturnType<typeof repoConfig>>,
  path: string,
  init: RequestInit = {},
) {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}${path}`,
    {
      ...init,
      headers: githubHeaders(config.token),
    },
  )

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`GitHub request failed (${response.status}): ${message}`)
  }

  return (await response.json()) as T
}

async function maybeFileSha(
  config: NonNullable<ReturnType<typeof repoConfig>>,
  filePath: string,
  branch: string,
) {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`,
    { headers: githubHeaders(config.token) },
  )

  if (response.status === 404) {
    return undefined
  }

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`GitHub content lookup failed (${response.status}): ${message}`)
  }

  const data = (await response.json()) as GitContentResponse

  return data.sha
}

async function putContent(
  config: NonNullable<ReturnType<typeof repoConfig>>,
  filePath: string,
  content: Buffer | string,
  branch: string,
  message: string,
) {
  const sha = await maybeFileSha(config, filePath, branch)

  await githubRequest(config, `/contents/${filePath}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: Buffer.isBuffer(content)
        ? content.toString('base64')
        : Buffer.from(content, 'utf8').toString('base64'),
      branch,
      sha,
    }),
  })
}

async function createBranch(config: NonNullable<ReturnType<typeof repoConfig>>, branch: string) {
  const baseRef = await githubRequest<GitRefResponse>(
    config,
    `/git/ref/heads/${config.baseBranch}`,
  )
  const sha = baseRef.object?.sha

  if (!sha) {
    throw new Error(`Could not resolve base branch ${config.baseBranch}.`)
  }

  await githubRequest(config, '/git/refs', {
    method: 'POST',
    body: JSON.stringify({
      ref: `refs/heads/${branch}`,
      sha,
    }),
  })
}

function publishBody(draft: PublisherDraft) {
  return [
    `Generated article draft for **${draft.title}**.`,
    '',
    `Category: ${draft.category}`,
    `Tags: ${draft.tags.join(', ')}`,
    '',
    'Review the Vercel preview before merging.',
    '',
    ...draft.confidenceNotes.map((note) => `- ${note}`),
  ].join('\n')
}

export async function POST(req: Request) {
  const authError = validatePublisherRequest(req)

  if (authError) {
    return authError
  }

  try {
    const config = repoConfig()

    if (!config) {
      return NextResponse.json(
        {
          error:
            'Missing GITHUB_TOKEN and repository config. Set PUBLISHER_GITHUB_OWNER and PUBLISHER_GITHUB_REPO, or enable Vercel Git system env vars.',
        },
        { status: 400 },
      )
    }

    const form = await req.formData()
    const draftField = form.get('draft')
    const draft = validateDraft(
      typeof draftField === 'string' ? JSON.parse(draftField) : null,
    )
    const files = form.getAll('files').filter(isUploadedFile)
    const branch = `publisher/${draft.slug}-${Date.now()}`
    await createBranch(config, branch)
    await putContent(
      config,
      `content/blog/${draft.slug}.mdx`,
      draft.mdx,
      branch,
      `Add generated article: ${draft.title}`,
    )

    for (const asset of draft.assetPlan) {
      const file = files.find((candidate) => candidate.name === asset.originalName)

      if (file) {
        await putContent(
          config,
          asset.targetPath,
          Buffer.from(await file.arrayBuffer()),
          branch,
          `Add article asset: ${asset.originalName}`,
        )
      }
    }

    const pullRequest = await githubRequest<PullRequestResponse>(config, '/pulls', {
      method: 'POST',
      body: JSON.stringify({
        title: `Draft article: ${draft.title}`,
        head: branch,
        base: config.baseBranch,
        body: publishBody(draft),
      }),
    })

    return NextResponse.json({
      prUrl: pullRequest.html_url,
      number: pullRequest.number,
      branch,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
