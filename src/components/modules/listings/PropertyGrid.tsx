import { FeaturedProjectCard } from '@/components/modules/listings/FeaturedProjectCard';
import { FeaturedPropertyFiltersBar } from '@/components/modules/listings/FeaturedPropertyFiltersBar';
import { LaunchTrustBar } from '@/components/modules/listings/LaunchTrustBar';
import { NewLaunchSpotlight } from '@/components/modules/listings/NewLaunchSpotlight';
import { MobilePropertyCarousel } from '@/components/modules/listings/MobilePropertyCarousel';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FEATURED_LAUNCH } from '@/data/featuredLaunch';
import { useProperties, useProperty } from '@/hooks';
import { buildFeaturedCarouselRows, findFeaturedLaunchProperty } from '@/lib/featuredLaunch';
import type { HeroSearchFilters } from '@/components/modules/search/SmartSearchBar';
import { buildFeaturedExploreUrl, heroFiltersToApiParams } from '@/lib/heroFilterUtils';
import type { PaginationParams } from '@/types/api';
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, IndianRupee, ShieldCheck } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { Link, useNavigate } from '@/lib/navigation';

interface PropertyGridProps {
    category: 'pg' | 'rent' | 'buy' | 'plot' | 'all';
    searchQuery: string;
    cardVariant?: 'default' | 'project';
    filters?: HeroSearchFilters;
    setFilters?: (next: HeroSearchFilters) => void;
}

