import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parse} from 'parse5';
import {CRAWLERS, allowsPath} from './crawler-policy.mjs';

const ORIGIN = 'https://www.ashwingupta.dev';
const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const text = node => node.nodeName === '#text' ? node.value : ['script','style','svg','template'].includes(node.tagName) ? '' : (node.childNodes ?? []).map(text).join(' ');
const normalized = node => text(node).replace(/\s+/g,' ').trim();

export function verifyContent(root = 'dist') {
  const read = file => fs.readFileSync(path.join(root,file),'utf8');
  const pages = [...read('sitemap-0.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
  const docs = new Map();
  const load = pathname => {
    if (!docs.has(pathname)) docs.set(pathname, walk(parse(read((pathname === '/' ? '' : pathname.slice(1)) + '/index.html'))));
    return docs.get(pathname);
  };
  const robots = read('robots.txt');
  const titles = new Set(), descriptions = new Set(), graph = new Map(), rows = [];
  for (const p of pages) {
    for (const bot of CRAWLERS) assert.ok(allowsPath(robots,bot,p),`${bot} blocked from ${p}`);
    const nodes = load(p);
    const one = (predicate, label) => { const matches=nodes.filter(predicate); assert.equal(matches.length,1,`${p}: exactly one ${label}`); return matches[0]; };
    assert.equal(attr(one(n=>n.tagName==='html','HTML root'),'lang'),'en',`${p}: document language`);
    assert.equal(attr(one(n=>n.tagName==='link'&&attr(n,'rel')==='canonical','canonical'),'href'),ORIGIN+p,`${p}: canonical URL`);
    for(const n of nodes.filter(n=>n.tagName==='meta'&&['robots','googlebot','bingbot'].includes(attr(n,'name')?.toLowerCase()))){
      assert.ok(!/\b(noindex|none|nosnippet)\b/i.test(attr(n,'content')??''),`${p}: restrictive indexing or snippet directive`);
    }
    const main = one(n=>n.tagName==='main'||attr(n,'role')==='main','main landmark');
    const title = normalized(one(n=>n.tagName==='title','title'));
    const description = attr(one(n=>n.tagName==='meta'&&attr(n,'name')==='description','description'),'content');
    assert.ok(title && !titles.has(title),`${p}: unique nonempty title`); titles.add(title);
    assert.ok(description && !descriptions.has(description),`${p}: unique nonempty description`); descriptions.add(description);
    const content = normalized(main);
    assert.ok(content.length>200,`${p}: substantive server-rendered content`);
    assert.ok(walk(main).some(n=>n.tagName==='h1'),`${p}: primary heading is in main content`);
    const ids = new Set();
    for(const n of nodes){const id=attr(n,'id');if(id){assert.ok(!ids.has(id),`${p}: duplicate ID ${id}`);ids.add(id);}}
    const links=[];
    for(const n of nodes.filter(n=>n.tagName==='a')){
      const href=attr(n,'href'); if(!href)continue;
      const target=new URL(href,ORIGIN+p); if(target.origin!==ORIGIN)continue;
      let file=path.join(root,decodeURIComponent(target.pathname));
      assert.ok(fs.existsSync(file),`${p}: broken internal link ${href}`);
      if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
      assert.ok(fs.existsSync(file),`${p}: missing target document ${href}`);
      if(file.endsWith('.html')){
        const targetNodes=load(target.pathname);
        if(target.hash)assert.ok(targetNodes.some(x=>attr(x,'id')===decodeURIComponent(target.hash.slice(1))),`${p}: missing anchor ${href}`);
        const canonical=targetNodes.find(x=>x.tagName==='link'&&attr(x,'rel')==='canonical');
        if(canonical)links.push(new URL(attr(canonical,'href')).pathname);
      }
    }
    const metadata=nodes.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').map(n=>JSON.parse(n.childNodes.map(c=>c.value??'').join('')));
    const person=metadata.find(s=>s['@type']==='Person');
    assert.ok(person.image,`${p}: Person portrait`);
    assert.ok(!person.alumniOf.some(s=>s.name==='IIIT Bangalore'),`${p}: ongoing diploma must not be represented as completed`);
    const page=metadata.find(s=>['WebPage','ProfilePage','CollectionPage'].includes(s['@type']));
    assert.ok(page?.image,`${p}: page image metadata`);
    for(const image of [person.image,page.image]){
      const url=new URL(image);assert.equal(url.origin,ORIGIN);
      assert.ok(fs.existsSync(path.join(root,decodeURIComponent(url.pathname))),`${p}: missing metadata image`);
    }
    if(p==='/research/pinns'){
      const paper=metadata.find(s=>s['@type']==='ScholarlyArticle');
      assert.equal(paper.associatedMedia?.encodingFormat,'application/pdf');
      assert.ok(nodes.some(n=>n.tagName==='a'&&new URL(attr(n,'href')||'/',ORIGIN).href===paper.associatedMedia.contentUrl),'Whitepaper metadata must match a real page link');
    }
    if(p==='/')for(const name of ['SkanAI','Coforge','Gida Technologies','IISc','CellStrat','OutLawed','IIIT Bangalore','BMS College of Engineering'])assert.ok(content.includes(name),'Missing server-rendered experience: '+name);
    graph.set(p,[...new Set(links)]);
    rows.push({path:p,words:content.split(/\s+/).length,internalDocuments:new Set(links).size});
  }
  const seen=new Set(['/']), queue=['/'];
  while(queue.length){for(const next of graph.get(queue.shift())??[])if(!seen.has(next)){seen.add(next);queue.push(next);}}
  for(const p of pages)assert.ok(seen.has(p),'Orphaned canonical page: '+p);
  return rows;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const rows=verifyContent();
  console.log(`Content checks passed: ${rows.length} reachable canonical pages; server-rendered text, experience, main landmarks, unique metadata, internal links/anchors, images, whitepaper, and six crawler policies.`);
}
