import { Link } from '@/lib/navigation';
import { getPgLocationBySlug } from '@/data/pgLocations';
import type { PgLocalityDeepProfile } from '@/types/localityContent';

interface LocalityInternalLinkHubProps {
    profile: PgLocalityDeepProfile;
}

/**
 * Internal linking graph: nearby areas, landmarks, gender hubs, comparisons, blogs.
 */
export function LocalityInternalLinkHub({ profile }: LocalityInternalLinkHubProps) {
    const { slug, name } = profile;

    return (
        <section
            className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-7 shadow-sm ring-1 ring-slate-900/5 space-y-6"
            aria-labelledby="locality-link-hub-heading"
        >
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Explore</p>
                <h2 id="locality-link-hub-heading" className="mt-1 text-lg font-bold text-slate-900">
                    PG near {name} — related pages
                </h2>
            </div>

            {profile.comparisons.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Area comparisons</h3>
                    <nav className="flex flex-col gap-2" aria-label="Locality comparisons">
                        {profile.comparisons.map((c) => (
                            <Link
                                key={c.pairSlug}
                                to={`/compare/${c.pairSlug}`}
                                className="text-sm font-semibold text-brand-red hover:underline"
                            >
                                {name} vs {c.name} →
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            {profile.nearbySlugs.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Nearby localities</h3>
                    <nav className="flex flex-wrap gap-2" aria-label="Nearby PG localities">
                        {profile.nearbySlugs.map((s) => {
                            const loc = getPgLocationBySlug(s);
                            if (!loc) return null;
                            return (
                                <Link
                                    key={s}
                                    to={`/pg/${s}`}
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 hover:border-brand-red/40 hover:text-brand-red"
                                >
                                    PG in {loc.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}

            {profile.landmarkPaths && profile.landmarkPaths.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">PG near landmarks</h3>
                    <nav className="flex flex-wrap gap-2">
                        {profile.landmarkPaths.map((p) => (
                            <Link
                                key={p}
                                to={`/${p}`}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800 hover:text-brand-red"
                            >
                                {p.replace(/-/g, ' ')}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            {profile.genderPaths && (
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">By audience</h3>
                    <nav className="flex flex-wrap gap-2">
                        <Link
                            to={`/pg-for-boys-in-${slug}`}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:text-brand-red"
                        >
                            Boys PG in {name}
                        </Link>
                        <Link
                            to={`/pg-for-girls-in-${slug}`}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:text-brand-red"
                        >
                            Girls PG in {name}
                        </Link>
                    </nav>
                </div>
            )}

            {profile.blogPaths && profile.blogPaths.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Guides</h3>
                    <nav className="flex flex-col gap-1">
                        {profile.blogPaths.map((b) => (
                            <Link key={b.path} to={b.path} className="text-sm font-semibold text-brand-red hover:underline">
                                {b.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </section>
    );
}
