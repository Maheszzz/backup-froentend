'use client';

import { Link } from '@/lib/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPageSEO, buildHowWeVerifyPageSEO } from '@/lib/seo';
import { buildBreadcrumbSchema, buildFaqPageSchema, type FaqItem } from '@/lib/schema';

const VERIFY_FAQS: FaqItem[] = [
    {
        question: 'Is MakeMyStay.ai a verified rental platform?',
        answer:
            'We publish listings only after baseline checks — photo consistency, availability, and owner or operator identity. Serious discrepancies trigger re-review or delisting.',
    },
    {
        question: 'Does MakeMyStay charge brokerage?',
        answer:
            'We position many rentals and PGs as zero brokerage for tenants; confirm on each listing and before you pay any token or deposit.',
    },
    {
        question: 'What should I still verify myself?',
        answer:
            'Always visit the property, read the agreement, confirm deposit and notice terms, and validate building or society rules. Use listings as a shortlist, not a substitute for due diligence.',
    },
];

export default function HowWeVerify() {
    const helmet = buildPageSEO(buildHowWeVerifyPageSEO());
    const breadcrumbLd = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'How we verify', path: '/how-we-verify' },
    ]);
    const faqLd = buildFaqPageSchema(VERIFY_FAQS);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd id="how-verify-breadcrumb" data={breadcrumbLd} />
            <JsonLd id="how-verify-faq" data={faqLd} />
            <Navbar />
            <main id="main-content" className="flex-grow pt-28 pb-16">
                <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate prose-lg">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight not-prose mb-6">
                        How we verify listings
                    </h1>
                    <p className="lead text-slate-600">
                        Every live listing should meet a <strong>minimum quality bar</strong> before we send traffic to
                        it: accurate category (PG vs rent vs buy vs plot), honest photos, and pricing that is not
                        obviously misleading versus comparable inventory in the same micro-market.
                    </p>
                    <h2>What our process covers</h2>
                    <ol>
                        <li>
                            <strong>Photo &amp; amenity audit</strong> — we look for stock-image patterns, duplicate
                            galleries across unrelated listings, and claims (WiFi, food, AC) that the PDP should
                            support.
                        </li>
                        <li>
                            <strong>Operator identity</strong> — owner or authorised manager contact on file; repeat
                            fraud patterns are blocked.
                        </li>
                        <li>
                            <strong>Rent / price sanity</strong> — extreme outliers vs the same locality and bed count
                            are flagged for human review.
                        </li>
                        <li>
                            <strong>Change control</strong> — material edits to price or availability can trigger
                            re-verification on sensitive categories.
                        </li>
                    </ol>
                    <p className="text-slate-600 text-base not-prose">
                        This page describes our product intent. For legal terms see{' '}
                        <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy</Link>.
                    </p>
                </article>
            </main>
            <Footer />
        </div>
    );
}
