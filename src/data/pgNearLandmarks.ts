/** Programmatic “PG near {landmark}” hubs — map to a primary locality slug for listings + internal links. */
export interface PgNearLandmarkEntry {
    /** URL segment: `/pg-near-ecospace` */
    path: string;
    /** Landmark phrase for titles and copy */
    landmark: string;
    /** Primary PG locality slug from `pg-locations.json` */
    hubSlug: string;
    /** Optional commute / context line */
    context: string;
}

export const PG_NEAR_LANDMARKS: PgNearLandmarkEntry[] = [
    {
        path: 'pg-near-ecospace',
        landmark: 'Ecospace & RMZ Ecoworld',
        hubSlug: 'bellandur',
        context: 'Bellandur–Sarjapur ORR belt; heavy IT footfall — book early for single rooms.',
    },
    {
        path: 'pg-near-rmz-ecoworld',
        landmark: 'RMZ Ecoworld',
        hubSlug: 'bellandur',
        context: 'Short walk or quick shuttle routes from Bellandur side PGs.',
    },
    {
        path: 'pg-near-wipro-ecity',
        landmark: 'Wipro & Electronic City Phase 1',
        hubSlug: 'electronic-city',
        context: 'Best for Infosys/Wipro/Biocon corridor commuters.',
    },
    {
        path: 'pg-near-manyata',
        landmark: 'Manyata Tech Park',
        hubSlug: 'hebbal',
        context: 'North Bangalore tech hub — compare Hebbal and Nagawara pockets.',
    },
    {
        path: 'pg-near-itpl',
        landmark: 'ITPL & Brookefield',
        hubSlug: 'whitefield',
        context: 'East Bangalore IT corridor — check metro last-mile from Kadugodi.',
    },
    {
        path: 'pg-near-embassy-techvillage',
        landmark: 'Embassy Tech Village',
        hubSlug: 'bellandur',
        context: 'ORR core — demand stays high; verify meal plans and WiFi fair-use.',
    },
    {
        path: 'pg-near-ecity-phase-2',
        landmark: 'Electronic City Phase 2',
        hubSlug: 'electronic-city',
        context: 'Often quieter blocks with competitive rent vs Phase 1.',
    },
    {
        path: 'pg-near-prestige-tech-park',
        landmark: 'Prestige Tech Park (Marathahalli)',
        hubSlug: 'marathahalli',
        context: 'Marathahalli–Kundalahalli micro-market; strong PG supply.',
    },
];

export function getPgNearLandmarkByPath(pathname: string): PgNearLandmarkEntry | undefined {
    const seg = pathname.replace(/^\/+|\/+$/g, '');
    return PG_NEAR_LANDMARKS.find((e) => e.path === seg);
}
