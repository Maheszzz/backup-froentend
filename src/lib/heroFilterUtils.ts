import type { HeroSearchFilters } from '@/components/modules/search/SmartSearchBar';
import { listingsCategoryHubPath, normalizeCitySlug } from '@/lib/listingsCategoryHubs';

export const HERO_CITY_TABS: { key: HeroSearchFilters['city']; label: string }[] = [
    { key: 'bangalore', label: 'Bangalore' },
    { key: 'pune', label: 'Pune' },
    { key: 'hyderabad', label: 'Hyderabad' },
];

export function priceRangeSelectValue(filters: Pick<HeroSearchFilters, 'min_price' | 'max_price'>): string {
    const { min_price, max_price } = filters;
    if (min_price === undefined && max_price === undefined) return 'any';
    return `${min_price ?? 0}-${max_price ?? 0}`;
}

export function patchFromPriceRangeValue(val: string): Pick<HeroSearchFilters, 'min_price' | 'max_price'> {
    if (val === 'any') return { min_price: undefined, max_price: undefined };
    if (val === '0-10000') return { min_price: undefined, max_price: 10000 };
    if (val === '10000-15000') return { min_price: 10000, max_price: 15000 };
    if (val === '15000-25000') return { min_price: 15000, max_price: 25000 };
    if (val === '25000-0') return { min_price: 25000, max_price: undefined };
    return { min_price: undefined, max_price: undefined };
}

/** Maps featured-section filters → GET /realty/properties query params. */
export function heroFiltersToApiParams(
    filters: HeroSearchFilters | undefined,
    base: { category?: 'pg' | 'rent' | 'buy' | 'plot'; search?: string; limit?: number; sort_by?: string }
) {
    const p: Record<string, string | number | boolean | undefined> = {
        limit: base.limit ?? 20,
        sort_by: base.sort_by ?? 'review_count_desc',
    };
    if (base.category) p.category = base.category;
    if (base.search?.trim()) p.search = base.search.trim();
    if (filters?.city) p.city = filters.city;
    if (filters?.property_type) p.property_type = filters.property_type;
    if (typeof filters?.min_price === 'number') p.min_price = filters.min_price;
    if (typeof filters?.max_price === 'number') p.max_price = filters.max_price;
    if (filters?.move_in === 'immediate') p.is_available = true;
    return p;
}

/** Navigate to PG hub (or properties) with the same filters applied in URL. */
export function buildFeaturedExploreUrl(
    filters: HeroSearchFilters,
    searchQuery: string,
    category: 'pg' | 'all' = 'pg'
): string {
    const city = normalizeCitySlug(filters.city) ?? 'bangalore';
    const pathname = category === 'pg' ? listingsCategoryHubPath('pg', city) : '/properties';
    const p = new URLSearchParams();
    const q = searchQuery.trim();
    if (q) p.set('q', q);
    if (category !== 'pg' && city) p.set('city', city);
    if (filters.property_type) p.set('type', filters.property_type);
    if (filters.min_price != null) p.set('min', String(filters.min_price));
    if (filters.max_price != null) p.set('max', String(filters.max_price));
    if (filters.amenity === 'wifi') p.set('wifi', 'true');
    if (filters.amenity === 'food') p.set('food', 'true');
    if (filters.amenity === 'ac') p.set('ac', 'true');
    if (filters.gender === 'male') p.set('gender', 'male');
    if (filters.gender === 'female') p.set('gender', 'female');
    if (filters.move_in === 'immediate') p.set('available', '1');
    const qs = p.toString();
    return qs ? `${pathname}?${qs}` : pathname;
}
