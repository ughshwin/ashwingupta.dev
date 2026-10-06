import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { ORIGIN, pages } from './verify-seo-live.mjs';

const endpoint = 'https://api.indexnow.org/indexnow';
const keyPath = '/indexnow-key.txt';

export function submission() {
  const key = fs.readFileSync('public' + keyPath, 'utf8').trim();
  assert.match(key, /^[a-zA-Z0-9-]{8,128}$/, 'Invalid IndexNow ownership key');
  const urlList = [...new Set(pages.map(page => ORIGIN + page))];
  assert.ok(urlList.length > 0 && urlList.length <= 10000);
  for (const url of urlList) {
    const parsed = new URL(url);
    assert.equal(parsed.origin, ORIGIN, 'Only the canonical production host may be submitted');
    assert.ok(!parsed.hash && !parsed.search, 'Only canonical document URLs may be submitted');
  }
  return { host: new URL(ORIGIN).host, key, keyLocation: ORIGIN + keyPath, urlList };
}

export async function notifyIndexNow({ dryRun = false, fetchImpl = fetch } = {}) {
  const payload = submission();
  if (dryRun) return { submitted: false, endpoint, keyLocation: payload.keyLocation, urls: payload.urlList };

  // Fail before notifying search engines if the release does not own this key yet.
  const verification = await fetchImpl(payload.keyLocation, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
  assert.equal(verification.status, 200, 'Deploy the IndexNow ownership file before submitting URLs');
  assert.equal((await verification.text()).trim(), payload.key, 'Production IndexNow key differs from this checkout');

  const response = await fetchImpl(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
  });
  assert.ok([200, 202].includes(response.status), `IndexNow rejected the notification (HTTP ${response.status})`);
  return { submitted: true, status: response.status, urls: payload.urlList.length, keyValidationPending: response.status === 202 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    console.log(JSON.stringify(await notifyIndexNow({ dryRun: process.argv.includes('--dry-run') }), null, 2));
    console.log('An accepted notification requests discovery; it does not confirm indexing or ranking.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
