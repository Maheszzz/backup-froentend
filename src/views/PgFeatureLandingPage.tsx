'use client';

import { useLayoutEffect } from 'react';
import { Link, Navigate, useLocation, useSearchParams } from '@/lib/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { buildPageSEO, pgFeatureLandingSeo, pgFeaturePathToKind } from '@/lib/seo';
import { buildPgLocationCombinedGraph } from '@/lib/schema';
import Properties from '@/views/Properties';

function featureFaqs(kind: 'wifi' | 'food' | 'ac' | 'girls' | 'boys' | 'single') {
    if (kind === 'wifi') {
        return [
            { question: 'Do PGs in Bangalore include WiFi?', answer: 'Most professional PGs advertise high-speed WiFi. Confirm fair-usage limits and backup during power cuts on the listing or during your visit.' },
            { question: 'Is WiFi speed enough for WFH?', answer: 'Ask for typical Mbps and whether each room has LAN or only shared WiFi. Premium PGs near IT corridors often cater to WFH tenants.' },
        ];
    }
    if (kind === 'food') {
        return [
            { question: 'Is food included in PG rent in Bangalore?', answer: 'Many PGs bundle 2–3 meals; others offer kitchen access or optional meal plans. Confirm veg/non-veg and timing before you pay a deposit.' },
            { question: 'Can I get only breakfast or only dinner?', answer: 'Operators vary — some offer flexible meal coupons or add-ons. Check the listing details or ask on enquiry.' },
        ];
    }
    if (kind === 'ac') {
        return [
            { question: 'Are AC rooms available in Bangalore PGs?', answer: 'Yes — many listings offer AC rooms, often at a premium versus non-AC. Verify inverter backup and maintenance inclusions.' },
        ];
    }
    if (kind === 'girls') {
        return [
            { question: 'Is safety guaranteed in girls PGs in Bangalore?', answer: 'Most girls PGs feature 24/7 security, CCTV, and restricted entry. Verify the presence of a live-in warden and emergency protocols.' },
            { question: 'Are there specific rules in ladies PGs?', answer: 'Common rules include visitor restrictions and gate timings. Review these on the property listing or during your enquiry.' },
        ];
    }
    if (kind === 'boys') {
        return [
            { question: 'What facilities are standard in boys PGs?', answer: 'WiFi, housekeeping, and meal plans are standard. Shared lounges and bike parking are also common in major Bangalore tech clusters.' },
        ];
    }
    return [
        { question: 'What is the benefit of a single room PG?', answer: 'Single rooms offer zero roommate interference, private study/work space, and total privacy within a managed coliving setup.' },
    ];
}

function featureIntro(kind: 'wifi' | 'food' | 'ac' | 'girls' | 'boys' | 'single'): { h1: string; lead: string; body: string } {
    const titles = {
        wifi: 'PG with WiFi in Bangalore',
        food: 'PG with food in Bangalore',
        ac: 'PG with AC in Bangalore',
        girls: 'Girls PG in Bangalore',
        boys: 'Boys PG in Bangalore',
        single: 'Single Room PG in Bangalore',
    };
    const leads = {
        wifi: 'High-speed internet is a must for students and professionals. Browse verified PG listings across Bangalore and filter for connectivity-friendly stays.',
        food: 'Meal-inclusive PGs save daily cooking time. Explore verified stays with food plans — veg and non-veg options vary by operator.',
        ac: 'Beat Bangalore summers with air-conditioned rooms. Compare verified PGs that mention AC in amenities or features.',
        girls: 'Find safe, secured, and comfortable female-only PG accommodations. Verified listings with CCTV and 24/7 security across Bangalore.',
        boys: 'Explore managed male-only PG and coliving stays. High-speed WiFi, optional meals, and flexible terms for early-career professionals.',
        single: 'Enjoy total privacy with single occupancy PG rooms. No more roommate stress — browse premium private rooms in Bangalore.',
    };
    const bodies = {
        wifi: 'Look beyond the word “WiFi” — ask about fair-usage policies, router placement, and whether meetings are workable during peak hours.',
        food: 'Food quality and timing matter as much as rent. Check whether meals are thali-style or buffet and if late-night access exists.',
        ac: 'AC rooms often command higher rent and may have separate electricity metering. Ask about inverter backup for AC during outages.',
        girls: 'Ladies PGs in areas like BTM, HSR, and Whitefield offer proximity to workplaces and safe transport links. Check for laundry and warden support.',
        boys: 'Male coliving spaces prioritize convenience and community. Most listings include cleaning and maintenance in the headline rent.',
        single: 'Single room PGs are the most requested category in 2026. They are ideal for WFH professionals and students needing focus.',
    };
    return { h1: titles[kind], lead: leads[kind], body: bodies[kind] };
}

