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
        question: 'What is the average PG rent in Pune?',
        answer: 'PG rent in Pune ranges from ₹5,500 for shared rooms to ₹13,000+ for premium single occupancy near Hinjewadi and Kharadi IT Parks.',
    },
    {
        question: 'Which areas in Pune are best for IT professionals?',
        answer: 'Hinjewadi, Kharadi, Wakad, and Baner are the top areas — closest to major IT parks and with good metro/bus connectivity.',
    },
    {
        question: 'Is there brokerage for PGs on MakeMyStay in Pune?',
        answer: 'No brokerage. Pay only rent and refundable deposit.',
    },
    {
        question: 'Can I book a PG in Pune online?',
        answer: 'Yes. Browse verified listings, pay a token online, and move in on your chosen date.',
    },
];

export default function PGPuneHub() {
    const helmet = buildPageSEO({
        title: 'Best PG in Pune — Verified, Zero Brokerage | MakeMyStay',
        description: 'Find verified PG in Pune near Hinjewadi IT Park and Kharadi from ₹5,500/month. Zero brokerage, WiFi included, instant online booking.',
        path: '/pg/pune'
    });
    
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: 'PG in Pune', path: '/pg/pune' },
    ];
    const combinedLd = buildPgLocationCombinedGraph(HUB_FAQS, breadcrumbItems, 'Pune');

    const topSlugs = PG_LOCATIONS.filter(loc => ['hinjewadi', 'kharadi', 'wakad', 'viman-nagar', 'baner'].includes(loc.slug));

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id="pg-pune-hub-ld-json" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">
                
                {/* ── Hero Header ── */}
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'PG', path: '/pg' },
                                { name: 'PG in Pune' },
                            ]}
                        />
                        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div className="max-w-3xl">
                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                                    Maharashtra · Oxford of the East
                                </p>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                    Best PG in Pune
                                    <span className="block text-brand-red text-2xl md:text-3xl mt-2 font-extrabold opacity-90">
                                        ₹5,500 – ₹13,000 /mo
                                    </span>
                                </h1>
                                <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                                    Find verified PG in Pune near Hinjewadi IT Park and Kharadi from ₹5,500/month. 
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
                        initialCity="Pune"
                        pageTitle="Listings in Pune"
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
                                    Quality Stays in Pune
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Pune is a premier educational and IT corridor. Whether you are studying near <strong>Viman Nagar</strong> or 
                                    working in major hubs like <strong>Infosys, Wipro, TCS, Cognizant, and ThoughtWorks</strong> across Hinjewadi and Kharadi, 
                                    securing a reliable PG ensures you settle quickly and efficiently.
                                </p>
                            </div>

                            <FaqSection
                                title="Frequently asked — PG in Pune"
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
                                        <span className="text-slate-900 font-bold">₹5.5k – ₹9k</span>
                                    </li>
                                    <li className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 font-medium">Single Room</span>
                                        <span className="text-slate-900 font-bold">₹11k – ₹14k</span>
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
