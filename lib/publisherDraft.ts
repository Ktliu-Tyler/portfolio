import {
  PublisherAssetPlan,
  PublisherCategory,
  PublisherDraft,
  PublisherSection,
  PublisherSource,
  RepoSignal,
  publisherCategoryLabels,
} from '@/lib/publisher'

export interface UploadedFileSignal {
  name: string
  size: number
  mimeType: string
  sourceType: PublisherSource['type']
}

export interface PublisherDraftInput {
  notes: string
  repoUrls: string[]
  repoSignals: RepoSignal[]
  files: UploadedFileSignal[]
  preferredCategory: PublisherCategory | 'auto'
  preferredTitle: string
  language: 'zh-TW' | 'en'
  tone: 'portfolio' | 'technical' | 'journal'
}

interface DraftSeed {
  title: string
  slug: string
  excerpt: string
  date: string
  readTime: string
  category: PublisherCategory
  tags: string[]
  coverImage: string
  sources: PublisherSource[]
  sections: PublisherSection[]
  assetPlan: PublisherAssetPlan[]
  imagePrompts: string[]
  confidenceNotes: string[]
}

const tagPatterns: Array<{ tag: string; pattern: RegExp }> = [
  { tag: 'CAN Bus', pattern: /\bcan\b|dbc|vehicle|telemetry|race|racing/i },
  { tag: 'Embedded', pattern: /embedded|firmware|stm32|esp32|raspberry|sensor/i },
  { tag: 'Python', pattern: /python|py\b|pandas|sqlite|flask/i },
  { tag: 'TypeScript', pattern: /typescript|tsx|next\.js|react|frontend/i },
  { tag: 'IoT', pattern: /iot|mqtt|infrared|irremote|smart home/i },
  { tag: 'Data Analysis', pattern: /dashboard|analysis|sqlite|csv|report|stock/i },
  { tag: 'GitHub', pattern: /github|repo|repository|commit|readme/i },
  { tag: 'Documentation', pattern: /pdf|document|report|presentation|note/i },
  { tag: 'Workflow', pattern: /workflow|process|pipeline|automation|agent/i },
  { tag: 'Portfolio', pattern: /portfolio|case study|project|作品|紀錄/i },
]

const categoryCovers: Record<PublisherCategory, string> = {
  project: '/images/journey.png',
  'technical-note': '/images/embedded.png',
  'work-log': '/images/data.png',
  'learning-note': '/images/journey.png',
  'life-record': '/images/journey.png',
  'case-study': '/images/racing.png',
}

function todayInTaipei() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
  }).format(new Date())
}

function stripExtension(fileName: string) {
  return fileName.replace(/\.[^.]+$/, '')
}

function slugify(value: string, fallback: string) {
  const slug = value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')

  return slug && slug.replace(/[\d-]/g, '').length > 0 ? slug : fallback
}

