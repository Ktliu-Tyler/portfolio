import { createClient, type Client } from '@libsql/client'
import fs from 'node:fs'
import path from 'node:path'

let client: Client | undefined
let initialized: Promise<void> | undefined

export function database() {
  if (client) return client
  const url = process.env.DATABASE_URL
  if (url && !url.startsWith('file:')) {
    const target = new URL(url)
    if (!['https:','libsql:'].includes(target.protocol) || target.username || target.password) throw new Error('Remote database connections must use TLS and a separate auth token.')
  }
  if (process.env.VERCEL && (!url || url.startsWith('file:'))) {
    throw new Error('A persistent remote DATABASE_URL is required on Vercel.')
  }
  if (!url) fs.mkdirSync(path.join(process.cwd(), '.private'), { recursive: true })
  client = createClient({ url: url || 'file:.private/portfolio.db', authToken: process.env.DATABASE_AUTH_TOKEN })
  return client
}

export async function readyDatabase() {
  const db = database()
  if (!initialized) {
    initialized = db.batch([
      `CREATE TABLE IF NOT EXISTS content (
        id TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK(kind IN ('article','experience','project','certificate')),
        slug TEXT NOT NULL, title TEXT NOT NULL, data TEXT NOT NULL,
        visibility TEXT NOT NULL DEFAULT 'private' CHECK(visibility IN ('public','private')),
        updated_at TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,
        UNIQUE(kind, slug), CHECK(kind != 'certificate' OR visibility = 'private'))`,
      `CREATE TABLE IF NOT EXISTS assets (id TEXT PRIMARY KEY, name TEXT NOT NULL, mime TEXT NOT NULL, bytes BLOB NOT NULL, private_only INTEGER NOT NULL DEFAULT 0)`,
      `CREATE TABLE IF NOT EXISTS content_assets (content_id TEXT NOT NULL REFERENCES content(id), asset_id TEXT NOT NULL REFERENCES assets(id), PRIMARY KEY(content_id,asset_id))`,
      `CREATE TABLE IF NOT EXISTS owner (id INTEGER PRIMARY KEY CHECK(id=1), password_hash TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1)`,
      `CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, expires_at INTEGER NOT NULL, owner_version INTEGER NOT NULL DEFAULT 0)`,
      `CREATE TABLE IF NOT EXISTS login_attempts (id INTEGER PRIMARY KEY AUTOINCREMENT, attempted_at INTEGER NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, content_id TEXT, title TEXT NOT NULL, action TEXT NOT NULL, created_at TEXT NOT NULL)`,
      'CREATE INDEX IF NOT EXISTS content_visibility ON content(kind,visibility)',
      'CREATE INDEX IF NOT EXISTS asset_references ON content_assets(asset_id)',
    ], 'write').then(async () => {
      // The write transaction serializes migrations across server instances.
      const tx = await db.transaction('write')
      try {
        const ownerColumns = (await tx.execute('PRAGMA table_info(owner)')).rows
        if (!ownerColumns.some(row => row.name === 'version')) await tx.execute('ALTER TABLE owner ADD COLUMN version INTEGER NOT NULL DEFAULT 1')
        const sessionColumns = (await tx.execute('PRAGMA table_info(sessions)')).rows
        if (!sessionColumns.some(row => row.name === 'owner_version')) await tx.execute('ALTER TABLE sessions ADD COLUMN owner_version INTEGER NOT NULL DEFAULT 0')
        await tx.commit()
      } finally { tx.close() }
    }).catch(error => { initialized = undefined; throw error })
  }
  await initialized
  return db
}
