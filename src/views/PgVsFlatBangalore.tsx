'use client';

import { Link } from '@/lib/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { FaqSection } from '@/components/seo/FaqSection';
import { buildPageSEO, pgVsFlatBangaloreSeo } from '@/lib/seo';
import { buildFaqPageSchema } from '@/lib/schema';
import { MapPin } from 'lucide-react';

const VS_FAQS = [
    {
        question: 'Is PG cheaper than a flat in Bangalore?',
        answer: 'Headline rent can look similar, but flats often add brokerage, larger deposits, furniture, utilities, and groceries. PGs may bundle meals and cleaning — compare total monthly spend, not just rent.',
    },
    {
        question: 'Which is better for students: PG or flat?',
        answer: 'PGs usually reduce daily friction (meals, laundry, security) so you can focus on studies. Flats offer more independence if you can manage setup and roommates.',
    },
    {
        question: 'Which is better for working professionals?',
        answer: 'If you work long hours or travel often, a managed PG can save time. If you need space for family or pets, a flat may suit better — expect higher setup cost.',
    },
    {
        question: 'Can I switch from PG to flat later?',
        answer: 'Yes — many tenants use a PG for the first 6–12 months in a new city, then move to a flat once they know neighbourhoods and commute patterns.',
    },
];

export default function PgVsFlatBangalore() {
    const helmet = buildPageSEO(pgVsFlatBangaloreSeo());

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={buildFaqPageSchema(VS_FAQS)} id="pg-vs-flat-faq-json" />

            <Navbar />

            <main id="main-content" className="flex-grow pt-28 pb-16">
                <article className="max-w-3xl mx-auto px-4 sm:px-6">
                    <BreadcrumbNav
                        items={[
                            { name: 'Home', path: '/' },
                            { name: 'PG', path: '/pg' },
                            { name: 'PG vs flat' },
                        ]}
                    />
                    <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        PG vs flat in Bangalore — which is better?
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                        A practical comparison for students and professionals: cost, flexibility, independence, and hidden expenses — so you can pick what fits your stage of life.
                    </p>

                    <div className="mt-10 space-y-6 text-slate-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900">Cost comparison</h2>
                            <p className="mt-2">
                                PG rent often includes meals, WiFi, housekeeping, and security in one number. Flats may show lower headline rent but require deposits, brokerage (in
                                traditional markets), furniture, appliances, and groceries. Add commute cost if a cheaper flat pushes you farther from work.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900">Flexibility &amp; independence</h2>
                            <p className="mt-2">
                                Flats give you control over cooking, guests, and layout. PGs trade some independence for convenience — fewer bills to chase and faster move-in. If you
                                relocate often, PGs can be simpler to exit subject to notice rules.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900">Best for students</h2>
                            <p className="mt-2">
                                Structured meals, curfew norms (where applicable), and peer networks make PGs popular on campuses. If you need quiet for exams, ask about room types
                                and house rules before you pay a token.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900">Best for working professionals</h2>
                            <p className="mt-2">
                                Shift workers should validate meal timings, WiFi reliability, and security. If you entertain clients at home or need a dedicated workspace, a small flat
                                might win — but budget the full setup.
                            </p>
                        </section>
                    </div>

                    <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="font-semibold text-slate-900">Explore next</p>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li>
                                <Link to="/pg/bangalore" className="text-brand-red font-medium hover:underline">
                                    PG in Bangalore (city hub)
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog/pg-rent-vs-flat-rent-bangalore" className="text-brand-red font-medium hover:underline">
                                    Blog: PG rent vs flat rent (deeper dive)
                                </Link>
                            </li>
                            <li>
                                <Link to="/pg/whitefield" className="text-brand-red font-medium hover:underline">
                                    Example area: PG in Whitefield
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-12">
                        <FaqSection
                            title="FAQ — PG vs flat in Bangalore"
                            items={VS_FAQS}
                            titleAdornment={<MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />}
                        />
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
