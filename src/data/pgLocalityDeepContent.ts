import type { PgLocalityDeepProfile } from '@/types/localityContent';

/** Rich locality profiles for AEO + topical authority (expand over time). */
export const PG_LOCALITY_DEEP_PROFILES: PgLocalityDeepProfile[] = [
    {
        slug: 'hsr-layout',
        name: 'HSR Layout',
        quickAnswer:
            'HSR Layout is one of Bangalore\'s top PG corridors for startups and IT professionals thanks to strong food options, metro access via Silk Board and HSR stations, and short commutes to Ecospace, Embassy Tech Village, and Koramangala. Expect ₹8,000–₹16,000/mo for shared PG with meals on many verified stays.',
        rent: { shared: '₹8,000–₹12,000', single: '₹14,000–₹20,000', note: 'Meal-inclusive plans common' },
        metro: 'Silk Board (Green) and HSR Layout metro — last-mile often by auto or tech shuttle.',
        commute: 'Peak ORR traffic 25–45 min to Ecospace/Bellandur; off-peak often under 25 min by two-wheeler.',
        nearbyOffices: ['Ecospace', 'Embassy Tech Village', 'RMZ Ecospace', 'HSR tech parks'],
        nearbyColleges: ['Christ University (Bannerghatta)', 'Jain University', 'NIFT Bangalore'],
        bestStreets: ['27th Main', 'Sector 2', 'Agara Lake side pockets'],
        safety: 'Active streets near 27th Main; prefer PGs with CCTV, biometric entry, and live-in warden.',
        foodNightlife: 'Strong café and restaurant scene; many PGs offer 2–3 meals with veg/non-veg slots.',
        internet: 'Most professional PGs advertise 50–100 Mbps WiFi; confirm fair-use policy for WFH.',
        idealFor: {
            students: 'Good for students who want social infra and metro access with budget sharing rooms.',
            professionals: 'Ideal for early-career tech workers on ORR and Ecospace belt.',
        },
        entities: ['Ecospace', 'Silk Board', 'Agara Lake', 'NIFT', 'Christ University'],
        nearbySlugs: ['koramangala', 'btm', 'bellandur', 'sarjapur-road', 'bommanahalli'],
        landmarkPaths: ['pg-near-ecospace', 'pg-near-embassy-techvillage'],
        genderPaths: true,
        blogPaths: [{ label: 'PG in Bangalore guide', path: '/blog/pg-in-bangalore-guide' }],
        comparisons: [
            {
                slug: 'koramangala',
                name: 'Koramangala',
                pairSlug: 'hsr-layout-vs-koramangala',
                blurb: 'HSR is often quieter with lake pockets; Koramangala is more nightlife-heavy and premium.',
            },
            {
                slug: 'bellandur',
                name: 'Bellandur',
                pairSlug: 'hsr-layout-vs-bellandur',
                blurb: 'Bellandur is closer to ORR tech parks; HSR balances food scene and slightly lower rent bands.',
            },
        ],
        extraFaqs: [
            {
                question: 'Is HSR Layout good for PG stays near Ecospace?',
                answer: 'Yes — many professionals choose HSR for Ecospace and Embassy Tech Village commutes, using Silk Board metro or cabs during peak hours.',
            },
            {
                question: 'Which metro is nearest to PGs in HSR Layout?',
                answer: 'Silk Board and HSR Layout stations on the Green Line are the usual metro anchors; confirm last-mile time on each listing.',
            },
            {
                question: 'Is HSR Layout safe for women PG tenants?',
                answer: 'Choose verified ladies PGs with CCTV, warden, and clear visitor policies; 27th Main stays busy until late evening.',
            },
        ],
    },
    {
        slug: 'koramangala',
        name: 'Koramangala',
        quickAnswer:
            'Koramangala is a premium PG micro-market popular with startup teams and students who want walkable cafés, nightlife, and quick access to Indiranagar and central Bangalore. PG rent typically runs ₹9,000–₹18,000/mo for shared rooms; single occupancy costs more.',
        rent: { shared: '₹9,000–₹14,000', single: '₹16,000–₹24,000' },
        metro: 'Mantri Square / Indiranagar corridor — many rely on cabs and BMTC rather than walking distance metro.',
        commute: 'Strong connectivity to CBD and ORR via intermediate ring roads; peak-hour variability is high.',
        nearbyOffices: ['Koramangala startup hubs', 'EGL (via Indiranagar)', 'Domlur tech offices'],
        nearbyColleges: ['Christ (central campuses)', 'Jyoti Nivas', 'Bishop Cotton'],
        bestStreets: ['5th Block', '6th Block', 'Koramangala 3rd Block'],
        safety: 'Busy commercial streets; still verify PG security for women-only floors and access control.',
        foodNightlife: 'One of Bangalore\'s strongest food scenes; PG meal plans vary widely in quality.',
        internet: 'Premium coliving PGs often market gigabit WiFi — validate with a speed test on visit.',
        idealFor: {
            students: 'Students who prioritize social life and internship access to startups.',
            professionals: 'Product and startup employees wanting walkable amenities.',
        },
        entities: ['5th Block', 'Forum Mall', 'Sony World signal', 'Indiranagar'],
        nearbySlugs: ['hsr-layout', 'btm', 'indiranagar', 'ejipura', 'domlur'],
        genderPaths: true,
        comparisons: [
            {
                slug: 'hsr-layout',
                name: 'HSR Layout',
                pairSlug: 'hsr-layout-vs-koramangala',
                blurb: 'Compare rent, commute to ORR, and nightlife intensity side by side.',
            },
            {
                slug: 'indiranagar',
                name: 'Indiranagar',
                pairSlug: 'koramangala-vs-indiranagar',
                blurb: 'Indiranagar is metro-strong; Koramangala is younger and startup-dense.',
            },
        ],
        extraFaqs: [
            {
                question: 'Is Koramangala expensive for PG rent?',
                answer: 'It is mid–premium for Bangalore. Shared PG often starts around ₹9k; private rooms and AC push budgets higher.',
            },
            {
                question: 'Which block is best for PG in Koramangala?',
                answer: '5th and 6th blocks are popular for walkability; compare noise levels and parking before booking.',
            },
        ],
    },
    {
        slug: 'whitefield',
        name: 'Whitefield',
        quickAnswer:
            'Whitefield is the go-to PG belt for ITPL, Brookefield, and Kadugodi commuters with Purple Line metro expansion and large PG inventory. Shared PG often starts around ₹7,000–₹14,000/mo; book early near ITPL for single rooms.',
        rent: { shared: '₹7,000–₹12,000', single: '₹13,000–₹18,000' },
        metro: 'Whitefield, Kadugodi, Hopefarm — check walking distance vs shuttle.',
        commute: 'Strong for east Bangalore tech parks; ORR reverse commute can be heavy evening.',
        nearbyOffices: ['ITPL', 'Brookefield', 'Manyata (via ORR)', 'SAP Labs corridor'],
        nearbyColleges: ['MVJ College', 'NITTE', 'Christ (nearby)'],
        bestStreets: ['Hopefarm', 'ITPL Road', 'Kadugodi'],
        safety: 'Gated communities common; prefer PGs with 24/7 security in industrial-adjacent pockets.',
        foodNightlife: 'Growing café scene; many PGs are meal-heavy with fixed timings.',
        internet: 'WFH-friendly PGs common — confirm backup power for outages.',
        idealFor: {
            students: 'Interns and students placed in east Bangalore campuses.',
            professionals: 'IT employees at ITPL/Whitefield tech parks.',
        },
        entities: ['ITPL', 'Phoenix Marketcity', 'VR Bengaluru', 'Kadugodi metro'],
        nearbySlugs: ['marathahalli', 'brookefield', 'hoodi', 'kadugodi', 'itpl'],
        landmarkPaths: ['pg-near-itpl'],
        comparisons: [
            {
                slug: 'marathahalli',
                name: 'Marathahalli',
                pairSlug: 'whitefield-vs-marathahalli',
                blurb: 'Marathahalli is central-east ORR; Whitefield is deeper east with metro tail.',
            },
        ],
        extraFaqs: [
            {
                question: 'Is Whitefield good for PG near ITPL?',
                answer: 'Yes — high supply of boys and girls PG near ITPL and Hopefarm; verify commute time during rain.',
            },
        ],
    },
    {
        slug: 'bellandur',
        name: 'Bellandur',
        quickAnswer:
            'Bellandur sits on the ORR spine with heavy demand from Ecospace, Embassy Tech Village, and Sarjapur Road workers. PG rent is competitive at ₹7,500–₹15,000/mo but traffic on ORR is the main trade-off.',
        rent: { shared: '₹7,500–₹13,000', single: '₹14,000–₹19,000' },
        metro: 'No walkable metro core — rely on cabs, shuttles, and buses.',
        commute: 'Short distance to major tech parks; ORR peak congestion is significant.',
        nearbyOffices: ['Ecospace', 'Embassy Tech Village', 'RMZ Ecospace', 'Cessna Business Park'],
        nearbyColleges: ['Christ (Bannerghatta)', 'St. Joseph'],
        bestStreets: ['Bellandur Gate', 'Sarjapur Road junction'],
        safety: 'Choose PGs away from flood-prone low pockets; verify drainage history in monsoon.',
        foodNightlife: 'Decent cloud-kitchen and delivery ecosystem; fewer walkable cafés than HSR.',
        internet: 'Standard 50–100 Mbps on professional listings.',
        idealFor: {
            students: 'Students interning on ORR belt.',
            professionals: 'Tech park employees prioritizing shortest commute over nightlife.',
        },
        entities: ['Ecospace', 'Embassy Tech Village', 'ORR', 'Bellandur Lake'],
        nearbySlugs: ['hsr-layout', 'sarjapur-road', 'marathahalli', 'kaikondrahalli'],
        landmarkPaths: ['pg-near-ecospace', 'pg-near-embassy-techvillage', 'pg-near-rmz-ecoworld'],
        comparisons: [
            {
                slug: 'hsr-layout',
                name: 'HSR Layout',
                pairSlug: 'hsr-layout-vs-bellandur',
                blurb: 'HSR offers more lifestyle infra; Bellandur minimizes ORR commute for many.',
            },
        ],
        extraFaqs: [
            {
                question: 'Why is Bellandur popular for PG stays?',
                answer: 'Proximity to ORR tech parks and relatively wide PG supply versus central Bangalore premiums.',
            },
        ],
    },
    {
        slug: 'marathahalli',
        name: 'Marathahalli',
        quickAnswer:
            'Marathahalli is a practical PG hub for ORR commuters with strong bus connectivity and access to Whitefield, Bellandur, and central Bangalore. Expect ₹7,000–₹14,000/mo for shared PG with meals on many listings.',
        rent: { shared: '₹7,000–₹12,000', single: '₹13,000–₹17,000' },
        metro: 'Limited walkable metro — Purple Line accessible toward Whitefield.',
        commute: 'ORR central — good for multi-direction tech commutes.',
        nearbyOffices: ['Prestige Tech Park', 'Intel campus corridor', 'ORR tech parks'],
        nearbyColleges: ['New Horizon', 'CMR'],
        bestStreets: ['Marathahalli Bridge', 'Kundalahalli Gate'],
        safety: 'High traffic areas feel safe late evening; verify PG access control.',
        foodNightlife: 'Strong local food options; less upscale than Koramangala.',
        internet: 'Reliable on verified professional PGs.',
        idealFor: {
            students: 'Budget-conscious students with east/center internships.',
            professionals: 'ORR workers wanting balanced rent.',
        },
        entities: ['Marathahalli Bridge', 'Prestige Tech Park', 'ORR'],
        nearbySlugs: ['whitefield', 'bellandur', 'kundalahalli', 'brookefield'],
        landmarkPaths: ['pg-near-prestige-tech-park'],
        comparisons: [
            {
                slug: 'whitefield',
                name: 'Whitefield',
                pairSlug: 'whitefield-vs-marathahalli',
                blurb: 'See which east-Bangalore hub fits your office location and rent band.',
            },
        ],
        extraFaqs: [],
    },
    {
        slug: 'electronic-city',
        name: 'Electronic City',
        quickAnswer:
            'Electronic City is ideal for Infosys, Wipro, and Phase 2 tech corridor employees with comparatively lower PG rent (often ₹6,000–₹12,000/mo) and quieter residential pockets than central Bangalore.',
        rent: { shared: '₹6,000–₹10,000', single: '₹11,000–₹16,000' },
        metro: 'Electronic City metro (Yellow) — valuable for daily commute.',
        commute: 'Excellent if your office is in ECity; long haul to central Bangalore.',
        nearbyOffices: ['Infosys', 'Wipro', 'Biocon', 'TCS campuses'],
        nearbyColleges: ['IIIT Bangalore (nearby)', 'Christ (Bannerghatta)'],
        bestStreets: ['Phase 1', 'Phase 2', 'Hosur Road'],
        safety: 'Generally calm; choose PGs with transport for late shifts.',
        foodNightlife: 'Limited nightlife; PG meal plans are important.',
        internet: 'Adequate for WFH on mid-tier PGs.',
        idealFor: {
            students: 'Students placed in south industrial corridor.',
            professionals: 'ECity campus employees.',
        },
        entities: ['Infosys', 'Wipro', 'Electronic City metro', 'Hosur Road'],
        nearbySlugs: ['bommanahalli', 'hsr-layout', 'btm', 'hosur-road'],
        landmarkPaths: ['pg-near-wipro-ecity', 'pg-near-ecity-phase-2'],
        extraFaqs: [
            {
                question: 'Is Electronic City cheaper for PG than HSR?',
                answer: 'Often yes for comparable sharing type — trade-off is distance to central Bangalore social infra.',
            },
        ],
        comparisons: [],
    },
    {
        slug: 'indiranagar',
        name: 'Indiranagar',
        quickAnswer:
            'Indiranagar offers premium PG and coliving options with excellent Purple Line metro access and walkable 100 Feet Road amenities — popular with consultants and senior analysts working in CBD and east Bangalore.',
        rent: { shared: '₹10,000–₹15,000', single: '₹17,000–₹25,000' },
        metro: 'Indiranagar, Trinity, Halasuru stations — strong metro story.',
        commute: 'Great for CBD; ORR reachable with variable traffic.',
        nearbyOffices: ['EGL', 'Ulsoor', 'CBD firms'],
        nearbyColleges: ['Bishop Cotton', 'St. Joseph'],
        bestStreets: ['100 Feet Road', 'CMH Road', '12th Main'],
        safety: 'Well-lit commercial spine; premium PGs have strong security stacks.',
        foodNightlife: 'Top-tier restaurants; meal-inclusive PG still common.',
        internet: 'Excellent on premium listings.',
        idealFor: {
            students: 'Students with higher budget and central internships.',
            professionals: 'Consulting and product roles wanting metro + nightlife.',
        },
        entities: ['100 Feet Road', 'Indiranagar metro', 'CMH Road'],
        nearbySlugs: ['koramangala', 'domlur', 'ulsoor', 'mg-road'],
        comparisons: [
            {
                slug: 'koramangala',
                name: 'Koramangala',
                pairSlug: 'koramangala-vs-indiranagar',
                blurb: 'Metro vs startup-density — pick based on office and lifestyle.',
            },
        ],
        extraFaqs: [],
    },
    {
        slug: 'btm',
        name: 'BTM Layout',
        quickAnswer:
            'BTM Layout is a budget-friendly PG hub near Bannerghatta Road, Jayanagar, and south Bangalore colleges with rent often ₹6,500–₹12,000/mo and good bus connectivity toward ORR and Electronic City.',
        rent: { shared: '₹6,500–₹11,000', single: '₹12,000–₹16,000' },
        metro: 'Jayanagar / Banashankari corridor — bus-heavy.',
        commute: 'Central for south Bangalore; ORR reachable via BTM layout choke points.',
        nearbyOffices: ['Mico-Bosch corridor', 'Bannerghatta tech pockets'],
        nearbyColleges: ['Christ Bannerghatta', 'Jain', 'NMIMS'],
        bestStreets: ['2nd Stage', '16th Main', 'UDIPI Garden Road'],
        safety: 'Dense residential — verify PG hygiene and security on visit.',
        foodNightlife: 'Affordable food; strong Udupi and mess culture.',
        internet: 'Variable — prioritize verified listings for WFH.',
        idealFor: {
            students: 'Strong value for students and college interns.',
            professionals: 'Budget-conscious ORR workers.',
        },
        entities: ['Bannerghatta Road', 'Christ University', 'Udupi Garden'],
        nearbySlugs: ['jayanagar', 'banashankari', 'bommanahalli', 'hsr-layout'],
        extraFaqs: [],
        comparisons: [],
    },
];

const PROFILE_BY_SLUG = new Map(PG_LOCALITY_DEEP_PROFILES.map((p) => [p.slug, p]));

export function getPgLocalityDeepProfile(slug: string): PgLocalityDeepProfile | undefined {
    return PROFILE_BY_SLUG.get(slug);
}
