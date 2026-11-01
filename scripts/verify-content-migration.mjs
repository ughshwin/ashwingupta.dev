import fs from 'node:fs';
import assert from 'node:assert/strict';
import { captureSite, captureProtectedSources } from './content-snapshot.mjs';

const baseline=JSON.parse(fs.readFileSync('docs/content-migration/before.json','utf8'));
const actual=captureSite();
const stableText=s=>s.replace(/\d{2}:\d{2}:\d{2}/g,'[clock]');
const expectedText=(route,s)=>{
  // The layout studies contained a stale current title and abbreviated IISc
  // company spelling. They now use the authoritative experience identities.
  if(/^\/editions\/(gazette|fieldnotes|review)$/.test(route))s=s.replaceAll('SkanAIAI Engineer','SkanAISoftware Engineer 1').replaceAll('AI Engineer at SkanAI','Software Engineer 1 at SkanAI').replaceAll('AI Engineer, SkanAI','Software Engineer 1, SkanAI').replaceAll('IISc · NMCAD Lab','IISc - NMCAD Lab');
  return stableText(s);
};
assert.deepEqual(Object.keys(actual),Object.keys(baseline.pages),'Identical generated route inventory');
const failures=[];
for(const[route,before]of Object.entries(baseline.pages)){
  for(const key of ['text','title','description','canonical','schemas','headings','links','images','diagrams']){
    let expected=before[key],received=actual[route][key];
    if(key==='text'){expected=expectedText(route,expected);received=stableText(received);}
    if(key==='headings')expected=expected.map(([tag,text,id])=>[tag,expectedText(route,text),id]);
    if(JSON.stringify(expected)!==JSON.stringify(received))failures.push(route+' '+key);
  }
}
assert.deepEqual(failures,[],'Rendered content migration regressions');
assert.deepEqual(captureProtectedSources(),baseline.protectedSources,'All original page runtime scripts and scoped styles preserved');
console.log(`Migration parity passed: ${Object.keys(actual).length} routes; exact text, headings, links, assets, metadata and diagram sources; all page scripts/styles unchanged. Live clock values excluded; layout-study identities corrected.`);
