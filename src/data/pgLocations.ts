import locations from './pg-locations.json';

export interface PgLocation {
    slug: string;
    name: string;
}

export const PG_LOCATIONS: PgLocation[] = locations;

/** 301-style client redirects for legacy `/pg/:slug` URLs after slug renames. */
export const LEGACY_PG_SLUG_REDIRECTS: Record<string, string> = {
    'btm-layout': 'btm',
    sarjapur: 'sarjapur-road',
    'hsr-sector-1': 'hsr-layout',
    'hsr-sector-2': 'hsr-layout',
    'hsr-sector-7': 'hsr-layout',
    'manyata-tech-park': 'hebbal',
    'itpl': 'whitefield',
    kundalahalli: 'marathahalli',
};

/** Resolve legacy slug → canonical slug, or undefined if unknown. */
export function resolveLegacyPgSlug(raw: string | undefined): string | undefined {
    if (!raw) return undefined;
    const s = raw.toLowerCase().trim();
    return LEGACY_PG_SLUG_REDIRECTS[s];
}

/** Location names for property filter dropdown (includes Bangalore). */
export const PROPERTY_CITY_OPTIONS: string[] = [
    'Bangalore',
    'Hyderabad',
    'Pune',
    ...[...new Set(PG_LOCATIONS.map((l) => l.name))].sort((a, b) => a.localeCompare(b)),
];

export function getPgLocationBySlug(slug: string | undefined): PgLocation | undefined {
    if (!slug) return undefined;
    const s = slug.toLowerCase().trim();
    return PG_LOCATIONS.find((l) => l.slug === s);
}

export function getPgLocationSlugs(): string[] {
    return PG_LOCATIONS.map((l) => l.slug);
}

/**
 * Map free-text area (e.g. API location) to a known PG locality — longest name match wins.
 */
export function findPgLocationForArea(areaRaw: string | undefined): PgLocation | undefined {
    if (!areaRaw?.trim()) return undefined;
    const norm = areaRaw.toLowerCase().replace(/\s+/g, ' ').trim();
    let best: PgLocation | undefined;
    let bestLen = 0;
    for (const loc of PG_LOCATIONS) {
        const name = loc.name.toLowerCase();
        if (name && norm.includes(name) && name.length > bestLen) {
            best = loc;
            bestLen = name.length;
        }
    }
    return best;
}
