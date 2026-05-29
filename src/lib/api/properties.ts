import { api } from './client';
import { deriveUiCategory } from '@/lib/propertyCategory';
import {
    getHardcodedById,
    getHardcodedBySlug,
    getHardcodedSimilar,
    getHardcodedSuggestions,
    listHardcodedProperties,
} from '@/lib/hardcodedPropertyStore';
import { getPropertyPlaceholderImages } from '@/lib/propertyPlaceholderImages';
import type {
    ApiError,
    Property,
    PropertyImage,
    RealtyProperty,
    PropertyCreateRequest,
    PropertyUpdateRequest,
    Review,
} from '@/types/api';

const REALTY_PATH = '/realty/properties';

export { deriveUiCategory } from '@/lib/propertyCategory';

function propertyNotFoundError(detail?: string): ApiError {
    return {
        message: 'Property not found',
        status: 404,
        detail: detail ?? 'Listing is missing or was removed',
    };
}

/** True when mapped property matches the id requested on the PDP route. */
export function propertyIdsMatch(requested: string | number, property: Property | null | undefined): boolean {
    if (property?.id == null || property.id === '') return false;
    const a = String(requested).trim();
    const b = String(property.id).trim();
    if (!a || !b) return false;
    if (a === b) return true;
    const na = Number(a);
    const nb = Number(b);
    return Number.isFinite(na) && Number.isFinite(nb) && na === nb;
}

/**
 * Maps the backend RealtyProperty to the frontend Property interface
 */
