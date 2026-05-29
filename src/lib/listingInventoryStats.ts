import type { Property } from '@/types/api';

/** Parse monthly rent from card price label (e.g. `₹22,000`). Ignores Cr / sale-style prices. */
export function parseMonthlyRentInr(price: string | undefined): number | null {
    if (!price?.trim()) return null;
    if (/price on request|on request/i.test(price)) return null;
    if (/\bcr\b/i.test(price)) return null;
    const normalized = price.replace(/[, ]/g, '');
    const m = normalized.match(/(\d+(?:\.\d+)?)/);
    if (!m) return null;
    const n = parseFloat(m[1]);
    return Number.isFinite(n) && n > 0 ? n : null;
}

/** Parse "1,200 sqft" / "1200 sq ft" style strings. */
export function parseSqftFromLabel(sqft: string | undefined): number | null {
    if (!sqft?.trim() || sqft === 'On Request') return null;
    const m = String(sqft).match(/([\d,]+(?:\.\d+)?)\s*sq\s*ft/i);
    if (!m) return null;
    const n = parseFloat(m[1].replace(/,/g, ''));
    return Number.isFinite(n) && n > 0 ? n : null;
}

export function plotSqftFromProperty(p: Property): number | null {
    if (typeof p.area === 'number' && p.area > 0) return p.area;
    return parseSqftFromLabel(p.sqft);
}

export interface InventoryRentPlotStats {
    rentMinInr: number | null;
    rentMaxInr: number | null;
    plotSqftMin: number | null;
    plotSqftMax: number | null;
}

export function computeRentPlotStatsFromListings(list: Property[]): InventoryRentPlotStats {
    const rents: number[] = [];
    const plotSq: number[] = [];
    for (const p of list) {
        if (!p) continue; // Safety guard
        if (p.category === 'rent') {
            const n = parseMonthlyRentInr(p.price);
            if (n != null) rents.push(n);
        }
        if (p.category === 'plot' || (p.type || '').toLowerCase() === 'plot') {
            const sq = plotSqftFromProperty(p);
            if (sq != null) plotSq.push(sq);
        }
    }
    return {
        rentMinInr: rents.length ? Math.min(...rents) : null,
        rentMaxInr: rents.length ? Math.max(...rents) : null,
        plotSqftMin: plotSq.length ? Math.min(...plotSq) : null,
        plotSqftMax: plotSq.length ? Math.max(...plotSq) : null,
    };
}

export function formatInrRange(min: number, max: number): string {
    const a = min.toLocaleString('en-IN');
    const b = max.toLocaleString('en-IN');
    return min === max ? `₹${a}` : `₹${a} – ₹${b}`;
}

export function formatSqftRange(min: number, max: number): string {
    const a = Math.round(min).toLocaleString('en-IN');
    const b = Math.round(max).toLocaleString('en-IN');
    return min === max ? `${a} sq ft` : `${a} – ${b} sq ft`;
}
