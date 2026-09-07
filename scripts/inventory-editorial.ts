import fs from 'node:fs'
import { createClient } from '@libsql/client'

async function main() {
  // Explicit local target: inventory never follows a remote .env setting.
  const db = createClient({ url: 'file:.private/portfolio.db' })
  const records = (await db.execute('SELECT id,kind,slug,title,data,visibility,updated_at,version FROM content ORDER BY kind,id')).rows.map(row => ({ ...row, data: JSON.parse(String(row.data)) }))
  const assets = (await db.execute('SELECT id,name,mime,private_only,length(bytes) AS size FROM assets ORDER BY name')).rows
  const references = (await db.execute('SELECT * FROM content_assets ORDER BY content_id,asset_id')).rows
  fs.mkdirSync('.private/editorial', { recursive: true })
  fs.writeFileSync('.private/editorial/inventory.json', JSON.stringify({ records, assets, references }, null, 2), { mode: 0o600 })
  console.log(JSON.stringify({ records: records.map(({data,...r})=>({ ...r, excerpt:data.article?.excerpt || data.summary?.zh || data.labels?.zh?.description, articleSlug:data.articleSlug, images:data.images, image:data.article?.image || data.image })), assets },null,2))
  db.close()
}
main().catch(error=>{console.error(error.message);process.exitCode=1})