export function mapRealtyToProperty(item: RealtyProperty): Property {
    if (item?.id == null) {
        throw propertyNotFoundError('Missing property id in API response');
    }
    const ptLower = (item.property_type || '').toLowerCase();
    const rawLt = (item.listing_type ?? 'rent').toString().toLowerCase();
    const isRentListing = rawLt === 'rent';
    const isBuyListing = rawLt === 'buy' || rawLt === 'sale';

    // Price: prefer starting_price; PG uses min(shared) prices even if listing_type casing differs.
    let priceDisplay = 'Price on Request';
    const sp = item.starting_price;
    if (typeof sp === 'number' && sp > 0) {
        priceDisplay = `₹${sp.toLocaleString('en-IN')}`;
    } else if (ptLower === 'pg') {
        const minPrice = Math.min(
            item.single_price ?? Infinity,
            item.double_price ?? Infinity,
            item.triple_price ?? Infinity
        );
        if (minPrice < Infinity) {
            priceDisplay = `₹${minPrice.toLocaleString('en-IN')}`;
        } else if (item.private_price != null && item.private_price > 0) {
            priceDisplay = `₹${item.private_price.toLocaleString('en-IN')}`;
        }
    } else if (isRentListing && item.private_price != null && item.private_price > 0) {
        priceDisplay = `₹${item.private_price.toLocaleString('en-IN')}`;
    } else if (isBuyListing && item.private_price != null && item.private_price > 0) {
        priceDisplay = `₹${(item.private_price / 10000000).toFixed(2)} Cr`;
    }

    // Heuristics for beds/baths based on type
    let beds = 1;
    let baths = 1;
    if (item.property_type === '2BHK') { beds = 2; baths = 2; }
    if (item.property_type === '3BHK') { beds = 3; baths = 3; }
    if (item.property_type === 'Villa') { beds = 4; baths = 4; }
    if (item.property_type?.toLowerCase() === 'plot') { beds = 0; baths = 0; }

    const isPlot = item.property_type?.toLowerCase() === 'plot';
    // Guard against malformed features
    const featuresList: string[] = [];
    if (Array.isArray(item.features)) {
        for (const f of item.features) {
            if (typeof f === 'string' && f.trim()) {
                featuresList.push(f.trim());
            } else if (f != null) {
                featuresList.push(String(f));
            }
        }
    }
    const has = (needle: string) => featuresList.some((f) => f.toLowerCase().includes(needle));

    const category = deriveUiCategory(item);

    // Extract images (support object rows + string URLs; copy before sort to avoid mutating response)
    const rawImages = Array.isArray(item.images) ? item.images : [];
    const sortedImages = [...rawImages].sort((a: any, b: any) => {
        const ao = a && typeof a === 'object' && 'sort_order' in a ? a.sort_order ?? 0 : 0;
        const bo = b && typeof b === 'object' && 'sort_order' in b ? b.sort_order ?? 0 : 0;
        return ao - bo;
    });

    const imageUrlFromEntry = (img: string | PropertyImage): string | undefined => {
        if (!img) return undefined;
        if (typeof img === 'string') return img.trim() || undefined;
        const u = img?.image_url;
        return typeof u === 'string' && u.trim() ? u : undefined;
    };

    let dbImages: string[] = [];
    try {
        dbImages = sortedImages.map(imageUrlFromEntry).filter((x): x is string => Boolean(x));
    } catch (err) {
        console.warn('[mapRealtyToProperty] Failed to map images array:', err, sortedImages);
    }
    
    // Explicit primary image lookup with fallback to first image in array
    const primaryEntry = sortedImages.find(
        (img): img is PropertyImage =>
            img && typeof img === 'object' && 'is_primary' in img && (img as PropertyImage).is_primary === true
    );
    const primaryImage = imageUrlFromEntry(primaryEntry ?? sortedImages[0]) ?? dbImages[0];
    const placeholders = dbImages.length === 0 ? getPropertyPlaceholderImages(item) : null;

    // Determine sharing options
    const sharingOptions: string[] = [];
    if (item.single_price) sharingOptions.push('Single');
    if (item.double_price) sharingOptions.push('Double');
    if (item.triple_price) sharingOptions.push('Triple');

    // Fallback if no specific prices but type is PG
    if (sharingOptions.length === 0 && item.property_type === 'PG') {
        sharingOptions.push('Shared');
    }

    const listingBadge =
        typeof item.listing_badge === 'string' && item.listing_badge.trim()
            ? item.listing_badge.trim()
            : undefined;
    const unitsRemaining =
        typeof item.units_remaining === 'number' && Number.isFinite(item.units_remaining)
            ? item.units_remaining
            : null;

    return {
        id: item.id,
        slug: item.slug || '',
        title: item.property_name || 'Untitled Property',
        location: item.location || 'Unknown Location',
        city: typeof item.city === 'string' ? item.city : undefined,
        price: priceDisplay,
        type: item.property_type || 'Apartment',
        beds: beds,
        baths: baths,
        sqft: item.area_sqft ? `${item.area_sqft} sqft` : "On Request",
        parking: item.parking,
        lift: item.lift,
        area: item.area_sqft,
        wifi: !isPlot && (has('wifi') || has('wi-fi') || has('internet')),
        housekeeping: !isPlot && (has('housekeeping') || has('hk ') || has('cleaning')),
        power_backup: !isPlot && (has('power') || has('backup')),
        gym: !isPlot && (has('gym') || item.property_type === 'Villa' || item.property_type === '4BHK'),
        lounge: !isPlot && (has('lounge') || item.property_type === 'PG' || item.property_type === 'Villa'),
        cctv: !isPlot && (has('cctv') || has('camera') || has('security')),
        washing_machine: !isPlot && (has('washing') || has('laundry')),
        geyser: !isPlot && (has('geyser') || has('water heater')),
        image: primaryImage || placeholders?.primary || '',
        modern_kitchen: !isPlot && ((featuresList.some(f => f.toLowerCase().includes('kitchen'))) || item.property_type === '1BHK' || item.property_type === '2BHK' || item.property_type === '3BHK' || item.property_type === 'Villa'),
        balcony: !isPlot && ((featuresList.some(f => f.toLowerCase().includes('balcony'))) || item.property_type === '1BHK' || item.property_type === '2BHK' || item.property_type === '3BHK' || item.property_type === 'Villa'),
        attached_bathroom: !isPlot, // Standard for most listed properties
        images: dbImages.length > 0 ? dbImages : placeholders?.gallery ?? [],
        tag: item.is_available ? 'Available' : 'Fully booked',
        listing_badge: listingBadge,
        units_remaining: unitsRemaining,
        category: category,
        description: item.description || `A premium ${item.property_type} property in ${item.location}.`,
        seo_about: typeof item.seo_about === 'string' && item.seo_about.trim() ? item.seo_about.trim() : undefined,
        sharing: sharingOptions,
        food: item.property_type === 'PG' || featuresList.some(f => f.toLowerCase().includes('food') || f.toLowerCase().includes('meal') || f.toLowerCase().includes('breakfast') || f.toLowerCase().includes('lunch') || f.toLowerCase().includes('dinner')),
        features: featuresList.length > 0 ? featuresList : [item.furnishing?.replace('_', ' ') || '', item.property_type].filter(Boolean),
        rating: item.average_rating || 0,
        reviews: item.review_count || 0,
        average_rating: item.average_rating,
        review_count: item.review_count,
        reviews_list: Array.isArray(item.reviews)
            ? item.reviews.map((r: Review) => ({
                  ...r,
                  comment: r.comment ?? r.review_text,
              }))
            : [],
        last_verified_at: item.last_verified_at,
        last_booked_at: item.last_booked_at,
        last_review_at: item.last_review_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        map_link: item.map_link,
        furnishing: item.furnishing,
        contact_phone: item.phone,
        is_available: item.is_available ?? true
    };
}

