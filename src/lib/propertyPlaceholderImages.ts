import type { RealtyProperty } from '@/types/api';

const UNSPLASH = (id: string) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

/**
 * Verified Unsplash photo IDs (HTTP 200). Invalid IDs were removed after 404 checks.
 */
const VERIFIED_INTERIOR = [
    'photo-1555854877-bab0e564b8d5',
    'photo-1522708323590-d24dbb6b0267',
    'photo-1502672260266-1c1ef2d93688',
    'photo-1493809842364-78817add7ffb',
    'photo-1586023492125-27b2c045efd7',
    'photo-1554995207-c18c203602cb',
    'photo-1484154218962-a197022b5858',
    'photo-1616594039964-ae9021a400a0',
    'photo-1600585154340-be6161a56a0c',
    'photo-1600566753190-17f0baa2a6c3',
    'photo-1600210492486-724fe5c67fb0',
    'photo-1494526585095-c41746248156',
    'photo-1600585154526-990dced4db0d',
    'photo-1600607687939-ce8a6c25118c',
] as const;

const VERIFIED_EXTERIOR = [
    'photo-1500382017468-9049fed747ef',
    'photo-1560518883-ce09059eeffa',
    'photo-1600596542815-ffad4c1539a9',
    'photo-1564013799919-ab600027ffc6',
    'photo-1582268611958-ebfd161ef9cf',
] as const;

const PG_POOL = [...VERIFIED_INTERIOR, ...VERIFIED_EXTERIOR].map(UNSPLASH);
const RK_POOL = VERIFIED_INTERIOR.map(UNSPLASH);
const BHK_POOL = [...VERIFIED_INTERIOR, ...VERIFIED_EXTERIOR].map(UNSPLASH);
const PLOT_POOL = VERIFIED_EXTERIOR.map(UNSPLASH);
const VILLA_POOL = [
    UNSPLASH('photo-1600607687939-ce8a6c25118c'),
    UNSPLASH('photo-1600585154526-990dced4db0d'),
    UNSPLASH('photo-1600596542815-ffad4c1539a9'),
    UNSPLASH('photo-1582268611958-ebfd161ef9cf'),
    UNSPLASH('photo-1564013799919-ab600027ffc6'),
];

function numericSeed(id: RealtyProperty['id']): number {
    if (typeof id === 'number' && Number.isFinite(id)) return Math.trunc(id);
    const s = String(id ?? 0);
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
}

function poolForPropertyType(propertyType: string | undefined): string[] {
    const pt = (propertyType || '').toLowerCase();
    if (pt === 'pg') return PG_POOL;
    if (pt === 'plot') return PLOT_POOL;
    if (pt === 'villa' || pt === '4bhk') return VILLA_POOL;
    if (pt === '1rk') return RK_POOL;
    if (pt === '1bhk' || pt === '2bhk' || pt === '3bhk') return BHK_POOL;
    return BHK_POOL;
}

function pickFromPool(pool: string[], seed: number, offset = 0): string {
    const idx = (seed + offset) % pool.length;
    return pool[idx < 0 ? idx + pool.length : idx]!;
}

/** Stable, unique placeholder URLs per listing (for cards + PDP when API has no images). */
export function getPropertyPlaceholderImages(item: RealtyProperty): {
    primary: string;
    gallery: string[];
} {
    const pool = poolForPropertyType(item.property_type);
    const seed = numericSeed(item.id);
    const primary = pickFromPool(pool, seed, 0);
    const gallery: string[] = [];
    const galleryCount = Math.min(5, pool.length);
    for (let i = 0; i < galleryCount; i++) {
        const url = pickFromPool(pool, seed, i);
        if (!gallery.includes(url)) gallery.push(url);
    }
    if (!gallery.includes(primary)) gallery.unshift(primary);
    return { primary, gallery };
}

/** Next fallback when primary URL fails to load (different offset). */
export function getPropertyPlaceholderFallback(
    item: Pick<RealtyProperty, 'id' | 'property_type'>,
    failedUrl?: string,
): string {
    const pool = poolForPropertyType(item.property_type);
    const seed = numericSeed(item.id);
    for (let offset = 1; offset < pool.length; offset++) {
        const url = pickFromPool(pool, seed, offset);
        if (url !== failedUrl) return url;
    }
    return pickFromPool(pool, seed, 1);
}
