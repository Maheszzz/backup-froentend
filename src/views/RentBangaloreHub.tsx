'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { buildPageSEO, rentBangaloreHubSeo } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/views/Properties';
import { MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import { formatInrRange } from '@/lib/listingInventoryStats';

const HUB_FAQS = [
    {
        question: 'What is the average rent for a 1BHK flat in Bangalore?',
        answer:
            '1BHK flats in Bangalore rent for ₹12,000–₹35,000/month depending on area. Whitefield and Electronic City average ₹15,000–₹22,000. Koramangala and Indiranagar run ₹25,000–₹40,000.',
    },
    {
        question: 'Is there any brokerage for rentals on MakeMyStay?',
        answer:
            'No. MakeMyStay charges zero brokerage to tenants. You pay only rent and a refundable security deposit directly to the owner.',
    },
    {
        question: 'Can I find furnished flats for rent in Bangalore on MakeMyStay?',
        answer:
            'Yes. All listings on MakeMyStay are verified and include furnished, semi-furnished, and unfurnished options. Filter by furnished status on the search page.',
    },
    {
        question: 'What documents do I need to rent a flat in Bangalore?',
        answer:
            "Typically: Aadhaar card, PAN card, last 3 months' salary slips or bank statements, and one passport photo. MakeMyStay guides you through the full documentation process after booking.",
    },
];

const PAGE_TITLE = 'Flats & Houses for Rent in Bangalore — Zero Brokerage';
const PAGE_SUBTITLE =
    'Verified rental homes and apartments across Bangalore. Compare monthly rent, book visits, and chat with zero broker bias.';

export default function RentBangaloreHub() {
    const [rentRange, setRentRange] = useState<{ min: number; max: number } | null>(null);
    const onRentHubInventoryRange = useCallback((min: number | null, max: number | null) => {
        if (min != null && max != null) setRentRange({ min, max });
        else setRentRange(null);
    }, []);

    const helmet = buildPageSEO(rentBangaloreHubSeo());
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'Rent', path: '/rent' },
        { name: 'Rent in Bangalore', path: '/rent/bangalore' },
    ];
    const combinedLd = buildPgLocationCombinedGraph(HUB_FAQS, breadcrumbItems, 'Bangalore');

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id="rent-bangalore-hub-ld-json" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'Rent', path: '/rent' },
                                { name: 'Rent in Bangalore' },
                            ]}
                        />
                        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div className="max-w-3xl">
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                                    Karnataka · Silicon Valley of India
                                </p>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                    {PAGE_TITLE}
                                    {rentRange ? (
                                        <span className="block text-brand-red text-2xl md:text-3xl mt-2 font-extrabold opacity-90">
                                            Typical range {formatInrRange(rentRange.min, rentRange.max)} / month
                                        </span>
                                    ) : (
                                        <span className="block text-slate-500 text-lg md:text-xl mt-2 font-semibold">
                                            Rent varies by area — browse live listings below.
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
                        embedRentHubUi
                        initialCategory="rent"
                        initialCity="bangalore"
                        pageTitle={PAGE_TITLE}
                        pageSubtitle={PAGE_SUBTITLE}
                        onRentHubInventoryRange={onRentHubInventoryRange}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20">
                    <FaqSection
                        title="Frequently asked — rent in Bangalore"
                        items={HUB_FAQS}
                        titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
