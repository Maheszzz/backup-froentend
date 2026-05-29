'use client';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import type { HeroSearchFilters } from '@/components/modules/search/SmartSearchBar';
import { Hero } from '@/components/sections/Hero';
import { JsonLd } from '@/components/seo/JsonLd';
import { HOME_PG_FAQS } from '@/data/homePgSeo';
import { HomeBelowFold } from '@/views/HomeBelowFold';
import {
    homeHeroTabToListingsCategory,
    parseHomeHeroTab,
    type HomeHeroNavigateTab,
    type ListingsCategoryKey,
} from '@/lib/listingsCategoryHubs';
import { buildFaqPageSchema, buildHomeOrganizationLocalWebGraph } from '@/lib/schema';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from '@/lib/navigation';

const LEGACY_HOME_CATEGORY = new Set<ListingsCategoryKey>(['pg', 'rent', 'buy', 'plot', 'all']);

function scrollToFeaturedListings() {
    requestAnimationFrame(() => {
        document.getElementById('featured-listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const heroTab = parseHomeHeroTab(searchParams.get('cat') ?? searchParams.get('category'));
    const listingsCategory = useMemo(() => homeHeroTabToListingsCategory(heroTab), [heroTab]);

    const [isSafetyPopupOpen, setIsSafetyPopupOpen] = useState(false);
    const [heroFilters, setHeroFilters] = useState<HeroSearchFilters>({
        city: 'bangalore',
        property_type: '',
        min_price: undefined,
        max_price: undefined,
        amenity: '',
        gender: '',
        move_in: '',
    });

    useEffect(() => {
        const hasShownHomeSafety = sessionStorage.getItem('hasShownHomeSafety');
        if (!hasShownHomeSafety) {
            setIsSafetyPopupOpen(true);
            sessionStorage.setItem('hasShownHomeSafety', 'true');
        }
    }, []);

    // Legacy `/?category=rent` → `/?cat=rent` on homepage (no redirect to hub pages).
    useEffect(() => {
        const legacy = searchParams.get('category');
        if (!legacy) return;
        if (!LEGACY_HOME_CATEGORY.has(legacy as ListingsCategoryKey)) {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    next.delete('category');
                    return next;
                },
                { replace: true }
            );
            return;
        }
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.delete('category');
                if (legacy !== 'pg' && legacy !== 'all') {
                    next.set('cat', legacy);
                } else {
                    next.delete('cat');
                }
                return next;
            },
            { replace: true }
        );
    }, [searchParams, setSearchParams]);

    const setSearchQuery = useCallback(
        (newQuery: string) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    if (newQuery) {
                        next.set('q', newQuery);
                    } else {
                        next.delete('q');
                    }
                    return next;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    const setHeroTab = useCallback(
        (tab: HomeHeroNavigateTab) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    if (tab === 'pg') {
                        next.delete('cat');
                    } else {
                        next.set('cat', tab);
                    }
                    return next;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    const handleHubTabChange = useCallback(
        (tab: HomeHeroNavigateTab) => {
            setHeroTab(tab);
            scrollToFeaturedListings();
        },
        [setHeroTab]
    );

    const handleFilterSearch = useCallback(
        (tab: HomeHeroNavigateTab, query: string) => {
            setHeroTab(tab);
            setSearchQuery(query);
            scrollToFeaturedListings();
        },
        [setHeroTab, setSearchQuery]
    );

    return (
        <>
            <JsonLd data={buildFaqPageSchema(HOME_PG_FAQS)} id="home-faq-schema" />
            <JsonLd data={buildHomeOrganizationLocalWebGraph()} id="home-org-local-website-schema" />

            <Navbar />
            <main id="main-content" className="min-h-screen bg-white pb-24 md:pb-0">
                <section id="home">
                    <Hero
                        category={listingsCategory}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filters={heroFilters}
                        setFilters={setHeroFilters}
                        filterTabsInPlace
                        activeHubTab={heroTab}
                        onHubTabChange={handleHubTabChange}
                        onFilterSearch={handleFilterSearch}
                    />
                </section>

                <HomeBelowFold
                    listingsCategory={listingsCategory}
                    searchQuery={searchQuery}
                    heroFilters={heroFilters}
                    setHeroFilters={setHeroFilters}
                    isSafetyPopupOpen={isSafetyPopupOpen}
                    onSafetyClose={() => setIsSafetyPopupOpen(false)}
                    homeFaqs={HOME_PG_FAQS}
                />
            </main>

            <Footer />
        </>
    );
}
