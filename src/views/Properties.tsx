'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from '@/lib/navigation';
import { SEOHead } from '@/components/seo/SEOHead';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProperties, useSmartBack, useListingLocalityOptions } from '@/hooks';
import { Search, ArrowLeft, Filter, ChevronDown, Heart, RefreshCw, ArrowRight } from 'lucide-react';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { PROPERTY_CITY_OPTIONS } from '@/data/pgLocations';
import {
    normalizePgGenderParam,
    propertyMatchesPgFeatureFilters,
    propertyMatchesPgGenderFilter,
} from '@/lib/propertySeoUtils';
import { buildPageSEO, isValidListingPageParam, listingsPageSeo } from '@/lib/seo';
import {
    listingsHubTabNavigateUrl,
    listingsLegacyCatRedirectPath,
    normalizeCitySlug,
    pathnameToActiveListingsTab,
} from '@/lib/listingsCategoryHubs';
import {
    computeRentPlotStatsFromListings,
} from '@/lib/listingInventoryStats';
import type { Property } from '@/types/api';

/** Neighbourhood chips for `/rent/bangalore` hub (canonical `/rent/{slug}`). */
const RENT_BANGALORE_AREA_CHIPS: { label: string; to: string }[] = [
    { label: 'Koramangala', to: '/rent/koramangala' },
    { label: 'Whitefield', to: '/rent/whitefield' },
    { label: 'Bellandur', to: '/rent/bellandur' },
    { label: 'Marathahalli', to: '/rent/marathahalli' },
    { label: 'HSR Layout', to: '/rent/hsr-layout' },
    { label: 'Electronic City', to: '/rent/electronic-city' },
];

const CATEGORY_KEYS = ['all', 'pg', 'rent', 'buy', 'plot'] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

const CATEGORY_TAB_LABEL: Record<CategoryKey, string> = {
    all: 'All',
    pg: 'PG',
    rent: 'Rent',
    buy: 'Buy',
    plot: 'Plot',
};

interface PropertiesProps {
    initialCategory?: 'all' | 'pg' | 'rent' | 'buy' | 'plot';
    initialTypeFilter?: string;
    initialCity?: string;
    pageTitle?: string;
    pageSubtitle?: string;
    initialMinPrice?: string;
    initialMaxPrice?: string;
    /** Embed listing UI inside another page (no Helmet, Navbar, Footer). */
    hideChrome?: boolean;
    /** When set with `hideChrome`, show `/rent/bangalore` area chips (hub shell provides hero + SEO). */
    embedRentHubUi?: boolean;
    /** When set with `hideChrome`, plot hub shell can read live sqft span from loaded plot listings. */
    embedPlotHubUi?: boolean;
    /** Live min/max rent (INR) for embedded rent hub hero — updated from loaded listings. */
    onRentHubInventoryRange?: (min: number | null, max: number | null) => void;
    /** Live min/max plot sqft for embedded plot hub hero. */
    onPlotHubInventoryRange?: (min: number | null, max: number | null) => void;
    onEmptyResultsChange?: (isEmpty: boolean) => void;
    /** Hub shells (e.g. PG city page) can mirror visible inventory into ItemList JSON-LD — max 100 items. */
    onDisplayedListingsForSeo?: (list: Property[]) => void;
    /** When set (e.g. `/pg-for-boys-in-*` hubs), filter PG listings client-side without relying on `?gender=`. */
    forcedGenderFilter?: 'male' | 'female';
}

