import { CRAWLERS, allowsPath } from './crawler-policy.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
export const ORIGIN='https://www.ashwingupta.dev';
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export const projectRoutes=load('src/data/project-routes.json');
export const publication=load('src/data/article-publication.json');
export const aliases=['about','impact','stack','experience','recommendations','featured','projects','contact'];
export const pages=['/','/articles',...['work','research','articles'].flatMap(f=>fs.readdirSync('src/pages/'+f).filter(n=>n.endsWith('.astro')&&n!=='index.astro'&&!n.startsWith('[')).map(n=>'/'+f+'/'+n.slice(0,-6)))];
const personId=ORIGIN+'/#ashwin-gupta';
const schemas=html=>[...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
function canonical(html){return [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g)].map(m=>m[1]);}
function publicIndexable(response){
  assert.ok(!/\b(noindex|none|unavailable_after)\b/i.test(response.headers.get('x-robots-tag')??''),'Indexing prohibited by HTTP header');
}
function validatePage(html,p){
  const url=ORIGIN+p;
  assert.deepEqual(canonical(html),[url],'Exactly one correct canonical required');
  assert.ok(!/<meta\b[^>]*name="(?:robots|googlebot|bingbot)"[^>]*content="[^"]*\b(?:noindex|none)\b/i.test(html),'Indexing prohibited by metadata');
  const data=schemas(html);
  const people=data.filter(s=>s['@type']==='Person');
  assert.equal(people.length,1,'One shared Person definition');
  assert.equal(people[0]['@id'],personId);
  assert.equal(people[0].worksFor?.name,'SkanAI');
  assert.equal(people[0].jobTitle,'AI Systems Engineer');
  for(const external of ['https://github.com/ughshwin','https://www.linkedin.com/in/ashwingupta3012/','https://www.kaggle.com/ashwingupta3012'])assert.ok(people[0].sameAs?.includes(external),'Missing sameAs '+external);
  if(p==='/'||p==='/articles')return;
  const content=data.find(s=>s['@id']===url+'#content');
  assert.ok(content,'Missing content entity');
  assert.equal(content.author?.['@id'],personId);
  assert.equal(content.url,url);
  if(p.startsWith('/articles/')){
    assert.equal(content['@type'],'Article');
    assert.equal(content.datePublished,publication[p.split('/').pop()]?.datePublished,'Publication date missing or stale');
    assert.ok(content.headline,'Article headline missing');
  }
}
// A local base is injected only by the fixture tests. The CLI always checks ORIGIN.
export async function verifyLive({base=ORIGIN,fetchImpl=fetch}={}){
  const results=[];
  async function request(p,agent){
    const response=await fetchImpl(base+p,{redirect:'manual',signal:AbortSignal.timeout(15000),headers:{'User-Agent':agent??'PortfolioSearchabilityCheck/1.0','Accept':'*/*'}});
    return response;
  }
  async function check(label,fn){try{await fn();results.push({label,ok:true});}catch(e){results.push({label,ok:false,error:e.message});}}
  const jobs=[];
  for(const p of pages)jobs.push(()=>check('Page '+p,async()=>{
    const res=await request(p);assert.equal(res.status,200,'Expected HTTP 200');publicIndexable(res);
    assert.match(res.headers.get('content-type')??'',/text\/html/i);
    validatePage(await res.text(),p);
  }));
  for(const alias of aliases)jobs.push(()=>check('Alias /'+alias,async()=>{
    const res=await request('/'+alias);assert.equal(res.status,200);publicIndexable(res);
    const html=await res.text();validatePage(html,'/');assert.ok(html.includes('id="'+alias+'"'),'Section content missing');
  }));
  const slashPaths=[...pages.filter(p=>p!=='/'),...aliases.map(a=>'/'+a),...Object.keys(projectRoutes).map(slug=>'/projects/'+slug),'/research'];
  for(const p of slashPaths)jobs.push(()=>check('Slash normalization '+p,async()=>{
    const res=await request(p+'/');
    assert.ok([301,308].includes(res.status),'Expected a permanent redirect');
    const target=p==='/research'?'/projects':p.startsWith('/projects/')?projectRoutes[p.slice('/projects/'.length)]:undefined;
    assert.ok([p,target].includes(new URL(res.headers.get('location'),base).pathname),'Unexpected slash redirect destination');
  }));
  for(const [slug,target] of Object.entries(projectRoutes))jobs.push(()=>check('Redirect /projects/'+slug,async()=>{
    const res=await request('/projects/'+slug);assert.equal(res.status,301,'Expected HTTP 301');
    assert.equal(new URL(res.headers.get('location'),base).pathname,target,'Wrong redirect destination');
    assert.equal(new URL(res.headers.get('location'),base).origin,new URL(base).origin,'Unexpected redirect host');
  }));
  jobs.push(()=>check('Research alias redirect',async()=>{
    const res=await request('/research');assert.equal(res.status,301);assert.equal(new URL(res.headers.get('location'),base).pathname,'/projects');
  }));
  jobs.push(()=>check('robots.txt',async()=>{
    const res=await request('/robots.txt');assert.equal(res.status,200);
    const robots=await res.text();assert.match(robots,/User-agent:\s*\*[\s\S]*Allow:\s*\//i);
    assert.ok(!/^Disallow:\s*\/(?:\s|$)/im.test(robots),'Root crawl disallowed');
    assert.ok(robots.includes('Sitemap: '+ORIGIN+'/sitemap-index.xml'));
    for(const bot of CRAWLERS)for(const page of pages)assert.ok(allowsPath(robots,bot,page),bot+' disallowed at '+page);
  }));
  jobs.push(()=>check('Sitemap index',async()=>{
    const res=await request('/sitemap-index.xml');assert.equal(res.status,200);
    assert.ok((await res.text()).includes('<loc>'+ORIGIN+'/sitemap-0.xml</loc>'));
  }));
  jobs.push(()=>check('Canonical sitemap coverage',async()=>{
    const res=await request('/sitemap-0.xml');assert.equal(res.status,200);
    const xml=await res.text();const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
    assert.deepEqual(urls.sort(),pages.map(p=>ORIGIN+p).sort());assert.ok(!xml.includes('<lastmod>'),'Unexpected fabricated freshness');
  }));
  jobs.push(()=>check('llms.txt',async()=>{
    const res=await request('/llms.txt');assert.equal(res.status,200);
    assert.match(res.headers.get('content-type')??'',/text\/plain/i);
    const body=await res.text();assert.ok(body.startsWith('# Ashwin Gupta'));assert.ok(body.includes('AI Systems Engineer'));
    for(const p of pages)assert.ok(body.includes(']('+ORIGIN+p+')'),'Missing canonical reading link '+p);
  }));
  for(const agent of CRAWLERS)jobs.push(()=>check('Crawler access '+agent,async()=>{
    for(const page of pages){
      const res=await request(page,agent);assert.equal(res.status,200,page+' crawler HTTP status');publicIndexable(res);
      const html=await res.text();assert.ok(/<h1(?:\s|>)/i.test(html),page+' missing server-rendered heading');
      assert.ok(!/<meta\b[^>]*name="(?:robots|googlebot|bingbot)"[^>]*content="[^"]*\b(?:noindex|none)\b/i.test(html),page+' crawler indexing prohibited');
    }
  }));
  for(let i=0;i<jobs.length;i+=4)await Promise.all(jobs.slice(i,i+4).map(fn=>fn()));
  return results;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const results=await verifyLive();
  for(const result of results)console.log((result.ok?'PASS ':'FAIL ')+result.label+(result.ok?'':': '+result.error));
  const failed=results.filter(r=>!r.ok).length;
  console.log(JSON.stringify({origin:ORIGIN,passed:results.length-failed,failed,checkedAt:new Date().toISOString()}));
  if(failed)process.exitCode=1;
}
