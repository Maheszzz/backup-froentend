import { api } from '@/lib/api/client';

export interface LocalityTrustStats {
    slug: string;
    name: string;
    average_rating: number | null;
    review_count: number;
    verified_review_count: number;
    listing_count: number;
    verified_listing_count: number;
}

export async function fetchLocalityTrustStats(slug: string): Promise<LocalityTrustStats | null> {
    try {
        return await api.get<LocalityTrustStats>(`/realty/localities/${slug}/trust-stats`);
    } catch {
        return null;
    }
}

export function formatLocalityTrustLine(stats: LocalityTrustStats): string {
    const parts: string[] = [];
    if (stats.average_rating && stats.review_count > 0) {
        parts.push(`${stats.average_rating.toFixed(1)}★ average from ${stats.review_count} reviews`);
    }
    if (stats.verified_listing_count > 0) {
        parts.push(`${stats.verified_listing_count} verified PGs on MakeMyStay`);
    } else if (stats.listing_count > 0) {
        parts.push(`${stats.listing_count} live listings`);
    }
    return parts.join(' · ') || `Verified PG options in ${stats.name}`;
}
