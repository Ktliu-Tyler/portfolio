import fs from 'node:fs'
import path from 'node:path'
import { readyDatabase } from '../lib/database'

async function main() {
  const db = await readyDatabase()
  const content = await db.execute("SELECT * FROM content WHERE visibility='public' ORDER BY kind, updated_at DESC, id")
  const assets = await db.execute(`
    SELECT DISTINCT a.id, a.name, a.mime, a.bytes
    FROM assets a
    JOIN content_assets ca ON ca.asset_id = a.id
    JOIN content c ON c.id = ca.content_id
    WHERE c.visibility='public' AND a.private_only=0
    ORDER BY a.id
  `)
  const snapshot = {
    generatedAt: new Date().toISOString(),
    records: content.rows.map(row => ({
      id: String(row.id),
      kind: String(row.kind),
      slug: String(row.slug),
      title: String(row.title),
      visibility: String(row.visibility),
      updatedAt: String(row.updated_at),
      version: Number(row.version),
      data: JSON.parse(String(row.data)),
    })),
    assets: assets.rows.map(row => ({
      id: String(row.id),
      name: String(row.name),
      mime: String(row.mime),
      bytes: Buffer.from(row.bytes as ArrayBuffer).toString('base64'),
    })),
  }
  fs.mkdirSync('data', { recursive: true })
  fs.writeFileSync(path.join('data', 'public-snapshot.json'), JSON.stringify(snapshot))
  console.log(`Public snapshot saved. ${snapshot.records.length} records, ${snapshot.assets.length} assets.`)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
