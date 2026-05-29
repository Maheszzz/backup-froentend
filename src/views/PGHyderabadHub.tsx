'use client';

import { Link } from '@/lib/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { PG_LOCATIONS } from '@/data/pgLocations';
import { buildPageSEO } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/views/Properties';
import { MapPin, ChevronRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const HUB_FAQS = [
    {
        question: 'What is the average PG rent in Hyderabad?',
        answer: 'PG rent in Hyderabad ranges from ₹5,000 for shared rooms to ₹12,000+ for premium single occupancy near HiTech City and Gachibowli.',
    },
    {
        question: 'Which areas in Hyderabad are best for IT professionals?',
        answer: 'HiTech City, Gachibowli, Kondapur, and Madhapur are the top areas — all within 10 minutes of major tech parks.',
    },
    {
        question: 'Is there brokerage for PGs on MakeMyStay in Hyderabad?',
        answer: 'No brokerage. Pay only rent and refundable deposit.',
    },
    {
        question: 'Can I book a PG in Hyderabad online?',
        answer: 'Yes. Browse verified listings, pay a token online, and move in on your chosen date.',
    },
];

export default function PGHyderabadHub() {
    const helmet = buildPageSEO({
        title: 'Best PG in Hyderabad — Verified, Zero Brokerage | MakeMyStay',
        description: 'Find verified PG in Hyderabad near HiTech City and Gachibowli from ₹5,000/month. Zero brokerage, WiFi included, instant online booking.',
        path: '/pg/hyderabad'
    });
    
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: 'PG in Hyderabad', path: '/pg/hyderabad' },
    ];
    const combinedLd = buildPgLocationCombinedGraph(HUB_FAQS, breadcrumbItems, 'Hyderabad');

    const topSlugs = PG_LOCATIONS.filter(loc => ['hitech-city', 'gachibowli', 'kondapur', 'madhapur', 'kukatpally'].includes(loc.slug));

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id="pg-hyderabad-hub-ld-json" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">
                
                {/* ── Hero Header ── */}
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'PG', path: '/pg' },
                                { name: 'PG in Hyderabad' },
                            ]}
                        />
                        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div className="max-w-3xl">
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                                    Telangana · IT Hub
                                </p>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                    Best PG in Hyderabad
                                    <span className="block text-brand-red text-2xl md:text-3xl mt-2 font-extrabold opacity-90">
                                        ₹5,000 – ₹12,000 /mo
                                    </span>
                                </h1>
                                <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                                    Find verified PG in Hyderabad near HiTech City and Gachibowli from ₹5,000/month. 
                                    Zero brokerage, WiFi included, instant online booking.
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                    <Properties
                        hideChrome
                        initialCategory="pg"
                        initialCity="Hyderabad"
                        pageTitle="Listings in Hyderabad"
                        pageSubtitle="Verified paying guest stays — filter by budget, WiFi, food, AC, and more."
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
                                    Make Your Stay in Hyderabad Seamless
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Hyderabad offers some of the best-managed and most affordable co-living options among major Indian IT hubs. 
                                    With major employers like <strong>Google, Microsoft, Amazon, Infosys, and TCS</strong> based in the city, the demand for high-quality stays is tremendous.
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    Whether you are shifting to <strong>HiTech City</strong> for your first job or looking for comfortable spaces in <strong>Kondapur</strong>, taking a PG ensures you don't worry about furnishing, WiFi, or daily meals.
                                </p>
                            </div>

                            <FaqSection
                                title="Frequently asked — PG in Hyderabad"
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
                                        <span className="text-slate-900 font-bold">₹5k – ₹8k</span>
                                    </li>
                                    <li className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 font-medium">Single Room</span>
                                        <span className="text-slate-900 font-bold">₹10k – ₹15k</span>
                                    </li>
                                </ul>
                                <p className="mt-4 text-[11px] text-slate-400 italic">
                                    *Monthly averages — vary by area and food inclusions.
                                </p>
                            </div>
                        </aside>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}
