import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { resolveReferences } from '../src/content/portfolio/references.mjs';
import { selectCurrentEmployment, buildContentFacts } from '../src/content/portfolio/selectors.mjs';

export function verifyPortfolioData(root='src/content/portfolio') {
  const read=name=>JSON.parse(fs.readFileSync(path.join(root,name+'.json'),'utf8'));
  const profile=read('profile'),experience=read('experience'),projects=read('projects'),details=read('project-details'),articles=read('articles'),kaggle=read('kaggle');
  const currentEmployment=selectCurrentEmployment(experience),facts=buildContentFacts({profile,experience,projects:projects.entries,articles,kaggle,publications:read('publications'),chrome:read('chrome'),editorial:read('editorial')});
  const nonempty=(value,label)=>assert.ok(typeof value==='string'&&value.trim(),label+' must be nonempty');
  const unique=(values,label)=>assert.equal(new Set(values).size,values.length,label+' must be unique');
  nonempty(profile.name,'Name');assert.match(profile.email,/^[^\s@]+@[^\s@]+\.[^\s@]+$/,'Email');
  assert.ok(profile.siteUrl.endsWith('/'),'Site URL requires trailing slash');
  for(const url of Object.values(profile.socials))assert.equal(new URL(url).protocol,'https:');
  unique(experience.map(e=>e.id),'Experience IDs');
  const validDate=value=>{
    assert.match(value,/^\d{4}-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?$/,'ISO month/day precision');
    if(value.length===10)assert.equal(new Date(value+'T00:00:00Z').toISOString().slice(0,10),value,'Valid calendar date');
  };
  for(const entry of experience){
    for(const field of ['id','company','role'])nonempty(entry[field],'Experience '+field);
    assert.ok(['professional','education'].includes(entry.track),'Experience track');validDate(entry.start);
    if(entry.end!==null){validDate(entry.end);assert.ok(entry.start<=entry.end,'Experience must end after it starts');}
    assert.ok(Array.isArray(entry.bullets)&&entry.bullets.length,'Experience contributions');
  }
  assert.equal(experience.filter(e=>e.track==='professional'&&e.end===null).length,1,'Exactly one current employment record');
  for(const id of [...profile.schemaEmploymentIds,...profile.alumniIds,profile.previousEmploymentId])assert.ok(experience.some(e=>e.id===id),'Unknown profile experience '+id);
  for(const id of profile.alumniIds)assert.equal(experience.find(e=>e.id===id)?.status,'completed','Only completed education belongs in alumni');
  unique(projects.cardOrder,'Project card order');
  unique(projects.secondaryCardOrder,'Secondary project order');
  for(const id of projects.secondaryCardOrder)assert.ok(projects.cardOrder.includes(id),'Secondary cards reference the main catalogue');
  assert.deepEqual(Object.keys(details).sort(),[...projects.cardOrder].sort(),'Every project card has detail content');
  const projectRef=id=>assert.ok(projects.entries[id],'Unknown project reference '+id);
  for(const[id,p]of Object.entries(projects.entries)){
    nonempty(p.title,id+' title');nonempty(p.displayName,id+' display name');
    if(p.href.startsWith('/'))assert.ok(fs.existsSync('src/pages'+p.href+'.astro'),'Missing project page '+p.href);else assert.equal(new URL(p.href).protocol,'https:');
    if(p.github)assert.equal(new URL(p.github).protocol,'https:');
    if(p.whitepaperUrl)assert.ok(fs.existsSync(path.join('public',p.whitepaperUrl)),'Missing project whitepaper '+p.whitepaperUrl);
    if(p.publicationUrl)assert.equal(new URL(p.publicationUrl).protocol,'https:');
    for(const[key,value]of Object.entries(p.metrics??{}))nonempty(resolveReferences(value,facts),'Project metric '+id+'.'+key);
  }
  const projectCopy=read('copy/Projects');
  for(const tone of ['award','client','completed','development'])nonempty(projectCopy.statusLabels[tone],'Project status label '+tone);
  for(const id of projects.cardOrder){
    projectRef(id);const d=details[id];
    assert.equal(d.summary.length,projectCopy.summaryLabels.length,id+' summary has one item per narrative stage');
    assert.ok(d.bullets.length,id+' complete account');nonempty(d.logo,id+' logo');
    assert.ok(['award','client','completed','development'].includes(d.statusTone),'Unknown project status '+id);
    for(const duplicate of ['github','status','devStatus'])assert.ok(!(duplicate in d),'Duplicate project field '+duplicate+' in '+id);
  }
  for(const section of ['featured','research']){
    const sectionCopy=read('copy/'+(section==='featured'?'Featured':'Research'));
    for(const item of read(section)){
      projectRef(item.projectId);
      assert.ok(Object.hasOwn(sectionCopy.typeLabels,item.type),'Unknown '+section+' card type');
      assert.equal(item.bullets.length,sectionCopy.stageLabels.length,section+' narrative has one item per stage');
    }
  }
  const impact=read('impact');unique(impact.order,'Impact categories');assert.deepEqual([...impact.order].sort(),Object.keys(impact.categories).sort());
  for(const entry of impact.entries){
    assert.ok(impact.categories[entry.category],'Unknown impact category');
    if(entry.projectId)projectRef(entry.projectId);
    else if(!entry.liveStat)nonempty(entry.item,'Impact source');
    nonempty(resolveReferences(entry.label,facts),'Impact label');
    assert.ok(entry.magnitude>=1&&entry.magnitude<=5,'Impact magnitude');
    if(entry.liveStat)assert.ok(entry.liveStat in kaggle.recordedCounts,'Unknown live statistic');else nonempty(entry.value,'Impact value');
  }
  for(const count of Object.values(kaggle.recordedCounts))assert.ok(Number.isSafeInteger(count)&&count>=0,'Recorded Kaggle count');
  assert.match(kaggle.datasetRef,/^[\w-]+\/[\w-]+$/,'Kaggle identity');
  for(const[id,a]of Object.entries(articles)){
    assert.equal(id,a.slug);nonempty(a.title,'Article title');nonempty(a.source,'Publication provenance');
    validDate(a.datePublished);assert.equal(a.datePublished.length,10,'Article RSS needs an evidenced publication day');
    assert.ok(fs.existsSync(`src/pages/articles/${id}.astro`),'Missing article page');
    nonempty(resolveReferences(facts.articles[id].description,facts),'Article description');
  }
  const achievements=read('achievements'),achievementCopy=read('copy/About');
  unique(achievements.map(item=>item.id),'Achievement IDs');
  for(const token of ['{downloads}','{views}'])assert.ok(achievementCopy.kaggleMetricsTemplate.includes(token),'Achievement metric template needs '+token);
  for(const item of achievements){
    for(const field of ['id','icon','time'])nonempty(item[field],'Achievement '+field);
    if(item.live){assert.equal(item.live,'kaggle');nonempty(kaggle.datasetName,'Kaggle dataset display name');}
    else {nonempty(item.title,'Achievement title');nonempty(item.sub,'Achievement subtitle');}
  }
  const recommendations=read('recommendations');unique(recommendations.map(rec=>rec.id),'Recommendation IDs');
  for(const rec of recommendations)for(const field of ['id','name','title','company','relationship','date','text'])nonempty(rec[field],'Recommendation '+field);
  const skills=read('skills');unique(skills.map(category=>category.id),'Skill category IDs');
  for(const category of skills){
    nonempty(category.id,'Skill category ID');nonempty(category.label,'Skill category label');
    assert.ok(category.technologies.length,'Skill category technologies');
    unique(category.technologies.map(tech=>tech.name),'Technology names within '+category.id);
    for(const tech of category.technologies){
      nonempty(tech.name,'Technology name');assert.ok(tech.icons.length,'Technology icons');
      for(const icon of tech.icons){assert.equal(path.basename(icon),icon,'Technology icon uses a filename');assert.ok(fs.existsSync(path.join('public/logos',icon)),'Missing technology icon '+icon);}
      if(tech.detail!==undefined)nonempty(tech.detail,'Technology detail');
    }
  }
  const contact=resolveReferences(read('copy/Contact'),facts),contactIds=['resume','email','github','linkedin','kaggle','location'];
  unique(contact.links.map(link=>link.id),'Contact link IDs');
  assert.deepEqual(contact.links.map(link=>link.id).sort(),contactIds.sort(),'Every contact icon has a supported row');
  for(const link of contact.links){
    nonempty(link.label,'Contact label');nonempty(link.value,'Contact value');
    assert.ok(Boolean(link.href)!==Boolean(link.asset),'Contact has one destination source');
    if(link.asset)assert.equal(link.asset,'resume','Supported downloadable contact asset');
    if(link.valueFormat)assert.equal(link.valueFormat,'url','Supported contact display formatter');
  }
  for(const item of read('currently')){projectRef(item.projectId);nonempty(resolveReferences(item.label,facts),'Current work label');nonempty(item.detail,'Current work description');}
  const editorial=read('editorial');editorial.work.forEach(item=>projectRef(item.projectId));editorial.experience.forEach(item=>assert.ok(experience.some(e=>e.id===item.experienceId),'Unknown editorial experience'));editorial.writing.forEach(item=>assert.ok(articles[item.articleId],'Unknown editorial article'));
  // Check every authored JSON record, including references nested in structured
  // section data. All renderers and build tools use this same reference context.
  let documents=0;
  for(const name of fs.readdirSync(root,{recursive:true}).filter(n=>n.endsWith('.json'))){
    const data=JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
    resolveReferences(data,facts);
    if(/^(documents|copy)[\\/]/.test(name))documents++;
  }
  return {experience:experience.length,projects:Object.keys(projects.entries).length,articles:Object.keys(articles).length,documents};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log('Portfolio data checks passed:',verifyPortfolioData());
