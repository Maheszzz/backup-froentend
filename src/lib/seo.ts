import { buildPropertyOgImageUrl } from '@/lib/ogImage';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/siteConfig';
import type { Property } from '@/types/api';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { stripMarkdownLight } from '@/lib/propertySeoUtils';
import { buildClientSeoAbout } from '@/lib/propertyClientSeoNarrative';

export interface PageSEOInput {
    title: string;
    description: string;
    path?: string;
    /** Override full canonical URL */
    canonicalUrl?: string;
    ogImage?: string;
    noindex?: boolean;
    /** Comma-separated keywords for legacy crawlers / internal tools */
    keywords?: string;
}

export interface HelmetSEOProps {
    title: string;
    description: string;
    canonicalHref: string;
    ogImage?: string;
    noindex?: boolean;
    keywords?: string;
}

/**
 * Build absolute canonical path (leading slash, no trailing slash except root).
 */
export function canonicalPath(path: string): string {
    if (!path || path === '/') return '/';
    const p = path.startsWith('/') ? path : `/${path}`;
    return p.replace(/\/+$/, '') || '/';
}

export function absoluteUrl(path: string): string {
    const p = canonicalPath(path);
    if (p === '/') return SITE_URL;
    return `${SITE_URL}${p}`;
}

/**
 * Values for react-helmet-async (title, meta, link).
 */
export function buildPageSEO(input: PageSEOInput): HelmetSEOProps {
    const canonicalHref = input.canonicalUrl ?? absoluteUrl(input.path ?? '/');
    const title = input.title.includes(SITE_NAME) ? input.title : `${input.title} | ${SITE_NAME}`;
    return {
        title,
        description: input.description,
        canonicalHref,
        ogImage: input.ogImage ?? DEFAULT_OG_IMAGE,
        noindex: input.noindex,
        keywords: input.keywords,
    };
}

/** Query keys allowed on `/pg/:slug` (listing UI + programmatic filters). */
const PG_LISTING_QUERY_KEYS = new Set([
    'cat',
    'city',
    'type',
    'min',
    'max',
    'sort',
    'q',
    'wifi',
    'food',
    'ac',
    'price',
    'gender',
    'page',
]);

export function pgListingQueryIsClean(searchParams: URLSearchParams): boolean {
    for (const k of searchParams.keys()) {
        if (!PG_LISTING_QUERY_KEYS.has(k)) return false;
        if (k === 'page' && !isValidListingPageParam(searchParams.get('page'))) return false;
    }
    return true;
}

/** Stable path for canonical + sharing (sorted keys). */
export function stablePgListingCanonical(slug: string, searchParams: URLSearchParams): string {
    const keys = [...searchParams.keys()].filter((k) => PG_LISTING_QUERY_KEYS.has(k)).sort();
    if (keys.length === 0) return `/pg/${slug}`;
    const q = new URLSearchParams();
    for (const k of keys) {
        const v = searchParams.get(k);
        if (v !== null && v !== '') q.set(k, v);
    }
    return `/pg/${slug}?${q.toString()}`;
}

/**
 * PG locality SEO with optional filter query (wifi / food / AC / price tier).
 * Unknown query keys → noindex to avoid soft-404 / spam patterns.
 */
