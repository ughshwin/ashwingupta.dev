import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { verifyPortfolioData } from './verify-portfolio-data.mjs';
import { resolveReferences } from '../src/content/portfolio/references.mjs';
import { selectCurrentEmployment, experiencePeriod, localDate, redirectRoutes, buildContentFacts } from '../src/content/portfolio/selectors.mjs';

const load=name=>JSON.parse(fs.readFileSync(`src/content/portfolio/${name}.json`,'utf8'));
const experience=load('experience'),projects=load('projects');
const edited=structuredClone(experience),role=selectCurrentEmployment(edited);
role.role='Migration test role';role.company='Migration test company';
const facts={currentEmployment:selectCurrentEmployment(edited),projects:structuredClone(projects.entries)};
facts.projects['hsbc-voice'].displayName='Migration test project';
facts.projects['hsbc-voice'].href='/work/migration-test';
assert.equal(resolveReferences('{{currentEmployment.role}} at {{currentEmployment.company}} / {{projects.hsbc-voice.displayName}}',facts),'Migration test role at Migration test company / Migration test project');
assert.equal(redirectRoutes(facts.projects)['hsbc-voice'],'/work/migration-test');
assert.equal(experiencePeriod({start:'2026-06-15',end:null}),'15 Jun 2026 – Present');
assert.equal(experiencePeriod({start:'2024-06',end:'2026-06-05'}),'Jun 2024 – 5 Jun 2026');
assert.equal(localDate('2026-06-15').getDate(),15,'Dates retain local calendar day');
assert.throws(()=>resolveReferences('{{projects.missing.title}}',facts),/Unknown portfolio reference/);
const sharedFacts=buildContentFacts({profile:load('profile'),experience:edited,projects:facts.projects,kaggle:load('kaggle'),articles:load('articles')});
assert.equal(resolveReferences('{{experience.skan.role}}',sharedFacts),'Migration test role','A historical role references its own identity');
assert.equal(resolveReferences('{{profile.firstName}} {{profile.lastName}}',sharedFacts),load('profile').name,'Shared derived profile identity');
assert.equal(resolveReferences('{{a}}',{a:'{{b}}',b:'nested value'}),'nested value','Nested references resolve');
assert.throws(()=>resolveReferences('{{a}}',{a:'{{b}}',b:'{{a}}'}),/Circular portfolio reference/);
assert.throws(()=>resolveReferences('{{profile.toString}}',sharedFacts),/Unknown portfolio reference/,'Prototype members are not content');
const articleSource=load('articles'),articleId=Object.keys(articleSource)[0];
articleSource[articleId].title='Edited article title';articleSource[articleId].datePublished='2026-01-15';
const articleFacts=buildContentFacts({profile:load('profile'),experience:edited,projects:facts.projects,articles:articleSource});
assert.equal(articleFacts.articles[articleId].date,'January 2026','Article display month derives from evidenced date');
assert.equal(articleFacts.articles[articleId].pageTitle,'Edited article title - '+load('profile').name,'Article SEO title derives from title and profile');
const stored=experience.find(entry=>entry.id==='coforge');
assert.equal(sharedFacts.experience.coforge.period,experiencePeriod(stored),'Featured dates use the same period projection as experience');
// Mutate an isolated fixture to prove validation rejects broken content.
const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'portfolio-data-test-'));
try{
 fs.cpSync('src/content/portfolio',fixture,{recursive:true});
 for(const[name,mutate]of [
  ['experience',d=>d.push({...d[0]})],
  ['experience',d=>{d[0].start='2026-02-30';}],
  ['featured',d=>{d[0].projectId='missing';}],
  ['impact',d=>{d.entries[0].category='missing';}],
  ['profile',d=>{d.alumniIds=['iiitb'];}],
  ['articles',d=>{Object.values(d)[0].datePublished='invalid';}],
  ['about',d=>{d.pillars[0].title='{{projects.missing.title}}';}],
  ['projects',d=>{d.secondaryCardOrder.push('missing');}],
  ['project-details',d=>{Object.values(d)[0].statusTone='missing';}],
  ['featured',d=>{d[0].type='missing';}],
  ['recommendations',d=>{d[1].id=d[0].id;}],
  ['skills',d=>{d[0].technologies[0].icons=['missing-logo.svg'];}],
  ['copy/Contact',d=>{d.links[0].id='missing';}],
  ['currently',d=>{d[0].projectId='missing';}],
  ['copy/About',d=>{d.kaggleMetricsTemplate='{downloads} downloads';}],
 ]){
  const file=path.join(fixture,name+'.json'),original=fs.readFileSync(file,'utf8'),data=JSON.parse(original);mutate(data);fs.writeFileSync(file,JSON.stringify(data));
  assert.throws(()=>verifyPortfolioData(fixture),'Reject malformed '+name);fs.writeFileSync(file,original);
 }
}finally{
 assert.equal(path.dirname(path.resolve(fixture)),path.resolve(os.tmpdir()));assert.ok(path.basename(fixture).startsWith('portfolio-data-test-'));fs.rmSync(fixture,{recursive:true,force:true});
}
console.log('Content mutation checks passed: shared role/project propagation, date precision, missing references and malformed records.');
