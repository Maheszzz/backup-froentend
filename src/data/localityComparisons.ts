export interface LocalityComparisonPage {
    pairSlug: string;
    left: { slug: string; name: string };
    right: { slug: string; name: string };
    title: string;
    description: string;
    summary: string;
    leftPros: string[];
    rightPros: string[];
    verdict: string;
}

export const LOCALITY_COMPARISONS: LocalityComparisonPage[] = [
    {
        pairSlug: 'hsr-layout-vs-koramangala',
        left: { slug: 'hsr-layout', name: 'HSR Layout' },
        right: { slug: 'koramangala', name: 'Koramangala' },
        title: 'HSR Layout vs Koramangala for PG — which is better?',
        description:
            'Compare PG rent, commute, nightlife, and safety between HSR Layout and Koramangala in Bangalore for students and IT professionals.',
        summary:
            'HSR Layout suits ORR/Ecospace commuters who want lake-side pockets and slightly lower premiums on some sharing types. Koramangala wins on nightlife, startup density, and walkable food — at higher rent.',
        leftPros: [
            'Strong for Ecospace & Embassy commute',
            'Agara Lake / 27th Main lifestyle',
            'Often better value on shared PG',
        ],
        rightPros: [
            'Dense startup & internship ecosystem',
            'Premium food and social scene',
            'Walkable 5th/6th Block amenities',
        ],
        verdict:
            'Choose HSR if your office is on ORR east; choose Koramangala if you prioritize social infra and central-east internships over lowest rent.',
    },
    {
        pairSlug: 'hsr-layout-vs-bellandur',
        left: { slug: 'hsr-layout', name: 'HSR Layout' },
        right: { slug: 'bellandur', name: 'Bellandur' },
        title: 'HSR Layout vs Bellandur for PG — commute & rent',
        description:
            'HSR Layout vs Bellandur PG comparison for Bangalore tech workers — rent bands, ORR traffic, and amenities.',
        summary:
            'Bellandur minimizes distance to Ecospace and Embassy Tech Village but faces heavier ORR peak traffic. HSR offers more lifestyle infrastructure with competitive PG supply.',
        leftPros: ['Better cafés & metro via Silk Board', 'Popular with Ecospace workers who accept short ORR ride'],
        rightPros: ['Shortest ORR tech-park commute for many', 'Wide PG inventory near Sarjapur junction'],
        verdict: 'Pick Bellandur for shortest office distance; pick HSR for lifestyle balance and metro option.',
    },
    {
        pairSlug: 'whitefield-vs-marathahalli',
        left: { slug: 'whitefield', name: 'Whitefield' },
        right: { slug: 'marathahalli', name: 'Marathahalli' },
        title: 'Whitefield vs Marathahalli — where to book a PG?',
        description:
            'Compare PG stays in Whitefield vs Marathahalli for ITPL, ORR, and east Bangalore commutes.',
        summary:
            'Whitefield is deeper east with Purple Line metro and ITPL proximity. Marathahalli is central-east on ORR with flexible routes to multiple tech parks.',
        leftPros: ['ITPL / Brookefield focus', 'Growing metro connectivity'],
        rightPros: ['Central ORR position', 'Often lower rent on older PG stock'],
        verdict: 'Office in ITPL → lean Whitefield; multi-ORR commute → consider Marathahalli.',
    },
    {
        pairSlug: 'koramangala-vs-indiranagar',
        left: { slug: 'koramangala', name: 'Koramangala' },
        right: { slug: 'indiranagar', name: 'Indiranagar' },
        title: 'Koramangala vs Indiranagar for PG in Bangalore',
        description:
            'Premium PG corridors compared — metro access, rent, and who each area suits best.',
        summary:
            'Indiranagar has superior metro connectivity and CBD access. Koramangala is younger, startup-heavy, and often slightly less formal on PG operators.',
        leftPros: ['Startup internship density', 'Vibrant food scene'],
        rightPros: ['Indiranagar metro stations', 'Consulting/CBD friendly'],
        verdict: 'CBD/consulting → Indiranagar; startup lifestyle → Koramangala.',
    },
];

const BY_PAIR = new Map(LOCALITY_COMPARISONS.map((c) => [c.pairSlug, c]));

export function getLocalityComparison(pairSlug: string): LocalityComparisonPage | undefined {
    return BY_PAIR.get(pairSlug);
}