export function pgLocationSeoWithQuery(
    locationName: string,
    slug: string,
    searchParams: URLSearchParams
): PageSEOInput {
    const path = stablePgListingCanonical(slug, searchParams);
    const dirty = !pgListingQueryIsClean(searchParams);
    const wifi = searchParams.get('wifi') === 'true';
    const food = searchParams.get('food') === 'true';
    const ac = searchParams.get('ac') === 'true';
    const price = searchParams.get('price');
    const genderRaw = searchParams.get('gender');
    const gender = genderRaw?.trim().toLowerCase();

    let title = `Verified PG in ${locationName} | Zero brokerage · ₹6k–₹18k`;
    const tags: string[] = [];
    if (gender === 'male' || gender === 'female') {
        tags.push(gender === 'male' ? 'boys PG' : 'girls PG');
    }
    if (wifi) tags.push('WiFi PGs');
    if (food) tags.push('food included');
    if (ac) tags.push('AC rooms');
    if (price === 'low') tags.push('budget-friendly');
    if (price === 'mid') tags.push('mid-range');
    if (price === 'high') tags.push('premium');
    if (tags.length) {
        title = `Verified PG in ${locationName}: ${tags.join(' · ')} | Zero brokerage`;
    }

    let description = `Verified PG in ${locationName}, Bangalore — zero brokerage on many listings, real photos, ₹6k–₹18k/mo bands. Compare WiFi, meals & security on ${SITE_NAME}.`;
    if (tags.length) {
        description = `PG in ${locationName} — ${tags.join(', ')}. Verified listings, transparent pricing; book visits or pay tokens online where enabled on ${SITE_NAME}.`;
    }

    return {
        title,
        description,
        path,
        noindex: dirty,
    };
}

export function pgLocationSeo(locationName: string, slug: string): PageSEOInput {
    return pgLocationSeoWithQuery(locationName, slug, new URLSearchParams());
}

/** SEO for `/rent/:slug` locality hub (flats & houses on rent). */
export function rentLocationHubSeo(locationName: string, slug: string): PageSEOInput {
    return {
        title: `Verified flats & 1BHK in ${locationName} | Zero brokerage rents`,
        description: `Browse verified 1BHK, 2BHK & family homes for rent in ${locationName}, Bangalore on ${SITE_NAME} — real photos, transparent rent, zero brokerage on many listings.`,
        path: `/rent/${slug}`,
    };
}

/** Long-tail: `/pg-for-boys-in-:slug` and `/pg-for-girls-in-:slug` (and men/women aliases). */
export function pgGenderLocalitySeo(
    locationName: string,
    slug: string,
    variant: 'male' | 'female' | 'men' | 'women'
): PageSEOInput {
    const isMale = variant === 'male' || variant === 'men';
    const pathPrefix = isMale ? 'pg-for-boys-in' : 'pg-for-girls-in';
    const label = isMale ? 'Boys PG' : 'Girls PG';
    return {
        title: `Verified ${label} in ${locationName} | Zero brokerage · near IT parks`,
        description: `Find verified ${label.toLowerCase()} in ${locationName}, Bangalore — WiFi, meals & security on many listings. Zero brokerage on select stays. Browse on ${SITE_NAME}.`,
        path: `/${pathPrefix}-${slug}`,
    };
}

function ogImageFromProperty(property: Property): string | undefined {
    let raw: string | undefined = property.image;
    if (Array.isArray(property.images) && property.images.length > 0) {
        const first = property.images[0];
        raw = typeof first === 'string' ? first : undefined;
    }
    if (!raw?.trim()) return undefined;
    const u = raw.trim();
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return absoluteUrl(u.startsWith('/') ? u : `/${u}`);
}

function normalizeLocationForSeo(location: string | undefined): string {
    const raw = (location || '').replace(/\s+/g, ' ').trim();
    if (!raw) return 'Bangalore';
    return /bangalore/i.test(raw) ? raw : `${raw}, Bangalore`;
}

function buildPropertyMetaTitle(property: Property): string {
    const name = formatPropertyTitle(property.title) || property.title || 'Property';
    const location = normalizeLocationForSeo(property.location);
    const typeLower = (property.type || '').toLowerCase();
    const isPgType = ['pg', 'hostel', 'coliving'].some(t => typeLower.includes(t));
    const isPG = property.category === 'pg' || isPgType;
    const bhk = property.type || '1BHK';

    if (isPG) {
        return `Verified PG in ${location} for rent | ${name}`;
    }

    // Rental property title pattern: {BHK} Flat for Rent in {Location}
    const rentPrefix = bhk.toLowerCase().includes('bhk') || bhk.toLowerCase().includes('rk') 
        ? `${bhk} Flat` 
        : 'Flat';
    return `${rentPrefix} for Rent in ${location} | ${name}`;
}

