import type { Metadata } from 'next';
import { fetchPropertyByIdServer } from '@/lib/server/fetchPropertyById';
import { getPropertyDetailPath, parsePropertySlugParam } from '@/lib/propertyRouting';
import {
    interimPropertyDetailSeo,
    propertyDetailPageSeo,
    propertyErrorSeo,
    propertyUnavailableSeo,
} from '@/lib/seo';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { inferPgLocalityHubFromPropertySlug } from '@/lib/seoPropertyRedirects';
import { getPgLocationBySlug } from '@/data/pgLocations';

export async function resolvePropertyPageMetadata(slug: string): Promise<Metadata> {
    const param = (slug || '').toLowerCase();
    const id = parsePropertySlugParam(param);
    if (!id) {
        return pageSeoToMetadata(propertyErrorSeo(`/pg/${param}`));
    }

    const property = await fetchPropertyByIdServer(id);
    if (!property) {
        return pageSeoToMetadata(interimPropertyDetailSeo(param, `/pg/${param}`));
    }

    if (property.is_available === false) {
        const hub = inferPgLocalityHubFromPropertySlug(param);
        const locName = hub ? getPgLocationBySlug(hub.replace('/pg/', ''))?.name : undefined;
        const detailPath = getPropertyDetailPath(property);
        return pageSeoToMetadata(propertyUnavailableSeo(detailPath, locName));
    }

    const detailPath = getPropertyDetailPath(property);
    return pageSeoToMetadata(propertyDetailPageSeo(property, detailPath));
}

export function isPropertySlugParam(slug: string): boolean {
    return /^(\d+)(-|$)/.test((slug || '').toLowerCase());
}
