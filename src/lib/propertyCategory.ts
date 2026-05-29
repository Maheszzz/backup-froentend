import type { Property, RealtyProperty } from '@/types/api';

/** Align with backend PropertyListItem.derive_category — never reduce pg/plot to rent/buy only. */
export function deriveUiCategory(item: RealtyProperty): Property['category'] {
    const raw = item.category;
    if (typeof raw === 'string' && raw.trim()) {
        const c = raw.trim().toLowerCase();
        if (c === 'pg' || c === 'plot' || c === 'rent' || c === 'buy') {
            return c as Property['category'];
        }
    }
    const pt = (item.property_type || '').toLowerCase();
    if (pt === 'pg') return 'pg';
    if (pt === 'plot') return 'plot';
    const lt = (item.listing_type ?? 'rent').toString().toLowerCase();
    if (lt === 'buy' || lt === 'sale') return 'buy';
    return 'rent';
}