function filtersReady(kind: 'wifi' | 'food' | 'ac' | 'girls' | 'boys' | 'single', sp: URLSearchParams): boolean {
    if (sp.get('cat') !== 'pg' || sp.get('city') !== 'Bangalore') return false;
    if (kind === 'wifi') return sp.get('wifi') === 'true';
    if (kind === 'food') return sp.get('food') === 'true';
    if (kind === 'ac') return sp.get('ac') === 'true';
    if (kind === 'girls') return sp.get('gender') === 'female' || sp.get('gender') === 'Female';
    if (kind === 'boys') return sp.get('gender') === 'male' || sp.get('gender') === 'Male';
    return sp.get('beds') === '1' || !!sp.get('sharing')?.includes('Single');
}

export default function PgFeatureLandingPage() {
    const { pathname } = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const kind = pgFeaturePathToKind(pathname);

    useLayoutEffect(() => {
        if (!kind) return;
        const params: Record<string, string> = { cat: 'pg', city: 'Bangalore' };
        if (kind === 'wifi') params.wifi = 'true';
        if (kind === 'food') params.food = 'true';
        if (kind === 'ac') params.ac = 'true';
        if (kind === 'girls') params.gender = 'female';
        if (kind === 'boys') params.gender = 'male';
        if (kind === 'single') params.beds = '1';
        setSearchParams(params, { replace: true });
    }, [kind, setSearchParams]);

    if (!kind) {
        return <Navigate to="/pg" replace />;
    }

    const ready = filtersReady(kind, searchParams);

    if (!ready) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center pt-24 pb-32">
                    <LoadingSpinner message="Applying filters for your search…" />
                </div>
                <Footer />
            </div>
        );
    }

    const seo = pgFeatureLandingSeo(kind);
    const helmet = buildPageSEO(seo);
    const copy = featureIntro(kind);
    const faqs = featureFaqs(kind);
    const paths = { 
        wifi: '/pg-with-wifi', 
        food: '/pg-with-food', 
        ac: '/pg-with-ac',
        girls: '/pg-for-girls',
        boys: '/pg-for-boys',
        single: '/pg-single-room'
    };
    const crumbPath = paths[kind];
    const combinedLd = buildPgLocationCombinedGraph(faqs, [
        { name: 'Home', path: '/' },
        { name: 'PG', path: '/pg' },
        { name: copy.h1, path: crumbPath },
    ], 'Bangalore');

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <SEOHead {...helmet} />
            <JsonLd data={combinedLd} id={`pg-feature-${kind}-json`} />

            <Navbar />

            <main id="main-content" className="flex-grow pt-28 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <header className="max-w-3xl">
                        <BreadcrumbNav
                            items={[
                                { name: 'Home', path: '/' },
                                { name: 'PG', path: '/pg' },
                                { name: copy.h1 },
                            ]}
                        />
                        <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{copy.h1}</h1>
                        <p className="mt-3 text-lg text-slate-600 leading-relaxed">{copy.lead}</p>
                        <p className="mt-4 text-slate-700 leading-relaxed">{copy.body}</p>
                        <p className="mt-4 text-sm">
                            <Link to="/pg/bangalore" className="font-semibold text-brand-red hover:underline">
                                ← PG in Bangalore (city hub)
                            </Link>
                        </p>
                    </header>
                </div>

                <div className="mt-8 border-t border-slate-200/80 bg-white">
                    <Properties
                        hideChrome
                        initialCategory="pg"
                        initialCity="Bangalore"
                        pageTitle={`${copy.h1} — listings`}
                        pageSubtitle="Filters applied for this page — scroll to refine further."
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
