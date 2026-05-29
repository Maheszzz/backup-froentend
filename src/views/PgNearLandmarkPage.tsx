'use client';

import { Link, Navigate, useLocation } from '@/lib/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { RelatedSearchesBlock } from '@/components/seo/RelatedSearchesBlock';
import { getPgNearLandmarkByPath } from '@/data/pgNearLandmarks';
import { getPgLocationBySlug } from '@/data/pgLocations';
import { buildNearbyLandmarkSeo } from '@/lib/seoIntentGenerators';
import { buildPageSEO } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import type { FaqItem } from '@/lib/schema';
import Properties from '@/views/Properties';
import { useMemo, useState } from 'react';

export default function PgNearLandmarkPage() {
    const { pathname } = useLocation();
    const entry = getPgNearLandmarkByPath(pathname);
    const loc = entry ? getPgLocationBySlug(entry.hubSlug) : undefined;

    const [hasEmptyListings, setHasEmptyListings] = useState(false);

    const faqs: FaqItem[] = useMemo(() => {
        if (!entry || !loc) return [];
        return [
            {
                question: `Which areas are best for PG near ${entry.landmark}?`,
                answer: `${loc.name} is the primary inventory cluster for ${entry.landmark}. Compare verified listings below and confirm last-mile commute during office hours.`,
            },
            {
                question: `What rent should I expect near ${entry.landmark}?`,
                answer: `Shared PG often starts around ₹6,000–₹15,000/mo depending on meals and AC; private rooms can be higher. Use filters on this page for your budget band.`,
            },
        ];
    }, [entry, loc]);

    if (!entry || !loc) {
        return <Navigate to="/pg/bangalore" replace />;
    }

    const { name, slug } = loc;
    const path = `/${entry.path}`;
    const helmet = buildPageSEO(buildNearbyLandmarkSeo(entry.landmark, name, path));
    const combinedLd = buildPgLocationCombinedGraph(
        faqs,
        [
            { name: 'Home', path: '/' },
            { name: 'PG', path: '/pg' },
            { name: `PG near ${entry.landmark}`, path },
        ],
        name
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} noindex={hasEmptyListings} />
            <JsonLd data={combinedLd} id="pg-near-landmark-jsonld" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'PG', path: '/pg' },
                                { name: `PG near ${entry.landmark}` },
                            ]}
                        />
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">Bangalore · Landmark</p>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            PG near {entry.landmark}
                        </h1>
                        <p className="mt-2 text-slate-600 text-sm md:text-base max-w-3xl leading-relaxed">
                            {entry.context} Listings are anchored to <strong>{name}</strong> — refine with WiFi, food, and budget
                            filters.
                        </p>
                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-700 max-w-3xl">
                            <p className="font-semibold text-slate-900">Commute tip</p>
                            <p className="mt-1">
                                Test Tuesday/Thursday evening routes before you pay a deposit. Pair this hub with{' '}
                                <Link to="/blog/pg-in-bangalore-guide" className="font-semibold text-brand-red hover:underline">
                                    our Bangalore PG guide
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <Properties
                        hideChrome
                        initialCategory="pg"
                        initialCity={name}
                        pageTitle={`PG near ${entry.landmark}`}
                        pageSubtitle={`Verified PG inventory around ${name} for ${entry.landmark} commuters.`}
                        onEmptyResultsChange={setHasEmptyListings}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
                    <RelatedSearchesBlock currentSlug={slug} localityName={name} variant="pg" />
                </div>
            </main>

            <Footer />
        </div>
    );
}
