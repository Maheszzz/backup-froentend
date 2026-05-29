import { BRAND_CONTACT, BRAND_EXTENDED, BRAND_SAME_AS } from '@/lib/brandEntity';
import { DEFAULT_OG_IMAGE, LEGAL_ENTITY_NAME, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import type { Property } from '@/types/api';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { findPgLocationForArea } from '@/data/pgLocations';
import { buildClientSeoAbout } from '@/lib/propertyClientSeoNarrative';
import { parseInrOfferAmount, stripMarkdownLight } from '@/lib/propertySeoUtils';
import { buildPropertyProductName } from '@/lib/propertyDetailCopy';

export interface FaqItem {
    question: string;
    answer: string;
}

/** FAQPage JSON-LD for rich results + AEO. */
export function buildFaqPageSchema(faqs: FaqItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
            },
        })),
    };
}

/** Local business / agent snippet for area pages. */
export function buildRealEstateAgentSchema(areaName: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: SITE_NAME,
        url: SITE_URL,
        areaServed: {
            '@type': 'Place',
            name: `${areaName}, Bangalore, India`,
        },
        priceRange: '₹6000–₹18000',
    };
}

/** BreadcrumbList for PG location pages. */
export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: it.name,
            item: `${SITE_URL}${it.path.startsWith('/') ? it.path : `/${it.path}`}`,
        })),
    };
}

/** WebSite + SearchAction for homepage rich results. */
export function buildWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/properties?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };
}

/** Organization — brand entity for homepage @graph (SEO audit: sameAs + legal name). */
export function buildOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'MakeMyStay',
        alternateName: 'MakeMyStay Realty',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
        description: BRAND_EXTENDED,
        sameAs: [...BRAND_SAME_AS],
    };
}

/** LocalBusiness — Bangalore service area (aligns with footer contact). */
export function buildLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'RealEstateAgent'],
        name: 'MakeMyStay',
        alternateName: 'MakeMyStay Realty',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
        image: DEFAULT_OG_IMAGE,
        description: BRAND_EXTENDED,
        email: BRAND_CONTACT.email,
        telephone: BRAND_CONTACT.telephone,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'HSR Layout, Sector 4',
            addressLocality: 'Bangalore',
            postalCode: '560102',
            addressRegion: 'Karnataka',
            addressCountry: 'IN',
        },
        areaServed: [
            'Koramangala',
            'Whitefield',
            'HSR Layout',
            'Indiranagar',
            'Electronic City',
            'Marathahalli',
            'BTM Layout',
            'Manyata Tech Park',
            'Bellandur',
            'Sarjapur Road',
            'Bangalore',
        ],
        priceRange: '₹6000 - ₹25000',
        sameAs: [...BRAND_SAME_AS],
    };
}

/** Organization + WebSite + LocalBusiness in one graph for the homepage. */
export function buildHomeOrganizationLocalWebGraph() {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            schemaNodeWithoutContext(buildOrganizationSchema() as Record<string, unknown>),
            schemaNodeWithoutContext(buildWebSiteSchema() as Record<string, unknown>),
            schemaNodeWithoutContext(buildLocalBusinessSchema() as Record<string, unknown>),
        ],
    };
}

/** Strip @context so nodes can live under a single @graph (recommended for rich results). */
function schemaNodeWithoutContext(schema: Record<string, unknown>) {
    const { ['@context']: _, ...rest } = schema;
    return rest;
}

/**
 * Single JSON-LD script: FAQPage + BreadcrumbList + RealEstateAgent (AEO + trust).
 */
export function buildPgLocationCombinedGraph(
    faqs: FaqItem[],
    breadcrumbItems: { name: string; path: string }[],
    areaName: string
) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            schemaNodeWithoutContext(buildFaqPageSchema(faqs) as Record<string, unknown>),
            schemaNodeWithoutContext(buildBreadcrumbSchema(breadcrumbItems) as Record<string, unknown>),
            schemaNodeWithoutContext(buildRealEstateAgentSchema(areaName) as Record<string, unknown>),
        ],
    };
}

const HUB_ITEMLIST_SCHEMA_MAX = 100;

/**
 * ItemList JSON-LD for PG (or other) hub shells — listing URLs match canonical PDP paths from `getPropertyDetailPath`.
 * Returns null when there are no items (avoid empty ItemList in the DOM).
 */
export function buildPgHubItemListSchema(
    properties: Property[],
    opts: { name: string; description?: string }
): Record<string, unknown> | null {
    const list = properties.slice(0, HUB_ITEMLIST_SCHEMA_MAX);
    if (list.length === 0) return null;
    const itemListElement = list.map((p, index) => {
        const path = getPropertyDetailPath(p);
        const absPath = path.startsWith('/') ? path : `/${path}`;
        const label = (p.title || `${p.type || 'Listing'} in ${p.location || ''}`).trim();
        return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Accommodation',
                name: label || `Listing ${p.id}`,
                url: `${SITE_URL}${absPath}`,
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: p.location || 'Bangalore',
                    addressRegion: 'Karnataka',
                    addressCountry: 'IN',
                },
            },
        };
    });
    const node: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: opts.name,
        numberOfItems: list.length,
        itemListElement,
    };
    if (opts.description?.trim()) node.description = opts.description.trim();
    return node;
}

