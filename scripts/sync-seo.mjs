import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const map=read('src/data/project-routes.json');
const config=read('vercel.json');
const managed=Object.entries(map).map(([slug,destination])=>({source:'/projects/'+slug,destination,statusCode:301}));
const research={source:'/research',destination:'/projects',statusCode:301};
for(const [slug,destination] of Object.entries(map)){
  assert.match(slug,/^[a-z0-9-]+$/);
  assert.match(destination,/^\/(work|research)\/[a-z0-9-]+$/);
  assert.ok(fs.existsSync('src/pages'+destination+'.astro'),'Missing authoritative page: '+destination);
}
const isManaged=r=>r.source.startsWith('/projects/')||r.source==='/research';
const existing=config.redirects??[];
if(process.argv.includes('--check')){
  assert.deepEqual(existing.filter(isManaged),[...managed,research],'Redirect configuration drift: run npm run sync:seo');
  assert.equal(config.buildCommand,'npm run build:verified','Vercel must run the verified build');
  console.log('SEO configuration matches the authoritative project map.');
}else{
  config.redirects=[...existing.filter(r=>!isManaged(r)),...managed,research];
  fs.writeFileSync('vercel.json',JSON.stringify(config,null,2)+'\n');
  console.log('Synchronized project redirects; unrelated Vercel configuration preserved.');
}
