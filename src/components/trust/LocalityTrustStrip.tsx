'use client';

import { useEffect, useState } from 'react';
import { Star, BadgeCheck } from 'lucide-react';
import { fetchLocalityTrustStats, formatLocalityTrustLine, type LocalityTrustStats } from '@/lib/localityTrust';

interface LocalityTrustStripProps {
    slug: string;
    name: string;
}

export function LocalityTrustStrip({ slug, name }: LocalityTrustStripProps) {
    const [stats, setStats] = useState<LocalityTrustStats | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchLocalityTrustStats(slug).then((s) => {
            if (!cancelled) setStats(s);
        });
        return () => {
            cancelled = true;
        };
    }, [slug]);

    if (!stats || (stats.review_count === 0 && stats.listing_count === 0)) return null;

    const line = formatLocalityTrustLine(stats);

    return (
        <div
            className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200/70 bg-amber-50/50 px-4 py-3 text-sm text-slate-800"
            data-seo="locality-trust-stats"
        >
            {stats.average_rating && stats.review_count > 0 && (
                <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden />
                    {stats.average_rating.toFixed(1)}
                </span>
            )}
            <span>{line}</span>
            {stats.verified_listing_count > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-emerald-800">
                    <BadgeCheck className="w-3.5 h-3.5" aria-hidden />
                    Field verified
                </span>
            )}
        </div>
    );
}
