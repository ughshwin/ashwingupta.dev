import fs from 'node:fs';
import path from 'node:path';
import { darkenWhiteSvg } from '../src/lib/review-svg.mjs';

const map = {};
for (const file of fs.readdirSync('public', { recursive: true }).sort()) {
  const relative = file.replaceAll('\\', '/');
  if (!relative.endsWith('.svg') || relative.startsWith('review-assets/')) continue;
  const original = fs.readFileSync(path.join('public', file), 'utf8');
  const dark = darkenWhiteSvg(original);
  if (dark === original) continue;
  const destination = path.join('public/review-assets', file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, dark);
  map['/' + relative] = '/review-assets/' + relative;
}
fs.writeFileSync('src/lib/review-svg-assets.json', JSON.stringify(map, null, 2) + '\n');
console.log(`Prepared ${Object.keys(map).length} dark SVG variants; original assets retained.`);
