import { NextResponse } from 'next/server'
import type { PublisherCategory, PublisherDraft, RepoSignal } from '@/lib/publisher'
import { validatePublisherRequest } from '@/lib/publisherAuth'
import { privateHeaders } from '@/lib/adminAuth'
import { RequestError, readLimitedForm, requestError } from '@/lib/requestSafety'
import { parseGitHubRepository, validateUploads, providerFetch, providerJson } from '@/lib/publisherSafety'
import {
  PublisherDraftInput,
  UploadedFileSignal,
  createDraftFromModel,
  createHeuristicDraft,
} from '@/lib/publisherDraft'

export const runtime = 'nodejs'

type DraftTone = PublisherDraftInput['tone']
type DraftLanguage = PublisherDraftInput['language']

interface GitHubRepoResponse {
  name?: string
  html_url?: string
  description?: string | null
  language?: string | null
  topics?: string[]
}

interface GitHubReadmeResponse {
  content?: string
  encoding?: string
}

interface OpenAIOutputContent {
  type?: string
  text?: string
}

interface OpenAIOutputItem {
  content?: OpenAIOutputContent[]
}

interface OpenAIResponseBody {
  output_text?: string
  output?: OpenAIOutputItem[]
}

const categories: Array<PublisherCategory | 'auto'> = [
  'auto',
  'project',
  'technical-note',
  'work-log',
  'learning-note',
  'life-record',
  'case-study',
]

function stringField(form: FormData, name: string) {
  const value = form.get(name)

  return typeof value === 'string' ? value.trim() : ''
}

function lines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeCategory(value: string): PublisherCategory | 'auto' {
  return categories.includes(value as PublisherCategory | 'auto')
    ? (value as PublisherCategory | 'auto')
    : 'auto'
}

function normalizeLanguage(value: string): DraftLanguage {
  return value === 'en' ? 'en' : 'zh-TW'
}

function normalizeTone(value: string): DraftTone {
  if (value === 'technical' || value === 'journal') {
    return value
  }

  return 'portfolio'
}

function isUploadedFile(value: FormDataEntryValue): value is File {
  return typeof value !== 'string' && value.size > 0
}

function sourceTypeForFile(file: File): UploadedFileSignal['sourceType'] {
  const fileName = file.name.toLowerCase()

  if (file.type.startsWith('image/')) {
    return 'image'
  }

  if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
    return 'pdf'
  }

  return 'document'
}

function fileSignal(file: File): UploadedFileSignal {
  return {
    name: file.name,
    size: file.size,
    mimeType: file.type || 'application/octet-stream',
    sourceType: sourceTypeForFile(file),
  }
}

