import { PG_NEAR_LANDMARKS } from '@/data/pgNearLandmarks';
import { PG_LOCATIONS } from '@/data/pgLocations';

export interface SearchSuggestionGroups {
    properties: string[];
    places: string[];
}

function normalize(s: string): string {
    return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

function matchesQuery(label: string, query: string): boolean {
    const q = normalize(query);
    const l = normalize(label);
    if (!q || !l) return false;
    return l.includes(q) || q.includes(l);
}

/** Static Bangalore localities + landmark hubs for autocomplete (merged with API). */
export function matchStaticPlaces(query: string): string[] {
    const q = query.trim();
    if (!q) return [];

    const hits = new Set<string>();

    for (const loc of PG_LOCATIONS) {
        if (matchesQuery(loc.name, q) || matchesQuery(loc.slug.replace(/-/g, ' '), q)) {
            hits.add(loc.name);
        }
    }

    for (const entry of PG_NEAR_LANDMARKS) {
        if (matchesQuery(entry.landmark, q)) {
            hits.add(entry.landmark);
        }
        const hub = PG_LOCATIONS.find((l) => l.slug === entry.hubSlug);
        if (hub && matchesQuery(hub.name, q)) {
            hits.add(hub.name);
        }
    }

    return [...hits].sort((a, b) => a.localeCompare(b));
}

export function mergeSuggestionGroups(
    api: SearchSuggestionGroups,
    query: string
): SearchSuggestionGroups {
    const staticPlaces = matchStaticPlaces(query);
    const seenPlaces = new Set<string>();
    const places: string[] = [];

    for (const label of [...staticPlaces, ...api.places]) {
        const key = normalize(label);
        if (!key || seenPlaces.has(key)) continue;
        seenPlaces.add(key);
        places.push(label);
    }

    const seenProps = new Set<string>();
    const properties: string[] = [];
    for (const name of api.properties) {
        const key = normalize(name);
        if (!key || seenProps.has(key)) continue;
        seenProps.add(key);
        properties.push(name);
    }

    return {
        properties: properties.slice(0, 10),
        places: places.slice(0, 10),
    };
}
