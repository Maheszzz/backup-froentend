import pgLocations from '@/data/pg-locations.json';

/** Longest-first so `koramangala-4th-block` wins over `koramangala`. */
const PG_LOCALITY_SLUGS = [...pgLocations.map((r) => r.slug)].sort((a, b) => b.length - a.length);

/**
 * Infer `/pg/{locality}` hub from a property slug segment (e.g. `202-foo-pg-marathahalli`).
 */
export function inferPgLocalityHubFromPropertySlug(slugParam: string | undefined): string | null {
    if (!slugParam) return null;
    const tail = slugParam.replace(/^\d+-/, '').toLowerCase();
    if (!tail) return null;
    for (const locSlug of PG_LOCALITY_SLUGS) {
        if (tail.includes(locSlug)) {
            return `/pg/${locSlug}`;
        }
    }
    return null;
}

/** Static 301 map for known removed listings (extend as needed). */
const STATIC_PG_PROPERTY_REDIRECTS: Record<string, string> = {};

export function getStaticPgPropertyRedirect(slugParam: string): string | null {
    const key = slugParam.toLowerCase();
    return STATIC_PG_PROPERTY_REDIRECTS[key] ?? null;
}
