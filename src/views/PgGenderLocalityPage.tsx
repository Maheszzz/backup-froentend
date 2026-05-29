'use client';

import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from '@/lib/navigation';
import { MapPin, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { RelatedSearchesBlock } from '@/components/seo/RelatedSearchesBlock';
import { getPgLocationBySlug } from '@/data/pgLocations';
import { buildPgLocationFaqs } from '@/lib/pgLocalityFaqs';
import { absoluteUrl, buildPageSEO, pgGenderLocalitySeo } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import type { FaqItem } from '@/lib/schema';
import Properties from '@/views/Properties';

export default function PgGenderLocalityPage() {
    const { pathname } = useLocation();
    const { slug: slugParam } = useParams<{ slug: string }>();
    const slug = (slugParam || '').toLowerCase();
    const loc = getPgLocationBySlug(slug);

    const isFemaleHub = /pg-for-(girls|women)-in-/i.test(pathname);
    const isMenOrWomenAlias = /pg-for-(men|women)-in-/i.test(pathname);
    const filterGender = isFemaleHub ? ('female' as const) : ('male' as const);
    const audienceLabel = isFemaleHub ? 'Girls PG' : 'Boys PG';
    const canonicalPath = isFemaleHub ? `/pg-for-girls-in-${slug}` : `/pg-for-boys-in-${slug}`;
    const seoVariant = pathname.includes('men') ? ('men' as const) : pathname.includes('women') ? ('women' as const) : filterGender;

    const [hasEmptyListings, setHasEmptyListings] = useState(false);

    if (!loc) {
        return <Navigate to={isFemaleHub ? '/pg-for-girls' : '/pg-for-boys'} replace />;
    }

    const { name, slug: locSlug } = loc;
    const baseSeo = pgGenderLocalitySeo(name, slug, seoVariant);
    const helmet = buildPageSEO({
        ...baseSeo,
        ...(isMenOrWomenAlias ? { canonicalUrl: absoluteUrl(canonicalPath) } : {}),
    });

    const faqs: FaqItem[] = useMemo(() => {
        const base = buildPgLocationFaqs(name);
        const extra: FaqItem =
            filterGender === 'male'
                ? {
                      question: `Is ${name} good for boys PG near IT offices?`,
                      answer: `${name} is on many ORR and tech-corridor commutes. Compare verified boys PG and male coliving on this page — check WiFi, meals, and gate security on each listing before you pay a token.`,
                  }
                : {
                      question: `Are girls PGs in ${name} safe for working women?`,
                      answer: `Look for CCTV, biometric entry, warden support, and clear visitor policies. Verified listings on MakeMyStay.ai highlight safety-focused amenities — always confirm on a site visit.`,
                  };
        return [extra, ...base];
    }, [name, filterGender]);

    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: `${audienceLabel} in ${name}`, path: canonicalPath },
    ];
    const combinedLd = buildPgLocationCombinedGraph(faqs, breadcrumbItems, name);

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} noindex={hasEmptyListings} />
            <JsonLd data={combinedLd} id="pg-gender-locality-ld-json" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'PG', path: '/pg' },
                                { name: `${audienceLabel} in ${name}` },
                            ]}
                        />
                        <div className="mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
                                    Bangalore · {audienceLabel}
                                </p>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                    Verified {audienceLabel.toLowerCase()} in {name}
                                </h1>
                                <p className="mt-2 text-slate-500 text-sm md:text-base leading-relaxed max-w-2xl">
                                    Long-tail search hub for {name} — zero brokerage on many listings, real photos, and filters for
                                    WiFi, meals, and AC on live inventory below.
                                </p>
                                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 max-w-2xl">
                                    <p className="font-semibold text-slate-900">Quick facts</p>
                                    <p className="mt-1">
                                        <span className="font-medium">Best for:</span> students, working professionals, early-career
                                        relocators.
                                    </p>
                                    <p className="mt-1">
                                        <span className="font-medium">Typical PG rent band in {name}:</span> ₹6,000–₹18,000/mo
                                        (varies by sharing, meals, and AC).
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0 text-xs font-bold">
                                <Link to={`/pg/${slug}`} className="inline-flex items-center gap-1.5 text-brand-red hover:underline">
                                    <MapPin className="w-3.5 h-3.5" aria-hidden />
                                    All PG in {name}
                                    <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                                </Link>
                                <Link to={`/rent/${slug}`} className="inline-flex items-center gap-1.5 text-slate-600 hover:underline">
                                    Flats for rent in {name}
                                    <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <Properties
                        hideChrome
                        initialCategory="pg"
                        initialCity={name}
                        pageTitle={`${audienceLabel} in ${name}`}
                        pageSubtitle={`Verified ${audienceLabel.toLowerCase()} — client-filtered for gender cues in listing text.`}
                        forcedGenderFilter={filterGender}
                        onEmptyResultsChange={setHasEmptyListings}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <FaqSection
                        id={`pg-gender-${slug}-faq`}
                        title={`${audienceLabel} in ${name} — FAQs`}
                        items={faqs}
                        variant="light"
                        collapsible
                        titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                    />
                    <div className="mt-10">
                        <RelatedSearchesBlock currentSlug={locSlug} localityName={name} variant="pg" />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
