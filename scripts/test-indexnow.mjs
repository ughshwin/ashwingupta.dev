import assert from 'node:assert/strict';
import { notifyIndexNow, submission } from './notify-indexnow.mjs';

const payload = submission();
let requests = [];
const fetchImpl = async (url, options) => {
  requests.push({ url, options });
  return url === payload.keyLocation
    ? new Response(payload.key + '\n', { status: 200 })
    : new Response(null, { status: 200 });
};
const preview = await notifyIndexNow({ dryRun: true, fetchImpl });
assert.equal(preview.submitted, false);
assert.equal(requests.length, 0, 'Dry run must make no network requests');
assert.ok(preview.urls.includes('https://www.ashwingupta.dev/articles/what-it-takes-to-leave-a-system-alone'));
assert.ok(!preview.urls.some(url => /\/projects(?:\/|$)/.test(url)), 'Do not submit aliases or legacy redirects');

let result = await notifyIndexNow({ fetchImpl });
assert.equal(result.submitted, true);
assert.equal(requests[0].url, payload.keyLocation, 'Verify deployed ownership before submission');
assert.equal(requests[1].url, 'https://api.indexnow.org/indexnow');
assert.equal(requests[1].options.method, 'POST');
assert.deepEqual(JSON.parse(requests[1].options.body), payload);

for (const [status, body] of [[404, ''], [200, 'wrong-key'], [308, payload.key]]) {
  let calls = 0;
  await assert.rejects(notifyIndexNow({ fetchImpl: async () => { calls++; return new Response(body, { status }); } }));
  assert.equal(calls, 1, 'Invalid ownership must prevent the submission request');
}
result = await notifyIndexNow({ fetchImpl: async url => url === payload.keyLocation ? new Response(payload.key) : new Response(null, { status: 202 }) });
assert.equal(result.keyValidationPending, true, '202 means key validation is pending');
await assert.rejects(notifyIndexNow({ fetchImpl: async url => url === payload.keyLocation ? new Response(payload.key) : new Response(null, { status: 429 }) }), /HTTP 429/);
console.log('IndexNow tests passed: offline preview, canonical URLs, deployed ownership, request payload, pending validation, and rejected notifications.');
