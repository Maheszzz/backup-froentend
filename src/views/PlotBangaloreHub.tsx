'use client';

import { useState, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { buildPageSEO, plotBangaloreHubSeo } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/views/Properties';
import { MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatSqftRange } from '@/lib/listingInventoryStats';

const HUB_FAQS = [
    {
        question: 'What documents should I check before buying a plot in Bangalore?',
        answer:
            'Review title deed, mother deed chain, encumbrance certificate, approved layout plan, conversion order if agricultural land, and khata (A/B/E-khata) status. Engage a lawyer for high-value parcels.',
    },
    {
        question: 'Are plot sizes listed in sq ft or guntha?',
        answer:
            'Listings usually show square feet or cents/guntha depending on the micro-market. Use filters and compare on a normalized basis before site visits.',
    },
    {
        question: 'Why do some Bangalore plots show limited inventory?',
        answer:
            'Bangalore has fragmented land records and gated community plots. Verified inventory updates as owners onboard — widen area filters if your first search is thin.',
    },
];

const PAGE_TITLE = 'Plots & Land for Sale in Bangalore — Zero Brokerage';
const PAGE_SUBTITLE =
    'Verified residential plots and land parcels across Bangalore. Transparent sizing, zero broker bias, and filters to narrow by budget and area.';

export default function PlotBangaloreHub() {
    const [sqftRange, setSqftRange] = useState<{ min: number; max: number } | null>(null);
    const onPlotHubInventoryRange = useCallback((min: number | null, max: number | null) => {
        if (min != null && max != null) setSqftRange({ min, max });
        else setSqftRange(null);
    }, []);

    const helmet = buildPageSEO(plotBangaloreHubSeo());
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'Plots', path: '/plots' },
        { name: 'Plots in Bangalore', path: '/plots/in/bangalore' },
    ];
    const combinedLd = buildPgLocationCombinedGraph(HUB_FAQS, breadcrumbItems, 'Bangalore');

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id="plot-bangalore-hub-ld-json" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'Plots', path: '/plots' },
                                { name: 'Plots in Bangalore' },
                            ]}
                        />
                        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div className="max-w-3xl">
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                                    Karnataka · Silicon Valley of India
                                </p>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                    {PAGE_TITLE}
                                    {sqftRange ? (
                                        <span className="block text-brand-red text-2xl md:text-3xl mt-2 font-extrabold opacity-90">
                                            Listed sizes {formatSqftRange(sqftRange.min, sqftRange.max)}
                                        </span>
                                    ) : (
                                        <span className="block text-slate-500 text-lg md:text-xl mt-2 font-semibold">
                                            Plot sizes vary by listing — browse live inventory below.
                                        </span>
                                    )}
                                </h1>
                                <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                                    {PAGE_SUBTITLE}
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Verified listings
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Zero brokerage
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-6">
                    <Properties
                        hideChrome
                        embedPlotHubUi
                        initialCategory="plot"
                        initialCity="bangalore"
                        pageTitle={PAGE_TITLE}
                        pageSubtitle={PAGE_SUBTITLE}
                        onPlotHubInventoryRange={onPlotHubInventoryRange}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20">
                    <FaqSection
                        title="Frequently asked — plots in Bangalore"
                        items={HUB_FAQS}
                        titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
