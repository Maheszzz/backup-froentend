/**
 * Homepage "new launch" spotlight — Urban Homes (HSR Layout).
 * Matched by id/slug/title from API; fetched by id if not in the current list.
 */
export const FEATURED_LAUNCH = {
    propertyId: 248,
    listingType: 'rent' as const,
    slug: '248-urban-homes-1bhk-hsr-layout',
    titleIncludes: 'urban homes',
    locationIncludes: 'hsr',
    badge: 'New launch',
    headlineLead: 'Urban Homes, Designed for',
    headlineAccent: 'You.',
    subheadline: 'Premium 1BHK in HSR Layout — now on MakeMyStay.',
    bullets: ['Move-in ready', 'Verified listing', 'Zero brokerage'] as const,
    priceFromLabel: 'From ₹25,000/mo',
    socialProof: {
        label: 'Happy Tenants',
        rating: 4.9,
        reviewCount: 320,
    },
} as const;
