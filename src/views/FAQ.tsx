'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BRAND_ONE_LINER } from '@/lib/brandEntity';
import { buildPageSEO, buildFaqPageSEO } from '@/lib/seo';
import { buildFaqPageSchema } from '@/lib/schema';

interface FAQItem {
    q: string;
    a: React.ReactNode;
    /** Plain text for JSON-LD (same meaning as visible content). */
    schemaAnswer: string;
}

interface FAQSection {
    title: string;
    emoji: string;
    items: FAQItem[];
}

const faqData: FAQSection[] = [
    {
        title: 'General',
        emoji: '🔹',
        items: [
            {
                q: 'What is MakeMyStay.ai?',
                a: BRAND_ONE_LINER,
                schemaAnswer: BRAND_ONE_LINER,
            },
            {
                q: 'How does MakeMyStay work?',
                a: 'Browse verified PGs, flats, and coliving on MakeMyStay.ai, filter by area and budget, shortlist listings with real photos, schedule visits, and complete booking or token payment with coordinated support when available.',
                schemaAnswer:
                    'Browse verified PGs, flats, and coliving on MakeMyStay.ai, filter by area and budget, shortlist listings with real photos, schedule visits, and complete booking or token payment with coordinated support when available.',
            },
            {
                q: 'What locations do you operate in?',
                a: 'MakeMyStay.ai is strongest in Bangalore across major IT and residential corridors. We also list inventory in Hyderabad and Pune where supply is live — check the city hubs on the site for current coverage.',
                schemaAnswer:
                    'MakeMyStay.ai is strongest in Bangalore across major IT and residential corridors. We also list inventory in Hyderabad and Pune where supply is live — check the city hubs on the site for current coverage.',
            },
            {
                q: 'Do I need to create an account?',
                a: 'Creating an account allows you to save listings, track inquiries, and manage bookings. Browsing may be available without login.',
                schemaAnswer:
                    'Creating an account allows you to save listings, track inquiries, and manage bookings. Browsing may be available without login.',
            },
            {
                q: 'What makes MakeMyStay different?',
                a: 'MakeMyStay.ai combines AI-powered discovery with verified listings, transparent pricing, and zero brokerage on many properties — so you spend less time on broker calls and more time visiting real homes.',
                schemaAnswer:
                    'MakeMyStay.ai combines AI-powered discovery with verified listings, transparent pricing, and zero brokerage on many properties — so you spend less time on broker calls and more time visiting real homes.',
            },
            {
                q: 'Can NRIs use MakeMyStay?',
                a: 'Yes. NRIs can request virtual tours, remote coordination, and documentation support.',
                schemaAnswer: 'Yes. NRIs can request virtual tours, remote coordination, and documentation support.',
            },
        ],
    },
    {
        title: 'PG & Rentals',
        emoji: '🏠',
        items: [
            {
                q: 'What types of PG and rental properties are available?',
                a: 'We list male PG, female PG, co-living spaces, shared rooms, private rooms, apartments, villas, and independent houses.',
                schemaAnswer:
                    'We list male PG, female PG, co-living spaces, shared rooms, private rooms, apartments, villas, and independent houses.',
            },
            {
                q: 'What documents are required for PG or rental booking?',
                a: (
                    <span>
                        Typically required documents include:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Government ID proof</li>
                            <li>Address proof</li>
                            <li>Passport-size photo</li>
                            <li>Advance deposit</li>
                        </ul>
                        <span className="block mt-2 text-slate-500 text-sm">Requirements may vary based on property.</span>
                    </span>
                ),
                schemaAnswer:
                    'Typically required documents include: Government ID proof; address proof; passport-size photo; advance deposit. Requirements may vary based on property.',
            },
            {
                q: 'Is there a security deposit?',
                a: "Deposit amounts vary depending on the owner's policy and property type. Details are mentioned in the listing.",
                schemaAnswer:
                    "Deposit amounts vary depending on the owner's policy and property type. Details are mentioned in the listing.",
            },
            {
                q: 'Can I visit the property before booking?',
                a: 'Yes. You can request a site visit through the platform. Our team coordinates with the owner.',
                schemaAnswer: 'Yes. You can request a site visit through the platform. Our team coordinates with the owner.',
            },
            {
                q: 'Are meals and utilities included in PG?',
                a: 'Inclusions such as food, Wi-Fi, electricity, and maintenance depend on the property and are mentioned in the listing.',
                schemaAnswer:
                    'Inclusions such as food, Wi-Fi, electricity, and maintenance depend on the property and are mentioned in the listing.',
            },
            {
                q: 'Is there a lock-in period?',
                a: 'Some rental agreements may include a lock-in period. Terms are defined in the rental agreement.',
                schemaAnswer: 'Some rental agreements may include a lock-in period. Terms are defined in the rental agreement.',
            },
            {
                q: 'Can I move in immediately?',
                a: 'Move-in depends on property availability, agreement completion, and payment confirmation.',
                schemaAnswer: 'Move-in depends on property availability, agreement completion, and payment confirmation.',
            },
        ],
    },
    {
        title: 'Buying & Plots',
        emoji: '🏗️',
        items: [
            {
                q: 'Do you assist with property purchase?',
                a: 'Yes. We assist with residential apartments, houses, resale properties, and investment plots.',
                schemaAnswer: 'Yes. We assist with residential apartments, houses, resale properties, and investment plots.',
            },
            {
                q: 'Do you verify legal documents?',
                a: 'We conduct basic listing verification. Buyers are responsible for independent legal due diligence before finalizing transactions.',
                schemaAnswer:
                    'We conduct basic listing verification. Buyers are responsible for independent legal due diligence before finalizing transactions.',
            },
            {
                q: 'Do you assist with registration?',
                a: 'Yes. We provide coordination and guidance support for sale agreements and registration processes.',
                schemaAnswer: 'Yes. We provide coordination and guidance support for sale agreements and registration processes.',
            },
            {
                q: 'Can I negotiate property prices?',
                a: 'Yes. We assist in facilitating communication and negotiation between buyer and seller.',
                schemaAnswer: 'Yes. We assist in facilitating communication and negotiation between buyer and seller.',
            },
            {
                q: 'Do you help first-time buyers?',
                a: 'Yes. We guide first-time buyers through the property selection and documentation process.',
                schemaAnswer: 'Yes. We guide first-time buyers through the property selection and documentation process.',
            },
            {
                q: 'Can you assist with home loans?',
                a: "We may connect buyers with financial institutions if required. Loan approval depends on the bank's policies.",
                schemaAnswer:
                    "We may connect buyers with financial institutions if required. Loan approval depends on the bank's policies.",
            },
            {
                q: 'Are plot approvals guaranteed?',
                a: 'Approval status varies. Buyers must verify layout approval, zoning compliance, and legal clearances independently.',
                schemaAnswer:
                    'Approval status varies. Buyers must verify layout approval, zoning compliance, and legal clearances independently.',
            },
        ],
    },
    {
        title: 'Payments & Refunds',
        emoji: '💳',
        items: [
            {
                q: 'How are payments made?',
                a: 'Payments must be made only through official and authorized channels communicated by MakeMyStay.',
                schemaAnswer: 'Payments must be made only through official and authorized channels communicated by MakeMyStay.',
            },
            {
                q: 'Is brokerage or service fee applicable?',
                a: 'Service fees, if applicable, are communicated transparently before confirmation.',
                schemaAnswer: 'Service fees, if applicable, are communicated transparently before confirmation.',
            },
            {
                q: 'What is the cancellation policy?',
                a: 'Cancellation policies vary based on property type, booking stage, and agreement terms. Deductions, if any, are disclosed prior to confirmation.',
                schemaAnswer:
                    'Cancellation policies vary based on property type, booking stage, and agreement terms. Deductions, if any, are disclosed prior to confirmation.',
            },
            {
                q: 'What is the refund policy?',
                a: (
                    <span>
                        Refund eligibility depends on:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Cancellation timeline</li>
                            <li>Agreement conditions</li>
                            <li>Processing fees</li>
                        </ul>
                        <span className="block mt-2">Refunds, if applicable, are processed within the stated timeframe.</span>
                    </span>
                ),
                schemaAnswer:
                    'Refund eligibility depends on cancellation timeline, agreement conditions, and processing fees. Refunds, if applicable, are processed within the stated timeframe.',
            },
            {
                q: 'How long does refund processing take?',
                a: 'Refund timelines depend on the payment method and agreement terms. Processing may take several working days.',
                schemaAnswer:
                    'Refund timelines depend on the payment method and agreement terms. Processing may take several working days.',
            },
            {
                q: 'Are service charges refundable?',
                a: 'Service or processing fees may be non-refundable unless otherwise stated.',
                schemaAnswer: 'Service or processing fees may be non-refundable unless otherwise stated.',
            },
            {
                q: 'Does MakeMyStay hold customer funds?',
                a: 'Payments are typically handled as per agreement terms. We do not function as an escrow unless explicitly mentioned.',
                schemaAnswer:
                    'Payments are typically handled as per agreement terms. We do not function as an escrow unless explicitly mentioned.',
            },
        ],
    },
    {
        title: 'Legal & Security',
        emoji: '🔒',
        items: [
            {
                q: 'Is my personal data secure?',
                a: 'Yes. We follow secure data handling practices. Information is used only for service-related communication.',
                schemaAnswer:
                    'Yes. We follow secure data handling practices. Information is used only for service-related communication.',
            },
            {
                q: 'Does MakeMyStay guarantee property availability?',
                a: 'Availability depends on real-time confirmation from owners. Users must confirm before making payments.',
                schemaAnswer:
                    'Availability depends on real-time confirmation from owners. Users must confirm before making payments.',
            },
            {
                q: 'Does MakeMyStay guarantee investment returns?',
                a: 'No. Property investments carry market risks. We do not guarantee returns.',
                schemaAnswer: 'No. Property investments carry market risks. We do not guarantee returns.',
            },
            {
                q: 'Who is responsible in case of disputes?',
                a: 'MakeMyStay acts as a facilitation platform. Disputes are governed by agreements between the concerned parties.',
                schemaAnswer:
                    'MakeMyStay acts as a facilitation platform. Disputes are governed by agreements between the concerned parties.',
            },
            {
                q: 'Are agreements legally binding?',
                a: 'Yes. Rental and sale agreements are legally binding between the respective parties.',
                schemaAnswer: 'Yes. Rental and sale agreements are legally binding between the respective parties.',
            },
            {
                q: 'Can policies change?',
                a: 'Yes. Policies and terms may be updated periodically. Users are encouraged to review them regularly.',
                schemaAnswer:
                    'Yes. Policies and terms may be updated periodically. Users are encouraged to review them regularly.',
            },
        ],
    },
    {
        title: 'For Property Owners',
        emoji: '🏢',
        items: [
            {
                q: 'How can I list my property?',
                a: 'You can submit your property details through the listing section on the website.',
                schemaAnswer: 'You can submit your property details through the listing section on the website.',
            },
            {
                q: 'What documents are required for listing?',
                a: (
                    <span>
                        Generally required:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Identity proof</li>
                            <li>Ownership proof</li>
                            <li>Property details</li>
                            <li>Contact information</li>
                        </ul>
                    </span>
                ),
                schemaAnswer:
                    'Generally required: identity proof; ownership proof; property details; contact information.',
            },
            {
                q: 'How long does listing approval take?',
                a: 'Approval depends on document verification and review.',
                schemaAnswer: 'Approval depends on document verification and review.',
            },
            {
                q: 'Can I list multiple properties?',
                a: 'Yes. Multiple listings are allowed after verification.',
                schemaAnswer: 'Yes. Multiple listings are allowed after verification.',
            },
            {
                q: 'Can I update or remove my listing?',
                a: 'Yes. Owners can request updates or removal through support channels.',
                schemaAnswer: 'Yes. Owners can request updates or removal through support channels.',
            },
            {
                q: 'How will I receive inquiries?',
                a: 'Inquiries are shared through registered contact details provided during listing.',
                schemaAnswer: 'Inquiries are shared through registered contact details provided during listing.',
            },
            {
                q: 'Can I set my own pricing?',
                a: 'Yes. Pricing is determined by the property owner.',
                schemaAnswer: 'Yes. Pricing is determined by the property owner.',
            },
        ],
    },
];

