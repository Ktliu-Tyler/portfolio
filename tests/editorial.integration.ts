import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createClient } from '@libsql/client'
import { hashPassword } from '../lib/password'

async function main(){
 const manifestPath=path.resolve('.private/editorial/import-result.json')
 if(!fs.existsSync(manifestPath)) throw new Error('Import the private editorial batch before running this local-content verification.')
 const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8')) as {articles:Array<{id:string;slug:string;assets:string[]}>}
 const fixture=path.resolve(`.private/editorial/test-${Date.now()}.db`)
 // The actual database is only copied; authentication changes affect the copy only.
 fs.copyFileSync(path.resolve('.private/portfolio.db'),fixture)
 const db=createClient({url:`file:${fixture.replace(/\\/g,'/')}`})
 if(!(await db.execute('PRAGMA table_info(owner)')).rows.some(row=>row.name==='version')) await db.execute('ALTER TABLE owner ADD COLUMN version INTEGER NOT NULL DEFAULT 1')
 const password='editorial-browser-test-only-2026'
 await db.execute({sql:'UPDATE owner SET password_hash=?,version=version+1 WHERE id=1',args:[await hashPassword(password)]})
 await db.execute('DELETE FROM sessions');await db.execute('DELETE FROM login_attempts');db.close()
 const origin='http://127.0.0.1:3103'
 const log=fs.openSync('.private/editorial/test-server.log','w')
 const env={...process.env,DATABASE_URL:`file:${fixture.replace(/\\/g,'/')}`,DATABASE_AUTH_TOKEN:'',ADMIN_ORIGIN:origin,NEXT_DIST_DIR:'.next',OPENAI_API_KEY:'',GITHUB_TOKEN:'',VERCEL:''}
 const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3103'],{env,stdio:['ignore',log,log],windowsHide:true})
 let checks=0
 try{
  let ready=false
  for(let i=0;i<40;i++){try{if((await fetch(origin+'/admin/login')).ok){ready=true;break}}catch{} await new Promise(resolve=>setTimeout(resolve,500))}
  assert.ok(ready,'Server started');checks++
  const pages=await Promise.all(['/','/projects','/experience','/blog','/sitemap.xml'].map(async route=>{const r=await fetch(origin+route);assert.equal(r.status,200);checks++;return r.text()}))
  for(const item of manifest.articles){
    assert.ok(pages.every(html=>!html.includes(item.slug)),'Private slug omitted from public pages');checks++
    assert.equal((await fetch(origin+'/blog/'+item.slug)).status,404);checks++
    assert.equal((await fetch(origin+'/admin/preview/'+encodeURIComponent(item.id),{redirect:'manual'})).status,307);checks++
  }
  const assets=[...new Set(manifest.articles.flatMap(item=>item.assets))]
  for(const id of assets){assert.equal((await fetch(origin+'/media/'+id)).status,404);checks++}
  const login=await fetch(origin+'/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({password})})
  assert.equal(login.status,200);checks++
  const cookie=login.headers.get('set-cookie')!.split(';')[0]
  const dashboard=await fetch(origin+'/admin',{headers:{Cookie:cookie}})
  assert.equal(dashboard.status,200);checks++
  const dashboardHtml=await dashboard.text()
  for(const item of manifest.articles){
    assert.ok(dashboardHtml.includes(item.slug));checks++
    const preview=await fetch(origin+'/admin/preview/'+encodeURIComponent(item.id),{headers:{Cookie:cookie}})
    assert.equal(preview.status,200);checks++
    const html=await preview.text()
    assert.ok(html.includes('This content is currently private') && html.includes('Content sources') && html.includes('Review before publishing'));checks++
    for(const id of item.assets){assert.ok(html.includes('/media/'+id));checks++}
    assert.ok(!html.includes('{{image:') && !html.includes('{{pdf:'));checks++
  }
  for(const id of assets){
    const media=await fetch(origin+'/media/'+id,{headers:{Cookie:cookie}})
    assert.equal(media.status,200);checks++
    assert.ok(media.headers.get('content-type')?.startsWith('image/'));checks++
    assert.match(media.headers.get('cache-control')||'',/no-store/);checks++
    await media.arrayBuffer()
  }
  fs.writeFileSync('.private/editorial/verification.json',JSON.stringify({checkedAt:new Date().toISOString(),checks,articles:manifest.articles.length,assets:assets.length,passed:true},null,2),{mode:0o600})
  console.log(`${checks} editorial checks passed: ${manifest.articles.length} private articles, ${assets.length} protected images; public routes hide all new content.`)
  if(process.argv.includes('--serve')){
    console.log('Isolated browser fixture remains on port 3103. Test password: editorial-browser-test-only-2026')
    await new Promise<void>(resolve=>{process.on('SIGINT',()=>{server.kill();resolve()});server.on('exit',()=>resolve())})
  }
 }finally{server.kill();fs.closeSync(log)}
}
main().catch(error=>{console.error(error.message);process.exitCode=1})