function buildPropertyMetaDescription(property: Property): string {
    const name = formatPropertyTitle(property.title) || property.title || 'This property';
    const type = (property.type || 'property').trim();
    const location = normalizeLocationForSeo(property.location);
    const isRent = property.category === 'rent';
    const price = (property.price || '').trim();
    const hasPrice = Boolean(price) && !/request|negotiable/i.test(price);

    const amenityBits = [
        property.wifi ? 'WiFi' : '',
        property.food ? 'food' : '',
        property.housekeeping ? 'housekeeping' : '',
        property.power_backup ? 'power backup' : '',
    ].filter(Boolean);
    const amenityText = amenityBits.length > 0 ? ` Explore ${amenityBits.slice(0, 3).join(', ')}, amenities,` : ' Explore amenities,';

    if (isRent && hasPrice) {
        return `${name} offers a ${type} for rent in ${location} from ${price}/month. View photos, location highlights,${amenityText} and book a visit online with ${SITE_NAME}.`;
    }

    if (isRent) {
        return `${name} offers a ${type} for rent in ${location}. View photos, location highlights,${amenityText} and book a visit online with ${SITE_NAME}.`;
    }

    return `Explore ${name}, a ${type} in ${location}. View photos, locality details, amenities, pricing guidance, and schedule a site visit with ${SITE_NAME}.`;
}

/** Meta + canonical for detail pages (handled via /pg/ or /rent/ routers). */
export function propertyDetailPageSeo(property: Property, detailPath: string): PageSEOInput {
    const path = detailPath; // Use the verified path from getPropertyDetailPath
    const longPlain = stripMarkdownLight(
        property.seo_about || buildClientSeoAbout(property) || property.description || ''
    )
        .replace(/\s+/g, ' ')
        .trim();
    const description = buildPropertyMetaDescription(property) || longPlain.slice(0, 160);
    const keywords = [
        formatPropertyTitle(property.title),
        property.type,
        property.location,
        normalizeLocationForSeo(property.location),
        'Bangalore rent',
        'PG coliving',
        'property visit booking',
        'verified property listing',
        SITE_NAME,
    ]
        .filter(Boolean)
        .join(', ');
    return {
        title: buildPropertyMetaTitle(property),
        description,
        path,
        ogImage: buildPropertyOgImageUrl(property),
        keywords,
    };
}

/** City hub: `/pg/bangalore` — primary “PG in Bangalore” landing. */
export function pgBangaloreHubSeo(): PageSEOInput {
    return {
        title: 'Best PG in Bangalore from ₹6,000 — verified & no brokerage',
        description:
            'Browse verified PGs in Bangalore from ₹6,000/month. Filter by locality, food, AC, sharing. Real photos, transparent pricing, no brokerage on MakeMyStay.ai.',
        path: '/pg/bangalore',
        canonicalUrl: 'https://makemystay.ai/pg/bangalore',
    };
}

/** City hub: `/rent/bangalore` — primary “flats & houses for rent in Bangalore” landing. */
export function rentBangaloreHubSeo(): PageSEOInput {
    return {
        title: 'Flats & Houses for Rent in Bangalore — Zero Brokerage | verified rentals',
        description:
            'Browse verified flats and houses for rent in Bangalore with zero brokerage. Compare monthly rent across Koramangala, Whitefield, Bellandur, HSR & more — furnished and unfurnished options on MakeMyStay.ai.',
        path: '/rent/bangalore',
    };
}

/** City hub: `/buy/in/bangalore` — primary “buy in Bangalore” landing. */
export function buyBangaloreHubSeo(): PageSEOInput {
    return {
        title: 'Buy Property in Bangalore — Verified Flats & Homes for Sale | MakeMyStay',
        description:
            'Explore verified apartments, 2BHK/3BHK flats, and homes for sale in Bangalore. Compare prices, book site visits, and shortlist with zero broker bias.',
        path: '/buy/in/bangalore',
    };
}