function AccordionItem({ item, index, isOpen, onToggle }: { item: FAQItem; index: number; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className={`border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? 'shadow-md' : 'hover:shadow-sm'}`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 md:px-6 py-3.5 md:py-4 text-left bg-white hover:bg-slate-50 transition-colors duration-200 group"
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-3 pr-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold flex items-center justify-center">
                        {index + 1}
                    </span>
                    <span className="font-semibold text-slate-800 text-sm md:text-base leading-snug">{item.q}</span>
                </span>
                <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-slate-400 group-hover:text-brand-red transition-all duration-300 ${isOpen ? 'rotate-180 text-brand-red' : ''}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-4 md:px-6 pb-4 md:pb-5 pt-1 border-t border-slate-100 bg-slate-50/50">
                    <div className="pl-9 text-slate-600 text-sm leading-relaxed">{item.a}</div>
                </div>
            </div>
        </div>
    );
}

function FAQSectionBlock({ section }: { section: FAQSection }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{section.emoji}</span>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">{section.title}</h2>
                <span className="ml-auto text-xs text-slate-400 font-medium bg-slate-100 px-2.5 py-1 rounded-full">
                    {section.items.length} questions
                </span>
            </div>
            <div className="space-y-3">
                {section.items.map((item, idx) => (
                    <AccordionItem
                        key={idx}
                        item={item}
                        index={idx}
                        isOpen={openIndex === idx}
                        onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                    />
                ))}
            </div>
        </div>
    );
}

