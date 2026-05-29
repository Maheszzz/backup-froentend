import { Link } from '@/lib/navigation';
import { useSimilarProperties } from '@/hooks';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import type { Property } from '@/types/api';
import { findPgLocationForArea } from '@/data/pgLocations';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface SimilarPropertiesSectionProps {
    current: Property;
}

export function SimilarPropertiesSection({ current }: SimilarPropertiesSectionProps) {
    const city = current.location?.trim() || undefined;
    const pgLoc = findPgLocationForArea(current.location);
    const isPg = current.type?.toLowerCase() === 'pg';

    const { properties: similar, loading, error } = useSimilarProperties(current.id, { limit: 6 });

    if (!loading && (error || similar.length === 0)) {
        return null;
    }

    const heading = isPg
        ? pgLoc
            ? `Similar PG in ${pgLoc.name}`
            : `More PG stays${city ? ` near ${city}` : ' in Bangalore'}`
        : pgLoc
          ? `Similar ${current.type} in ${pgLoc.name}`
          : `More ${current.type} listings${city ? ` near ${city}` : ''}`;

    return (
        <section className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.25)] p-5 sm:p-6 md:p-8" aria-labelledby="similar-pg-heading">
            <div className="mb-4 md:mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 id="similar-pg-heading" className="text-xl md:text-2xl font-extrabold text-slate-900">
                        {heading}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Verified listings — tap to compare and save</p>
                </div>
                {pgLoc && (
                    <Link
                        to={`/pg/${pgLoc.slug}`}
                        className="text-sm font-semibold text-brand-red hover:underline flex items-center gap-1"
                    >
                        View all in {pgLoc.name} <span className="text-lg">→</span>
                    </Link>
                )}
            </div>

            {loading && similar.length === 0 ? (
                <div className="py-12 flex justify-center">
                    <LoadingSpinner size={40} message="Loading similar listings…" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-5 xl:gap-6">
                    {similar.map((p) => (
                        <PropertyCard key={p.id} property={p} />
                    ))}
                </div>
            )}
        </section>
    );
}