/** City hub: `/plots/in/bangalore` — primary “plots in Bangalore” landing. */
export function plotBangaloreHubSeo(): PageSEOInput {
    return {
        title: 'Plots & Land for Sale in Bangalore — Verified Listings | MakeMyStay',
        description:
            'Browse verified residential plots and land parcels in Bangalore. Compare sizes, locations, and pricing with transparent listings and zero broker bias.',
        path: '/plots/in/bangalore',
    };
}

const PG_FEATURE_PATHS: Record<string, 'wifi' | 'food' | 'ac' | 'girls' | 'boys' | 'single'> = {
    '/pg-with-wifi': 'wifi',
    '/pg-with-food': 'food',
    '/pg-with-ac': 'ac',
    '/pg-for-girls': 'girls',
    '/pg-for-boys': 'boys',
    '/pg-single-room': 'single',
};

export function pgFeaturePathToKind(pathname: string): 'wifi' | 'food' | 'ac' | 'girls' | 'boys' | 'single' | undefined {
    return PG_FEATURE_PATHS[pathname];
}

export function pgFeatureLandingSeo(feature: 'wifi' | 'food' | 'ac' | 'girls' | 'boys' | 'single'): PageSEOInput {
    const titles = {
        wifi: 'PG with WiFi in Bangalore | Verified · zero brokerage on many stays',
        food: 'PG with food in Bangalore | Verified meals-included stays · zero brokerage',
        ac: 'PG with AC in Bangalore | Verified AC rooms · compare rent bands',
        girls: 'Girls PG in Bangalore | Verified & safe · zero brokerage options',
        boys: 'Boys PG in Bangalore | Verified male PG & coliving · zero brokerage',
        single: 'Single room PG in Bangalore | Verified private rooms · zero brokerage',
    };
    const desc = {
        wifi: 'Looking for PG with reliable WiFi in Bangalore? Explore verified paying guest stays with transparent pricing, filters for connectivity, and book online.',
        food: 'Find PG with meals in Bangalore — veg and non-veg plans vary by operator. Compare verified listings and enquire on MakeMyStay.ai.',
        ac: 'Discover air-conditioned PG rooms in Bangalore. Verified listings with clear amenities — compare rent and book a visit.',
        girls: 'Find safe, verified ladies PG in Bangalore. CCTV, security, and meal inclusive stays for students and working women.',
        boys: 'Search for boys PG in Bangalore. Managed stays with WiFi, food, and housekeeping for early career tech professionals.',
        single: 'Browse private single occupancy PG rooms in Bangalore. No roommate stress — premium verified coliving options.',
    };
    const paths = {
        wifi: '/pg-with-wifi',
        food: '/pg-with-food',
        ac: '/pg-with-ac',
        girls: '/pg-for-girls',
        boys: '/pg-for-boys',
        single: '/pg-single-room',
    };
    return {
        title: titles[feature],
        description: desc[feature],
        path: paths[feature],
    };
}

/** Comparison guide `/pg-vs-flat-bangalore`. */
export function pgVsFlatBangaloreSeo(): PageSEOInput {
    return {
        title: 'PG vs flat in Bangalore: cost, flexibility & which is better (2026)',
        description:
            'Compare PG and rented flats in Bangalore — deposits, meals, independence, and who each option suits. Plus FAQs for students and working professionals.',
        path: '/pg-vs-flat-bangalore',
    };
}

/** Homepage title/description for high-conversion SEO (SEO audit Appendix A). */
export function buildHomeSEO(): PageSEOInput {
    return {
        title: 'Verified PG & 1BHK/2BHK in Bangalore | Zero brokerage rentals',
        description:
            'Find verified PGs and flats on rent in Bangalore with real photos, transparent pricing, and zero brokerage. Book a visit in 60 seconds on MakeMyStay.ai.',
        path: '/',
    };
}

/** `/about` — trust & E-E-A-T (audit). */
export function buildAboutPageSEO(): PageSEOInput {
    return {
        title: 'About MakeMyStay — verified rentals & PG in Bangalore',
        description:
            'MakeMyStay.ai helps you find verified PGs and rentals in Bangalore without brokers. Learn about our mission and how we keep listings trustworthy.',
        path: '/about',
    };
}

