'use client';

import { Link } from '@/lib/navigation';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { Shield, Star, Zap, Navigation } from 'lucide-react';
import Properties from '@/views/Properties';

export default function PgNearMe() {
    const [hasEmptyListings, setHasEmptyListings] = useState(false);
    const seo = {
        title: 'PG Near Me in Bangalore | Top-rated verified PG stays — browse now',
        description: 'Searching for PG near me? Find verified paying guest accommodations in Bangalore with WiFi, meals, and 24/7 security. Compare top listings in your immediate area.',
        canonicalHref: 'https://makemystay.ai/pg-near-me',
    };

    const faqs = [
        {
            question: 'How do I find the best PG near me in Bangalore?',
            answer: 'Use MakeMyStay.ai to browse verified listings by your current locality. Look for properties with high ratings, verified badges, and transparent pricing in areas like Whitefield, HSR, or BTM.',
        },
        {
            question: 'What is the standard rent for a PG near me?',
            answer: 'In Bangalore, PG rent typically starts from ₹6,000 for triple sharing and goes up to ₹18,000+ for premium single rooms. Location and amenities (AC/Food) significantly impact the final price.',
        },
        {
            question: 'Are PGs near me safe for women?',
            answer: 'Yes, most professional ladies PGs featured on our platform include 24/7 security, CCTV surveillance, and resident wardens. Always check for "Verified" properties for added peace of mind.',
        }
    ];

    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: 'PG Near Me' },
    ];

    const combinedLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": breadcrumbItems.map((item, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": item.name,
                    "item": item.path ? `https://makemystay.ai${item.path}` : undefined
                }))
            },
            {
                "@type": "FAQPage",
                "mainEntity": faqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...seo} noindex={hasEmptyListings} />
            <JsonLd data={combinedLd} id="pg-near-me-ld-json" />

            <Navbar />

            <main id="main-content" className="flex-grow pt-28 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Header Card */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-900/5 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        
                        <header className="relative z-10 max-w-4xl">
                            <BreadcrumbNav items={breadcrumbItems} />
                            
                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 italic">
                                    <Navigation className="w-3 h-3" />
                                    Location Aware Results
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                    <Zap className="w-3 h-3 fill-blue-700" />
                                    Instant Booking
                                </span>
                            </div>

                            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                Find the Best <span className="text-brand-red">PG Near Me</span> in Bangalore
                            </h1>
                            
                            <p className="mt-6 text-slate-600 text-base md:text-xl leading-relaxed max-w-3xl">
                                Looking for a safe and comfortable stay nearby? We've curated the top-rated <strong>Paying Guest accommodations</strong> in Bangalore's key IT and education hubs. 
                                Every listing is <strong>verified for hygiene and security</strong>.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link to="/pg" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                                    Browse All Verified PGs
                                </Link>
                                <a href="tel:+918150099911" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-brand-red hover:text-brand-red transition-all">
                                    Speak to an Expert
                                </a>
                            </div>
                        </header>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-start gap-4">
                            <div className="bg-brand-red/10 p-3 rounded-2xl shrink-0">
                                <Shield className="w-6 h-6 text-brand-red" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Verified Stays</h3>
                                <p className="text-sm text-slate-500 mt-1">Every PG near you is physically verified by our team.</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-start gap-4">
                            <div className="bg-emerald-50 p-3 rounded-2xl shrink-0">
                                <Zap className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Ready to Move</h3>
                                <p className="text-sm text-slate-500 mt-1">Instant confirmation and immediate move-in available.</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-start gap-4">
                            <div className="bg-amber-50 p-3 rounded-2xl shrink-0">
                                <Star className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Premium Perks</h3>
                                <p className="text-sm text-slate-500 mt-1">WiFi, washing machine, and home-style food included.</p>
                            </div>
                        </div>
                    </div>

                    {/* Narrative AEO Content */}
                    <article className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10 max-w-4xl">
                            <p className="text-brand-red font-bold text-sm tracking-widest uppercase mb-4">Market Guide 2026</p>
                            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">How to choose the right PG in Bangalore?</h2>
                            <div className="space-y-6 text-slate-300 leading-relaxed text-sm md:text-base">
                                <p>
                                    When searching for a <strong>PG near me</strong>, prioritize commute over cost. Staying in <strong>HSRLayout</strong> for a job in <strong>Whitefield</strong> might save you ₹2,000 in rent, but cost you 3 hours daily in traffic.
                                </p>
                                <p>
                                    Modern PGs in Bangalore are now called <strong>Coliving Spaces</strong>. They offer more than just a bed; you get high-speed WiFi for WFH, professional housekeeping, and a community of like-minded techies and entrepreneurs.
                                </p>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2"></div>
                    </article>

                    {/* Real Listings Integration */}
                    <div className="pt-8 border-t border-slate-200/80">
                        <Properties
                            hideChrome
                            initialCategory="pg"
                            pageTitle="PG Accommodations"
                            pageSubtitle="Real-time verified listings across Bangalore"
                            onEmptyResultsChange={setHasEmptyListings}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
