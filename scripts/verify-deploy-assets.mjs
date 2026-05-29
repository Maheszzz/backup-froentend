/**
 * Fail build/deploy if LCP hero assets are missing from dist/public.
 */
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const publicDir = process.argv.includes('--dist')
    ? join(root, 'dist/public/images/blog')
    : join(root, 'public/images/blog');

const required = [
    'hero-sunset.avif',
    'hero-sunset.webp',
    'hero-sunset-mobile.avif',
    'hero-sunset-mobile.webp',
];

const missing = required.filter((f) => !existsSync(join(publicDir, f)));
if (missing.length > 0) {
    console.error('❌ Missing optimized hero assets:', missing.join(', '));
    console.error('   Run: npm run optimize:hero');
    process.exit(1);
}

const jpg = join(publicDir, 'hero-sunset.jpg');
if (existsSync(jpg)) {
    const mb = statSync(jpg).size / (1024 * 1024);
    if (mb > 0.5) {
        console.warn(
            `⚠️  hero-sunset.jpg is still ${mb.toFixed(1)} MB in ${publicDir} — ensure the app never preloads it (use AVIF/WebP only).`,
        );
    }
}

console.log('✅ Hero AVIF/WebP assets present.');
