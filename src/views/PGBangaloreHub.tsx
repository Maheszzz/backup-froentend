'use client';

import { useCallback, useMemo, useState } from 'react';
import { Link } from '@/lib/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { QuickAnswersBlock } from '@/components/seo/QuickAnswersBlock';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { PG_LOCATIONS } from '@/data/pgLocations';
import { buildPageSEO, pgBangaloreHubSeo } from '@/lib/seo';
import { buildPgHubItemListSchema, buildPgLocationCombinedGraph } from '@/lib/schema';
import type { Property } from '@/types/api';
import Properties from '@/views/Properties';
import { MapPin, ChevronRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const HUB_FAQS = [
    {
        question: 'What is the average PG rent in Bangalore?',
        answer: 'The average PG rent in Bangalore in 2025 ranges from ₹6,000 to ₹15,000 per month for shared rooms and ₹15,000 to ₹25,000 for private rooms. Premium areas like Koramangala and Indiranagar cost ₹10,000 to ₹20,000, while budget-friendly areas like Electronic City and Marathahalli start from ₹5,000 to ₹8,000 per month. Rent depends on location, amenities (food, WiFi, AC), and room type (single, double, or triple sharing).',
    },
    {
        question: 'Which areas in Bangalore have the best PGs for IT professionals?',
        answer: 'The best areas for PGs for IT professionals in Bangalore are: Whitefield (near ITPL, Prestige Tech Park), Electronic City (near Infosys, Wipro), Marathahalli and Bellandur (near RMZ Ecoworld, Embassy Tech Village), Manyata Tech Park area (near many MNC offices), and HSR Layout (convenient access to the Outer Ring Road tech corridor). MakeMyStay lists verified PGs in all these areas with transparent pricing and real photos.',
    },
    {
        question: 'How much security deposit is required for a PG in Bangalore?',
        answer: "Most PGs in Bangalore charge a security deposit of 1 to 2 months' rent. Under the Karnataka Rent Control Act, the maximum allowable deposit for residential property is 10 months' rent, but PGs typically charge much less - usually ₹5,000 to ₹20,000. Some managed co-living spaces like those listed on MakeMyStay offer zero or minimal deposit options.",
    },
    {
        question: 'What amenities should I look for in a good PG in Bangalore?',
        answer: 'A good PG in Bangalore should include: high-speed WiFi (minimum 50 Mbps), 24/7 security and CCTV, power backup for electricity outages, meals (breakfast and dinner at minimum), laundry service or washing machine, clean attached or shared washrooms, housekeeping, and a furnished room with bed, wardrobe, and study table. Premium PGs also offer AC rooms, gym access, and Netflix or entertainment subscriptions.',
    },
    {
        question: 'What is the difference between a PG and co-living space in Bangalore?',
        answer: 'A PG (Paying Guest) is traditional shared accommodation with basic facilities like a room, meals, and WiFi. A co-living space is a professionally managed, fully furnished living arrangement that includes all utilities, meals, housekeeping, community events, and flexible lease terms - usually with an app for service requests. Co-living spaces cost ₹8,000 to ₹20,000/month but offer a more hassle-free experience. MakeMyStay lists both options with verified listings and transparent pricing.',
    },
    {
        question: 'Are there good PGs for girls and women in Bangalore?',
        answer: 'Yes, Bangalore has many verified ladies PGs with strong safety features including 24/7 security, biometric entry, CCTV, in-house warden, and no late-night curfews. Popular areas for ladies PGs include Koramangala, HSR Layout, Marathahalli, Whitefield, and Indiranagar. MakeMyStay lists women-only verified PGs across all these neighbourhoods.',
    },
    {
        question: 'How do I find a verified PG in Bangalore without a broker?',
        answer: 'To find a verified PG in Bangalore without a broker: (1) Use platforms like MakeMyStay that list zero-brokerage verified PGs with real photos and transparent pricing. (2) Filter by your workplace area, budget, and amenities. (3) Schedule a visit directly through the platform. (4) Check reviews from previous tenants. (5) Confirm the agreement terms before paying any deposit. MakeMyStay verifies all listings to ensure no hidden charges.',
    },
    {
        question: 'What is the cheapest PG available in Bangalore?',
        answer: 'The cheapest PGs in Bangalore start from ₹4,000 to ₹6,000 per month for shared rooms in outer areas like Electronic City Phase 2, Bannerghatta Road, KR Puram, and Hosur Road. These budget PGs typically include basic amenities - a bed, WiFi, and shared bathroom - but may not include meals. For slightly better quality at ₹7,000 to ₹9,000, areas like BTM Layout, Marathahalli, and Hebbal offer good value.',
    },
];

export default function PGBangaloreHub() {
    const helmet = buildPageSEO(pgBangaloreHubSeo());
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: 'PG in Bangalore', path: '/pg/bangalore' },
    ];
    const combinedLd = buildPgLocationCombinedGraph(HUB_FAQS, breadcrumbItems, 'Bangalore');

    const [hubListingsForSeo, setHubListingsForSeo] = useState<Property[]>([]);
    const onDisplayedListingsForSeo = useCallback((list: Property[]) => {
        setHubListingsForSeo((prev) => {
            if (
                prev.length === list.length &&
                prev.every((p, i) => p.id === list[i]?.id)
            ) {
                return prev;
            }
            return list;
        });
    }, []);

    const itemListLd = useMemo(
        () =>
            buildPgHubItemListSchema(hubListingsForSeo, {
                name: 'PG listings in Bangalore',
                description:
                    'Verified paying guest stays in Bengaluru — same URLs as on-page listing cards.',
            }),
        [hubListingsForSeo]
    );

    const topSlugs = PG_LOCATIONS.slice(0, 16);

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id="pg-bangalore-hub-ld-json" />
            {itemListLd ? <JsonLd data={itemListLd} id="pg-bangalore-itemlist-ld-json" /> : null}
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">
                
                {/* ── Hero Header ── */}
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'PG', path: '/pg' },
                                { name: 'PG in Bangalore' },
                            ]}
                        />
                        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div className="max-w-3xl">
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                                    Karnataka · Silicon Valley of India
                                </p>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                    Best PG in Bangalore
                                    <span className="block text-brand-red text-2xl md:text-3xl mt-2 font-extrabold opacity-90">
                                        ₹6,000 – ₹15,000 /mo
                                    </span>
                                </h1>
                                <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                                    Discover verified coliving spaces and managed PGs across Whitefield, BTM, HSR, 
                                    and Marathahalli. Transparent pricing, zero broker bias.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Verified Stays
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Zero Brokerage
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── PROPERTIES GRID (HIGH PRIORITY) ── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-6">
                    <Properties
                        hideChrome
                        initialCategory="pg"
                        initialCity="Bangalore"
                        pageTitle="Listings in Bangalore"
                        pageSubtitle="Verified paying guest stays — filter by budget, WiFi, food, AC, and more."
                        onDisplayedListingsForSeo={onDisplayedListingsForSeo}
                    />
                </div>

                {/* ── SEO CONTENT & AREA GUIDES (BELOW THE FOLD) ── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-16">
                    
                    {/* Area Navigation Grid */}
                    <section aria-labelledby="top-areas-heading">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h2 id="top-areas-heading" className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                    Browse by Top Locations
                                </h2>
                                <p className="text-slate-500 mt-1 text-sm md:text-base">
                                    Select a micro-market to see specialized area guides and local listings.
                                </p>
                            </div>
                            <div className="flex gap-4 text-sm font-bold text-brand-red">
                                <Link to="/pg-with-wifi" className="hover:underline">WiFi Stays →</Link>
                                <Link to="/pg-with-food" className="hover:underline">Food Included →</Link>
                            </div>
                        </div>
                        
                        <nav className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4" aria-label="PG areas">
                            {topSlugs.map((loc) => (
                                <Link
                                    key={loc.slug}
                                    to={`/pg/${loc.slug}`}
                                    className="group flex flex-col p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-red/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-brand-red transition-colors" />
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-800 group-hover:text-brand-red transition-colors">
                                        PG in {loc.name}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </section>

                    {/* Authority Content / Guide */}
                    <article className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start pt-12 border-t border-slate-200/60">
                        <div className="lg:col-span-2 space-y-10">
                            <div className="prose prose-slate prose-lg max-w-none">
                                <h2 className="text-3xl font-black text-slate-900 leading-tight">
                                    The Shifting Landscape of PG in Bangalore (2026)
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Bangalore remains the primary hub for managed paying guest (PG) and coliving stays. 
                                    In 2026, the traditional <em>"PG"</em> has transformed into sophisticated 
                                    <strong> coliving spaces</strong> that prioritize community, high-speed connectivity, 
                                    and flexible lease terms.
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    Whether you are at <strong>ITPL Whitefield</strong>, <strong>Manyata Tech Park</strong>, 
                                    or a student at <strong>Christ University</strong>, finding a stay that balances commute 
                                    time with lifestyle is critical. MakeMyStay.ai simplifies this by providing verified 
                                    listings that filter out binary broker noise.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-4 bg-blue-500 rounded-full" />
                                        Technical Hubs
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        <strong>Whitefield & Electronic City:</strong> The anchors for IT professionals. 
                                        Rent here targets the mid-to-high range but offers superior coliving infrastructure.
                                    </p>
                                </div>
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
                                        Lifestyle Corridors
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        <strong>BTM Layout & HSR:</strong> Start-up central. High density of verified PGs 
                                        with unrivaled food options and connectivity to Silk Board and Koramangala.
                                    </p>
                                </div>
                            </div>
                            
                            <QuickAnswersBlock locationName="Bangalore" />
                            
                            <FaqSection
                                title="Frequently asked — PG in Bangalore"
                                items={HUB_FAQS}
                                titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                            />
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6 lg:sticky lg:top-28">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Rent Reality Check</h4>
                                <ul className="space-y-4">
                                    <li className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 font-medium">Twin Sharing</span>
                                        <span className="text-slate-900 font-bold">₹8.5k – ₹11k</span>
                                    </li>
                                    <li className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 font-medium">Single Room</span>
                                        <span className="text-slate-900 font-bold">₹13k – ₹18k</span>
                                    </li>
                                </ul>
                                <p className="mt-4 text-[11px] text-slate-400 italic">
                                    *Monthly averages — vary by area and food inclusions.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Also Read</h4>
                                <ul className="space-y-3">
                                    <li>
                                        <Link to="/pg-vs-flat-bangalore" className="text-sm font-bold text-brand-red hover:underline flex items-center justify-between">
                                            PG vs Flat Comparison
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/blog/how-to-choose-pg-in-bangalore" className="text-sm font-bold text-slate-600 hover:text-brand-red flex items-center justify-between">
                                            How to choose a PG
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </aside>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}