/** `/how-we-verify` — verification story (audit). */
export function buildHowWeVerifyPageSEO(): PageSEOInput {
    return {
        title: 'How MakeMyStay verifies every property',
        description:
            'Our verification process — photo audit, on-site checks, ID and rent benchmarking — so you can shortlist PGs and flats with confidence on MakeMyStay.ai.',
        path: '/how-we-verify',
    };
}

/** `/contact-us` */
export function buildContactPageSEO(): PageSEOInput {
    return {
        title: 'Contact MakeMyStay — PG & rental support in Bangalore',
        description:
            'Reach MakeMyStay at +91 81500 99911 or connect@makemystay.ai for PG and flat enquiries, visit bookings, and operator onboarding. Office: HSR Layout, Bangalore. Response within one business day.',
        path: '/contact-us',
    };
}

/** `/blog` index */
export function buildBlogIndexSEO(postCount = 0): PageSEOInput {
    const countBit = postCount > 0 ? `${postCount}+ ` : '';
    return {
        title: 'Guides & Insights — PG, Rent & Bangalore Living (2026)',
        description: `${countBit}expert guides on PG in Bangalore, area-wise rent, legal checklists, safety, and verified rentals — updated for 2026.`,
        path: '/blog',
    };
}

/** `/pg-near-me` */
export function buildPgNearMeSEO(): PageSEOInput {
    return {
        title: 'PG Near Me in Bangalore | Top-rated verified PG stays',
        description:
            'Searching for PG near me? Find verified paying guest accommodations in Bangalore with WiFi, meals, and 24/7 security. Compare top listings in your immediate area.',
        path: '/pg-near-me',
    };
}

export function buildFlatsInBangaloreSEO(): PageSEOInput {
    return {
        title: 'Flats for Rent in Bangalore — Verified 1BHK & 2BHK | Zero brokerage',
        description:
            'Browse verified flats for rent in Bangalore — Koramangala, Whitefield, HSR, Bellandur and more. Real photos, transparent rent, zero brokerage on MakeMyStay.ai.',
        path: '/flats-in-bangalore',
    };
}

export function build1BhkSEO(): PageSEOInput {
    return {
        title: '1BHK for Rent in Bangalore — Verified flats | Zero brokerage',
        description:
            'Find verified 1BHK flats for rent in Bangalore with real photos and transparent pricing. Compare localities and book a visit on MakeMyStay.ai.',
        path: '/1bhk',
    };
}

export function build2BhkSEO(): PageSEOInput {
    return {
        title: '2BHK for Rent in Bangalore — Verified family homes | Zero brokerage',
        description:
            'Browse verified 2BHK flats and homes for rent in Bangalore. Zero brokerage on many listings — compare rent across top localities on MakeMyStay.ai.',
        path: '/2bhk',
    };
}

export function buildPrivacyPageSEO(): PageSEOInput {
    return {
        title: 'Privacy Policy',
        description: 'How MakeMyStay Realty collects, uses, and protects your personal information on makemystay.ai.',
        path: '/privacy',
    };
}

export function buildTermsPageSEO(): PageSEOInput {
    return {
        title: 'Terms and Conditions',
        description: 'Terms governing use of makemystay.ai and MakeMyStay Realty rental services in Bangalore.',
        path: '/terms',
    };
}

export function buildRefundPolicyPageSEO(): PageSEOInput {
    return {
        title: 'Refund & Cancellation Policy',
        description: 'Refund and cancellation terms for payments made on makemystay.ai operated by MakeMyStay Realty.',
        path: '/refund-policy',
    };
}

/** Thin / utility routes — do not index. */
export function buildNoindexUtilitySEO(title: string, path: string): PageSEOInput {
    return { title, description: `${SITE_NAME} — ${title}`, path, noindex: true };
}

