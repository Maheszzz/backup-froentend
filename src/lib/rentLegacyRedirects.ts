import locJson from '@/data/pg-locations.json';
import { RENT_HUB_LOCATION_SLUGS } from '@/data/rentHubSlugs';

/** Hub segment used in legacy URLs `/rent-in-{hubSlug}` (matches sitemap / generate-sitemap). */
function rentInHubSegmentForRow(slug: string): string {
    return slug === 'btm' ? 'btm-layout' : slug;
}

/**
 * Maps `/rent-in-:segment` to canonical `/rent/{locationSlug}` or null if unknown.
 */
export function canonicalRentPathForRentInSegment(segment: string): string | null {
    const lower = segment.toLowerCase();
    for (const row of locJson as { slug: string }[]) {
        if (!RENT_HUB_LOCATION_SLUGS.includes(row.slug)) continue;
        if (rentInHubSegmentForRow(row.slug) === lower) {
            return `/rent/${row.slug}`;
        }
    }
    return null;
}
