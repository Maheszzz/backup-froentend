'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { buildPageSEO, buyBangaloreHubSeo } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/views/Properties';
import { MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

const HUB_FAQS = [
    {
        question: 'Is brokerage charged when buying through MakeMyStay?',
        answer:
            'MakeMyStay focuses on verified listings and transparent pricing. Brokerage terms depend on the listing — many owners advertise direct deals; confirm before you pay any token or deposit.',
    },
    {
        question: 'What should I verify before buying a flat in Bangalore?',
        answer:
            'Check RERA registration where applicable, sanctioned plan, OC status, encumbrance certificate, and builder reputation. Use site visits to validate carpet area and amenities match the listing.',
    },
    {
        question: 'Which areas are popular for mid-budget apartments in Bangalore?',
        answer:
            'Whitefield, Sarjapur Road, Electronic City, and Bellandur see strong IT demand. Indiranagar, Koramangala, and HSR skew premium. Pick based on commute and long-term resale liquidity.',
    },
];

const PAGE_TITLE = 'Buy Property in Bangalore — Verified Listings';
const PAGE_SUBTITLE =
    'Verified apartments and homes for sale across Bangalore. Compare prices, book site visits, and shortlist with zero broker bias.';

export default function BuyBangaloreHub() {
    const helmet = buildPageSEO(buyBangaloreHubSeo());
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'Buy', path: '/buy' },
        { name: 'Buy in Bangalore', path: '/buy/in/bangalore' },
    ];
    const combinedLd = buildPgLocationCombinedGraph(HUB_FAQS, breadcrumbItems, 'Bangalore');

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id="buy-bangalore-hub-ld-json" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'Buy', path: '/buy' },
                                { name: 'Buy in Bangalore' },
                            ]}
                        />
                        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div className="max-w-3xl">
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                                    Karnataka · Silicon Valley of India
                                </p>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                    {PAGE_TITLE}
                                    <span className="block text-slate-500 text-lg md:text-xl mt-2 font-semibold">
                                        Prices vary by project — browse live inventory below.
                                    </span>
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
                        initialCategory="buy"
                        initialCity="bangalore"
                        pageTitle={PAGE_TITLE}
                        pageSubtitle={PAGE_SUBTITLE}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20">
                    <FaqSection
                        title="Frequently asked — buy in Bangalore"
                        items={HUB_FAQS}
                        titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
