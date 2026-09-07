export type ContentKind = 'article' | 'experience' | 'project' | 'certificate'
export type Visibility = 'public' | 'private'
export interface ManagedContent {
  id: string
  kind: ContentKind
  slug: string
  title: string
  visibility: Visibility
  updatedAt: string
  version: number
  data: Record<string, any>
}
export interface ContentSummary extends Omit<ManagedContent, 'data'> {
  subtitle: string
}
export interface Project {
  key: string
  link: string
  image: string | null
  imagePosition?: string
  status: 'public' | 'private' | 'contribution'
  labels: Record<'zh' | 'en', { title: string; subtitle: string; description: string; tags: string }>
}
export interface YearSection { yearKey: string; projects: Project[] }
