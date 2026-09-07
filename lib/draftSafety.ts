import type { PublisherDraft } from './publisher'
import { RequestError } from './requestSafety'

export function validSlug(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 120 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

// Metadata is supplied separately by the form. Never execute or parse document
// frontmatter: gray-matter's built-in JavaScript engine evaluates code.
export function stripDraftFrontmatter(value: string) {
  const text = value.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  if (!text.startsWith('---')) return text.trim()
  const newline = text.indexOf('\n')
  if (newline === -1 || text.slice(0, newline).trim() !== '---') throw new RequestError('文章開頭僅支援一般 YAML 標頭，不支援可執行語言。')
  const closing = /\n---[ \t]*(?:\n|$)/g
  closing.lastIndex = newline
  const end = closing.exec(text)
  if (!end || end.index > 20_000) throw new RequestError('文章標頭未正確結束或過長。')
  return text.slice(end.index + end[0].length).trim()
}

export function validateExportDraft(value: unknown): PublisherDraft {
  if (!value || typeof value !== 'object') throw new RequestError('需要完整草稿。')
  const draft = value as PublisherDraft
  if (!validSlug(draft.slug) || typeof draft.title !== 'string' || !draft.title.trim() || draft.title.length > 300 || typeof draft.mdx !== 'string' || !draft.mdx.trim() || draft.mdx.length > 500_000) throw new RequestError('草稿標題、網址或內容不正確。')
  stripDraftFrontmatter(draft.mdx)
  for (const values of [draft.tags, draft.confidenceNotes]) {
    if (!Array.isArray(values) || values.length > 30 || values.some(item => typeof item !== 'string' || item.length > 2000)) throw new RequestError('草稿欄位格式不正確。')
  }
  if (typeof draft.category !== 'string' || draft.category.length > 80 || !Array.isArray(draft.assetPlan) || draft.assetPlan.length > 8) throw new RequestError('草稿附件格式不正確。')
  const seen = new Set<string>()
  for (const asset of draft.assetPlan) {
    const prefix = `public/images/articles/${draft.slug}/`
    if (!asset || typeof asset.originalName !== 'string' || typeof asset.targetPath !== 'string' || !asset.targetPath.startsWith(prefix)) throw new RequestError('附件只能匯出到這篇文章的圖片資料夾。')
    const name = asset.targetPath.slice(prefix.length)
    if (!/^(cover|inline)-[a-z0-9][a-z0-9._-]*\.(png|jpe?g|webp)$/.test(name) || name.includes('..') || seen.has(asset.targetPath)) throw new RequestError('附件檔名或類型不正確。')
    if (asset.publicPath !== '/' + asset.targetPath.slice('public/'.length)) throw new RequestError('附件網址與檔案路徑不一致。')
    seen.add(asset.targetPath)
  }
  return draft
}