export function stringifySchema(data: unknown): string {
    return JSON.stringify(data);
}

function absoluteImageUrl(url: string | undefined): string | undefined {
    if (!url || !url.trim()) return undefined;
    const u = url.trim();
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    if (u.startsWith('/')) return `${SITE_URL}${u}`;
    return `${SITE_URL}/${u}`;
}

/**
 * Product + Offer + BreadcrumbList for property detail pages (long-tail + rich results).
 * Optional locality FAQs (e.g. PG area guide) are merged into @graph when provided.
 */
export function buildPropertyDetailGraph(
    property: Property,
    detailPath: string,
    localityFaqs?: FaqItem[],
    pdpFaqs?: FaqItem[]
) {
    const path = detailPath.startsWith('/') ? detailPath : `/${detailPath}`;
    const url = `${SITE_URL}${path}`;
    const desc = stripMarkdownLight(
        property.seo_about || buildClientSeoAbout(property) || property.description || ''
    ).slice(0, 5000);
    const images: string[] = [];
    if (Array.isArray(property.images)) {
        for (const img of property.images) {
            const raw = typeof img === 'string' ? img : (img as { image_url?: string })?.image_url;
            const abs = absoluteImageUrl(raw);
            if (abs) images.push(abs);
        }
    }
    const primary = absoluteImageUrl(property.image);
    if (primary && !images.includes(primary)) images.unshift(primary);
    // Offer omitted when price is not parseable (e.g. "Price on Request") — expected.
    const priceAmount = parseInrOfferAmount(property.price);
    const availability = property.is_available === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock';
    const productName = buildPropertyProductName(property);

    const product: Record<string, unknown> = {
        '@type': ['Product', 'Accommodation', 'Residence'],
        name: productName,
        description: desc || `${productName} — ${property.type} in ${property.location}`,
        url,
        address: {
            '@type': 'PostalAddress',
            addressLocality: property.location || 'Bangalore',
            addressRegion: 'Karnataka',
            addressCountry: 'IN',
        },
    };
    if (property.type) {
        product.category = property.type;
    }
    if (images.length > 0) product.image = images.length === 1 ? images[0] : images;

    if (priceAmount !== undefined) {
        product.offers = {
            '@type': 'Offer',
            url,
            priceCurrency: 'INR',
            price: priceAmount,
            priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            availability,
        };
    }

    const reviewCount = property.review_count ?? property.reviews ?? 0;
    const avgRating = property.average_rating ?? property.rating;
    if (avgRating != null && avgRating > 0 && reviewCount > 0) {
        product.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: Math.min(5, Math.max(1, Number(avgRating))),
            reviewCount,
            bestRating: 5,
            worstRating: 1,
        };
    }

    const reviewsList = property.reviews_list?.filter((r) => r && (r.rating > 0 || r.comment?.trim()));
    if (reviewsList && reviewsList.length > 0) {
        product.review = reviewsList.slice(0, 8).map((r) => {
            const node: Record<string, unknown> = {
                '@type': 'Review',
                author: { '@type': 'Person', name: (r.user_name || 'Guest').trim() || 'Guest' },
                publisher: { '@type': 'Organization', name: LEGAL_ENTITY_NAME, url: SITE_URL },
                reviewRating: {
                    '@type': 'Rating',
                    ratingValue: Math.min(5, Math.max(1, r.rating)),
                    bestRating: 5,
                    worstRating: 1,
                },
                datePublished: r.created_at,
            };
            const rawBody = (r.comment ?? (r as { review_text?: string }).review_text)?.trim();
            const body = rawBody ? stripMarkdownLight(rawBody).slice(0, 5000) : '';
            if (body) node.reviewBody = body;
            return node;
        });
    }

    const pgLoc = findPgLocationForArea(property.location);
    const isPgHub =
        (property.type || '').toUpperCase() === 'PG' || (property.type || '').toLowerCase() === 'hostel';
    const crumbs = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        ...(isPgHub
            ? [
                  { name: 'PG', path: '/pg' },
                  ...(pgLoc ? [{ name: `PG in ${pgLoc.name}`, path: `/pg/${pgLoc.slug}` }] : []),
              ]
            : [{ name: 'Listings', path: '/properties' }]),
        { name: productName.slice(0, 78), path },
    ]);

    const webPage: Record<string, unknown> = {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: productName,
        description: (desc || `${productName} — ${property.type} in ${property.location}`).slice(0, 500),
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['[data-seo="pdp-h1"]', '[data-seo="pdp-hero-lead"]', '[data-seo="pdp-about"]'],
        },
    };
    if (images.length > 0) {
        webPage.primaryImageOfPage = { '@type': 'ImageObject', url: images[0] };
    }

    const mergedFaqs = [...(pdpFaqs ?? []), ...(localityFaqs ?? [])].slice(0, 10);

    const graph: Record<string, unknown>[] = [
        schemaNodeWithoutContext(product),
        schemaNodeWithoutContext(webPage),
        schemaNodeWithoutContext(crumbs as Record<string, unknown>),
    ];
    if (mergedFaqs.length > 0) {
        graph.push(schemaNodeWithoutContext(buildFaqPageSchema(mergedFaqs) as Record<string, unknown>));
    }

    return {
        '@context': 'https://schema.org',
        '@graph': graph,
    };
}
