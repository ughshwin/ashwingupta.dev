import fs from 'node:fs';
import assert from 'node:assert/strict';
import { profile, experience, currentEmployment, contentFacts } from './portfolio-data.mjs';
import { resolveReferences } from '../src/content/portfolio/references.mjs';

const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
const date=value=>{const[y,m,d]=value.split('-').map(Number);return `${d?d+' ':''}${months[m-1]} ${y}`;};
const previousEmployment=experience.find(e=>e.id===profile.previousEmploymentId);
assert.ok(previousEmployment?.end,'A previous completed employment record is required by the reading guide');
const template=fs.readFileSync('src/content/portfolio/discovery/llms.template.md','utf8');
const output=resolveReferences(template,{
 ...contentFacts, profile, currentEmployment, previousEmployment,
 currentStart:date(currentEmployment.start), previousPeriod:`${date(previousEmployment.start)}–${date(previousEmployment.end)}`,
});
if(process.argv.includes('--check'))assert.equal(fs.readFileSync('public/llms.txt','utf8').replace(/\r\n/g,'\n'),output.replace(/\r\n/g,'\n'),'Reading-guide drift: run npm run sync:seo');
else fs.writeFileSync('public/llms.txt',output);
console.log('Reading guide matches canonical portfolio facts.');