function githubHeaders() {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const token = process.env.GITHUB_TOKEN

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

function decodeReadme(data: GitHubReadmeResponse) {
  if (data.encoding !== 'base64' || !data.content) {
    return ''
  }

  return Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8')
}

async function fetchRepoSignal(repoUrl: string): Promise<RepoSignal> {
  const parsed = parseGitHubRepository(repoUrl)

  const apiBase = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`
  const repoResponse = await providerFetch(apiBase, { headers: githubHeaders() })

  if (!repoResponse.ok) {
    return { name: parsed.repo, url: repoUrl, topics: [] }
  }

  const repoData = await providerJson<GitHubRepoResponse>(repoResponse)
  const readmeResponse = await providerFetch(`${apiBase}/readme`, { headers: githubHeaders() })
  const readmeData = readmeResponse.ok
    ? decodeReadme(await providerJson<GitHubReadmeResponse>(readmeResponse))
    : ''

  return {
    name: repoData.name ?? parsed.repo,
    url: repoData.html_url ?? repoUrl,
    description: repoData.description ?? undefined,
    language: repoData.language ?? undefined,
    topics: repoData.topics ?? [],
    readme: readmeData.slice(0, 8000),
  }
}

function modelPrompt(input: PublisherDraftInput) {
  const repoContext = input.repoSignals
    .map(
      (repo) => `
Repository: ${repo.name}
URL: ${repo.url}
Description: ${repo.description ?? 'N/A'}
Language: ${repo.language ?? 'N/A'}
Topics: ${repo.topics.join(', ') || 'N/A'}
README excerpt:
${repo.readme ?? 'N/A'}
`,
    )
    .join('\n')
  const fileContext = input.files
    .map((file) => `${file.name} (${file.mimeType}, ${Math.ceil(file.size / 1024)} KB)`)
    .join('\n')

  return `
You are a personal publishing agent for a software and embedded-systems portfolio.
Turn the provided sources into a publishable article draft.

Rules:
- Return valid JSON only.
- Write in ${input.language === 'en' ? 'English' : 'Traditional Chinese'}.
- Tone: ${input.tone}.
- Preferred title: ${input.preferredTitle || 'auto'}.
- Preferred category: ${input.preferredCategory}.
- Keep claims grounded in the attached sources.
- Mention uncertainty in confidenceNotes instead of inventing details.
- The output must match this JSON shape:
{
  "title": "string",
  "slug": "kebab-case-string",
  "excerpt": "string",
  "category": "project | technical-note | work-log | learning-note | life-record | case-study",
  "tags": ["string"],
  "coverImage": "string optional public path",
  "sections": [
    { "heading": "string", "body": ["paragraph"], "bullets": ["optional bullet"] }
  ],
  "imagePrompts": ["string"],
  "confidenceNotes": ["string"]
}

Manual notes:
${input.notes || 'N/A'}

GitHub context:
${repoContext || 'N/A'}

Uploaded file list:
${fileContext || 'N/A'}
`
}

async function uploadOpenAIFile(file: File, apiKey: string) {
  const form = new FormData()
  form.append('purpose', 'user_data')
  form.append('file', file, file.name)

  const response = await providerFetch('https://api.openai.com/v1/files', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  })

  if (!response.ok) {
    throw new Error(`OpenAI file upload failed: ${response.status}`)
  }

  const data = await providerJson<{ id?: string }>(response)

  if (!data.id || !/^file-[a-zA-Z0-9_-]+$/.test(data.id)) {
    throw new Error('OpenAI file upload did not return a file id.')
  }

  return data.id
}

async function imageDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())

  return `data:${file.type || 'image/png'};base64,${buffer.toString('base64')}`
}

function extractOpenAIText(responseBody: OpenAIResponseBody) {
  if (responseBody.output_text) {
    return responseBody.output_text
  }

  return (
    responseBody.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text ?? '')
      .join('\n')
      .trim() ?? ''
  )
}

function parseJsonResponse(text: string) {
  const withoutFence = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  return JSON.parse(withoutFence) as Partial<PublisherDraft>
}

async function generateOpenAIDraft(input: PublisherDraftInput, files: File[]) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return null
  }

  const content: Array<Record<string, string>> = [
    { type: 'input_text', text: modelPrompt(input) },
  ]

  const uploadedIds: string[] = []
  try {
    for (const file of files) {
      if (file.type.startsWith('image/') && file.size <= 12 * 1024 * 1024) {
        content.push({ type: 'input_image', image_url: await imageDataUrl(file) })
      } else if (file.size <= 25 * 1024 * 1024) {
        const fileId = await uploadOpenAIFile(file, apiKey)
        uploadedIds.push(fileId)
        content.push({ type: 'input_file', file_id: fileId })
      }
    }

    const response = await providerFetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? 'gpt-5.2',
        input: [{ role: 'user', content }],
        max_output_tokens: 5000,
        store: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI draft generation failed: ${response.status}`)
    }

    const responseBody = await providerJson<OpenAIResponseBody>(response)
    const text = extractOpenAIText(responseBody)

    if (!text) {
      throw new Error('OpenAI draft generation returned an empty response.')
    }

    return parseJsonResponse(text)
  } finally {
    const cleanup = await Promise.allSettled(uploadedIds.map(id => providerFetch(`https://api.openai.com/v1/files/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${apiKey}` } })))
    if (cleanup.some(result => result.status === 'rejected' || !result.value.ok)) throw new RequestError('OpenAI 暫存附件未能清除，請至 OpenAI 管理介面確認；本次已改為本機草稿。', 502)
  }
}

export async function POST(req: Request) {
  const authError = await validatePublisherRequest(req)

  if (authError) {
    return authError
  }

  try {
    const form = await readLimitedForm(req)
    const files = form.getAll('files').filter(isUploadedFile)
    await validateUploads(files)
    const rawUrls = lines(stringField(form, 'repoUrls'))
    if (rawUrls.length > 6 || stringField(form, 'notes').length > 50_000 || stringField(form, 'title').length > 300) throw new RequestError('最多 6 個儲存庫；筆記或標題過長。')
    const repoUrls = rawUrls.map(value => parseGitHubRepository(value).url)
    const repoSignals = await Promise.all(repoUrls.map(fetchRepoSignal))
    const input: PublisherDraftInput = {
      notes: stringField(form, 'notes'),
      repoUrls,
      repoSignals,
      files: files.map(fileSignal),
      preferredCategory: normalizeCategory(stringField(form, 'category')),
      preferredTitle: stringField(form, 'title'),
      language: normalizeLanguage(stringField(form, 'language')),
      tone: normalizeTone(stringField(form, 'tone')),
    }

    try {
      const modelDraft = form.get('useAI') === 'true' ? await generateOpenAIDraft(input, files) : null

      if (modelDraft) {
        return NextResponse.json({ draft: createDraftFromModel(input, modelDraft) }, { headers: privateHeaders })
      }
    } catch (error) {
      const draft = createHeuristicDraft(input)
      draft.confidenceNotes = [
        ...draft.confidenceNotes,
        error instanceof RequestError ? error.message : 'AI 整理暫時無法使用，已改為本機草稿。',
      ]

      return NextResponse.json({ draft }, { headers: privateHeaders })
    }

    return NextResponse.json({ draft: createHeuristicDraft(input) }, { headers: privateHeaders })
  } catch (error) {
    const result = requestError(error, '草稿整理失敗，請稍後重試。')
    return NextResponse.json({ error: result.error }, { status: result.status, headers: privateHeaders })
  }
}
