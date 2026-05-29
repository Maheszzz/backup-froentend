import { useState, useEffect, useCallback, useMemo } from 'react';
import { propertyApi } from '@/lib/api';
import { inferPropertyTypeFromPath, parsePropertySlugParam } from '@/lib/propertyRouting';
import type { Property, PropertyId, ApiError, PaginationParams } from '@/types/api';

/** Stable key for filters (excludes pagination). */
function filterKeyFromParams(params?: PaginationParams): string {
    if (!params) return '';
    const { skip, limit, page, page_size, ...rest } = params as Record<string, any>;
    return JSON.stringify(rest);
}

export interface UsePropertiesOptions {
    /** Accumulate pages (skip += len) with Load more / infinite scroll */
    infiniteScroll?: boolean;
    pageSize?: number;
    /** 1-based crawlable page (e.g. `?page=2`). Initial fetch uses skip = (page-1)*pageSize when infiniteScroll. */
    initialListingPage?: number;
}

export interface UsePropertiesResult {
    properties: Property[];
    totalCount: number;
    propertyCounts?: Record<string, number>;
    shownCount: number;
    loading: boolean;
    loadingMore: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
    loadMore: () => Promise<void>;
    hasMore: boolean;
}

const DEFAULT_PAGE_SIZE = 24;

/**
 * Custom hook to fetch properties from the API with support for advanced filtering, sorting, and infinite scroll.
 */
