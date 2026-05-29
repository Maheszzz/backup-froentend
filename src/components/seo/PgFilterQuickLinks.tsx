import { Link, useSearchParams } from '@/lib/navigation';

interface PgFilterQuickLinksProps {
    slug: string;
}

const chipClass =
    'inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-brand-red/40 hover:text-brand-red';

/**
 * Indexable filter shortcuts (wifi / food / AC / price tier) — deep-links preserve existing query from the listing embed.
 */
export function PgFilterQuickLinks({ slug }: PgFilterQuickLinksProps) {
    const [searchParams] = useSearchParams();
    const basePath = `/pg/${slug}`;

    const withParams = (extra: Record<string, string>) => {
        const next = new URLSearchParams(searchParams.toString());
        for (const [k, v] of Object.entries(extra)) {
            next.set(k, v);
        }
        const q = next.toString();
        return q ? `${basePath}?${q}` : basePath;
    };

    return (
        <nav className="flex flex-wrap gap-2" aria-label="Popular PG filters">
            <Link to={withParams({ wifi: 'true' })} className={chipClass}>
                WiFi PGs
            </Link>
            <Link to={withParams({ food: 'true' })} className={chipClass}>
                Food included
            </Link>
            <Link to={withParams({ ac: 'true' })} className={chipClass}>
                AC rooms
            </Link>
            <Link to={withParams({ price: 'low' })} className={chipClass}>
                Budget (price: low)
            </Link>
            <Link to={withParams({ price: 'high' })} className={chipClass}>
                Premium (price: high)
            </Link>
        </nav>
    );
}