function safeFileName(value: string) {
  return (
    value
      .normalize('NFKD')
      .replace(/[^\w.\s-]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-') || 'asset'
  )
}

function trimText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trim()}...`
}

function estimateReadTime(sections: PublisherSection[]) {
  const text = sections
    .flatMap((section) => [section.heading, ...section.body, ...(section.bullets ?? [])])
    .join(' ')
  const wordCount = text.split(/\s+/).filter(Boolean).length

  return String(Math.max(3, Math.ceil(wordCount / 220)))
}

function inferCategory(input: PublisherDraftInput): PublisherCategory {
  if (input.preferredCategory !== 'auto') {
    return input.preferredCategory
  }

  const combinedText = [
    input.notes,
    ...input.repoSignals.flatMap((repo) => [
      repo.name,
      repo.description ?? '',
      repo.language ?? '',
      repo.readme ?? '',
      ...repo.topics,
    ]),
    ...input.files.map((file) => `${file.name} ${file.mimeType}`),
  ].join('\n')

  if (/tutorial|learn|course|study|學習|讀書|筆記/i.test(combinedText)) {
    return 'learning-note'
  }

  if (/case|result|impact|成果|案例|分析/i.test(combinedText)) {
    return 'case-study'
  }

  if (/daily|journal|life|生活|日常|反思/i.test(combinedText)) {
    return 'life-record'
  }

  if (/bug|debug|progress|today|work|週報|工作|開發|紀錄/i.test(combinedText)) {
    return 'work-log'
  }

  if (/protocol|architecture|algorithm|can|dbc|mqtt|api|技術|架構/i.test(combinedText)) {
    return 'technical-note'
  }

  return input.repoSignals.length > 0 ? 'project' : 'work-log'
}

function inferTags(input: PublisherDraftInput) {
  const combinedText = [
    input.notes,
    ...input.repoSignals.flatMap((repo) => [
      repo.name,
      repo.description ?? '',
      repo.language ?? '',
      repo.readme ?? '',
      ...repo.topics,
    ]),
    ...input.files.map((file) => `${file.name} ${file.mimeType}`),
  ].join('\n')

  const tags = tagPatterns
    .filter(({ pattern }) => pattern.test(combinedText))
    .map(({ tag }) => tag)

  input.repoSignals.forEach((repo) => {
    if (repo.language && !tags.includes(repo.language)) {
      tags.push(repo.language)
    }
  })

  if (tags.length === 0) {
    tags.push('Work Log')
  }

  return tags.slice(0, 6)
}

function buildSources(input: PublisherDraftInput): PublisherSource[] {
  const repoSources: PublisherSource[] = input.repoUrls.map((url) => ({
    type: 'github',
    name: url.replace(/^https?:\/\/github\.com\//, ''),
    url,
  }))

  const fileSources: PublisherSource[] = input.files.map((file) => ({
    type: file.sourceType,
    name: file.name,
    size: file.size,
    mimeType: file.mimeType,
  }))

  if (input.notes.trim()) {
    fileSources.push({
      type: 'note',
      name: input.language === 'en' ? 'Manual note' : '手動紀錄',
    })
  }

  return [...repoSources, ...fileSources]
}

function buildAssetPlan(slug: string, files: UploadedFileSignal[]): PublisherAssetPlan[] {
  return files
    .filter((file) => file.sourceType === 'image')
    .map((file, index) => {
      const fileName = safeFileName(file.name)
      const role = index === 0 ? 'cover' : 'inline'

      return {
        originalName: file.name,
        targetPath: `public/images/articles/${slug}/${role}-${fileName}`,
        publicPath: `/images/articles/${slug}/${role}-${fileName}`,
        role,
      }
    })
}

function buildTitle(input: PublisherDraftInput, category: PublisherCategory, date: string) {
  if (input.preferredTitle.trim()) {
    return input.preferredTitle.trim()
  }

  const firstRepo = input.repoSignals[0]
  const firstFile = input.files[0]

  if (input.language === 'en') {
    if (firstRepo) {
      return `${firstRepo.name}: Development Notes and Technical Record`
    }

    if (firstFile) {
      return `${stripExtension(firstFile.name)} Work Record`
    }

    return `${publisherCategoryLabels[category]} ${date}`
  }

  if (firstRepo) {
    return `${firstRepo.name} 開發紀錄與技術整理`
  }

  if (firstFile) {
    return `${stripExtension(firstFile.name)} 工作紀錄整理`
  }

  return `${publisherCategoryLabels[category]} ${date}`
}

function summarizeRepos(input: PublisherDraftInput) {
  if (input.repoSignals.length === 0) {
    return input.language === 'en'
      ? 'No GitHub repository was attached for this draft.'
      : '這次草稿沒有附上 GitHub repo，因此重點會以文件、圖片與手動紀錄為主。'
  }

  return input.repoSignals
    .map((repo) => {
      const topicText = repo.topics.length > 0 ? ` Topics: ${repo.topics.join(', ')}.` : ''
      const languageText = repo.language ? ` Primary language: ${repo.language}.` : ''
      const descriptionText = repo.description ? ` ${repo.description}` : ''

      return `${repo.name}.${descriptionText}${languageText}${topicText}`
    })
    .join('\n')
}

function summarizeFiles(input: PublisherDraftInput) {
  if (input.files.length === 0) {
    return input.language === 'en'
      ? 'No local files were attached.'
      : '這次沒有上傳本機檔案。'
  }

  return input.files
    .map((file) => `${file.name} (${file.mimeType || 'unknown'}, ${Math.ceil(file.size / 1024)} KB)`)
    .join('\n')
}

function noteParagraphs(notes: string, language: PublisherDraftInput['language']) {
  const cleanNotes = notes
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .slice(0, 3)

  if (cleanNotes.length > 0) {
    return cleanNotes.map((paragraph) => trimText(paragraph, 420))
  }

  return language === 'en'
    ? [
        'The draft was generated from the attached project sources. Add a few first-person notes before publishing to make the record more personal and precise.',
      ]
    : [
        '這篇草稿根據你提供的來源整理而成。正式發布前，建議再補上一兩段第一人稱紀錄，讓文章更像你的實際工作脈絡。',
      ]
}

function buildSections(input: PublisherDraftInput, category: PublisherCategory): PublisherSection[] {
  const repoSummary = summarizeRepos(input)
  const fileSummary = summarizeFiles(input)
  const notes = noteParagraphs(input.notes, input.language)
  const repoBullets = input.repoSignals.map((repo) => {
    const language = repo.language ? `, ${repo.language}` : ''

    return `${repo.name}${language}: ${repo.description ?? repo.url}`
  })
  const fileBullets = input.files.map((file) => `${file.name}: ${file.mimeType || file.sourceType}`)

  if (input.language === 'en') {
    return [
      {
        heading: 'Context',
        body: [
          `This ${publisherCategoryLabels[category]} gathers the source material into a publishable record for the portfolio site.`,
          ...notes,
        ],
      },
      {
        heading: 'Source Material',
        body: [repoSummary, fileSummary],
        bullets: [...repoBullets, ...fileBullets].slice(0, 8),
      },
      {
        heading: 'What This Shows',
        body: [
          'The record should make the work easier to scan by separating the motivation, implementation details, evidence, and next steps.',
        ],
        bullets: [
          'Clarifies the problem or workflow behind the work.',
          'Highlights the technical decisions and tools involved.',
          'Keeps the original sources traceable for future updates.',
        ],
      },
      {
        heading: 'Next Improvements',
        body: [
          'Before publishing, add screenshots, measured results, or a short reflection about what changed after this work.',
        ],
      },
    ]
  }

  return [
    {
      heading: '背景脈絡',
      body: [
        `這篇${publisherCategoryLabels[category]}把你提供的來源整理成可以放進作品網站的紀錄。`,
        ...notes,
      ],
    },
    {
      heading: '來源整理',
      body: [repoSummary, fileSummary],
      bullets: [...repoBullets, ...fileBullets].slice(0, 8),
    },
    {
      heading: '重點整理',
      body: [
        '這份紀錄的核心價值，是把原本分散在文件、repo、圖片與日常筆記裡的資訊，整理成讀者能快速理解的脈絡。',
      ],
      bullets: [
        '說明這件工作的問題背景與使用情境。',
        '整理技術選擇、實作重點與可被檢視的成果。',
        '保留來源線索，方便之後更新、補圖或擴寫成完整 case study。',
      ],
    },
    {
      heading: '下一步',
      body: [
        '正式發布前，可以再補上實際截圖、量測結果、流程圖，或一段你自己的反思。這會讓文章不只像摘要，而更像真實的工程紀錄。',
      ],
    },
  ]
}

function yamlString(value: string) {
  return JSON.stringify(value)
}

function yamlArray(values: string[]) {
  if (values.length === 0) {
    return '[]'
  }

  return `\n${values.map((value) => `  - ${yamlString(value)}`).join('\n')}`
}

function yamlSources(sources: PublisherSource[]) {
  if (sources.length === 0) {
    return '[]'
  }

  return `\n${sources
    .map((source) => {
      const lines = [`  - type: ${yamlString(source.type)}`, `    name: ${yamlString(source.name)}`]

      if (source.url) {
        lines.push(`    url: ${yamlString(source.url)}`)
      }

      return lines.join('\n')
    })
    .join('\n')}`
}

export function buildMdx(draft: Omit<PublisherDraft, 'mdx' | 'generatedBy'>) {
  const frontmatter = [
    '---',
    `title: ${yamlString(draft.title)}`,
    `slug: ${yamlString(draft.slug)}`,
    `date: ${yamlString(draft.date)}`,
    `category: ${yamlString(draft.category)}`,
    `sourceType: ${yamlString(draft.sources.map((source) => source.type).join(','))}`,
    `excerpt: ${yamlString(draft.excerpt)}`,
    `readTime: ${yamlString(draft.readTime)}`,
    `tags: ${yamlArray(draft.tags)}`,
    `coverImage: ${yamlString(draft.coverImage)}`,
    `sources: ${yamlSources(draft.sources)}`,
    '---',
  ].join('\n')

  const body = draft.sections
    .map((section) => {
      const bodyText = section.body.map((paragraph) => paragraph.trim()).join('\n\n')
      const bullets = section.bullets?.map((bullet) => `- ${bullet}`).join('\n')

      return [`## ${section.heading}`, bodyText, bullets].filter(Boolean).join('\n\n')
    })
    .join('\n\n')

  return `${frontmatter}\n\n${body}\n`
}

