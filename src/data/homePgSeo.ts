import type { FaqItem } from '@/lib/schema';
import { BRAND_FAQ_ITEMS } from '@/lib/brandEntity';

/** Topic FAQs for PG / Bangalore (paired with brand FAQs for home + footer). */
const HOME_PG_TOPIC_FAQS: FaqItem[] = [
    {
        question: 'What is the average PG rent in Bangalore?',
        answer: 'Typical PG rent ranges from ₹6,000 for shared rooms to ₹15,000+ for premium single occupancy near IT corridors, depending on meals, WiFi, and security.',
    },
    {
        question: 'Is WiFi included in PG rent?',
        answer: 'Most verified PGs on MakeMyStay.ai include high-speed WiFi. Confirm speed and fair-usage policy on each listing.',
    },
    {
        question: 'Are food and housekeeping included?',
        answer: 'Many PGs bundle 2–3 meals and periodic housekeeping. Veg/non-veg plans and timings vary — check the listing details before booking.',
    },
    {
        question: 'How do I book or pay a token securely?',
        answer: 'Browse verified listings, shortlist properties, and use on-page actions to schedule a visit or pay a booking token where enabled — with transparent pricing and support.',
    },
];

/** Shared copy for Home JSON-LD, visible home FAQ, and Footer PG / AEO blocks. */
export const HOME_PG_FAQS: FaqItem[] = [...BRAND_FAQ_ITEMS, ...HOME_PG_TOPIC_FAQS];
