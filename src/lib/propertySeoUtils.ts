import type { Property } from '@/types/api';

/** Rough parse of displayed INR price for JSON-LD Offer (best-effort). */
export function parseInrOfferAmount(priceDisplay: string): number | undefined {
    const s = priceDisplay.trim();
    if (!s || /request|negotiable/i.test(s)) return undefined;
    if (/cr/i.test(s)) {
        const n = parseFloat(s.replace(/[^\d.]/g, ''));
        return Number.isFinite(n) ? n * 1_00_00_000 : undefined;
    }
    const n = parseFloat(s.replace(/[₹,\s]/g, ''));
    return Number.isFinite(n) ? n : undefined;
}

export function stripMarkdownLight(text: string): string {
    return text.replace(/\*\*?|__|\*|_/g, '').replace(/\s+/g, ' ').trim();
}

export function propertyLikelyHasAc(property: Property): boolean {
    const blob = [property.type, ...(property.features ?? [])].join(' ').toLowerCase();
    return /\bac\b|air[\s-]*condition|a\/c|split/i.test(blob);
}

export function propertyMatchesPgFeatureFilters(
    property: Property,
    f: { wifi?: boolean; food?: boolean; ac?: boolean }
): boolean {
    if (f.wifi && !property.wifi) return false;
    if (f.food && !property.food) return false;
    if (f.ac && !propertyLikelyHasAc(property)) return false;
    return true;
}

export type PgGenderFilter = 'male' | 'female';

/** Normalize `gender` query values (legacy Male/Female + new male/female). */
export function normalizePgGenderParam(raw: string | null | undefined): PgGenderFilter | undefined {
    if (raw == null || typeof raw !== 'string') return undefined;
    const s = raw.trim().toLowerCase();
    if (s === 'male' || s === 'm' || s === 'men' || s === 'boys' || s === 'gents') return 'male';
    if (s === 'female' || s === 'f' || s === 'women' || s === 'girls' || s === 'ladies') return 'female';
    if (raw === 'Male') return 'male';
    if (raw === 'Female') return 'female';
    return undefined;
}

/**
 * Best-effort client filter when the API has no gender field — uses title/type/features text.
 * Inclusive: ambiguous listings stay visible to avoid empty hubs.
 */
export function propertyMatchesPgGenderFilter(property: Property, gender: PgGenderFilter): boolean {
    const text = [property.title, property.description, property.type, ...(property.features ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    const hasFemaleCue = /\b(female|girls|ladies|women|she|her|woman-only|ladies only|girls pg|ladies pg)\b/i.test(
        text
    );
    const hasMaleCue = /\b(male|boys|gents|men|stag|bachelor|his|him|boys pg|gents pg)\b/i.test(text);

    if (gender === 'male') {
        if (hasFemaleCue && !hasMaleCue) return false;
        return true;
    }
    if (hasMaleCue && !hasFemaleCue) return false;
    return true;
}
