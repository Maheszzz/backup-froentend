import type { Property } from "@/types/api";

/** Coerce API `id` (number, string, or bad object) to a numeric route segment. */
export function normalizePropertyId(id: unknown): string {
    if (id == null || id === '') return '';
    if (typeof id === 'number' && Number.isFinite(id)) return String(Math.trunc(id));
    if (typeof id === 'string') {
        const t = id.trim();
        if (!t || t === '[object Object]') return '';
        const m = t.match(/^(\d+)/);
        return m ? m[1] : t;
    }
    if (typeof id === 'object') {
        const o = id as Record<string, unknown>;
        if ('id' in o) return normalizePropertyId(o.id);
        if ('$oid' in o) return normalizePropertyId(o.$oid);
    }
    const s = String(id);
    if (s === '[object Object]') return '';
    const m = s.match(/^(\d+)/);
    return m ? m[1] : '';
}

/**
 * Convert a property title into a URL-safe slug segment.
 * e.g. "SLC BHK 2 — BTM Layout!" → "slc-bhk-2-btm-layout"
 */
export function titleToSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function tokenizeSlugSource(value: string | undefined): string[] {
    if (!value) return [];
    return value
        .toLowerCase()
        .replace(/\bin\b/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

/**
 * SEO-first semantic slug:
 * name + type + locality/city while deduping repeated words.
 *
 * Example:
 * "New Living Homes" + "1BHK" + "Bellandur, Bangalore"
 *   → "new-living-homes-1bhk-bellandur-bangalore"
 */
export function buildPropertySeoSlug(
    property: Pick<Property, 'title' | 'type' | 'location' | 'slug' | 'city'>,
): string {
    const orderedTokens = [
        ...tokenizeSlugSource(property.title),
        ...tokenizeSlugSource(property.type),
        ...tokenizeSlugSource(property.location),
        ...tokenizeSlugSource(property.city),
    ];
    const deduped = orderedTokens.filter((token, index) => orderedTokens.indexOf(token) === index);
    const semanticSlug = deduped.join('-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return semanticSlug || property.slug?.trim() || titleToSlug(property.title || '');
}

/**
 * Build the canonical property detail path: /properties/{id}-{slug}
 * Using the ID prefix means the detail page can always fetch by ID — no
 * separate slug-lookup needed and links stay valid even if the title changes.
 *
 * Examples:
 *   /properties/102-slc-bhk-2
 *   /properties/45-premium-pg-koramangala
 */
export function getPropertyDetailPath(property: Property): string {
    const id = normalizePropertyId(property.id);
    if (!id) return '/properties';
    const slugPart = buildPropertySeoSlug(property);
    
    const category = (property.category || '').toLowerCase();
    const typeLower = (property.type || '').toLowerCase();
    const isPgType = ['pg', 'hostel', 'coliving'].some(t => typeLower.includes(t));

    // Audit Log: Detect data mismatches for internal cleanup
    if (isPgType && category === 'rent') {
        console.warn(`[SEO AUDIT] Category Mismatch: Property ID ${id} is type "${property.type}" but categorized as "rent". Correct prefixing applied.`, { id, title: property.title });
    }

    // Priority: PG/Hostel types always get /pg prefix
    // Otherwise follow the category
    let prefix = '/pg';
    if (category === 'rent' && !isPgType) {
        prefix = '/rent';
    } else if (category === 'buy' || category === 'plot') {
        prefix = '/property';
    } else if (isPgType || category === 'pg') {
        prefix = '/pg';
    }
    
    const base = slugPart ? `${id}-${slugPart}` : id;
    return `${prefix}/${base}`;
}

/**
 * Parse a combined "{id}-{slug}" route param back to just the numeric ID.
 * "/properties/102-slc-bhk-2" → param = "102-slc-bhk-2" → returns "102"
 */
export function parsePropertySlugParam(param: string): string {
    const match = param.match(/^(\d+)/);
    return match ? match[1] : '';
}

/** Backend `by-slug` type segment from PDP path prefix. */
export function inferPropertyTypeFromPath(pathname: string): string {
    if (pathname.startsWith('/rent/')) return 'rent';
    if (pathname.startsWith('/property/')) return 'plot';
    return 'PG';
}

/** True when path looks like a property PDP (`/pg/96-foo`, `/rent/79-bar`, `/properties/12-baz`), not a city hub (`/pg/bangalore`). */
export function isPropertyDetailCanonicalPath(path: string): boolean {
    return /^\/(pg|rent|property|properties)\/(\d+)(-|$)/.test(path);
}
