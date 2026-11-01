import http from 'node:http';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {verifyLive,projectRoutes,ORIGIN} from './verify-seo-live.mjs';
let defect='';
const server=http.createServer((req,res)=>{
  const p=new URL(req.url,'http://localhost').pathname;
  if(p!=='/'&&p.endsWith('/')){res.writeHead(defect==='slash'?307:308,{location:p.slice(0,-1)});res.end();return;}
  if(p.startsWith('/projects/')&&projectRoutes[p.slice(10)]){
    res.writeHead(defect==='redirect'?302:301,{location:projectRoutes[p.slice(10)]});res.end();return;
  }
  if(p==='/research'){res.writeHead(301,{location:'/projects'});res.end();return;}
  const file='dist'+(p==='/'?'/index.html':p.endsWith('.xml')||p.endsWith('.txt')?p:p+'/index.html');
  if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}
  let body=fs.readFileSync(file,'utf8');
  if(defect==='robots-specific'&&p==='/robots.txt')body+='\nUser-agent: Claude-SearchBot\nDisallow: /research/\n';
  if(defect==='deep-crawler'&&p==='/research/scholaros'&&req.headers['user-agent']==='Claude-User'){res.writeHead(403);res.end();return;}
  if(defect==='canonical'&&p==='/')body=body.replace('rel="canonical" href="'+ORIGIN+'/"','rel="canonical" href="'+ORIGIN+'/wrong"');
  if(defect==='date')body=body.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g,(_match,open,json,close)=>{
    const schema=JSON.parse(json);delete schema.datePublished;return open+JSON.stringify(schema)+close;
  });
  if(defect==='crawler'&&req.headers['user-agent']==='OAI-SearchBot'){res.writeHead(403);res.end();return;}
  res.writeHead(200,{'content-type':p.endsWith('.xml')?'application/xml':p.endsWith('.txt')?'text/plain':'text/html'});res.end(body);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try{
  const base='http://127.0.0.1:'+server.address().port;
  let result=await verifyLive({base});
  assert.deepEqual(result.filter(r=>!r.ok),[],'Known-good HTTP fixture must pass');
  for(defect of ['canonical','date','redirect','crawler','robots-specific','deep-crawler','slash']){
    result=await verifyLive({base});
    assert.ok(result.some(r=>!r.ok),'Checker must reject '+defect+' regression');
  }
  console.log('HTTP verifier tests passed: valid site accepted; wrong canonical, missing dates, incorrect redirect status, blocked crawlers, crawler-specific robots rules, and deep-page blocking rejected.');
}finally{await new Promise(resolve=>server.close(resolve));}
