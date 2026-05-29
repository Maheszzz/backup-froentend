#!/usr/bin/env node
/**
 * Write public/BingSiteAuth.xml for Bing Webmaster verification.
 *
 * Usage (either):
 *   node scripts/set-bing-auth.mjs <user-code-from-bing>
 *   node scripts/set-bing-auth.mjs --file ~/Downloads/BingSiteAuth.xml
 */
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const out = join(root, 'public', 'BingSiteAuth.xml');
const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Usage: node scripts/set-bing-auth.mjs <bing-user-code>');
    console.error('   or: node scripts/set-bing-auth.mjs --file path/to/BingSiteAuth.xml');
    process.exit(1);
}

let xml;
if (args[0] === '--file') {
    const src = args[1];
    if (!src) {
        console.error('Missing path after --file');
        process.exit(1);
    }
    xml = readFileSync(src, 'utf8').trim();
} else {
    const code = args[0].trim();
    xml = `<?xml version="1.0"?>\n<users>\n\t<user>${code}</user>\n</users>`;
}

if (!xml.includes('<user>')) {
    console.error('Invalid Bing XML — expected a <user> element.');
    process.exit(1);
}

writeFileSync(out, `${xml}\n`, 'utf8');
console.log(`Wrote ${out}`);
console.log('Deploy the site, then click Verify in Bing Webmaster Tools.');
