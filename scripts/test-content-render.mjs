// Opt-in integration test: edits real source files, builds, checks static pages,
// and always restores source bytes and rebuilds the original portfolio.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { parse } from 'parse5';
const files=['experience','projects','profile','recommendations','kaggle','documents/work--hsbc','featured','research','skills','articles','copy/About','copy/Contact','copy/Projects','copy/ExperienceTimeline'].map(n=>`src/content/portfolio/${n}.json`);
const originals=new Map(files.map(file=>[file,fs.readFileSync(file)]));
const mutate=(index,change)=>{const file=files[index],data=JSON.parse(originals.get(file));change(data);fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');};
const build=()=>{const result=spawnSync(process.execPath,['node_modules/astro/astro.js','build'],{encoding:'utf8'});if(result.status!==0)throw new Error(result.stdout+'\n'+result.stderr);};
const sync=()=>{for(const script of ['sync-seo','sync-discovery','build-discovery']){const result=spawnSync(process.execPath,[`scripts/${script}.mjs`],{encoding:'utf8'});if(result.status!==0)throw new Error(result.stdout+'\n'+result.stderr);}};
const walk=n=>[n,...(n.childNodes||[]).flatMap(walk)];
const text=n=>n.nodeName==='#text'?n.value:['script','style'].includes(n.tagName)?'':(n.childNodes||[]).map(text).join(' ');
const load=route=>walk(parse(fs.readFileSync(`dist/${route?route+'/':''}index.html`,'utf8')));
const rendered=route=>text(load(route).find(n=>n.tagName==='body'));
let passed=false;
try{
 mutate(0,data=>{data.find(e=>e.id==='skan').role='Migration Verification Role';});
 mutate(1,data=>{data.entries['hsbc-voice'].displayName='Migration Verification Project';data.entries['hsbc-voice'].metrics.sessionCapacityMultiplier='9×';});
 mutate(2,data=>{data.name='Migration Person';data.email='migration-verification@example.com';});
 mutate(3,data=>{data[0].text='Migration Verification Recommendation';});
 mutate(4,data=>{data.recordedCounts.downloads=12345;});
 mutate(5,data=>{data.blocks.the_constraint_environment_cs_body='Migration Verification Case Study';});
 mutate(6,data=>{data[0].title='Migration Verification Featured';});
 mutate(7,data=>{data[0].title='Migration Verification Research';});
 mutate(8,data=>{data[0].label='Migration Verification Skills';data[0].technologies[0].name='Migration Verification Technology';});
 mutate(9,data=>{data['what-it-takes-to-leave-a-system-alone'].title='Migration Verification Article';data['what-it-takes-to-leave-a-system-alone'].datePublished='2026-01-15';});
 mutate(10,data=>{data.biography.background='Migration Verification Biography';});
 mutate(11,data=>{data.hard_problems_welcome='Migration Verification Contact';});
 mutate(12,data=>{data.statusLabels.client='Migration Verification Client Status';});
 mutate(13,data=>{data.the_trajectory='Migration Verification Experience';});
 console.log('Building temporary source edits to verify real renderer propagation…');
 // The guide is generated before copying public assets into the build.
 const guide=spawnSync(process.execPath,['scripts/sync-discovery.mjs'],{encoding:'utf8'});assert.equal(guide.status,0,guide.stderr);
 build();sync();
 for(const route of ['']){
  const body=rendered(route);
  for(const marker of ['Migration Verification Role','Migration Verification Project','Migration Verification Recommendation','12,345 Downloads','Migration Verification Featured','Migration Verification Research','Migration Verification Skills','Migration Verification Technology','Migration Verification Biography','Migration Verification Contact','Migration Verification Client Status','Migration Verification Experience','9×'])assert.ok(body.includes(marker),route+' missing source edit '+marker);
  const nodes=load(route),person=nodes.filter(n=>n.tagName==='script').map(n=>(n.childNodes||[]).map(c=>c.value||'').join('')).filter(s=>s.startsWith('{')).map(s=>{try{return JSON.parse(s);}catch{return null;}}).find(s=>s?.['@type']==='Person');
  assert.equal(person.name,'Migration Person');assert.equal(person.jobTitle,'Migration Verification Role');assert.equal(person.email,'migration-verification@example.com');
  assert.ok(nodes.some(n=>n.tagName==='a'&&n.attrs.some(a=>a.name==='href'&&a.value==='mailto:migration-verification@example.com')),'Changed email link');
 }
 for(const route of ['work/hsbc'])for(const marker of ['Migration Verification Case Study','9×'])assert.ok(rendered(route).includes(marker),route+' case-study source '+marker);
 assert.ok(fs.readFileSync('dist/llms.txt','utf8').includes('Migration Verification Role'),'Discovery reading guide');
 for(const route of ['articles','articles/what-it-takes-to-leave-a-system-alone'])for(const marker of ['Migration Verification Article','January 2026'])assert.ok(rendered(route).includes(marker),route+' article source '+marker);
 assert.ok(fs.readFileSync('dist/articles/what-it-takes-to-leave-a-system-alone/index.html','utf8').includes('<title>Migration Verification Article - Migration Person</title>'),'Derived article page title');
 const rss=fs.readFileSync('dist/rss.xml','utf8');assert.ok(rss.includes('Migration Verification Article'),'RSS title source');assert.ok(rss.includes('15 Jan 2026'),'RSS date source');
 passed=true;
}finally{
 for(const[file,bytes]of originals)fs.writeFileSync(file,bytes);
 console.log('Restored source files; rebuilding the original portfolio…');
 const guide=spawnSync(process.execPath,['scripts/sync-discovery.mjs'],{encoding:'utf8'});assert.equal(guide.status,0,guide.stderr);
 build();sync();
 for(const[file,bytes]of originals)assert.deepEqual(fs.readFileSync(file),bytes,'Source restored: '+file);
}
if(passed)console.log('Render integration passed: all homepage sections, shared metrics and identity, article metadata/dates/RSS; original data and static build restored.');
