/**
 * Generate AVIF/WebP hero assets from source JPG (<150 KB targets).
 * Source lives in scripts/assets/ (not public/) so the 2.7 MB JPG is never deployed.
 * Run: node scripts/optimize-hero-images.mjs
 */
import { copyFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(root, 'scripts/assets');
const sourceInAssets = join(assetsDir, 'hero-sunset-source.jpg');
const legacyPublicJpg = join(root, 'public/images/blog/hero-sunset.jpg');
const outDir = join(root, 'public/images/blog');
const deployedJpg = join(outDir, 'hero-sunset.jpg');

function resolveSourcePath() {
    mkdirSync(assetsDir, { recursive: true });
    if (existsSync(sourceInAssets)) return sourceInAssets;
    if (existsSync(legacyPublicJpg)) {
        copyFileSync(legacyPublicJpg, sourceInAssets);
        console.log('Copied hero source to scripts/assets/hero-sunset-source.jpg');
        return sourceInAssets;
    }
    console.error('Missing hero source. Add scripts/assets/hero-sunset-source.jpg');
    console.error('(or place hero-sunset.jpg in public/images/blog/ once to migrate)');
    process.exit(1);
}

async function main() {
    const input = resolveSourcePath();
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

    mkdirSync(outDir, { recursive: true });
    for (const [name, pipeline] of tasks) {
        const out = join(outDir, name);
        const info = await pipeline.toFile(out);
        console.log(`${name}: ${(info.size / 1024).toFixed(1)} KB`);
    }

    if (existsSync(deployedJpg)) {
        unlinkSync(deployedJpg);
        console.log('Removed public/images/blog/hero-sunset.jpg from deploy bundle (use AVIF/WebP only).');
    }

    console.log('Done.');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