export function PropertyGrid({
    category,
    searchQuery,
    cardVariant = 'default',
    filters,
    setFilters,
}: PropertyGridProps) {
    const navigate = useNavigate();
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const params = useMemo((): PaginationParams => {
        const apiBase = heroFiltersToApiParams(filters, {
            category: category !== 'all' ? category : undefined,
            search: searchQuery.trim() || undefined,
            limit: cardVariant === 'project' ? 24 : 20,
            sort_by: 'review_count_desc',
        });
        return apiBase as PaginationParams;
    }, [category, searchQuery, filters, cardVariant]);

    const { properties, loading, error } = useProperties(params);

    const safeProperties = Array.isArray(properties) ? properties : [];
    
    // Client-side sort fallback for 'review_count_desc' (matching Properties.tsx logic)
    const sortedProperties = useMemo(() => {
        return [...safeProperties].sort((a, b) => {
            const ca = (a.reviews ?? a.review_count ?? 0) || 0;
            const cb = (b.reviews ?? b.review_count ?? 0) || 0;
            return cb - ca;
        });
    }, [safeProperties]);

    const amenityGenderFiltered = useMemo(() => {
        return sortedProperties.filter((p) => {
            if (filters?.amenity) {
                if (filters.amenity === 'wifi' && !p.wifi) return false;
                if (filters.amenity === 'food' && !p.food) return false;
                if (filters.amenity === 'parking' && !p.parking) return false;
                if (filters.amenity === 'ac') {
                    const text = `${p.title} ${p.description} ${(p.features || []).join(' ')}`.toLowerCase();
                    if (!text.includes('ac') && !text.includes('air condition')) return false;
                }
            }
            if (filters?.gender) {
                const text = `${p.title} ${p.description} ${(p.features || []).join(' ')}`.toLowerCase();
                if (filters.gender === 'male' && !text.includes('male') && !text.includes('boys')) return false;
                if (filters.gender === 'female' && !text.includes('female') && !text.includes('girls')) return false;
                if (filters.gender === 'unisex' && !text.includes('unisex') && !text.includes('co-ed') && !text.includes('coed')) return false;
            }
            return true;
        });
    }, [sortedProperties, filters]);

    const launchFromList = useMemo(
        () => findFeaturedLaunchProperty(amenityGenderFiltered),
        [amenityGenderFiltered]
    );

    const { property: launchById } = useProperty(
        cardVariant === 'project' && !launchFromList ? FEATURED_LAUNCH.propertyId : null
    );

    const launchProperty = launchFromList ?? launchById ?? null;

    const projectDisplayRows = useMemo(() => {
        if (cardVariant !== 'project') return [];
        const base = amenityGenderFiltered.length ? amenityGenderFiltered : [];
        return buildFeaturedCarouselRows(base, launchProperty, 8);
    }, [cardVariant, amenityGenderFiltered, launchProperty]);

    // Filter for the home page (limit to 4)
    const filteredProperties = amenityGenderFiltered.slice(0, 4);

    const slideBy = (dir: 'left' | 'right') => {
        const el = sliderRef.current;
        if (!el) return;
        el.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
    };

    const viewAllByCategory: Record<PropertyGridProps['category'], string> = {
        all: '/properties',
        pg: '/pg',
        rent: '/rent',
        buy: '/buy',
        plot: '/plots',
    };
    const viewAllPath = viewAllByCategory[category];

    const activeFilters: HeroSearchFilters = filters ?? {
        city: 'bangalore',
        property_type: '',
        amenity: '',
        gender: '',
        move_in: '',
    };

    const handleExplore = () => {
        const path = buildFeaturedExploreUrl(
            activeFilters,
            searchQuery,
            category === 'all' ? 'all' : 'pg'
        );
        navigate(path);
    };

    if (loading) {
        return (
            <section className="py-20 bg-slate-50">
                <div className="flex justify-center">
                    <LoadingSpinner message="Loading latest listings..." />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <ErrorMessage
                            message="Failed to load properties"
                            detail={error.message}
                        />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            id="featured-listings"
            className={
                cardVariant === 'project'
                    ? 'py-12 md:py-20 bg-gradient-to-b from-slate-50 via-[#f8f8f7] to-slate-100/60 pb-20 md:pb-20 scroll-mt-24'
                    : 'py-10 md:py-20 bg-gradient-to-b from-stone-50 via-[#faf9f7] to-stone-100/50 pb-20 md:pb-20 scroll-mt-24'
            }
        >
            {/* Section Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {cardVariant === 'project' && setFilters && (
                    <FeaturedPropertyFiltersBar
                        filters={activeFilters}
                        onFiltersChange={setFilters}
                        onExplore={handleExplore}
                    />
                )}

                {cardVariant === 'project' && launchProperty && (
                    <NewLaunchSpotlight property={launchProperty} />
                )}

                {cardVariant === 'project' && <LaunchTrustBar />}

                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 md:mb-6 gap-3 md:gap-4">
                    <div className="max-w-3xl">
                        <h2
                            className={
                                cardVariant === 'project'
                                    ? 'text-2xl sm:text-3xl md:text-[2.15rem] font-bold text-slate-900 tracking-tight font-luxury'
                                    : 'text-2xl md:text-3xl font-semibold text-stone-900 mb-1 md:mb-2 tracking-tight'
                            }
                        >
                            {cardVariant === 'project' ? (
                                <>
                                    Handpicked for You{' '}
                                    <span className="not-italic font-sans" aria-hidden>
                                        ✨
                                    </span>
                                </>
                            ) : (
                                'Featured PGs near you'
                            )}
                        </h2>
                        <p
                            className={
                                cardVariant === 'project'
                                    ? 'mt-1 text-slate-600 text-sm md:text-base'
                                    : 'text-stone-500 text-sm md:text-base'
                            }
                        >
                            {cardVariant === 'project'
                                ? 'Curated homes that match your lifestyle.'
                                : 'Verified listings with real photos and transparent pricing'}
                        </p>
                    </div>
                    <Link
                        to={viewAllPath}
                        className={
                            cardVariant === 'project'
                                ? 'inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap self-start sm:self-auto sm:mb-1 text-slate-700 hover:text-brand-red transition-colors'
                                : 'inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap text-stone-700 hover:text-brand-red transition-colors'
                        }
                    >
                        View All Properties
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Mobile: horizontal swipe carousel for default; simple grid for project variant */}
            {cardVariant === 'project' ? (
                <div className="md:hidden max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 gap-4">
                        {projectDisplayRows.length > 0 ? (
                            projectDisplayRows.map((prop, idx) => (
                                    <FeaturedProjectCard
                                        key={prop.id}
                                        property={prop}
                                        rank={idx + 1}
                                    />
                                ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <h3 className="text-xl font-semibold text-slate-900">No properties found</h3>
                                <p className="text-slate-500 mt-2">Try adjusting your search criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <MobilePropertyCarousel properties={filteredProperties} />
            )}

            {/* Desktop listing area */}
            <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {cardVariant === 'project' ? (
                    <div className="relative rounded-2xl border border-slate-200 bg-white/80 p-3">
                        <button
                            type="button"
                            onClick={() => slideBy('left')}
                            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-slate-200 bg-white shadow-md flex items-center justify-center text-slate-700 hover:text-slate-900"
                            aria-label="Previous properties"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => slideBy('right')}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-slate-200 bg-white shadow-md flex items-center justify-center text-slate-700 hover:text-slate-900"
                            aria-label="Next properties"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="pointer-events-none absolute left-3 top-3 bottom-3 w-10 bg-gradient-to-r from-white/95 to-transparent z-10" />
                        <div className="pointer-events-none absolute right-3 top-3 bottom-3 w-10 bg-gradient-to-l from-white/95 to-transparent z-10" />

                        <div ref={sliderRef} className="overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            <div className="flex gap-5 min-w-max">
                                {projectDisplayRows.length > 0 ? (
                                    projectDisplayRows.map((prop, idx) => (
                                            <div key={prop.id} className="shrink-0 w-[280px]">
                                                <FeaturedProjectCard property={prop} rank={idx + 1} />
                                            </div>
                                        ))
                                ) : (
                                    <div className="w-full text-center py-12">
                                        <h3 className="text-xl font-semibold text-slate-900">No properties found</h3>
                                        <p className="text-slate-500 mt-2">Try adjusting your search criteria</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
                        {filteredProperties.length > 0 ? (
                            filteredProperties.map((prop) => <PropertyCard key={prop.id} property={prop} />)
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <h3 className="text-xl font-semibold text-slate-900">No properties found</h3>
                                <p className="text-slate-500 mt-2">Try adjusting your search criteria</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-8 md:mt-12 flex justify-center px-4">
                <Link to={viewAllPath} className="flex items-center gap-2 px-8 py-4 bg-white/95 border border-stone-300/80 text-stone-900 font-semibold rounded-xl hover:bg-stone-50 hover:border-stone-400/70 transition-all shadow-sm hover:shadow-md group w-full md:w-auto justify-center">
                    View All Properties
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {cardVariant !== 'project' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-14">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    <div className="rounded-2xl border border-stone-200 bg-white/95 p-4">
                        <div className="flex items-center gap-2 text-stone-900 mb-1.5">
                            <BadgeCheck className="w-4 h-4 text-emerald-600" aria-hidden />
                            <p className="text-sm font-medium">Verified listings</p>
                        </div>
                        <p className="text-xs text-stone-600">Every PG is physically inspected by our team.</p>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white/95 p-4">
                        <div className="flex items-center gap-2 text-stone-900 mb-1.5">
                            <IndianRupee className="w-4 h-4 text-brand-gold" aria-hidden />
                            <p className="text-sm font-medium">Zero brokerage</p>
                        </div>
                        <p className="text-xs text-stone-600">No hidden fees or middlemen during booking.</p>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white/95 p-4">
                        <div className="flex items-center gap-2 text-stone-900 mb-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-600" aria-hidden />
                            <p className="text-sm font-medium">Real reviews</p>
                        </div>
                        <p className="text-xs text-stone-600">Only verified tenants can rate listed properties.</p>
                    </div>
                </div>
            </div>
            )}
        </section>
    );
}