export function createDraftSeed(input: PublisherDraftInput): DraftSeed {
  const date = todayInTaipei()
  const category = inferCategory(input)
  const title = buildTitle(input, category, date)
  const fallbackSlug = `record-${date.replace(/-/g, '')}`
  const slugBase =
    input.repoSignals[0]?.name || input.preferredTitle || input.files[0]?.name || title
  const slug = slugify(slugBase, fallbackSlug)
  const tags = inferTags(input)
  const assetPlan = buildAssetPlan(slug, input.files)
  const coverImage = assetPlan.find((asset) => asset.role === 'cover')?.publicPath ?? categoryCovers[category]
  const sources = buildSources(input)
  const sections = buildSections(input, category)
  const excerpt =
    input.language === 'en'
      ? trimText(`A ${publisherCategoryLabels[category]} generated from personal sources, repositories, and working notes.`, 180)
      : trimText(`由個人文件、GitHub repo 與工作紀錄整理出的${publisherCategoryLabels[category]}。`, 180)
  const imagePrompts =
    input.language === 'en'
      ? [
          `Create a clean portfolio cover image for "${title}" with visual cues from ${tags.join(', ')}. Avoid fake UI text.`,
          `Create a simple technical architecture diagram for "${title}" using the source material as reference.`,
        ]
      : [
          `為「${title}」製作一張乾淨的作品集封面圖，視覺元素可參考 ${tags.join('、')}，不要放難以辨識的假文字。`,
          `為「${title}」製作一張簡潔的技術架構圖，用來源資料中的系統元件作為參考。`,
        ]

  return {
    title,
    slug,
    excerpt,
    date,
    readTime: estimateReadTime(sections),
    category,
    tags,
    coverImage,
    sources,
    sections,
    assetPlan,
    imagePrompts,
    confidenceNotes:
      input.language === 'en'
        ? ['Generated with the local fallback. Add an OpenAI API key to parse PDFs and images more deeply.']
        : ['目前使用本地草稿模式。加入 OpenAI API key 後，可以更深入解析 PDF、文件與圖片內容。'],
  }
}

