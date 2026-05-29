import { useState, useEffect } from 'react';
import { propertyApi } from '@/lib/api';

/**
 * Distinct locality names derived from live PG listings (backend), sorted A–Z.
 * Replaces static JSON for filter dropdowns where possible.
 */
export function useListingLocalityOptions(seedArea?: string) {
    const [areas, setAreas] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await propertyApi.getAll({ category: 'pg', limit: 100, skip: 0 });
                const rows = Array.isArray(res.items) ? res.items : [];
                const set = new Set<string>();
                for (const p of rows) {
                    const loc = typeof p.location === 'string' ? p.location.trim() : '';
                    if (!loc) continue;
                    const head = loc.split(',')[0].trim();
                    if (head.length > 1) set.add(head);
                }
                let list = Array.from(set).sort((a, b) => a.localeCompare(b, 'en-IN'));
                if (seedArea?.trim()) {
                    const s = seedArea.trim();
                    if (!list.some((x) => x.toLowerCase() === s.toLowerCase())) {
                        list = [s, ...list];
                    }
                }
                if (!cancelled) setAreas(list);
            } catch {
                if (!cancelled) setAreas(seedArea ? [seedArea] : []);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [seedArea]);

    return { areas, loading };
}
