'use client';

import { Link } from '@/lib/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPageSEO, buildAboutPageSEO } from '@/lib/seo';
import { buildBreadcrumbSchema } from '@/lib/schema';

export default function About() {
    const helmet = buildPageSEO(buildAboutPageSEO());
    const breadcrumbLd = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
    ]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd id="about-breadcrumb" data={breadcrumbLd} />
            <Navbar />
            <main id="main-content" className="flex-grow pt-28 pb-16">
                <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate prose-lg">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight not-prose mb-6">
                        About MakeMyStay
                    </h1>
                    <p className="lead text-slate-600">
                        MakeMyStay.ai is a Bangalore-first property discovery platform for{' '}
                        <strong>verified PGs, rentals, resale homes, and plots</strong> — with transparent pricing,
                        real photos, and zero brokerage for tenants on supported listings.
                    </p>
                    <h2>What we optimise for</h2>
                    <ul>
                        <li>Clear locality and category pages so you can compare real inventory, not broker spam.</li>
                        <li>Fast enquiry and visit booking — fewer middlemen, more direct owner or operator context.</li>
                        <li>Consistent trust signals: structured data, breadcrumbs, and FAQs across major hubs.</li>
                    </ul>
                    <h2>Contact</h2>
                    <p>
                        HSR Layout, Sector 4, Bengaluru 560102 ·{' '}
                        <a href="mailto:connect@makemystay.ai">connect@makemystay.ai</a> ·{' '}
                        <a href="tel:+918150099911">+91 81500 99911</a>
                    </p>
                    <p>
                        <Link to="/how-we-verify">How we verify listings →</Link>
                    </p>
                </article>
            </main>
            <Footer />
        </div>
    );
}
