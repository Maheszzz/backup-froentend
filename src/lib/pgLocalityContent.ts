import { getPgLocalityDeepProfile } from '@/data/pgLocalityDeepContent';
import { getPgLocationBySlug } from '@/data/pgLocations';
import { buildPgLocationFaqs } from '@/lib/pgLocalityFaqs';
import {
    buildBreadcrumbSchema,
    buildFaqPageSchema,
    buildRealEstateAgentSchema,
    type FaqItem,
} from '@/lib/schema';
import { SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import type { LocalityComparisonPage } from '@/data/localityComparisons';
import type { PgLocalityDeepProfile } from '@/types/localityContent';

function schemaNodeWithoutContext(schema: Record<string, unknown>) {
    const { ['@context']: _, ...rest } = schema;
    return rest;
}

function fallbackProfile(slug: string, name: string): PgLocalityDeepProfile {
    return {
        slug,
        name,
        quickAnswer: `${name} is a well-known Bangalore locality for verified PG and coliving stays with transparent rent (typically ₹6,000–₹18,000/mo), meal plans, and security features on professional operators. Compare live listings on ${SITE_NAME} before you pay a token.`,
        rent: { shared: '₹6,000–₹12,000', single: '₹12,000–₹18,000' },
        metro: 'Check Namma Metro app for nearest station and last-mile time from each listing.',
        commute: `Plan peak-hour commute from ${name} to your office — ORR and CBD routes vary by 20–40 minutes.`,
        nearbyOffices: ['Major tech parks within 30–45 min drive'],
        nearbyColleges: ['Colleges within bus/auto range'],
        bestStreets: [`Residential pockets in ${name}`],
        safety: 'Prefer verified PGs with CCTV, access control, and clear visitor policies.',
        foodNightlife: 'Meal-inclusive PG common; explore local eateries on visit.',
        internet: 'Confirm WiFi speed and power backup for work-from-home.',
        idealFor: {
            students: `Students seeking affordable sharing options in ${name}.`,
            professionals: `Working professionals commuting from ${name} to Bangalore offices.`,
        },
        entities: [name, 'Bangalore'],
        nearbySlugs: [],
        comparisons: [],
        extraFaqs: [],
    };
}

export function resolveLocalityProfile(slug: string): PgLocalityDeepProfile {
    const loc = getPgLocationBySlug(slug);
    const name = loc?.name ?? slug.replace(/-/g, ' ');
    return getPgLocalityDeepProfile(slug) ?? fallbackProfile(slug, name);
}

export function buildLocalityFaqs(name: string, slug: string): FaqItem[] {
    const profile = resolveLocalityProfile(slug);
    const base = buildPgLocationFaqs(name);
    const seen = new Set(base.map((f) => f.question));
    const merged = [...base];
    for (const f of profile.extraFaqs) {
        if (!seen.has(f.question)) {
            merged.push(f);
            seen.add(f.question);
        }
    }
    return merged.slice(0, 15);
}

/** WebPage + SpeakableSpecification for locality hubs (AEO). */
export function buildLocalityAeoGraph(
    profile: PgLocalityDeepProfile,
    faqs: FaqItem[],
    breadcrumbItems: { name: string; path: string }[],
    canonicalPath: string,
) {
    const url = `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    const webPage = {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: `PG in ${profile.name} — verified stays`,
        description: profile.quickAnswer.slice(0, 300),
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: [
                '[data-seo="locality-quick-answer"]',
                '[data-seo="locality-quick-answer"] p',
                '#quick-answers-heading',
                '#pg-locality-faq-heading',
            ],
        },
    };

    return {
        '@context': 'https://schema.org',
        '@graph': [
            schemaNodeWithoutContext(webPage),
            schemaNodeWithoutContext(buildFaqPageSchema(faqs) as Record<string, unknown>),
            schemaNodeWithoutContext(buildBreadcrumbSchema(breadcrumbItems) as Record<string, unknown>),
            schemaNodeWithoutContext(buildRealEstateAgentSchema(profile.name) as Record<string, unknown>),
        ],
    };
}

/** WebPage + Speakable for locality comparison pages (AEO). */
export function buildComparisonAeoGraph(
    cmp: LocalityComparisonPage,
    faqs: FaqItem[],
    breadcrumbItems: { name: string; path: string }[],
    canonicalPath: string,
) {
    const url = `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    const webPage = {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: cmp.title,
        description: cmp.description,
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['[data-seo="locality-quick-answer"] p', '[data-seo="compare-verdict"]', '#compare-faq-heading'],
        },
    };

    return {
        '@context': 'https://schema.org',
        '@graph': [
            schemaNodeWithoutContext(webPage),
            schemaNodeWithoutContext(buildFaqPageSchema(faqs) as Record<string, unknown>),
            schemaNodeWithoutContext(buildBreadcrumbSchema(breadcrumbItems) as Record<string, unknown>),
        ],
    };
}
