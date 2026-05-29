import type { FaqItem } from '@/lib/schema';

/** FAQ copy for PG locality hub + property detail locality block (single source of truth). */
export function buildPgLocationFaqs(locationName: string): FaqItem[] {
    return [
        {
            question: `What is the average PG rent in ${locationName}?`,
            answer: `PG rent in ${locationName}, Bangalore typically ranges from ₹6,000 for shared rooms to ₹18,000+ for premium single occupancy, depending on meals, WiFi, and security.`,
        },
        {
            question: `Is food included in PG rent in ${locationName}?`,
            answer: `Most professional PGs include 2–3 meals per day. Confirm veg/non-veg options and timings on each listing before booking.`,
        },
        {
            question: `How do I verify a PG near ${locationName}?`,
            answer: `MakeMyStay.ai lists verified properties with real photos and transparent pricing. You can book a visit or pay a token online where enabled.`,
        },
        {
            question: `Are PGs in ${locationName} safe for working professionals?`,
            answer: `Reputed PGs offer CCTV, biometric access, and warden support. Always check the exact amenities on the listing and read recent reviews.`,
        },
    ];
}
