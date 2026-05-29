import hardcodedRows from '@/data/hardcodedProperties.json';
import { deriveUiCategory } from '@/lib/propertyCategory';
import { buildPropertySeoSlug } from '@/lib/propertyRouting';
import type { RealtyProperty } from '@/types/api';

const ALL_ROWS = hardcodedRows as RealtyProperty[];

let cachedRows: RealtyProperty[] | null = null;

export function getHardcodedRealtyRows(): RealtyProperty[] {
    if (!cachedRows) {
        cachedRows = ALL_ROWS;
    }
    return cachedRows;
}

function isDeleted(row: RealtyProperty): boolean {
    const d = row.is_deleted;
    return d === true || d === 1;
}

function isPublicListing(row: RealtyProperty): boolean {
    return !isDeleted(row) && (row.is_available ?? true);
}

/** Effective numeric price for filters (matches mapRealtyToProperty logic). */
export function getEffectivePrice(row: RealtyProperty): number | null {
    const sp = row.starting_price;
    if (typeof sp === 'number' && sp > 0) return sp;

    const pt = (row.property_type || '').toLowerCase();
    if (pt === 'pg') {
        const min = Math.min(
            row.single_price ?? Infinity,
            row.double_price ?? Infinity,
            row.triple_price ?? Infinity,
        );
        if (min < Infinity) return min;
        if (row.private_price != null && row.private_price > 0) return row.private_price;
        return null;
    }

    const lt = (row.listing_type ?? 'rent').toString().toLowerCase();
    if ((lt === 'rent' || lt === 'buy' || lt === 'sale') && row.private_price != null && row.private_price > 0) {
        return row.private_price;
    }
    return null;
}

function locationTokens(value: string | undefined): string[] {
    if (!value) return [];
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter((t) => t.length > 1);
}

function locationsOverlap(a: string | undefined, b: string | undefined): boolean {
    const ta = new Set(locationTokens(a));
    const tb = locationTokens(b);
    return tb.some((t) => ta.has(t));
}

export type HardcodedListParams = {
    skip?: number;
    limit?: number;
    category?: string;
    property_type?: string;
    listing_type?: string;
    is_available?: boolean;
    search?: string;
    exclude_property_type?: string;
    min_price?: number;
    max_price?: number;
    city?: string;
    sort_by?: string;
};

