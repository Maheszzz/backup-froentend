import type { FaqItem } from '@/lib/schema';

/** FAQ copy for `/rent/:slug` locality hubs (AEO + FAQPage JSON-LD). */
export function buildRentLocationFaqs(locationName: string, slug: string): FaqItem[] {
    return [
        {
            question: `What is the typical rent for a 1BHK in ${locationName}?`,
            answer: `1BHK rent in ${locationName}, Bangalore usually ranges from ₹18,000 to ₹35,000 depending on furnishing, floor, and proximity to metro or IT parks. Browse live listings on MakeMyStay.ai for exact pricing.`,
        },
        {
            question: `Are flats for rent in ${locationName} verified on MakeMyStay?`,
            answer: `We prioritize verified homes with real photos and field checks where applicable. Always confirm society rules, maintenance, and deposit terms on a site visit before paying any token.`,
        },
        {
            question: `How do I compare PG vs flat in ${locationName}?`,
            answer: `PGs bundle meals and utilities with lower setup effort; flats offer more privacy and cooking flexibility. Compare PG options in the same area on MakeMyStay.ai at /pg/${slug}, or read our Bangalore PG guide on the blog.`,
        },
        {
            question: `Is brokerage charged for rentals in ${locationName}?`,
            answer: `Many MakeMyStay.ai listings are zero brokerage for tenants; some owners may use channel partners. Check each listing page and agreement before you pay.`,
        },
    ];
}
