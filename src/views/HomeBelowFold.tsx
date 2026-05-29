'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { HeroSearchFilters } from '@/components/modules/search/SmartSearchBar';
import type { ListingsCategoryKey } from '@/lib/listingsCategoryHubs';

function SectionFallback({ label }: { label?: string }) {
    return (
        <div className="flex justify-center py-16" aria-busy="true" aria-label={label ?? 'Loading section'}>
            <LoadingSpinner />
        </div>
    );
}

const PropertyGrid = dynamic(
    () => import('@/components/modules/listings/PropertyGrid').then((m) => ({ default: m.PropertyGrid })),
    { loading: () => <SectionFallback label="Loading listings" /> },
);

const ServicesGrid = dynamic(
    () => import('@/components/modules/services/ServicesGrid').then((m) => ({ default: m.ServicesGrid })),
    { loading: () => <SectionFallback label="Loading services" /> },
);

const InvestmentCalculator = dynamic(
    () => import('@/components/modules/calculator/InvestmentCalculator').then((m) => ({ default: m.InvestmentCalculator })),
    { loading: () => <SectionFallback /> },
);

const About = dynamic(() => import('@/components/sections/About').then((m) => ({ default: m.About })));
const Problem = dynamic(() => import('@/components/sections/Problem').then((m) => ({ default: m.Problem })));
const Solution = dynamic(() => import('@/components/sections/Solution').then((m) => ({ default: m.Solution })));
const Comparison = dynamic(() => import('@/components/sections/Comparison').then((m) => ({ default: m.Comparison })));
const CaseStudy = dynamic(() => import('@/components/sections/CaseStudy').then((m) => ({ default: m.CaseStudy })));
const CTA = dynamic(() => import('@/components/sections/CTA').then((m) => ({ default: m.CTA })));

const FaqSection = dynamic(
    () => import('@/components/seo/FaqSection').then((m) => ({ default: m.FaqSection })),
    { loading: () => <SectionFallback label="Loading FAQ" /> },
);

const SafetyPopup = dynamic(
    () => import('@/components/modals/SafetyPopup').then((m) => ({ default: m.SafetyPopup })),
    { ssr: false },
);

interface HomeBelowFoldProps {
    listingsCategory: ListingsCategoryKey;
    searchQuery: string;
    heroFilters: HeroSearchFilters;
    setHeroFilters: (next: HeroSearchFilters) => void;
    isSafetyPopupOpen: boolean;
    onSafetyClose: () => void;
    homeFaqs: { question: string; answer: string }[];
}

export function HomeBelowFold({
    listingsCategory,
    searchQuery,
    heroFilters,
    setHeroFilters,
    isSafetyPopupOpen,
    onSafetyClose,
    homeFaqs,
}: HomeBelowFoldProps) {
    return (
        <>
            <PropertyGrid
                category={listingsCategory}
                searchQuery={searchQuery}
                cardVariant="project"
                filters={heroFilters}
                setFilters={setHeroFilters}
            />

            <section id="services" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Services</h2>
                    <p className="text-slate-600 mt-2 text-sm sm:text-base">
                        Comprehensive solutions for every real estate need
                    </p>
                </div>
                <ServicesGrid />
            </section>

            <InvestmentCalculator />
            <About />
            <Problem />
            <Solution />
            <Comparison />
            <CaseStudy />
            <CTA />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
                <FaqSection
                    id="home-faq-heading"
                    title="Frequently asked questions"
                    items={homeFaqs}
                    variant="light"
                />
            </div>

            <SafetyPopup isOpen={isSafetyPopupOpen} onClose={onSafetyClose} />
        </>
    );
}
