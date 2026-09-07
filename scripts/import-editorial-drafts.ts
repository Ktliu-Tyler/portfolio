import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { createClient } from '@libsql/client'
import assert from 'node:assert/strict'

type Draft = { slug:string; title:string; excerpt:string; cover:string; tags:string[]; body:string; sources:string[]; related:string[]; reviewNotes:string[]; draftType:string; category:string }
const digest = (value: string | Buffer) => createHash('sha256').update(value).digest('hex')
const editorialRoot = path.resolve('.private/editorial')
const experienceRoot = path.resolve('../experience')
function under(root:string, relative:string) {
  const resolved=path.resolve(root,relative)
  if (!resolved.startsWith(root+path.sep)) throw new Error('Source must stay inside its private source directory.')
  return resolved
}

async function main() {
  // Deliberately local. A content-preparation task must never follow cloud credentials.
  const db=createClient({url:'file:.private/portfolio.db'})
  const manifest=JSON.parse(fs.readFileSync(path.join(editorialRoot,'drafts.json'),'utf8')) as {batch:string;drafts:Draft[]}
  assert.match(manifest.batch,/^editorial-\d{4}-\d{2}-\d{2}$/)
  const imageIndex=JSON.parse(fs.readFileSync(path.join(editorialRoot,'image-index.json'),'utf8')) as Array<{id:number;path:string}>
  const reportNames:Record<string,string>={ '01':'Jarvis 微處理器期中簡報','02':'《香水》比較電影與小說的視角呈現','03':'冷凍空調原理：高溫熱泵的應用','04':'微處理器期末專題書面報告','05':'機械工程實務 Group 7 期末報告','06':'機械設計原理：有線電話拆解小組報告','07':'機械設計原理：人力塔吊小組報告','08':'機械設計原理：折疊椅小組報告','09':'機械設計原理：個人日誌（一）','10':'機械設計原理：個人日誌（二）','11':'機械設計原理：個人日誌（三）','12':'計算機程式期末專題報告','13':'類比電子學實務：BOUTELEUR 期末報告' }
  const selectedAssets=new Map<string,{id:string;name:string;mime:string;bytes:Buffer}>()
  function asset(key:string) {
    if (selectedAssets.has(key)) return `/media/${selectedAssets.get(key)!.id}`
    let filename:string
    if (/^image:\d+$/.test(key)) {
      const original=imageIndex.find(row=>row.id===Number(key.split(':')[1]))
      if (!original) throw new Error('Missing indexed photo')
      filename=under(experienceRoot,original.path)
    } else if (/^pdf:\d{2}-p\d+$/.test(key)) filename=under(editorialRoot,`pdf-images/${key.slice(4)}.png`)
    else throw new Error('Unsupported editorial asset')
    const bytes=fs.readFileSync(filename)
    const ext=path.extname(filename).toLowerCase()
    assert.ok(['.png','.jpg','.jpeg'].includes(ext))
    const id=digest(`${manifest.batch}:${key}:${digest(bytes)}`).slice(0,32)
    selectedAssets.set(key,{id,name:`${manifest.batch}-${key.replace(':','-')}${ext}`,mime:ext==='.png'?'image/png':'image/jpeg',bytes})
    return `/media/${id}`
  }
  const rows=manifest.drafts.map(draft=>{
    assert.match(draft.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    assert.ok(draft.title.length>0 && draft.body.length>500)
    const content=draft.body.replace(/\{\{((?:image:\d+)|(?:pdf:\d{2}-p\d+))\}\}/g,(_match,key)=>asset(key))
    assert.ok(!content.includes('{{'))
    const image=asset(draft.cover)
    const sources=draft.sources.map(source=>{
      const match=source.match(/^(\d{2}):(.*)$/)
      return {type:match?'report':'archive',name:match?`${reportNames[match[1]]}（PDF 第 ${match[2]} 頁）`:source}
    })
    const data={kind:'markdown',article:{slug:draft.slug,title:draft.title,excerpt:draft.excerpt,date:'2026-09-07',readTime:String(Math.max(1,Math.ceil(content.replace(/!\[[^\]]*\]\([^)]*\)/g,'').length/400))),tags:draft.tags,category:draft.category,sourceType:'local-archive',image,content,sources},editorial:{batch:manifest.batch,draftType:draft.draftType,preparedAt:new Date().toISOString(),sourceDigest:digest(JSON.stringify(draft)),relatedIds:draft.related,reviewNotes:draft.reviewNotes}}
    return {id:`article:${draft.slug}`,draft,data,assetIds:[...new Set((image+' '+content).match(/\/media\/[a-f0-9]{32}/g) || [])].map(url=>url.slice(7))}
  })
  assert.equal(new Set(rows.map(row=>row.id)).size,rows.length)
  const tx=await db.transaction('write')
  try {
    const before=(await tx.execute('SELECT * FROM content ORDER BY id')).rows
    const beforeAssets=(await tx.execute('SELECT * FROM assets ORDER BY id')).rows
    const backup={format:'portfolio-private-v1',exportedAt:new Date().toISOString(),content:before,assets:beforeAssets.map(row=>({...row,bytes:Buffer.from(row.bytes as ArrayBuffer).toString('base64')})),references:(await tx.execute('SELECT * FROM content_assets')).rows,history:(await tx.execute('SELECT * FROM audit_log')).rows}
    const backupPath=path.join(editorialRoot,`before-import-${Date.now()}.json`)
    fs.writeFileSync(backupPath,JSON.stringify(backup),{mode:0o600})
    const added:string[]=[]
    for(const row of rows) {
      const existing=before.find(item=>item.id===row.id)
      if(existing) {
        const current=JSON.parse(String(existing.data))
        assert.equal(current.editorial?.sourceDigest,row.data.editorial.sourceDigest,'Existing article changed; refusing overwrite.')
        continue
      }
      for(const related of row.draft.related) assert.ok(before.some(item=>item.id===related),'Related record missing')
      for(const id of row.assetIds) {
        const file=[...selectedAssets.values()].find(item=>item.id===id)!
        assert.ok(file)
        const existingAsset=beforeAssets.find(item=>item.id===id)
        if(existingAsset) assert.ok(Buffer.from(existingAsset.bytes as ArrayBuffer).equals(file.bytes))
        else await tx.execute({sql:'INSERT OR IGNORE INTO assets(id,name,mime,bytes,private_only) VALUES(?,?,?,?,0)',args:[id,file.name,file.mime,file.bytes]})
      }
      const now=new Date().toISOString()
      await tx.execute({sql:"INSERT INTO content(id,kind,slug,title,data,visibility,updated_at) VALUES(?,'article',?,?,?,'private',?)",args:[row.id,row.draft.slug,row.draft.title,JSON.stringify(row.data),now]})
      for(const id of row.assetIds) await tx.execute({sql:'INSERT INTO content_assets(content_id,asset_id) VALUES(?,?)',args:[row.id,id]})
      await tx.execute({sql:'INSERT INTO audit_log(content_id,title,action,created_at) VALUES(?,?,?,?)',args:[row.id,row.draft.title,'整理本地資料為私密圖文草稿',now]})
      added.push(row.id)
    }
    const after=(await tx.execute('SELECT * FROM content ORDER BY id')).rows
    // Existing public/private choices and text must survive the import byte-for-byte.
    for(const original of before) assert.deepEqual(after.find(item=>item.id===original.id),original)
    for(const id of added) assert.equal(after.find(item=>item.id===id)?.visibility,'private')
    for(const file of selectedAssets.values()) {
      const publicRefs=await tx.execute({sql:"SELECT 1 FROM content_assets ca JOIN content c ON c.id=ca.content_id WHERE ca.asset_id=? AND c.visibility='public'",args:[file.id]})
      assert.equal(publicRefs.rows.length,0,'New editorial asset unexpectedly public')
    }
    await tx.commit()
    const result={batch:manifest.batch,added:added.length,articles:rows.map(row=>({id:row.id,title:row.draft.title,slug:row.draft.slug,type:row.draft.draftType,assets:row.assetIds,related:row.draft.related,reviewNotes:row.draft.reviewNotes})),newAssetCount:selectedAssets.size,backupPath,unchangedExistingRecords:before.length}
    fs.writeFileSync(path.join(editorialRoot,'import-result.json'),JSON.stringify(result,null,2),{mode:0o600})
    for(const row of rows) fs.writeFileSync(path.join(editorialRoot,'articles',`${row.draft.slug}.md`),`# ${row.draft.title}\n\n${row.draft.excerpt}\n\n${row.data.article.content}\n`,{mode:0o600})
    console.log(JSON.stringify({added:added.length,articles:rows.length,privateImages:selectedAssets.size,unchangedExistingRecords:before.length,backupPath},null,2))
  } finally {tx.close();db.close()}
}
main().catch(error=>{console.error(error.message);process.exitCode=1})
