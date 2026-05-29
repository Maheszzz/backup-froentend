import { Link } from '@/lib/navigation';
import { PG_LOCATIONS } from '@/data/pgLocations';

const MAX_LINKS = 20;

interface PgRelatedAreasNavProps {
    /** Current locality slug — excluded from chips */
    currentSlug: string;
    /** Prefer graph-defined nearby slugs when available */
    nearbySlugs?: string[];
}

/**
 * Single consolidated internal-link block for PG locality hubs (replaces duplicate Explore UIs).
 */
export function PgRelatedAreasNav({ currentSlug, nearbySlugs }: PgRelatedAreasNavProps) {
    const fromGraph =
        nearbySlugs && nearbySlugs.length > 0
            ? nearbySlugs
                  .map((s) => PG_LOCATIONS.find((l) => l.slug === s))
                  .filter((l): l is (typeof PG_LOCATIONS)[number] => Boolean(l))
            : [];
    const others =
        fromGraph.length > 0
            ? fromGraph.slice(0, MAX_LINKS)
            : PG_LOCATIONS.filter((l) => l.slug !== currentSlug).slice(0, MAX_LINKS);

    return (
        <section
            className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-7 shadow-sm ring-1 ring-slate-900/5"
            aria-labelledby="pg-related-areas-heading"
        >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">More areas</p>
            <h2 id="pg-related-areas-heading" className="mt-1 text-lg font-bold text-slate-900 tracking-tight">
                Compare PGs across Bangalore
            </h2>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                Open another locality hub — same verification standards and listing quality.
            </p>
            <nav className="mt-5 flex flex-wrap gap-2" aria-label="Other PG localities">
                {others.map((loc) => (
                    <Link
                        key={loc.slug}
                        to={`/pg/${loc.slug}`}
                        className="rounded-lg border border-slate-200 bg-slate-50/90 px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm transition hover:border-brand-red/40 hover:bg-red-50 hover:text-brand-red"
                    >
                        {loc.name}
                    </Link>
                ))}
            </nav>
            <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
                <Link to="/pg/bangalore" className="text-brand-red hover:underline w-fit">
                    PG in Bangalore — city hub →
                </Link>
                <Link to="/pg" className="text-brand-red hover:underline w-fit">
                    Browse all PG listings →
                </Link>
            </div>
        </section>
    );
}
