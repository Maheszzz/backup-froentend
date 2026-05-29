'use client';

import { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from '@/lib/navigation';
import { Home, ChevronRight, MapPin } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { RelatedSearchesBlock } from '@/components/seo/RelatedSearchesBlock';
import locJson from '@/data/pg-locations.json';
import { getPgLocationBySlug } from '@/data/pgLocations';
import { buildRentLocationFaqs } from '@/lib/rentLocalityFaqs';
import { buildPageSEO, rentLocationHubSeo } from '@/lib/seo';
import { buildPgHubItemListSchema, buildPgLocationCombinedGraph } from '@/lib/schema';
import type { Property } from '@/types/api';
import Properties from '@/views/Properties';

export default function RentLocationPage() {
    const { slug: locationParam } = useParams<{ slug: string }>();
    const param = (locationParam || '').toLowerCase();
    const loc = getPgLocationBySlug(param);

    if (!loc) {
        return (
            <Properties
                key={`rent-${locationParam ?? 'hub'}`}
                initialCategory="rent"
                initialCity={locationParam ?? 'all'}
            />
        );
    }

    const { name, slug } = loc;
    const helmet = buildPageSEO(rentLocationHubSeo(name, slug));
    const faqs = buildRentLocationFaqs(name, slug);
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'Rent', path: '/rent/bangalore' },
        { name: `Rent in ${name}`, path: `/rent/${slug}` },
    ];
    const combinedLd = buildPgLocationCombinedGraph(faqs, breadcrumbItems, name);

    const [hubListingsForSeo, setHubListingsForSeo] = useState<Property[]>([]);
    const onDisplayedListingsForSeo = useCallback((list: Property[]) => {
        setHubListingsForSeo((prev) => {
            if (prev.length === list.length && prev.every((p, i) => p.id === list[i]?.id)) {
                return prev;
            }
            return list;
        });
    }, []);

    const itemListLd = useMemo(
        () =>
            buildPgHubItemListSchema(hubListingsForSeo, {
                name: `Rent listings in ${name}`,
                description: `Verified flats and houses for rent in ${name}, Bangalore — same URLs as on-page cards.`,
            }),
        [hubListingsForSeo, name]
    );

    const [hasEmptyListings, setHasEmptyListings] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} noindex={hasEmptyListings} />
            <JsonLd data={combinedLd} id="rent-location-ld-json" />
            {itemListLd ? <JsonLd data={itemListLd} id="rent-location-itemlist-ld-json" /> : null}
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'Rent', path: '/rent/bangalore' },
                                { name: `Rent in ${name}` },
                            ]}
                        />
                        <div className="mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
                                    Bangalore · Rent
                                </p>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                    Flats &amp; houses for rent in {name}
                                </h1>
                                <p className="mt-2 text-slate-500 text-sm md:text-base leading-relaxed max-w-2xl">
                                    Verified apartments and independent homes in{' '}
                                    <strong className="text-slate-700">{name}</strong> — transparent rent, real photos, and
                                    options with zero brokerage on many listings.
                                </p>
                                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-700 max-w-2xl">
                                    <p className="font-semibold text-slate-900">Quick facts</p>
                                    <p className="mt-1">
                                        <span className="font-medium">Best for:</span> working professionals, small families,
                                        roommate-free 1BHK seekers.
                                    </p>
                                    <p className="mt-1">
                                        <span className="font-medium">Typical 1BHK band in {name}:</span> ₹18,000–₹38,000/mo
                                        (furnishing and society dues vary).
                                    </p>
                                </div>
                            </div>
                            <Link
                                to={`/pg/${slug}`}
                                className="inline-flex items-center gap-1.5 shrink-0 text-xs font-bold text-brand-red hover:underline"
                            >
                                <Home className="w-3.5 h-3.5" aria-hidden />
                                PG in {name}
                                <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <Properties
                        hideChrome
                        initialCategory="rent"
                        initialCity={name}
                        pageTitle={`Rent in ${name}`}
                        pageSubtitle={`Verified flats & houses in ${name} — filter by BHK and budget.`}
                        onDisplayedListingsForSeo={onDisplayedListingsForSeo}
                        onEmptyResultsChange={setHasEmptyListings}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-10">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />
                            Why search rent in {name} on MakeMyStay.ai
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                            {name} stays popular with IT teams and families because of commute access and neighbourhood amenities.
                            Shortlist verified listings, compare deposits, and book visits without endless broker follow-ups. Pair this
                            hub with our{' '}
                            <Link to="/blog/pg-in-bangalore-guide" className="font-semibold text-brand-red hover:underline">
                                PG in Bangalore guide
                            </Link>{' '}
                            if you are still deciding between PG and flat.
                        </p>
                    </section>

                    <FaqSection
                        id={`rent-${slug}-faq`}
                        title="Rent FAQs"
                        items={faqs}
                        variant="light"
                        titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                    />

                    <section className="pt-6 border-t border-slate-200/60">
                        <h2 className="font-heading text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <div className="w-1.5 h-5 bg-brand-red rounded-full" />
                            Nearby rent hubs
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {locJson
                                .filter((l) => l.slug !== slug)
                                .slice(0, 12)
                                .map((item) => (
                                    <Link
                                        key={item.slug}
                                        to={`/rent/${item.slug}`}
                                        className="group flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-brand-red/30 hover:shadow-md transition-all duration-200"
                                    >
                                        <MapPin className="w-3 h-3 text-slate-400 group-hover:text-brand-red shrink-0 transition-colors" />
                                        <span className="text-[12px] font-semibold text-slate-600 group-hover:text-brand-red transition-colors truncate">
                                            {item.name}
                                        </span>
                                    </Link>
                                ))}
                        </div>
                    </section>

                    <RelatedSearchesBlock currentSlug={slug} localityName={name} variant="rent" />
                </div>
            </main>

            <Footer />
        </div>
    );
}
