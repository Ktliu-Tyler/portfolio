import 'server-only'
import snapshotData from '@/data/public-snapshot.json'
import type { ContentKind, ManagedContent } from './contentTypes'

type PublicSnapshotAsset = {
  id: string
  name: string
  mime: string
  bytes: string
}

type PublicSnapshot = {
  generatedAt: string
  records: ManagedContent[]
  assets: PublicSnapshotAsset[]
}

const snapshot = snapshotData as PublicSnapshot

export function usesPublicSnapshot() {
  const url = process.env.DATABASE_URL
  return Boolean(process.env.VERCEL && (!url || url.startsWith('file:')))
}

export function snapshotPublicRecords(kind: ContentKind) {
  return snapshot.records
    .filter(record => record.kind === kind && record.visibility === 'public')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id))
}

export function snapshotPublicRecord(kind: ContentKind, slug: string) {
  return snapshotPublicRecords(kind).find(record => record.slug === slug) ?? null
}

export function snapshotPublicAsset(id: string) {
  const asset = snapshot.assets.find(item => item.id === id)
  return asset ? { mime: asset.mime, bytes: Buffer.from(asset.bytes, 'base64') } : null
}
