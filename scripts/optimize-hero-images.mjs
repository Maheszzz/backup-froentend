/**
 * Generate AVIF/WebP hero assets from hero-sunset.jpg (<150 KB targets).
 * Run: node scripts/optimize-hero-images.mjs
 */
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const input = join(root, 'public/images/blog/hero-sunset.jpg');
const outDir = join(root, 'public/images/blog');

async function main() {
    if (!existsSync(input)) {
        console.error('Missing', input);
        process.exit(1);
    }
    const sharp = (await import('sharp')).default;

    const tasks = [
        ['hero-sunset.avif', sharp(input).resize(1600, null, { withoutEnlargement: true }).avif({ quality: 42 })],
        ['hero-sunset.webp', sharp(input).resize(1600, null, { withoutEnlargement: true }).webp({ quality: 62 })],
        [
            'hero-sunset-mobile.avif',
            sharp(input).resize(828, null, { withoutEnlargement: true }).avif({ quality: 44 }),
        ],
        [
            'hero-sunset-mobile.webp',
            sharp(input).resize(828, null, { withoutEnlargement: true }).webp({ quality: 65 }),
        ],
    ];

    for (const [name, pipeline] of tasks) {
        const out = join(outDir, name);
        const info = await pipeline.toFile(out);
        console.log(`${name}: ${(info.size / 1024).toFixed(1)} KB`);
    }
    console.log('Done.');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
