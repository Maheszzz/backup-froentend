/**
 * Fallback listing copy when API `seo_about` is absent.
 * Keep copy factual and short — avoid internal/SEO scaffolding phrases in user-facing text.
 */

import type { Property } from '@/types/api';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';

/** Same shape as `FaqItem` in schema (kept local to avoid circular imports). */
export interface PropertyPdpFaq {
    question: string;
    answer: string;
}

function fmtPrice(property: Property): string {
    const p = property.price?.trim();
    if (p && !/request|negotiable/i.test(p)) return p;
    return '';
}

/** Plain-text excerpt for hero (no markdown). */
export function extractHeroLeadFromNarrative(narrative: string, maxChars: number): string {
    const block = narrative.split(/\n\n+/)[0] ?? narrative;
    const plain = block.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\s+/g, ' ').trim();
    if (plain.length <= maxChars) return plain;
    const cut = plain.slice(0, maxChars);
    const lastSpace = cut.lastIndexOf(' ');
    return `${cut.slice(0, lastSpace > 40 ? lastSpace : maxChars).trim()}…`;
}

/**
 * Short factual copy for PDP / JSON-LD when `seo_about` is missing.
 * Prefer API `description` when it has substance; never prefix with internal labels.
 */
export function buildClientSeoAbout(property: Property): string {
    const raw = (property.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (raw.length > 80) {
        return raw.slice(0, 5000).trim();
    }

    const name = formatPropertyTitle(property.title) || (property.title?.trim() ?? 'Property');
    const loc = property.location?.trim() || 'Bangalore';
    const pt = (property.type || 'Home').trim();
    const price = fmtPrice(property);
    const pl = pt.toLowerCase();

    if (pl === 'plot') {
        return `${name} is land for sale in ${loc}. ${price ? `Indicative price ${price}. ` : ''}Confirm dimensions, title, and approvals with qualified advisors before you pay a token.`;
    }
    if (pl === 'pg' || pl === 'hostel') {
        const feats = Array.isArray(property.features) ? property.features.slice(0, 6).join(', ') : '';
        return `${name} is a ${pt} in ${loc}. ${price ? `Monthly rent is typically discussed around ${price}; confirm room type and meal plan. ` : ''}${feats ? `Amenities and tags include ${feats}. ` : ''}Book a visit to verify Wi‑Fi, security, and deposit terms.`;
    }

    return `${name} is a ${pt} listed for rent in ${loc}. ${price ? `Rent from ${price} per month where shown. ` : ''}Confirm furnishing, maintenance, and what is included before you book.`;
}

/** FAQ snippets for PDP (concise, no meta-commentary). */
export function buildPropertyPdpFaqs(property: Property): PropertyPdpFaq[] {
    const name = formatPropertyTitle(property.title) || (property.title?.trim() ?? 'Property');
    const loc = property.location?.trim() || 'Bangalore';
    const price = fmtPrice(property);
    const type = property.type || 'property';
    const bookingText =
        property.is_available === false
            ? 'Use the enquiry options on this page to check whether this unit is still available before you visit.'
            : 'Use Book visit, Call, or WhatsApp on this page to schedule a walkthrough.';

    const amenityParts = [
        property.wifi ? 'WiFi' : '',
        property.food ? 'food' : '',
        property.housekeeping ? 'housekeeping' : '',
        property.power_backup ? 'power backup' : '',
    ].filter(Boolean);
    const amenitySummary =
        amenityParts.length > 0
            ? amenityParts.slice(0, 3).join(', ')
            : 'the amenities listed on this page';

    const items: PropertyPdpFaq[] = [
        {
            question: `What is the rent for ${name} in ${loc}?`,
            answer: price
                ? `The listing shows rent around ${price} per month. Final amount depends on room type and inclusions — confirm on enquiry or visit.`
                : `Rent for this ${type} in ${loc} is confirmed on enquiry so you can compare total monthly cost.`,
        },
        {
            question: `Is ${name} in ${loc} furnished?`,
            answer: `This ${type} in ${loc} is described on this page. Furnishing and society rules should be confirmed during a call or site visit.`,
        },
        {
            question: 'How do I book a visit on MakeMyStay?',
            answer: bookingText,
        },
        {
            question: `What amenities are available at ${name}?`,
            answer: `${name} includes ${amenitySummary}. Confirm what is included in the monthly price.`,
        },
        {
            question: `Where is ${name} located?`,
            answer: `${name} is in ${loc}, Bangalore. Plan a visit near your usual commute hours.`,
        },
    ];

    if (property.type === 'PG' || property.type === 'Hostel') {
        items.splice(
            2,
            0,
            {
                question: `Does ${name} include WiFi, food, or housekeeping?`,
                answer: `Check the tags on this listing and confirm meal frequency, Wi‑Fi, and housekeeping on enquiry.`,
            },
            {
                question: `Is there a security deposit for this PG in ${loc}?`,
                answer: `Most PGs in ${loc} ask for 1–2 months deposit and notice. Confirm amounts in writing before you pay a token.`,
            }
        );
    }
    return items.slice(0, 10);
}