export function useProperties(
    params: PaginationParams = {},
    options: UsePropertiesOptions = {}
): UsePropertiesResult {
    const { infiniteScroll = false, pageSize = DEFAULT_PAGE_SIZE, initialListingPage = 1 } = options;
    const startPage = Math.max(1, Math.min(500, initialListingPage || 1));

    const [properties, setProperties] = useState<Property[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [propertyCounts, setPropertyCounts] = useState<Record<string, number> | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Stabilize params by stringifying them as the dependency
    const paramsString = JSON.stringify(params);
    const filterKey = useMemo(() => filterKeyFromParams(params), [paramsString]);

    // Initial fetch and reset when filters change
    useEffect(() => {
        let isMounted = true;

        const fetchInitial = async () => {
            setLoading(true);
            setError(null);
            const initialSkip = infiniteScroll ? (startPage - 1) * pageSize : 0;
            setPage(infiniteScroll ? startPage : 1);

            try {
                const response = await propertyApi.getAll({
                    ...params,
                    skip: initialSkip,
                    limit: pageSize,
                }) as any;

                if (isMounted) {
                    // Hardened: Support both bare array and { items, total, property_counts } format
                    const list = Array.isArray(response) 
                        ? response 
                        : (response && Array.isArray(response.items) ? response.items : []);
                    
                    const total = (!Array.isArray(response) && typeof response?.total === 'number')
                        ? response.total
                        : list.length;

                    const counts = (!Array.isArray(response) && response?.property_counts)
                        ? response.property_counts
                        : undefined;

                    setProperties(list);
                    setTotalCount(total);
                    setPropertyCounts(counts);
                    setHasMore(initialSkip + list.length < total);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    // Coerce any thrown value into a clean ApiError
                    const apiErr: ApiError = (
                        err && typeof err === 'object' && 'message' in err
                    ) ? (err as ApiError)
                      : { message: 'Failed to load properties', status: 0, detail: String(err) };
                    setError(apiErr);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchInitial();
        return () => { isMounted = false; };
    }, [filterKey, pageSize, startPage, infiniteScroll]);

    const loadMore = useCallback(async () => {
        if (loading || loadingMore || !hasMore) return;

        setLoadingMore(true);
        const nextPage = page + 1;

        try {
            const response = await propertyApi.getAll({
                ...params,
                skip: (nextPage - 1) * pageSize,
                limit: pageSize,
            }) as any;

            // Hardened: Support both bare array and { items, total } format
            const pageItems = Array.isArray(response) 
                ? response 
                : (response && Array.isArray(response.items) ? response.items : []);
            
            const total = (!Array.isArray(response) && typeof response?.total === 'number')
                ? response.total
                : properties.length + pageItems.length;

            setProperties(prev => [...prev, ...pageItems]);
            setPage(nextPage);
            setHasMore((properties.length + pageItems.length) < total);
            setTotalCount(total);
            
            if (!Array.isArray(response) && response?.property_counts) {
                setPropertyCounts(response.property_counts);
            }
        } catch (err) {
            console.error('Failed to load more properties:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [loading, loadingMore, hasMore, page, pageSize, params, properties.length]);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        setPage(1);
        try {
            const response = await propertyApi.getAll({
                ...params,
                skip: 0,
                limit: pageSize,
            }) as any;
            // Hardened: Support both bare array and { items, total } format
            const list = Array.isArray(response) 
                ? response 
                : (response && Array.isArray(response.items) ? response.items : []);
            
            const total = (!Array.isArray(response) && typeof response?.total === 'number')
                ? response.total
                : list.length;

            const counts = (!Array.isArray(response) && response?.property_counts)
                ? response.property_counts
                : undefined;

            setProperties(list);
            setTotalCount(total);
            setPropertyCounts(counts);
            setHasMore(list.length < total);
        } catch (err: unknown) {
            const apiErr: ApiError = (
                err && typeof err === 'object' && 'message' in err
            ) ? (err as ApiError)
              : { message: 'Failed to load properties', status: 0, detail: String(err) };
            setError(apiErr);
        } finally {
            setLoading(false);
        }
    }, [params, pageSize]);

    return {
        properties,
        totalCount,
        propertyCounts,
        shownCount: properties.length,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore,
        refetch
    };
}

export interface UsePropertyResult {
    property: Property | null;
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch a single property by ID
 */
export function useProperty(
    id: number | string | null | undefined,
    initialProperty?: Property | null,
): UsePropertyResult {
    const [property, setProperty] = useState<Property | null>(initialProperty ?? null);
    const [loading, setLoading] = useState<boolean>(!initialProperty && Boolean(id));
    const [error, setError] = useState<ApiError | null>(null);

    const fetchProperty = async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await propertyApi.getById(id);
            setProperty(data);
        } catch (err) {
            setError(err as ApiError);
            console.error(`Error fetching property ${id}:`, err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialProperty && String(initialProperty.id) === String(id)) {
            setProperty(initialProperty);
            setLoading(false);
            return;
        }
        void fetchProperty();
    }, [id]);

    return {
        property,
        loading,
        error,
        refetch: fetchProperty,
    };
}

/**
 * Custom hook to fetch a single property by type and slug
 */
/**
 * Resolve PDP data from `/pg|rent|property|properties/:slug` (numeric id or legacy slug-only).
 */
export function usePropertyFromRoute(
    slugParam: string | undefined,
    pathname: string,
    initialProperty?: Property | null,
): UsePropertyResult {
    const id = slugParam ? parsePropertySlugParam(slugParam) : '';
    const byId = useProperty(id || null, initialProperty);
    const legacySlug = slugParam && !id ? slugParam : undefined;
    const bySlug = usePropertyBySlug(
        legacySlug ? inferPropertyTypeFromPath(pathname) : undefined,
        legacySlug,
        initialProperty,
    );
    return id ? byId : bySlug;
}

export function usePropertyBySlug(
    type: string | undefined,
    slug: string | undefined,
    initialProperty?: Property | null,
): UsePropertyResult {
    const [property, setProperty] = useState<Property | null>(initialProperty ?? null);
    const [loading, setLoading] = useState<boolean>(!initialProperty && Boolean(type && slug));
    const [error, setError] = useState<ApiError | null>(null);

    const fetchProperty = async () => {
        if (!type || !slug) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await propertyApi.getBySlug(type, slug);
            setProperty(data);
        } catch (err) {
            setError(err as ApiError);
            console.error(`Error fetching property ${type}/${slug}:`, err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchProperty();
    }, [type, slug]);

    return {
        property,
        loading,
        error,
        refetch: fetchProperty,
    };
}

export interface UseSimilarPropertiesResult {
    properties: Property[];
    loading: boolean;
    error: ApiError | null;
    refetch: () => Promise<void>;
}

/**
 * PDP similar listings — server-ranked (locality + neighbors + fallback); not the generic list API.
 */
export function useSimilarProperties(
    propertyId: PropertyId | null | undefined,
    options: { limit?: number } = {}
): UseSimilarPropertiesResult {
    const { limit = 6 } = options;
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    const refetch = useCallback(async () => {
        if (propertyId === null || propertyId === undefined) {
            setProperties([]);
            setLoading(false);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await propertyApi.getSimilar(propertyId, { limit });
            // Hardened: Support both bare array and { items, total } format
            if (Array.isArray(res)) {
                setProperties(res);
            } else if (res && Array.isArray(res.items)) {
                setProperties(res.items);
            } else {
                setProperties([]);
            }
        } catch (err: any) {
            setError(err as ApiError);
            setProperties([]);
            console.error(`Error fetching similar properties for ${propertyId}:`, err);
        } finally {
            setLoading(false);
        }
    }, [propertyId, limit]);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    return { properties, loading, error, refetch };
}