/** Meta for `/faq` (Help Center). */
export function buildFaqPageSEO(): PageSEOInput {
    return {
        title: 'FAQ — PG, rentals, buying & plots',
        description:
            'Answers about MakeMyStay: PG and rental bookings, documents, deposits, payments, refunds, legal terms, and listing your property in Bangalore.',
        path: '/faq',
    };
}

/** Readable phrase from `/pg/:slug` param (strips leading numeric id if present). */
export function humanizePropertySlugParam(slugParam: string | undefined): string {
    if (!slugParam?.trim()) return 'Listing';
    const s = slugParam.trim();
    const rest = /^\d+-(.+)$/.test(s) ? s.replace(/^\d+-/, '') : s;
    if (!rest) return 'Listing';
    return rest
        .split('-')
        .filter(Boolean)
        .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

/** Loading state on property PDP so the document does not keep the shell title. */
export function interimPropertyDetailSeo(slugParam: string | undefined, pathname: string): PageSEOInput {
    const label = humanizePropertySlugParam(slugParam);
    return {
        title: `${label} — property listing`,
        description: `Photos, rent, amenities, and visit booking for this listing in Bangalore on ${SITE_NAME}.`,
        path: canonicalPath(pathname.split('?')[0]),
    };
}

/** Error / not-found PDP: noindex and distinct title from live listings. */
export function propertyErrorSeo(pathname: string): PageSEOInput {
    return {
        title: 'Property not found',
        description: `This listing may have moved or been removed. Browse verified PG and rentals on ${SITE_NAME}.`,
        path: canonicalPath(pathname.split('?')[0]),
        noindex: true,
    };
}

/** Removed or fully booked listing — keep URL, noindex, suggest nearby hubs. */
export function propertyUnavailableSeo(pathname: string, localityLabel?: string): PageSEOInput {
    const area = localityLabel?.trim() ? ` in ${localityLabel}` : '';
    return {
        title: 'Property no longer available',
        description: `This listing${area} is no longer available on ${SITE_NAME}. Explore similar PG and coliving stays nearby.`,
        path: canonicalPath(pathname.split('?')[0]),
        noindex: true,
    };
}

export interface ListingsPageSeoInput {
    pathname: string;
    pageTitle: string;
    pageSubtitle: string;
    category: 'all' | 'pg' | 'rent' | 'buy' | 'plot';
    /** `locationFilter` from listings UI (`all` or city name). */
    cityLabel: string;
    totalCount?: number;
    /** Crawlable pagination (1-based). Page 1 omitted from canonical. */
    listingPage?: number;
    noindex?: boolean;
}

/** Listings index routes (`/pg`, `/rent`, `/properties`, …) + optional `?page=` crawl depth. */
export function isValidListingPageParam(raw: string | null | undefined): boolean {
    if (raw === null || raw === undefined || raw === '') return true;
    if (!/^\d+$/.test(raw.trim())) return false;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 1 && n <= 100;
}

export function listingsPageSeo(input: ListingsPageSeoInput): PageSEOInput {
    const pathOnly = canonicalPath(input.pathname.split('?')[0]);
    const city = input.cityLabel === 'all' ? 'Bangalore' : input.cityLabel;
    const n = input.totalCount;
    const countBit = typeof n === 'number' && n > 0 ? `${n.toLocaleString()} ` : '';
    const categoryPhrase =
        input.category === 'all'
            ? 'PG, rent & sale'
            : input.category === 'pg'
              ? 'PG'
              : input.category === 'rent'
                ? 'rental'
                : input.category === 'buy'
                  ? 'sale'
                  : 'plot & land';
    const lp = input.listingPage && input.listingPage > 1 ? input.listingPage : undefined;
    const titleBase = `${input.pageTitle} — ${city}`;
    const title = lp ? `${titleBase} — Page ${lp}` : titleBase;
    const description = `${input.pageSubtitle} Explore ${countBit}verified ${categoryPhrase} listings in ${city}. Transparent pricing and expert support on ${SITE_NAME}.`;
    const path = lp ? `${pathOnly}?page=${lp}` : pathOnly;
    return {
        title,
        description,
        path,
        noindex: input.noindex || (lp != null && lp > 50),
    };
}
