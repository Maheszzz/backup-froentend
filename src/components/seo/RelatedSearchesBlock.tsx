import { Link } from '@/lib/navigation';
import { getPgLocationBySlug } from '@/data/pgLocations';

export interface RelatedSearchesBlockProps {
    /** Current locality slug (e.g. `hsr-layout`). */
    currentSlug: string;
    localityName: string;
    variant: 'pg' | 'rent';
}

const EXTRA_SLUGS = ['bellandur', 'koramangala', 'whitefield', 'electronic-city', 'marathahalli', 'btm', 'indiranagar'];

/**
 * Automated internal links for topical clusters (locality + intent).
 */
export function RelatedSearchesBlock({ currentSlug, localityName, variant }: RelatedSearchesBlockProps) {
    const base = variant === 'pg' ? '/pg' : '/rent';
    const links: { label: string; to: string }[] = [];

    for (const s of EXTRA_SLUGS) {
        if (s === currentSlug) continue;
        const loc = getPgLocationBySlug(s);
        if (!loc) continue;
        links.push({
            label: variant === 'pg' ? `PG in ${loc.name}` : `Rent in ${loc.name}`,
            to: `${base}/${s}`,
        });
        if (links.length >= 6) break;
    }

    links.push(
        { label: `Boys PG in ${localityName}`, to: `/pg-for-boys-in-${currentSlug}` },
        { label: `Girls PG in ${localityName}`, to: `/pg-for-girls-in-${currentSlug}` },
        { label: 'PG in Bangalore (hub)', to: '/pg/bangalore' },
        { label: 'Rent in Bangalore (hub)', to: '/rent/bangalore' }
    );

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="related-searches-heading">
            <h2 id="related-searches-heading" className="text-lg font-bold text-slate-900 mb-3">
                Related searches
            </h2>
            <p className="text-sm text-slate-600 mb-4">
                Explore nearby areas and intent hubs — useful for comparing commute and rent before you shortlist.
            </p>
            <ul className="flex flex-wrap gap-2">
                {links.map((item) => (
                    <li key={item.to}>
                        <Link
                            to={item.to}
                            className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-red/40 hover:text-brand-red transition-colors"
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
