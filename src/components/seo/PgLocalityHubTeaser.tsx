import { Link } from '@/lib/navigation';
import { MapPin } from 'lucide-react';

interface PgLocalityHubTeaserProps {
    name: string;
    slug: string;
}

/**
 * Single cross-link to the canonical PG locality hub — avoids duplicating long-form SEO on PDP.
 */
export function PgLocalityHubTeaser({ name, slug }: PgLocalityHubTeaserProps) {
    return (
        <section
            className="rounded-2xl border border-slate-200/90 bg-white p-6 md:p-7 shadow-sm"
            aria-labelledby={`pg-locality-teaser-${slug}`}
        >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Area guide</p>
                    <h2
                        id={`pg-locality-teaser-${slug}`}
                        className="mt-1 text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2"
                    >
                        <MapPin className="h-5 w-5 text-brand-red shrink-0" aria-hidden />
                        PG in {name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
                        Full rent ranges, amenities, FAQs, filters, and more listings for this locality live on the hub
                        page — we keep it in one place so details stay consistent.
                    </p>
                </div>
                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <Link
                        to={`/pg/${slug}`}
                        className="inline-flex items-center justify-center rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-red/95 transition-colors"
                    >
                        Open full PG guide →
                    </Link>
                    <Link
                        to="/pg/bangalore"
                        className="text-xs font-semibold text-brand-red hover:underline text-center sm:text-right"
                    >
                        Bangalore city hub →
                    </Link>
                </div>
            </div>
        </section>
    );
}
