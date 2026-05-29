/**
 * Locality slugs used for rent hub pages: canonical path `/rent/{slug}`.
 * Keep in sync with `scripts/generate-sitemap.mjs` (`rentAreas`).
 */
export const RENT_HUB_LOCATION_SLUGS: readonly string[] = [
    'whitefield',
    'marathahalli',
    'btm',
    'koramangala',
    'hsr-layout',
    'electronic-city',
    'indiranagar',
    'bellandur',
    'hebbal',
    'jp-nagar',
    'bannerghatta-road',
    'sarjapur-road',
    'hyderabad',
    'pune',
] as const;
