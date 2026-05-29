import { redirect } from 'next/navigation';
import { fetchPropertyByIdServer } from '@/lib/server/fetchPropertyById';
import { getPropertyDetailPath, parsePropertySlugParam } from '@/lib/propertyRouting';
import { isPropertySlugParam } from '@/lib/propertyMetadata';
import type { Property } from '@/types/api';

export type PropertyPdpRouteResult =
    | { kind: 'redirect'; destination: string }
    | { kind: 'render'; property: Property | null; slug: string }
    | { kind: 'not_property_slug' };

/**
 * Server-side PDP routing: canonical 301 for duplicate prefixes (/properties, /rent, …).
 */
export async function resolvePropertyPdpRoute(
    slug: string,
    currentPath: string,
): Promise<PropertyPdpRouteResult> {
    const param = (slug || '').toLowerCase();
    if (!isPropertySlugParam(param)) {
        return { kind: 'not_property_slug' };
    }

    const id = parsePropertySlugParam(param);
    if (!id) {
        return { kind: 'render', property: null, slug: param };
    }

    const property = await fetchPropertyByIdServer(id);
    if (!property) {
        return { kind: 'render', property: null, slug: param };
    }

    const canonical = getPropertyDetailPath(property);
    const pathOnly = currentPath.split('?')[0];
    if (canonical !== pathOnly) {
        return { kind: 'redirect', destination: canonical };
    }

    return { kind: 'render', property, slug: param };
}

export function applyPropertyPdpRoute(result: PropertyPdpRouteResult): void {
    if (result.kind === 'redirect') {
        redirect(result.destination);
    }
}
