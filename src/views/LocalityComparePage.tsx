'use client';

import { Link, Navigate, useParams } from '@/lib/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { QuickAnswer } from '@/components/seo/QuickAnswer';
import { FaqSection } from '@/components/seo/FaqSection';
import { getLocalityComparison } from '@/data/localityComparisons';
import { buildPageSEO } from '@/lib/seo';
import { buildComparisonAeoGraph } from '@/lib/pgLocalityContent';
import { Check } from 'lucide-react';

export default function LocalityComparePage() {
    const { pair } = useParams<{ pair: string }>();
    const cmp = getLocalityComparison(pair || '');

    if (!cmp) {
        return <Navigate to="/pg/bangalore" replace />;
    }

    const path = `/compare/${cmp.pairSlug}`;
    const helmet = buildPageSEO({
        title: cmp.title,
        description: cmp.description,
        path,
    });
    const faqs = [
        {
            question: `Is ${cmp.left.name} or ${cmp.right.name} better for PG?`,
            answer: cmp.verdict,
        },
        {
            question: `What is the main difference between PG in ${cmp.left.name} and ${cmp.right.name}?`,
            answer: cmp.summary,
        },
    ];
    const breadcrumbItems = [
        { name: 'Home', path: '/' },
        { name: 'PG Bangalore', path: '/pg/bangalore' },
        { name: cmp.title, path },
    ];
    const ld = buildComparisonAeoGraph(cmp, faqs, breadcrumbItems, path);

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={ld} id="compare-ld-json" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <BreadcrumbNav items={breadcrumbItems} />
                    <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{cmp.title}</h1>
                    <div className="mt-6">
                        <QuickAnswer>{cmp.summary}</QuickAnswer>
                    </div>

                    <div className="mt-10 grid md:grid-cols-2 gap-6">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900">
                                <Link to={`/pg/${cmp.left.slug}`} className="text-brand-red hover:underline">
                                    PG in {cmp.left.name}
                                </Link>
                            </h2>
                            <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                {cmp.leftPros.map((p) => (
                                    <li key={p} className="flex gap-2">
                                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </section>
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900">
                                <Link to={`/pg/${cmp.right.slug}`} className="text-brand-red hover:underline">
                                    PG in {cmp.right.name}
                                </Link>
                            </h2>
                            <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                {cmp.rightPros.map((p) => (
                                    <li key={p} className="flex gap-2">
                                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <section className="mt-8 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-6">
                        <h2 className="text-lg font-bold text-slate-900">Verdict</h2>
                        <p className="mt-2 text-slate-700 leading-relaxed" data-seo="compare-verdict">
                            {cmp.verdict}
                        </p>
                    </section>

                    <FaqSection
                        id="compare-faq-heading"
                        title="People also ask"
                        items={faqs}
                        collapsible
                        className="mt-10"
                    />

                    <p className="mt-8 text-sm text-slate-600">
                        Browse live listings:{' '}
                        <Link to={`/pg/${cmp.left.slug}`} className="font-semibold text-brand-red hover:underline">
                            PG in {cmp.left.name}
                        </Link>
                        {' · '}
                        <Link to={`/pg/${cmp.right.slug}`} className="font-semibold text-brand-red hover:underline">
                            PG in {cmp.right.name}
                        </Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