export default function FAQ() {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const faqHelmet = useMemo(() => buildPageSEO(buildFaqPageSEO()), []);
    const faqJsonLd = useMemo(
        () =>
            buildFaqPageSchema(
                faqData.flatMap((s) => s.items.map((it) => ({ question: it.q, answer: it.schemaAnswer })))
            ),
        []
    );

    return (
        <>
            <SEOHead {...faqHelmet} />
            <JsonLd data={faqJsonLd} id="faq-page-schema" />
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-slate-50">
                {/* Hero */}
                <div className="bg-white border-b border-slate-100 py-12 mb-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-block bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                            Help Center
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                            Frequently Asked <span className="text-brand-red">Questions</span>
                        </h1>
                        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
                            Everything you need to know about MakeMyStay. Can't find your answer?{' '}
                            <a href="/contact-us" className="text-brand-red hover:underline font-medium">
                                Contact us
                            </a>
                            .
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section nav pills */}
                    <div className="flex gap-2 mb-8 md:mb-10 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center scrollbar-hide">
                        <button
                            onClick={() => setActiveSection(null)}
                            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${activeSection === null
                                ? 'bg-brand-red text-white border-brand-red shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-red hover:text-brand-red'
                                }`}
                        >
                            All Topics
                        </button>
                        {faqData.map((section) => (
                            <button
                                key={section.title}
                                onClick={() => setActiveSection(section.title === activeSection ? null : section.title)}
                                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap ${activeSection === section.title
                                    ? 'bg-brand-red text-white border-brand-red shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-red hover:text-brand-red'
                                    }`}
                            >
                                {section.emoji} {section.title}
                            </button>
                        ))}
                    </div>

                    {/* FAQ Sections */}
                    {faqData
                        .filter((s) => activeSection === null || s.title === activeSection)
                        .map((section) => (
                            <FAQSectionBlock key={section.title} section={section} />
                        ))}

                    {/* Bottom CTA */}
                    <div className="mt-10 rounded-2xl bg-gradient-to-r from-brand-red to-rose-500 p-8 text-center text-white shadow-lg">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">Still have questions?</h3>
                        <p className="text-rose-100 mb-5 text-sm md:text-base">
                            Our team is here to help you find the perfect property.
                        </p>
                        <a
                            href="/contact-us"
                            className="inline-block bg-white text-brand-red font-semibold px-6 py-3 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-sm md:text-base"
                        >
                            Get in Touch →
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
