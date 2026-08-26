export type PublisherCategory =
  | 'project'
  | 'technical-note'
  | 'work-log'
  | 'learning-note'
  | 'life-record'
  | 'case-study'

export type PublisherSourceType = 'github' | 'pdf' | 'image' | 'document' | 'note'

export interface PublisherSource {
  type: PublisherSourceType
  name: string
  url?: string
  size?: number
  mimeType?: string
}

export interface PublisherSection {
  heading: string
  body: string[]
  bullets?: string[]
}

export interface PublisherAssetPlan {
  originalName: string
  targetPath: string
  publicPath: string
  role: 'cover' | 'inline' | 'reference'
}

export interface PublisherDraft {
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
  mdx: string
  assetPlan: PublisherAssetPlan[]
  imagePrompts: string[]
  confidenceNotes: string[]
  generatedBy: 'openai' | 'heuristic'
}

export interface RepoSignal {
  name: string
  url: string
  description?: string
  language?: string
  topics: string[]
  readme?: string
}

export const publisherCategoryLabels: Record<PublisherCategory, string> = {
  project: '作品紀錄',
  'technical-note': '技術筆記',
  'work-log': '工作紀錄',
  'learning-note': '學習筆記',
  'life-record': '生活紀錄',
  'case-study': '案例研究',
}

export const publisherCategories = Object.entries(publisherCategoryLabels).map(
  ([value, label]) => ({ value: value as PublisherCategory, label }),
)
