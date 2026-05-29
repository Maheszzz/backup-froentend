import type { FaqItem } from '@/lib/schema';

export interface LocalityRentBand {
    shared: string;
    single: string;
    note?: string;
}

export interface LocalityComparisonRef {
    slug: string;
    name: string;
    pairSlug: string;
    blurb: string;
}

export interface PgLocalityDeepProfile {
    slug: string;
    name: string;
    /** Lead paragraph for AEO / QuickAnswer (40–80 words). */
    quickAnswer: string;
    rent: LocalityRentBand;
    metro: string;
    commute: string;
    nearbyOffices: string[];
    nearbyColleges: string[];
    bestStreets: string[];
    safety: string;
    foodNightlife: string;
    internet: string;
    idealFor: { students: string; professionals: string };
    entities: string[];
    nearbySlugs: string[];
    landmarkPaths?: string[];
    genderPaths?: boolean;
    blogPaths?: { label: string; path: string }[];
    comparisons: LocalityComparisonRef[];
    extraFaqs: FaqItem[];
}
