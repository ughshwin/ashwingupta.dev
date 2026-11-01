import fs from 'node:fs';
import { captureSite, captureProtectedSources } from './content-snapshot.mjs';
fs.mkdirSync('docs/content-migration', { recursive: true });
fs.writeFileSync('docs/content-migration/before.json', JSON.stringify({ pages: captureSite(), protectedSources: captureProtectedSources() }, null, 2) + '\n');
console.log('Captured pre-migration rendered content and protected page scripts/styles.');
