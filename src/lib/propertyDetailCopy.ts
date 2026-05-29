import type { Property } from '@/types/api';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';

function locationMentionsBangalore(location: string): boolean {
    return /bangalore/i.test(location);
}

/**
 * Single SEO-oriented H1: locality + type + price when available (matches audit pattern).
 */
export function buildPropertySeoHeading(property: Property): string {
    const title = formatPropertyTitle(property.title) || (property.title?.trim() ?? 'Property');
    const type = (property.type || 'Property').trim();
    const loc = (property.location || '').trim() || 'Bangalore';
    const bangaloreSuffix = locationMentionsBangalore(loc) ? '' : ' Bangalore';
    const locPhrase = `${loc}${bangaloreSuffix}`.replace(/\s+/g, ' ').trim();

    const priceOk = Boolean(property.price && !/request|negotiable/i.test(property.price));
    const isRent = property.category === 'rent';

    if (isRent && priceOk) {
        const price = property.price?.trim() ?? '';
        return `${title} ${type} in ${locPhrase} (${price}/month)`.replace(/\s+/g, ' ').trim();
    }
    if (isRent) {
        return `${title} ${type} in ${locPhrase}`.replace(/\s+/g, ' ').trim();
    }
    return `${title} — ${type} in ${locPhrase}`.replace(/\s+/g, ' ').trim();
}

/** Short intro under H1 (above the fold), ~320 chars max. */
export function buildPropertyHeroIntro(property: Property): string {
    const name = formatPropertyTitle(property.title) || property.title;
    const loc = property.location?.trim() || 'Bangalore';
    const wifi = property.wifi ? 'WiFi, ' : '';
    const food = property.food ? 'food options, ' : '';
    const avail =
        property.is_available === false
            ? 'Limited availability — enquire for current openings.'
            : 'Book a visit or enquire online.';

    return `${name} in ${loc} offers fully furnished stays with ${wifi}${food}housekeeping, and 24/7 security. Ideal for working professionals and students seeking affordable comfort in Bangalore. ${avail}`.slice(
        0,
        320
    );
}

/** Browser tab / OG title: keep readable if the SEO heading is very long. */
export function trimMetaTitle(heading: string, max = 62): string {
    const t = heading.trim();
    if (t.length <= max) return t;
    return `${t.slice(0, max - 1).trim()}…`;
}

/** Shared product name for JSON-LD (match visible H1, cap length for schema). */
export function buildPropertyProductName(property: Property): string {
    const h = buildPropertySeoHeading(property);
    return h.length > 150 ? `${h.slice(0, 147)}…` : h;
}