function matchesSearch(row: RealtyProperty, q: string): boolean {
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    const hay = [
        row.property_name,
        row.location,
        row.city,
        row.slug,
        row.description,
        ...(row.features ?? []),
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    return hay.includes(needle);
}

function filterRows(params: HardcodedListParams, publicOnly: boolean): RealtyProperty[] {
    let rows = getHardcodedRealtyRows();
    if (publicOnly) {
        rows = rows.filter(isPublicListing);
    }

    if (params.is_available === true) {
        rows = rows.filter((r) => r.is_available !== false);
    }

    if (params.category) {
        const cat = params.category.toLowerCase();
        rows = rows.filter((r) => deriveUiCategory(r) === cat);
    }

    if (params.property_type) {
        const pt = params.property_type.toLowerCase();
        rows = rows.filter((r) => (r.property_type || '').toLowerCase() === pt);
    }

    if (params.listing_type) {
        const lt = params.listing_type.toLowerCase();
        rows = rows.filter((r) => (r.listing_type ?? '').toString().toLowerCase() === lt);
    }

    if (params.exclude_property_type) {
        const ex = params.exclude_property_type.toLowerCase();
        rows = rows.filter((r) => (r.property_type || '').toLowerCase() !== ex);
    }

    if (params.city) {
        const city = params.city.toLowerCase();
        rows = rows.filter(
            (r) =>
                (r.city || '').toLowerCase() === city ||
                (r.location || '').toLowerCase().includes(city),
        );
    }

    if (params.search) {
        rows = rows.filter((r) => matchesSearch(r, params.search!));
    }

    if (params.min_price != null || params.max_price != null) {
        rows = rows.filter((r) => {
            const p = getEffectivePrice(r);
            if (p == null) return false;
            if (params.min_price != null && p < params.min_price) return false;
            if (params.max_price != null && p > params.max_price) return false;
            return true;
        });
    }

    if (params.sort_by === 'price_asc') {
        rows = [...rows].sort((a, b) => (getEffectivePrice(a) ?? 0) - (getEffectivePrice(b) ?? 0));
    } else if (params.sort_by === 'price_desc') {
        rows = [...rows].sort((a, b) => (getEffectivePrice(b) ?? 0) - (getEffectivePrice(a) ?? 0));
    } else {
        rows = [...rows].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
    }

    return rows;
}

export function listHardcodedProperties(
    params: HardcodedListParams = {},
): { rows: RealtyProperty[]; total: number } {
    const filtered = filterRows(params, true);
    const total = filtered.length;
    const skip = Math.max(0, params.skip ?? 0);
    const limit = params.limit ?? filtered.length;
    const rows = filtered.slice(skip, skip + limit);
    return { rows, total };
}

export function getHardcodedById(id: number | string): RealtyProperty | null {
    const idStr = String(id).trim();
    const num = Number(idStr);
    const row = getHardcodedRealtyRows().find((r) => {
        if (r.id == null) return false;
        if (String(r.id) === idStr) return true;
        return Number.isFinite(num) && r.id === num;
    });
    if (!row || isDeleted(row)) return null;
    return row;
}

export function getHardcodedBySlug(_type: string, slug: string): RealtyProperty | null {
    const normalized = slug.trim().toLowerCase();
    if (!normalized) return null;

    for (const row of getHardcodedRealtyRows()) {
        if (!isPublicListing(row)) continue;
        if (row.slug && row.slug.toLowerCase() === normalized) return row;
        const seo = buildPropertySeoSlug({
            title: row.property_name || '',
            type: row.property_type || '',
            location: row.location || '',
            slug: row.slug,
            city: row.city,
        });
        if (seo.toLowerCase() === normalized) return row;
    }
    return null;
}

export function getHardcodedSimilar(
    id: number | string,
    limit = 8,
): RealtyProperty[] {
    const base = getHardcodedById(id);
    if (!base) return [];

    const baseCat = deriveUiCategory(base);
    const candidates = getHardcodedRealtyRows().filter(
        (r) => isPublicListing(r) && r.id !== base.id,
    );

    const scored = candidates.map((r) => {
        let score = 0;
        if (deriveUiCategory(r) === baseCat) score += 3;
        if (locationsOverlap(r.location, base.location)) score += 5;
        if ((r.property_type || '').toLowerCase() === (base.property_type || '').toLowerCase()) {
            score += 2;
        }
        if ((r.city || '') === (base.city || '')) score += 1;
        return { r, score };
    });

    scored.sort((a, b) => b.score - a.score || (b.r.id ?? 0) - (a.r.id ?? 0));

    const out: RealtyProperty[] = [];
    const seen = new Set<number>();
    for (const { r, score } of scored) {
        if (score <= 0 && out.length >= limit) break;
        const rid = r.id as number;
        if (seen.has(rid)) continue;
        seen.add(rid);
        out.push(r);
        if (out.length >= limit) break;
    }

    if (out.length < limit) {
        for (const r of candidates) {
            if (out.length >= limit) break;
            const rid = r.id as number;
            if (seen.has(rid)) continue;
            seen.add(rid);
            out.push(r);
        }
    }

    return out.slice(0, limit);
}

export function getHardcodedSuggestions(
    query: string,
): { properties: string[]; places: string[] } {
    const q = query.trim().toLowerCase();
    if (!q) return { properties: [], places: [] };

    const properties: string[] = [];
    const places = new Set<string>();

    for (const row of filterRows({ search: q }, true)) {
        if (row.property_name && properties.length < 12) {
            properties.push(row.property_name);
        }
        if (row.location) {
            places.add(row.location);
        }
    }

    return {
        properties: [...new Set(properties)].slice(0, 10),
        places: [...places].slice(0, 10),
    };
}
