'use client';

import { Link, Navigate, useParams, useSearchParams } from '@/lib/navigation';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { PgLocalitySeoContent } from '@/components/seo/PgLocalitySeoContent';
import { RelatedSearchesBlock } from '@/components/seo/RelatedSearchesBlock';
import { getPgLocationBySlug, resolveLegacyPgSlug } from '@/data/pgLocations';
import { buildLocalityFaqs, buildLocalityAeoGraph, resolveLocalityProfile } from '@/lib/pgLocalityContent';
import { buildPageSEO, pgLocationSeoWithQuery, stablePgListingCanonical } from '@/lib/seo';
import { QuickAnswer } from '@/components/seo/QuickAnswer';
import { LocalityTrustStrip } from '@/components/trust/LocalityTrustStrip';
import { LocationComparisonTable } from '@/components/seo/LocationComparisonTable';
import locJson from '@/data/pg-locations.json';
import Properties from '@/views/Properties';
import { MapPin, ChevronRight } from 'lucide-react';

export default function PGLocationPage({ overrideSlug, overrideMaxPrice }: { overrideSlug?: string; overrideMaxPrice?: string }) {
    const { slug: locationParamFromParams } = useParams<{ slug: string }>();
    const locationParam = overrideSlug || locationParamFromParams;
    const [searchParams] = useSearchParams();
    const [hasEmptyListings, setHasEmptyListings] = useState(false);
    const legacyTarget = resolveLegacyPgSlug(locationParam);
    if (legacyTarget) {
        return <Navigate to={`/pg/${legacyTarget}`} replace />;
    }

    const loc = getPgLocationBySlug(locationParam);
    if (!loc) {
        return <Navigate to="/pg" replace />;
    }

    const { name, slug } = loc;
    const seoInput = pgLocationSeoWithQuery(name, slug, searchParams);
    const helmet = buildPageSEO(seoInput);
    const profile = resolveLocalityProfile(slug);
    const faqs = buildLocalityFaqs(name, slug);
    const canonicalListingPath = stablePgListingCanonical(slug, searchParams);
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: `PG in ${name}`, path: canonicalListingPath },
    ];
    const combinedLd = buildLocalityAeoGraph(profile, faqs, breadcrumbItems, canonicalListingPath);

    const pageTitle = overrideMaxPrice ? `Budget PG in ${name} under ₹${overrideMaxPrice}` : `PG in ${name}`;
    const pageSubtitle = overrideMaxPrice
        ? `Best budget-friendly PG in ${name} under ₹${overrideMaxPrice}. Verified stays with WiFi & food.`
        : `Verified paying guest stays in ${name} — filter by budget, food plan, and room type.`;

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} noindex={helmet.noindex || hasEmptyListings} />
            <JsonLd data={combinedLd} id="pg-location-ld-json" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">

                {/* ── HeroBanner ── */}
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'PG', path: '/pg' },
                                { name: `PG in ${name}` },
                            ]}
                        />
                        <div className="mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
                                    Bangalore · PG
                                </p>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                    PG in {name}
                                </h1>
                                <p className="mt-2 text-slate-500 text-sm md:text-base leading-relaxed max-w-2xl">
                                    Verified accommodations in <strong className="text-slate-700">{name}</strong> — transparent pricing,
                                    instant shortlist, and secure online booking.
                                </p>
                                <div className="mt-4 max-w-2xl space-y-3">
                                    <QuickAnswer locationName={name}>{profile.quickAnswer}</QuickAnswer>
                                    <LocalityTrustStrip slug={slug} name={name} />
                                </div>
                            </div>
                            <Link
                                to="/pg/bangalore"
                                className="inline-flex items-center gap-1.5 shrink-0 text-xs font-bold text-brand-red hover:underline"
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                Full Bangalore PG guide
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── PROPERTIES FIRST ── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <Properties
                        hideChrome
                        initialCategory="pg"
                        initialCity={name}
                        initialMaxPrice={overrideMaxPrice}
                        pageTitle={pageTitle}
                        pageSubtitle={pageSubtitle}
                        onEmptyResultsChange={setHasEmptyListings}
                    />
                </div>

                {/* ── SEO CONTENT BELOW ── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-10">

                    {/* Area Guide */}
                    <PgLocalitySeoContent name={name} slug={slug} />

                    {/* Comparison Table */}
                    <LocationComparisonTable currentLocation={name} />

                    <RelatedSearchesBlock currentSlug={slug} localityName={name} variant="pg" />

                    {/* Nearby Localities */}
                    <section className="pt-6 border-t border-slate-200/60">
                        <h2 className="font-heading text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <div className="w-1.5 h-5 bg-brand-red rounded-full" />
                            Explore Nearby Area Hubs
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {(profile.nearbySlugs.length > 0
                                ? profile.nearbySlugs
                                      .map((s) => locJson.find((l) => l.slug === s || (s === 'btm' && l.slug === 'btm')))
                                      .filter(Boolean)
                                : locJson.filter((l) => l.slug !== slug).slice(0, 10)
                            ).map((item) => {
                                if (!item) return null;
                                const hubSlug = item.slug === 'btm' ? 'btm' : item.slug;
                                return (
                                    <Link
                                        key={item.slug}
                                        to={`/pg/${hubSlug}`}
                                        className="group flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-brand-red/30 hover:shadow-md transition-all duration-200"
                                    >
                                        <MapPin className="w-3 h-3 text-slate-400 group-hover:text-brand-red shrink-0 transition-colors" />
                                        <span className="text-[12px] font-semibold text-slate-600 group-hover:text-brand-red transition-colors truncate">
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
