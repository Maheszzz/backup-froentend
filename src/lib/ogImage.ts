import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { normalizePropertyId } from '@/lib/propertyRouting';
import { SITE_URL } from '@/lib/siteConfig';
import type { Property } from '@/types/api';

/** Dynamic OG card URL (1200×630) — see `src/app/api/og/route.tsx`. */
export function buildPropertyOgImageUrl(property: Property): string {
    const id = normalizePropertyId(property.id);
    const params = new URLSearchParams({
        title: (formatPropertyTitle(property.title) || property.title || 'Verified listing').slice(0, 100),
        location: (property.location || 'Bangalore').slice(0, 80),
        price: (property.price || 'Rent on request').slice(0, 48),
        type: (property.type || 'PG').slice(0, 32),
    });
    if (id) params.set('id', id);
    return `${SITE_URL}/api/og?${params.toString()}`;
}

/** Hub / blog OG with custom headline. */
export function buildTextOgImageUrl(fields: {
    title: string;
    location?: string;
    price?: string;
    type?: string;
}): string {
    const params = new URLSearchParams({
        title: fields.title.slice(0, 100),
        location: (fields.location || 'Bangalore').slice(0, 80),
        price: (fields.price || 'Zero brokerage on many stays').slice(0, 48),
        type: (fields.type || 'MakeMyStay.ai').slice(0, 32),
    });
    return `${SITE_URL}/api/og?${params.toString()}`;
}
