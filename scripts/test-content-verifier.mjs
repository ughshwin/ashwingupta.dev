import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {verifyContent} from './verify-content.mjs';
import {allowsPath} from './crawler-policy.mjs';

assert.equal(allowsPath('User-agent: *\nAllow: /\nUser-agent: Claude-SearchBot\nDisallow: /research/', 'Claude-SearchBot','/research/pinns'),false);
assert.equal(allowsPath('User-agent: *\nDisallow: /work/\nAllow: /work/hsbc', 'Googlebot','/work/hsbc'),true);
assert.equal(allowsPath('User-agent: *\nDisallow: /work/*$','bingbot','/work/hsbc'),false);
assert.equal(allowsPath('User-agent: *\nDisallow: /\nUser-agent: Googlebot\nAllow: /','Googlebot','/'),true);
assert.equal(allowsPath('User-agent: Googlebot\nDisallow:\nUser-agent: Claude-SearchBot\nDisallow: /','Googlebot','/'),true);

const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'portfolio-content-test-'));
try {
  fs.cpSync('dist',fixture,{recursive:true});
  assert.equal(verifyContent(fixture).length,14);
  const home=path.join(fixture,'index.html');const good=fs.readFileSync(home,'utf8');
  for(const [label,mutate] of [
    ['missing landmark',s=>s.replace('role="main"','')],
    ['broken link',s=>s.replace('href="/work/hsbc"','href="/work/missing"')],
    ['missing experience',s=>s.replaceAll('OutLawed','Removed employer')],
    ['missing anchor',s=>s.replace('href="/work/hsbc"','href="/work/hsbc#missing"')],
    ['indexing blocked',s=>s.replace('content="index, follow, max-snippet:-1, max-image-preview:large"','content="noindex"')],
  ]){
    fs.writeFileSync(home,mutate(good));
    assert.throws(()=>verifyContent(fixture),undefined,label+' must be rejected');
    fs.writeFileSync(home,good);
  }
  console.log('Content verifier tests passed: valid build, robot precedence, missing landmarks/experience, indexing blocks, broken links and anchors.');
} finally {
  // Remove only the exact unique fixture created above, directly within the OS temp folder.
  assert.equal(path.dirname(path.resolve(fixture)),path.resolve(os.tmpdir()));
  assert.ok(path.basename(fixture).startsWith('portfolio-content-test-'));
  fs.rmSync(fixture,{recursive:true,force:true});
}