/**
 * Property API Service
 * Provides methods for CRUD operations on properties
 */
export const propertyApi = {
    /**
     * Get all properties
     * @param params - Optional pagination parameters
     * @returns Object containing array of properties and total count
     */
    getAll: async (params: {
        skip?: number;
        limit?: number;
        category?: string;
        property_type?: string;
        listing_type?: string;
        is_available?: boolean;
        search?: string;
        exclude_property_type?: string;
        min_price?: number;
        max_price?: number;
        city?: string;
        sort_by?: string;
    } = {}): Promise<{ items: Property[]; total: number }> => {
        const { rows, total } = listHardcodedProperties(params);
        const items: Property[] = [];
        for (const row of rows) {
            try {
                items.push(mapRealtyToProperty(row));
            } catch (e) {
                console.warn('[propertyApi.getAll] Skipping malformed property row:', e, row);
            }
        }
        return { items, total };
    },

    /**
     * PDP similar listings — server-ranked locality + fallback (see backend GET /properties/{id}/similar).
     */
    getSimilar: async (
        id: number | string,
        params: { limit?: number } = {}
    ): Promise<{ items: Property[]; total: number }> => {
        const limit = params.limit ?? 8;
        const rows = getHardcodedSimilar(id, limit);
        const items: Property[] = [];
        for (const row of rows) {
            try {
                items.push(mapRealtyToProperty(row));
            } catch (e) {
                console.warn('[propertyApi.getSimilar] Skipping malformed property row:', e, row);
            }
        }
        return { items, total: items.length };
    },

    /**
     * Get a single property by ID
     * @param id - Property ID
     * @returns Property object
     */
    getById: async (id: number | string): Promise<Property> => {
        const row = getHardcodedById(id);
        if (!row) {
            throw propertyNotFoundError();
        }
        const mapped = mapRealtyToProperty(row);
        if (!propertyIdsMatch(id, mapped)) {
            throw propertyNotFoundError('Property id mismatch');
        }
        return mapped;
    },

    /**
     * Get a single property by type and slug
     * @param type - Property Type
     * @param slug - Property Slug
     * @returns Property object
     */
    getBySlug: async (type: string, slug: string): Promise<Property> => {
        const row = getHardcodedBySlug(type, slug);
        if (!row) {
            throw propertyNotFoundError();
        }
        return mapRealtyToProperty(row);
    },

    /**
     * Create a new property
     * @param data - Property data
     * @returns Created property
     */
    create: async (data: PropertyCreateRequest): Promise<Property> => {
        const response = await api.post<RealtyProperty>(REALTY_PATH, data);
        return mapRealtyToProperty(response);
    },

    /**
     * Update an existing property
     * @param id - Property ID
     * @param data - Updated property data
     * @returns Updated property
     */
    update: async (id: number | string, data: PropertyUpdateRequest): Promise<Property> => {
        const response = await api.put<RealtyProperty>(`${REALTY_PATH}/${id}`, data);
        return mapRealtyToProperty(response);
    },

    /**
     * Delete a property
     * @param id - Property ID
     * @returns Deletion confirmation
     */
    delete: async (id: number | string): Promise<void> => {
        await api.delete(`${REALTY_PATH}/${id}`);
    },

    /**
     * Get search suggestions based on a query
     * @param query - The search string
     * @returns Array of strings
     */
    getSuggestions: async (
        query: string
    ): Promise<{ properties: string[]; places: string[] }> => {
        if (!query || query.length < 1) return { properties: [], places: [] };
        return getHardcodedSuggestions(query);
    },
};

export default propertyApi;