export function createHeuristicDraft(input: PublisherDraftInput): PublisherDraft {
  const seed = createDraftSeed(input)

  return {
    ...seed,
    mdx: buildMdx(seed),
    generatedBy: 'heuristic',
  }
}

export function createDraftFromModel(
  input: PublisherDraftInput,
  modelDraft: Partial<PublisherDraft>,
): PublisherDraft {
  const seed = createDraftSeed(input)
  const sections =
    modelDraft.sections && modelDraft.sections.length > 0
      ? modelDraft.sections.map((section) => ({
          heading: section.heading || 'Section',
          body: Array.isArray(section.body) ? section.body.map(String) : [],
          bullets: Array.isArray(section.bullets) ? section.bullets.map(String) : undefined,
        }))
      : seed.sections

  const merged = {
    ...seed,
    title: modelDraft.title || seed.title,
    slug: slugify(modelDraft.slug || seed.slug, seed.slug),
    excerpt: modelDraft.excerpt || seed.excerpt,
    category: modelDraft.category || seed.category,
    tags: modelDraft.tags && modelDraft.tags.length > 0 ? modelDraft.tags.slice(0, 8) : seed.tags,
    coverImage: modelDraft.coverImage || seed.coverImage,
    sections,
    readTime: modelDraft.readTime || estimateReadTime(sections),
    confidenceNotes:
      modelDraft.confidenceNotes && modelDraft.confidenceNotes.length > 0
        ? modelDraft.confidenceNotes
        : ['Generated with OpenAI from the attached source material.'],
  }

  return {
    ...merged,
    mdx: buildMdx(merged),
    generatedBy: 'openai',
  }
}
