import { FEATURED_LAUNCH } from '@/data/featuredLaunch';
import type { Property } from '@/types/api';

function matchesFeaturedLaunch(property: Property): boolean {
    if (String(property.id) === String(FEATURED_LAUNCH.propertyId)) return true;
    const slug = (property.slug || '').toLowerCase();
    if (slug.includes('urban-homes') && slug.includes('hsr')) return true;
    const title = (property.title || '').toLowerCase();
    const loc = (property.location || '').toLowerCase();
    return title.includes(FEATURED_LAUNCH.titleIncludes) && loc.includes(FEATURED_LAUNCH.locationIncludes);
}

export function findFeaturedLaunchProperty(properties: Property[]): Property | undefined {
    return properties.find(matchesFeaturedLaunch);
}

/** Carousel rows excluding the spotlight launch (shown separately above). */
export function buildFeaturedCarouselRows(
    properties: Property[],
    launch: Property | null | undefined,
    maxItems = 8
): Property[] {
    const rows = launch
        ? properties.filter((p) => String(p.id) !== String(launch.id))
        : properties;
    return rows.slice(0, maxItems);
}
