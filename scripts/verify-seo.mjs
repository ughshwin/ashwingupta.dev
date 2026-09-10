import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const origin='https://www.ashwingupta.dev';
const personId=origin+'/#ashwin-gupta';
const publication=JSON.parse(read('src/data/article-publication.json'));
const seenArticles=[];
const aliases=['about','impact','stack','experience','recommendations','featured','projects','contact'];
const routes=JSON.parse(read('src/data/project-routes.json'));
const htmlAt=p=>read('dist'+(p==='/'?'':p)+'/index.html');
const canonical=html=>html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
const schemas=html=>[...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
const pages=['/','/articles',...['work','research','articles'].flatMap(f=>fs.readdirSync(path.join(root,'src/pages',f)).filter(n=>n.endsWith('.astro')&&n!=='index.astro'&&!n.startsWith('[')).map(n=>'/'+f+'/'+n.replace('.astro','')))];
for(const p of pages){
  const html=htmlAt(p), url=p==='/'?origin+'/':origin+p;
  assert.equal(canonical(html),url,p+' canonical');
  const data=schemas(html), person=data.filter(s=>s['@type']==='Person');
  assert.equal(person.length,1,p+' one Person');
  assert.equal(person[0]['@id'],personId);
  assert.equal(person[0].worksFor.name,'SkanAI');
  assert.equal(person[0].jobTitle,'AI Systems Engineer');
  assert.equal(data.find(s=>s['@type']==='WebSite').author['@id'],personId);
  const ids=new Set(data.map(s=>s['@id']));
  function checkRefs(v){
    if(!v||typeof v!=='object')return;
    if(v['@id'])assert.ok(ids.has(v['@id']),p+' unresolved reference '+v['@id']);
    for(const child of Object.values(v))if(typeof child==='object')checkRefs(child);
  }
  data.forEach(checkRefs);
  if(p==='/'||p==='/articles')continue;
  const content=data.find(s=>s['@id']===url+'#content');
  assert.ok(content,p+' content schema');
  assert.equal(content.author['@id'],personId);
  assert.equal(content.url,url);
  if(p.startsWith('/articles/')){
    assert.equal(content['@type'],'Article');
    const slug=p.split('/').pop();
    seenArticles.push(slug);
    assert.ok(publication[slug],p+' publication record');
    const date=publication[slug].datePublished;
    assert.match(date,/^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new Date(date).toISOString().slice(0,10),date,p+' valid publication date');
    assert.equal(content.datePublished,date,p+' publication date');
    assert.ok(content.headline,p+' headline');
    assert.ok(html.includes('property="og:type" content="article"'),p+' article Open Graph type');
    assert.ok(html.includes('property="article:published_time" content="'+date+'"'),p+' Open Graph publication date');
  }
  if(p==='/work/pageindexollama'){
    assert.equal(content['@type'],'SoftwareSourceCode');
    assert.equal(content.codeRepository,'https://github.com/ughshwin/PageIndexOllama');
  }
  if(p==='/research/pinns')assert.equal(content['@type'],'ScholarlyArticle');
  assert.ok(html.includes('<h1'),p+' rendered heading');
}
assert.deepEqual(seenArticles.sort(),Object.keys(publication).sort(),'all publication records used');
for(const alias of aliases){
  const html=htmlAt('/'+alias);
  assert.equal(canonical(html),origin+'/',alias+' homepage canonical');
  assert.ok(html.includes('id="'+alias+'"'),alias+' section retained');
  assert.equal(schemas(html).find(s=>s['@type']==='ProfilePage').mainEntity['@id'],personId);
}
const sitemap=read('dist/sitemap-0.xml');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.deepEqual([...urls].sort(),pages.map(p=>origin+p).sort(),'sitemap includes exactly canonical documents');
assert.ok(!sitemap.includes('<lastmod>'),'no invented modification dates');
for(const p of ['public/sitemap-0.xml','public/sitemap-index.xml'])assert.ok(!fs.existsSync(path.join(root,p)));
const hosting=JSON.parse(read('vercel.json'));
assert.equal(hosting.trailingSlash,false,'canonical URLs must normalize trailing slashes');
const redirects=hosting.redirects;
const source=read('src/app/components/Projects.tsx');
const slugs=[...source.matchAll(/slug: "([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(Object.keys(routes).sort(),slugs.sort(),'every project has an authoritative route');
for(const [slug,destination] of Object.entries(routes)){
  const rule=redirects.find(r=>r.source==='/projects/'+slug);
  assert.equal(rule?.destination,destination);
  assert.equal(rule?.statusCode,301);
  assert.ok(pages.includes(destination),'redirect destination exists');
  const fallback=htmlAt('/projects/'+slug);
  assert.ok(fallback.includes('http-equiv="refresh"')&&fallback.includes(destination),'static redirect fallback');
}
const home=htmlAt('/');
for(const p of Object.values(routes))assert.ok(home.includes('href="'+p+'"'),'crawlable homepage link '+p);
assert.ok(!/href="\/projects\/[^"#]+/.test(home),'no duplicate project links');
assert.ok(home.includes('AI Systems Engineer'));
assert.ok(read('src/app/components/ExperienceTimeline.tsx').includes('role: "AI Engineer"'),'employment title preserved');
for(const match of read('dist/llms.txt').matchAll(/\]\((https:\/\/www\.ashwingupta\.dev[^)]*)\)/g)){
  assert.ok(pages.includes(new URL(match[1]).pathname),'llms.txt canonical destination '+match[1]);
}
assert.ok(read('dist/robots.txt').includes('Allow: /'));
console.log('SEO checks passed: '+pages.length+' canonical pages, '+aliases.length+' section aliases, '+Object.keys(routes).length+' project redirects, shared entities, sitemap, and crawlable links.');
