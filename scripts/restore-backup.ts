import fs from 'node:fs'
import { loadEnvConfig } from '@next/env'
import { readyDatabase } from '../lib/database'

loadEnvConfig(process.cwd())
async function main() {
  const filename = process.argv[2]
  if (!filename) throw new Error('Usage: npm run db:restore -- path/to/private-backup.json')
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'))
  if (data.format !== 'portfolio-private-v1' || !Array.isArray(data.content) || !Array.isArray(data.assets) || !Array.isArray(data.references) || !Array.isArray(data.history)) throw new Error('Invalid private backup format.')
  const db = await readyDatabase()
  const tx = await db.transaction('write')
  try {
    if ((await tx.execute('SELECT 1 FROM content LIMIT 1')).rows.length || (await tx.execute('SELECT 1 FROM assets LIMIT 1')).rows.length) throw new Error('Restore requires an empty content database; existing data will not be overwritten.')
    for (const item of data.content) await tx.execute({ sql: 'INSERT INTO content(id,kind,slug,title,data,visibility,updated_at,version) VALUES(?,?,?,?,?,?,?,?)', args: [item.id,item.kind,item.slug,item.title,item.data,item.visibility,item.updated_at,item.version] })
    for (const item of data.assets) await tx.execute({ sql: 'INSERT INTO assets(id,name,mime,bytes,private_only) VALUES(?,?,?,?,?)', args: [item.id,item.name,item.mime,Buffer.from(item.bytes,'base64'),item.private_only] })
    for (const item of data.references) await tx.execute({ sql: 'INSERT INTO content_assets(content_id,asset_id) VALUES(?,?)', args: [item.content_id,item.asset_id] })
    for (const item of data.history) await tx.execute({ sql: 'INSERT INTO audit_log(content_id,title,action,created_at) VALUES(?,?,?,?)', args: [item.content_id,item.title,item.action,item.created_at] })
    await tx.commit()
    console.log(`Restored ${data.content.length} records and ${data.assets.length} assets. Configure the owner separately with npm run admin:setup.`)
  } finally { tx.close(); db.close() }
}
main().catch(error => { console.error(error.message); process.exitCode = 1 })
