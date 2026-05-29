import { mapRealtyToProperty } from '@/lib/api/properties';
import { getHardcodedById } from '@/lib/hardcodedPropertyStore';
import type { Property } from '@/types/api';

/** Server-only property fetch for `generateMetadata` (ISR-cached). */
export async function fetchPropertyByIdServer(id: string): Promise<Property | null> {
    const trimmed = id.trim();
    if (!trimmed || !/^\d+$/.test(trimmed)) return null;
    const row = getHardcodedById(trimmed);
    if (!row?.id) return null;
    try {
        return mapRealtyToProperty(row);
    } catch {
        return null;
    }
}