export default function Properties({
    initialCategory = 'all',
    initialTypeFilter = 'all',
    initialCity = 'all',
    pageTitle = 'Find Your Perfect Home',
    pageSubtitle = 'Browse Professional & Verified Listings',
    hideChrome = false,
    embedRentHubUi = false,
    embedPlotHubUi = false,
    initialMinPrice = '',
    initialMaxPrice = '',
    onRentHubInventoryRange,
    onPlotHubInventoryRange,
    onEmptyResultsChange,
    onDisplayedListingsForSeo,
    forcedGenderFilter,
}: PropertiesProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const routeParams = useParams<{ city?: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const goBack = useSmartBack({ fallback: '/' });
    const { wishlist } = useWishlist();

    // 1. Initialize state from URL or Props
    const [category, setCategory] = useState<'all' | 'pg' | 'rent' | 'buy' | 'plot'>(
        (searchParams.get('cat') as any) || initialCategory
    );
    const [locationFilter, setLocationFilter] = useState(searchParams.get('city') || initialCity);
    const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || initialTypeFilter);
    const [minPrice, setMinPrice] = useState(searchParams.get('min') || initialMinPrice);
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || initialMaxPrice);
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'review_count_desc');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    
    const pageQueryParam = searchParams.get('page');
    const listingPageNum = useMemo(() => {
        if (!pageQueryParam || !isValidListingPageParam(pageQueryParam)) return 1;
        const n = parseInt(pageQueryParam, 10);
        if (!Number.isFinite(n)) return 1;
        return Math.max(1, Math.min(100, n));
    }, [pageQueryParam]);

    const [showFilters, setShowFilters] = useState(false);

    // 2. Sync URL with state (debounced). `cat` only on `/properties` — hubs use path, not ?cat= (SEO).
    useEffect(() => {
        const timer = setTimeout(() => {
            const params: Record<string, string> = {};
            const onPropertiesIndex = location.pathname === '/properties';
            if (onPropertiesIndex && category !== 'all') {
                params.cat = category;
            }
            if (locationFilter !== 'all') params.city = locationFilter;
            if (typeFilter !== 'all') params.type = typeFilter;
            if (minPrice) params.min = minPrice;
            if (maxPrice) params.max = maxPrice;
            if (sortBy !== 'review_count_desc') params.sort = sortBy;
            if (searchQuery) params.q = searchQuery;

            const pageRaw = searchParams.get('page');
            if (isValidListingPageParam(pageRaw) && pageRaw && parseInt(pageRaw, 10) > 1) {
                params.page = pageRaw.trim();
            }

            for (const key of ['wifi', 'food', 'ac', 'price', 'gender'] as const) {
                const v = searchParams.get(key);
                if (v) params[key] = v;
            }

            const currentParams = Object.fromEntries(searchParams.entries());
            if (JSON.stringify(params) !== JSON.stringify(currentParams)) {
                setSearchParams(params, { replace: true });
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [
        category,
        location.pathname,
        locationFilter,
        typeFilter,
        minPrice,
        maxPrice,
        sortBy,
        searchQuery,
        setSearchParams,
        searchParams,
        pageQueryParam,
    ]);

    // Update state if category props change (from App.tsx routes)
    useEffect(() => {
        if (initialCategory !== category && !searchParams.get('cat')) {
            setCategory(initialCategory);
        }
    }, [initialCategory]);

    // 3. Restore scroll position
    useEffect(() => {
        const key = location.key;
        const saved = sessionStorage.getItem(`scroll:${key}`);
        if (!saved) return;
        const y = Number(saved);
        if (Number.isFinite(y)) {
            requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'auto' }));
        }
    }, [location.key]);

    // Save scroll position
    useEffect(() => {
        const key = location.key;
        return () => {
            sessionStorage.setItem(`scroll:${key}`, String(window.scrollY || 0));
        };
    }, [location.key]);

    /** Metro slug when "Entire Bangalore" / hub default applies (not all-India). */
    const defaultMetroSlug = useMemo(() => {
        return normalizeCitySlug(initialCity !== 'all' ? initialCity : undefined) ?? 'bangalore';
    }, [initialCity]);

    /** City slug for tab navigation: URL param wins, then initial hub city, then search query city, then filter. */
    const citySlugForTabs = useMemo(() => {
        const fromRoute = normalizeCitySlug(routeParams.city);
        if (fromRoute) return fromRoute;
        const fromQuery = normalizeCitySlug(searchParams.get('city'));
        if (fromQuery) return fromQuery;
        const init = normalizeCitySlug(initialCity !== 'all' ? initialCity : undefined);
        if (init) return init;
        return normalizeCitySlug(locationFilter !== 'all' ? locationFilter : undefined) ?? defaultMetroSlug;
    }, [routeParams.city, searchParams, initialCity, locationFilter, defaultMetroSlug]);

    /** Tab highlight follows URL so back/forward and deep links stay correct. */
    const activeTabKey = useMemo((): CategoryKey => {
        const implied = pathnameToActiveListingsTab(location.pathname);
        if (implied !== null) return implied;
        return category;
    }, [location.pathname, category]);

    useEffect(() => {
        const implied = pathnameToActiveListingsTab(location.pathname);
        if (implied !== null && implied !== category) {
            setCategory(implied);
        }
    }, [location.pathname, category]);

    const wifiOn = searchParams.get('wifi') === 'true';
    const foodOn = searchParams.get('food') === 'true';
    const acOn = searchParams.get('ac') === 'true';
    const priceTier = searchParams.get('price');

    /**
     * City sent to API — normalized slug; never mixed into `search` (text query stays in `q` only).
     * Filter value `all` means "Entire Bangalore" (all areas in the metro), not all cities globally.
     */
    const apiCity = useMemo(() => {
        if (locationFilter === 'all') return defaultMetroSlug;
        return normalizeCitySlug(locationFilter) ?? String(locationFilter).trim().toLowerCase();
    }, [locationFilter, defaultMetroSlug]);

    // 4. API Parameters (Derived from URL/State)
    const apiParams = useMemo(() => {
        const q = searchQuery.trim() || undefined;
        let min_price = minPrice ? parseFloat(minPrice) : undefined;
        let max_price = maxPrice ? parseFloat(maxPrice) : undefined;
        if (!min_price && !max_price && priceTier === 'low') max_price = 12000;
        if (!min_price && !max_price && priceTier === 'mid') {
            min_price = 8000;
            max_price = 16000;
        }
        if (!min_price && !max_price && priceTier === 'high') min_price = 14000;
        const sort_by = sortBy;

        const base = { search: q, min_price, max_price, city: apiCity, sort_by };

        if (category === 'all') {
            return { ...base, property_type: typeFilter === 'all' ? undefined : typeFilter };
        }
        return { ...base, category };
    }, [category, searchQuery, typeFilter, minPrice, maxPrice, apiCity, sortBy, priceTier]);

    const PAGE_SIZE = 24;
    const {
        properties,
        totalCount,
        propertyCounts,
        loading,
        error,
        refetch,
        loadMore,
        hasMore,
        loadingMore,
    } = useProperties(apiParams, {
        infiniteScroll: true,
        pageSize: PAGE_SIZE,
        initialListingPage: listingPageNum,
    });

    const genderFilter = useMemo(() => {
        if (forcedGenderFilter) return forcedGenderFilter;
        if (category !== 'pg') return undefined;
        return normalizePgGenderParam(searchParams.get('gender'));
    }, [forcedGenderFilter, category, searchParams]);

    const listingFilterKey = useMemo(
        () =>
            JSON.stringify({
                category,
                searchQuery,
                typeFilter,
                minPrice,
                maxPrice,
                apiCity,
                sortBy,
                priceTier,
                wifiOn,
                foodOn,
                acOn,
                genderKey: genderFilter ?? '',
            }),
        [
            category,
            searchQuery,
            typeFilter,
            minPrice,
            maxPrice,
            apiCity,
            sortBy,
            priceTier,
            wifiOn,
            foodOn,
            acOn,
            genderFilter,
        ]
    );

    const listingFilterKeyPrev = useRef<string | null>(null);
    useEffect(() => {
        if (listingFilterKeyPrev.current === null) {
            listingFilterKeyPrev.current = listingFilterKey;
            return;
        }
        if (listingFilterKeyPrev.current === listingFilterKey) return;
        listingFilterKeyPrev.current = listingFilterKey;
        if (!searchParams.get('page')) return;
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.delete('page');
                return next;
            },
            { replace: true }
        );
    }, [listingFilterKey, searchParams, setSearchParams]);

    const propertyListFiltered = useMemo(() => {
        try {
            const rawList = Array.isArray(properties) ? properties : [];
            let list = rawList.filter((p) => !!p); // Always strip nulls/undefined

            const flags = { wifi: wifiOn, food: foodOn, ac: acOn };
            if (wifiOn || foodOn || acOn) {
                list = list.filter((p) => propertyMatchesPgFeatureFilters(p, flags));
            }

            if (category === 'pg' && genderFilter) {
                list = list.filter((p) => propertyMatchesPgGenderFilter(p, genderFilter));
            }

            return list;
        } catch (e) {
            console.error('[Properties] Filtering crash:', e);
            return [];
        }
    }, [properties, wifiOn, foodOn, acOn, category, genderFilter]);

    /** Client-side ordering fallback when API order is weak. */
    const propertyListOrdered = useMemo(() => {
        try {
            const list = [...propertyListFiltered];
            if (sortBy === 'review_count_desc') {
                return list.sort((a, b) => {
                    const ca = (a?.reviews ?? a?.review_count ?? 0) || 0;
                    const cb = (b?.reviews ?? b?.review_count ?? 0) || 0;
                    return cb - ca;
                });
            }
            if (sortBy !== 'rating_desc') return list;
            return list.sort((a, b) => {
                const ra = (a?.rating ?? a?.average_rating ?? 0) || 0;
                const rb = (b?.rating ?? b?.average_rating ?? 0) || 0;
                if (rb !== ra) return rb - ra;
                const ca = (a?.reviews ?? a?.review_count ?? 0) || 0;
                const cb = (b?.reviews ?? b?.review_count ?? 0) || 0;
                return cb - ca;
            });
        } catch (e) {
            console.error('[Properties] Sorting crash:', e);
            return propertyListFiltered;
        }
    }, [propertyListFiltered, sortBy]);

    const inventoryStats = useMemo(
        () => computeRentPlotStatsFromListings(propertyListFiltered),
        [propertyListFiltered]
    );

    useEffect(() => {
        if (!embedRentHubUi || !onRentHubInventoryRange) return;
        onRentHubInventoryRange(inventoryStats.rentMinInr, inventoryStats.rentMaxInr);
    }, [embedRentHubUi, onRentHubInventoryRange, inventoryStats.rentMinInr, inventoryStats.rentMaxInr]);

    useEffect(() => {
        if (!embedPlotHubUi || !onPlotHubInventoryRange) return;
        onPlotHubInventoryRange(inventoryStats.plotSqftMin, inventoryStats.plotSqftMax);
    }, [embedPlotHubUi, onPlotHubInventoryRange, inventoryStats.plotSqftMin, inventoryStats.plotSqftMax]);

    const shouldNoindexEmptyResults = !loading && !error && propertyListOrdered.length === 0;
    const shouldNoindexThinCategory =
        !loading &&
        !error &&
        typeof totalCount === 'number' &&
        ((category === 'buy' && totalCount < 10) || (category === 'plot' && totalCount < 3));

    const listingsHelmet = useMemo(() => {
        if (hideChrome) return null;
        const page = listingsPageSeo({
            pathname: location.pathname,
            pageTitle,
            pageSubtitle,
            category,
            cityLabel: locationFilter === 'all' ? 'all' : locationFilter,
            totalCount: totalCount ?? undefined,
            listingPage: listingPageNum,
        });
        return buildPageSEO({
            ...page,
            noindex: Boolean(page.noindex) || shouldNoindexEmptyResults || shouldNoindexThinCategory,
        });
    }, [
        hideChrome,
        location.pathname,
        pageTitle,
        pageSubtitle,
        category,
        locationFilter,
        totalCount,
        shouldNoindexEmptyResults,
        shouldNoindexThinCategory,
        listingPageNum,
    ]);

    useEffect(() => {
        onEmptyResultsChange?.(shouldNoindexEmptyResults);
    }, [onEmptyResultsChange, shouldNoindexEmptyResults]);

    useEffect(() => {
        if (!onDisplayedListingsForSeo) return;
        if (loading && propertyListOrdered.length === 0) return;
        onDisplayedListingsForSeo(propertyListOrdered.slice(0, 100));
    }, [onDisplayedListingsForSeo, loading, propertyListOrdered]);

    // Infinite scroll observer
    const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!sentinelEl || !hasMore || loading || loadingMore) return;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    void loadMore();
                }
            },
            { root: null, rootMargin: '600px', threshold: 0 }
        );
        obs.observe(sentinelEl);
        return () => obs.disconnect();
    }, [sentinelEl, hasMore, loading, loadingMore, loadMore]);

    const { areas: localitiesFromApi } = useListingLocalityOptions(
        initialCity !== 'all' ? initialCity : undefined
    );
    const cities = localitiesFromApi.length > 0 ? localitiesFromApi : PROPERTY_CITY_OPTIONS;

    const resetFilters = useCallback(() => {
        setMinPrice('');
        setMaxPrice('');
        setLocationFilter('all');
        setSortBy('review_count_desc');
        setSearchQuery('');
        setTypeFilter('all');
        setSearchParams({}, { replace: true });
    }, [setSearchParams]);

    const handleCategoryTab = useCallback(
        (cat: CategoryKey) => {
            navigate(listingsHubTabNavigateUrl(cat, citySlugForTabs, searchQuery.trim()));
        },
        [navigate, citySlugForTabs, searchQuery]
    );

    const redirectFromLegacyCat =
        location.pathname === '/properties' ? listingsLegacyCatRedirectPath(searchParams.get('cat')) : null;

    const showRentBangaloreHubBlocks =
        initialCategory === 'rent' &&
        String(initialCity ?? '').toLowerCase() === 'bangalore' &&
        (!hideChrome || embedRentHubUi);

    const showPlotCityHubBlocks =
        category === 'plot' && initialCity !== 'all' && !hideChrome;

    const cityLabelDisplay = useMemo(() => {
        if (locationFilter === 'all') return 'Bangalore';
        const s = String(locationFilter).trim();
        if (!s) return 'Bangalore';
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    }, [locationFilter]);

    const emptyResultsSummary = useMemo(() => {
        const q = searchQuery.trim();
        if (q) return `text search "${q}"`;
        if (locationFilter !== 'all') return `city / filters for ${cityLabelDisplay}`;
        return 'your criteria';
    }, [searchQuery, locationFilter, cityLabelDisplay]);

    if (redirectFromLegacyCat) {
        return <Navigate to={redirectFromLegacyCat} replace />;
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans flex flex-col overflow-x-hidden">
            {listingsHelmet && <SEOHead {...listingsHelmet} />}
            {!hideChrome && <Navbar />}

            <main id={hideChrome ? undefined : 'main-content'} className={hideChrome ? 'pt-0 pb-16 flex-grow' : 'pt-20 pb-20 flex-grow'}>
                {/* 1. Hero Section (Only if not hidden) */}
                {!hideChrome && (
                    <section className="relative py-16 md:py-24 bg-brand-charcoal overflow-hidden mb-12">
                        <div className="absolute inset-0 z-0">
                            <img 
                                src="/images/blog/hero.png" 
                                alt="" 
                                className="w-full h-full object-cover opacity-20 scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/60 to-transparent" />
                        </div>
                        
                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="group mb-8 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1" />
                                    Back to Home
                                </button>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
                                    {pageTitle}
                                </h1>
                                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                                    {pageSubtitle}
                                </p>
                            </motion.div>
                        </div>
                    </section>
                )}

                <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${hideChrome ? 'mt-0 md:mt-2' : '-mt-20 md:-mt-24 relative z-20'}`}>
                    
                    {/* 2. Floating Filter Bar */}
                    <div className={`bg-white/95 backdrop-blur-xl p-3 md:p-5 rounded-[2rem] shadow-[0_20px_50px_-20px_rgba(15,23,42,0.2)] border border-slate-200/60 mb-16 transition-all ring-1 ring-slate-900/[0.02] ${hideChrome ? 'relative z-10' : 'sticky top-24 z-30'}`}>
                        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-stretch">
                            
                            {/* Search and Category Tabs Wrapper */}
                            <div className="flex-grow flex flex-col md:flex-row gap-3">
                                {/* Search Input */}
                                <div className="relative md:w-1/3 lg:w-1/4">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search area..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-red/10 focus:bg-white transition-all text-sm font-medium"
                                    />
                                </div>

                                {/* Category Pills */}
                                <div className="flex-grow flex items-center p-1.5 bg-slate-100/80 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth">
                                    {CATEGORY_KEYS.map((cat) => {
                                        const count = propertyCounts?.[cat];
                                        const isActive = activeTabKey === cat;
                                        return (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => handleCategoryTab(cat)}
                                                className={`flex-1 min-w-[70px] md:min-w-[90px] px-3 py-2.5 rounded-xl text-[11px] md:text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                                    isActive 
                                                        ? 'bg-white text-brand-red shadow-md scale-[1.02]' 
                                                        : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                                                }`}
                                            >
                                                <span>{CATEGORY_TAB_LABEL[cat]}</span>
                                                {count !== undefined && (
                                                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] tabular-nums ${
                                                        isActive ? 'bg-brand-red/10 text-brand-red' : 'bg-slate-200 text-slate-500'
                                                    }`}>
                                                        {count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Filter and Refetch Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex-1 lg:w-32 py-3.5 rounded-2xl border font-bold text-[11px] md:text-xs transition-all flex items-center justify-center gap-2 ${
                                        showFilters 
                                            ? 'bg-brand-red border-brand-red text-white shadow-glow' 
                                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-sm'
                                    }`}
                                >
                                    <Filter className="w-3.5 h-3.5" />
                                    More Filters
                                </button>
                                <button 
                                    onClick={refetch} 
                                    className="p-3.5 rounded-2xl bg-slate-50 text-slate-400 hover:text-brand-red hover:bg-white hover:shadow-sm border border-slate-100 transition-all"
                                    aria-label="Refresh results"
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Expandable Advanced Filters */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {/* Sort Options */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 pl-1">Sort Preference</label>
                                            <div className="relative">
                                                <select
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                    className="w-full appearance-none px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:ring-4 focus:ring-brand-red/5 outline-none pr-10 transition-all"
                                                >
                                                    <option value="review_count_desc">Popularity</option>
                                                    <option value="rating_desc">Top Rated</option>
                                                    <option value="price_asc">Lowest Price</option>
                                                    <option value="price_desc">Highest Price</option>
                                                    <option value="newest">Recently Added</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Price Range */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 pl-1">Monthly Budget (₹)</label>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="number" 
                                                    placeholder="Min" 
                                                    value={minPrice} 
                                                    onChange={(e) => setMinPrice(e.target.value)} 
                                                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-red/5 outline-none transition-all" 
                                                />
                                                <span className="text-slate-300 font-bold">/</span>
                                                <input 
                                                    type="number" 
                                                    placeholder="Max" 
                                                    value={maxPrice} 
                                                    onChange={(e) => setMaxPrice(e.target.value)} 
                                                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold focus:bg-white focus:ring-4 focus:ring-brand-red/5 outline-none transition-all" 
                                                />
                                            </div>
                                        </div>

                                        {/* Locality Selection */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 pl-1">City / Area</label>
                                            <div className="relative">
                                                <select
                                                    value={locationFilter}
                                                    onChange={(e) => setLocationFilter(e.target.value)}
                                                    className="w-full appearance-none px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:ring-4 focus:ring-brand-red/5 outline-none pr-10 transition-all"
                                                >
                                                    <option value="all">Entire Bangalore</option>
                                                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Specific Type */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 pl-1">Home Type</label>
                                            <div className="relative">
                                                <select
                                                    value={typeFilter}
                                                    onChange={(e) => setTypeFilter(e.target.value)}
                                                    className="w-full appearance-none px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:ring-4 focus:ring-brand-red/5 outline-none pr-10 transition-all"
                                                >
                                                    <option value="all">All Types</option>
                                                    <option value="1RK">Studio (1 RK)</option>
                                                    <option value="1BHK">1 BHK</option>
                                                    <option value="2BHK">2 BHK</option>
                                                    <option value="3BHK">3 BHK</option>
                                                    <option value="Villa">Villa / Row House</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                                        <button 
                                            onClick={resetFilters}
                                            className="text-[11px] font-bold text-slate-400 hover:text-brand-red transition-colors uppercase tracking-widest"
                                        >
                                            Clear all filters
                                        </button>
                                        <button 
                                            onClick={() => setShowFilters(false)}
                                            className="px-6 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-xl hover:bg-brand-charcoal transition-all uppercase tracking-widest"
                                        >
                                            Show Results
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 3. Area Chips (Hub context) */}
                    {showRentBangaloreHubBlocks && (
                        <div className="mb-10 p-1 bg-white rounded-2xl border border-slate-200/60 shadow-sm flex items-center overflow-hidden">
                            <div className="hidden md:flex items-center px-4 py-2 border-r border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0">
                                Popular Areas
                            </div>
                            <div className="flex flex-nowrap gap-2 overflow-x-auto no-scrollbar py-2 px-3">
                                {RENT_BANGALORE_AREA_CHIPS.map((c) => (
                                    <Link
                                        key={c.to}
                                        to={c.to}
                                        className="whitespace-nowrap px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-600 hover:bg-brand-red hover:text-white hover:border-brand-red transition-all"
                                    >
                                        {c.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. Results Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 mt-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {loading ? 'Searching...' : `Available Properties`}
                                </h2>
                                {!loading && (
                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs font-bold tabular-nums">
                                        {totalCount}
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-500 text-sm font-medium">
                                {loading 
                                    ? 'Curating verified listings for you...' 
                                    : `Verified ${category !== 'all' ? CATEGORY_TAB_LABEL[category] : 'Home'} listings in ${cityLabelDisplay}`}
                            </p>
                        </div>
                        
                        {loadingMore && (
                            <div className="flex items-center gap-2 text-brand-red">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Updating listings...</span>
                            </div>
                        )}
                    </div>

                    {/* 5. Main Content Grid */}
                    {loading && propertyListOrdered.length === 0 ? (
                        <div className="py-32 text-center">
                            <LoadingSpinner size={48} message="Fetching verified listings..." />
                        </div>
                    ) : error ? (
                        <div className="py-20">
                            <ErrorMessage message={error.message} detail={error.detail} onRetry={refetch} />
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Grid */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`grid gap-6 md:gap-8 ${
                                    hideChrome ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                }`}
                            >
                                {propertyListOrdered.length > 0 ? (
                                    propertyListOrdered.map((prop, idx) => {
                                        if (!prop || !prop.id) return null;
                                        return (
                                            <motion.div
                                                key={prop.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: Math.min(idx * 0.05, 0.4), duration: 0.5 }}
                                            >
                                                <PropertyCard property={prop} />
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
                                        <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-slate-100/50">
                                            <Search className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">No results found</h3>
                                        <p className="text-slate-500 max-w-md mx-auto text-lg mb-10 leading-relaxed font-medium">
                                            {`We couldn't find any listings matching ${emptyResultsSummary}.`}
                                        </p>
                                        <div className="flex flex-wrap items-center justify-center gap-4">
                                            <button 
                                                onClick={resetFilters} 
                                                className="px-8 py-4 bg-brand-red text-white font-bold rounded-2xl shadow-glow hover:scale-[1.03] active:scale-[0.98] transition-all"
                                            >
                                                Reset All Filters
                                            </button>
                                            <button 
                                                onClick={() => setLocationFilter('all')} 
                                                className="px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                            >
                                                Explore Entire City
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* Load More Trigger */}
                            {hasMore && (
                                <div className="pt-8 pb-12 flex flex-col items-center">
                                    <div ref={setSentinelEl} className="h-10 w-full mb-8" aria-hidden />
                                    <button 
                                        onClick={() => void loadMore()} 
                                        disabled={loadingMore}
                                        className="group relative px-10 py-4 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-900 hover:border-brand-red transition-all shadow-sm overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {loadingMore ? 'Loading...' : 'Discover More Properties'}
                                            {!loadingMore && <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />}
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {!hideChrome && <Footer />}

            {/* Floating Wishlist Button (Mobile focused) */}
            <AnimatePresence>
                {wishlist.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
                    >
                        <Link 
                            to="/wishlist"
                            className="flex items-center justify-between p-4 bg-brand-charcoal text-white rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="bg-brand-red p-2.5 rounded-xl shadow-glow group-hover:scale-110 transition-transform">
                                        <Heart className="w-5 h-5 fill-white" />
                                    </div>
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-brand-red text-[10px] font-black rounded-full flex items-center justify-center shadow-md">
                                        {wishlist.length}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Your Selection</p>
                                    <p className="text-[11px] text-slate-400">View saved properties</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-xs font-bold group-hover:bg-brand-red transition-colors">
                                View Wishlist
                                <ArrowRight className="w-3 h-3" />
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
