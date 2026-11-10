import { profile, experience, siteRedirects, contentFacts, projects, articles } from './portfolio-data.mjs';
import { resolveReferences } from '../src/content/portfolio/references.mjs';
import { darkenWhiteSvg } from '../src/lib/review-svg.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parse } from 'parse5';

// The static design now owns canonical URLs. Check the new architecture while
// retaining the content, dark-logo, single-CV and protected-diagram guarantees.
const attr=(n,key)=>n.attrs?.find(a=>a.name===key)?.value;
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const text=n=>n.nodeName==='#text'?n.value:['script','style','svg','template'].includes(n.tagName)?'':(n.childNodes??[]).map(text).join(' ');
const clean=n=>text(n).replace(/\s+/g,' ').trim();
const hasClass=(n,c)=>(attr(n,'class')||'').split(' ').includes(c);
const load=route=>walk(parse(fs.readFileSync(path.join('dist',route,'index.html'),'utf8')));
const read=name=>resolveReferences(JSON.parse(fs.readFileSync(`src/content/portfolio/${name}.json`,'utf8')),contentFacts);
const routes=[...fs.readFileSync('dist/sitemap-0.xml','utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const expectedRoutes=['/','/articles',...new Set(Object.values(projects.entries).map(p=>p.href).filter(h=>h.startsWith('/'))),...Object.values(articles).map(a=>'/articles/'+a.slug)];
assert.deepEqual([...routes].sort(),expectedRoutes.sort(),'Only the authoritative documents belong in the sitemap');
for(const route of routes){
  const nodes=load(route);
  assert.equal(attr(nodes.find(n=>n.tagName==='body'),'class'),'review-edition',route+' static default');
  assert.equal(nodes.filter(n=>n.tagName==='main').length,1,route+' one main');
  assert.equal(nodes.filter(n=>n.tagName==='canvas'||attr(n,'data-edition-switch')!==undefined).length,0,route+' no animated design or mode switch');
  const islands=nodes.filter(n=>n.tagName==='astro-island').map(n=>attr(n,'component-url'));
  assert.ok(islands.every(url=>/\/(ClockWidget|SiteAnalytics)\./.test(url)),route+' only functional enhancements hydrate');
  const downloads=nodes.filter(n=>n.tagName==='a'&&attr(n,'download')===profile.resumeFilename);
  assert.equal(downloads.length,1,route+' one CV download');
  const resumeHref=attr(downloads[0],'href');
  assert.equal(path.extname(resumeHref),path.extname(profile.resumeFilename),route+' CV format');
  assert.ok(fs.existsSync(path.join('dist',resumeHref)),route+' CV asset exists');
  assert.ok(walk(nodes.find(n=>hasClass(n,'rv-rail'))).includes(downloads[0]),route+' CV lives in the rail');
  const ribbon=nodes.filter(n=>attr(n,'id')==='awwwards');
  assert.equal(ribbon.length,1,route+' one Awwwards ribbon');
  const parts=walk(ribbon[0]),link=parts.find(n=>n.tagName==='a'),svg=parts.find(n=>n.tagName==='svg');
  assert.equal(attr(link,'href'),read('recognition').awwwards.url);
  assert.equal(attr(link,'target'),'_blank');assert.match(attr(link,'rel'),/noopener/);
  assert.equal(attr(svg,'width'),'53.08');assert.equal(attr(svg,'height'),'171.358');
  assert.equal(attr(parts.find(n=>hasClass(n,'js-color-bg')),'fill'),'black');
  assert.equal(attr(parts.find(n=>hasClass(n,'js-color-text')),'fill'),'white');
  for(const style of ['position:fixed','z-index:999','translateY(-50%)','top:50%','left:0'])assert.ok(attr(ribbon[0],'style').replace(/\s/g,'').includes(style),route+' supplied ribbon placement');
  for(const link of nodes.filter(n=>n.tagName==='a')){
    const href=attr(link,'href')||'';
    assert.ok(!/^\/(review|landing|editions)(\/|#|$)/.test(href),route+' canonical internal links: '+href);
  }
}
const home=load('/'),homeSource=home.find(n=>attr(n,'data-static-home')!==undefined);
assert.ok(homeSource,'Homepage is a native Astro template');
const section=id=>home.find(n=>attr(n,'id')===id);
assert.deepEqual(walk(homeSource).filter(n=>n.tagName==='section'&&attr(n,'id')).map(n=>attr(n,'id')),['hero','about','experience','impact','featured','projects','recommendations','stack','contact']);
assert.equal(walk(section('hero')).filter(n=>n.tagName==='img').length,0,'Removed portrait stays removed');
const career=home.filter(n=>attr(n,'data-experience-id'));
assert.deepEqual(career.map(n=>attr(n,'data-experience-id')),[...experience].sort((a,b)=>b.start.localeCompare(a.start)).map(e=>e.id),'Newest experience first');
for(const entry of experience){
  const card=career.find(n=>attr(n,'data-experience-id')===entry.id);
  for(const value of [entry.role,entry.company,...entry.bullets])assert.ok(clean(card).includes(value.replace(/\s+/g,' ').trim()),entry.id+' content retained');
}
assert.ok(!/Best Team Award|Pat on Back|Keep It Up Award|Java Spring AI trainer/i.test(clean(career.find(n=>attr(n,'data-experience-id')==='coforge'))),'Coforge work summary excludes duplicate awards');
const awards=home.filter(n=>attr(n,'data-achievement'));
assert.deepEqual(awards.map(n=>attr(n,'data-achievement')),read('achievements').map(a=>a.id),'All awards retained');
const recs=home.filter(n=>attr(n,'data-recommendation-id'));
for(const rec of read('recommendations')){
  const card=recs.find(n=>attr(n,'data-recommendation-id')===rec.id);
  assert.ok(card,'Recommendation '+rec.id);
  for(const value of [rec.text,rec.name,rec.title,rec.company,rec.relationship,rec.date])assert.ok(clean(card).includes(value),rec.id+' complete recommendation');
  assert.ok(hasClass(card.childNodes.filter(n=>n.tagName).at(-1),'recommendation-attribution'),'Attribution at bottom');
}
assert.equal(recs.length,read('recommendations').length);
assert.equal(walk(section('impact')).filter(n=>n.tagName==='a').length,0,'Impact names are plain text');
assert.equal(home.filter(n=>hasClass(n,'impact-outcome-metric')).length,read('impact').entries.length,'All impact entries retained');
assert.equal(walk(section('stack')).filter(n=>hasClass(n,'native-skill-category')).length,read('skills').length,'All skill categories retained');
const personal=home.find(n=>attr(n,'data-project-id')==='ashwingupta-dev');
assert.equal(attr(walk(personal).find(n=>n.tagName==='img'),'src'),'/favicon.svg','Personal project favicon');
for(const logo of ['hsbc-black.svg','kaggle-black.png','sipp-black.png'])assert.ok(home.some(n=>n.tagName==='img'&&attr(n,'src')?.endsWith(logo)),'Dark logo '+logo);
for(const [original,dark]of Object.entries(JSON.parse(fs.readFileSync('src/lib/review-svg-assets.json','utf8'))))assert.equal(fs.readFileSync('public'+dark,'utf8'),darkenWhiteSvg(fs.readFileSync('public'+original,'utf8')),dark+' changes white paint only');
const hosting=JSON.parse(fs.readFileSync('vercel.json','utf8'));
for(const [from,to]of Object.entries(siteRedirects)){
  const rule=hosting.redirects.find(r=>r.source===from);
  assert.equal(rule?.destination,to,from+' hosted destination');assert.equal(rule?.statusCode,301);
  assert.ok(fs.readFileSync(path.join('dist',from,'index.html'),'utf8').includes(to),from+' static fallback');
}
for(const id of Object.keys(read('section-titles'))){
  const nodes=load('/'+id);
  assert.equal(clean(nodes.find(n=>attr(n,'data-static-home')!==undefined)),clean(homeSource),id+' same shared homepage');
  assert.equal(attr(nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href'),profile.siteUrl);
}
const baseline=JSON.parse(fs.readFileSync('docs/content-migration/before.json','utf8'));
const blocks=s=>[...s.replace(/\r\n/g,'\n').matchAll(/<(script|style)\b[\s\S]*?<\/\1>/g)].map(m=>m[0]).join('\n');
for(const[file,hash]of Object.entries(baseline.protectedSources).filter(([file])=>/^src\/pages\/(work|research|articles)\//.test(file)))assert.equal(crypto.createHash('sha256').update(blocks(fs.readFileSync(file,'utf8'))).digest('hex'),hash,file+' protected scripts/styles');
const hsbc=load('/work/hsbc');
assert.deepEqual(hsbc.filter(n=>hasClass(n,'mermaid')).map(n=>text(n).trim()),baseline.pages['/work/hsbc'].diagrams.map(s=>s.trim()),'All eight diagram definitions retained');
assert.equal(hsbc.filter(n=>hasClass(n,'cs-tab-panel')).length,2,'HSBC both panels');
assert.equal(load('/research/pinns').filter(n=>hasClass(n,'th-tab-panel')).length,2,'PINNs both panels');
assert.ok(!fs.readdirSync('dist/_astro').some(name=>/^(App|ProjectDetailApp|AIBackground|Entrance)\./.test(name)),'Animated application is absent from the build');
const geometryFile='docs/review-rendering-baseline/static-mermaid-geometry.json';
assert.deepEqual(JSON.parse(fs.readFileSync(geometryFile,'utf8')),JSON.parse(fs.readFileSync('docs/review-rendering-baseline/mermaid-geometry.json','utf8')),'All eight rendered diagrams: both tabs at desktop and phone widths');
const renderedStyles=JSON.parse(fs.readFileSync('docs/review-rendering-baseline/static-verified-styles.json','utf8'));
for(const[file,hash]of Object.entries(renderedStyles.files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n')).digest('hex'),hash,file+' changed since browser geometry verification');
console.log(`Static-site checks passed: ${routes.length} canonical documents, ${Object.keys(siteRedirects).length} redirects, native shared homepage, ribbon, single CV, dark logos, all content records and protected diagrams.`);
