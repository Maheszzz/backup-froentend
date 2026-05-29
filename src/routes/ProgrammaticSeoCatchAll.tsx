'use client';

import { notFound } from 'next/navigation';
import { Navigate } from '@/lib/navigation';
import PGLocationPage from '@/views/PGLocationPage';
import PgGenderLocalityPage from '@/views/PgGenderLocalityPage';
import PgNearLandmarkPage from '@/views/PgNearLandmarkPage';
import { PG_NEAR_LANDMARKS } from '@/data/pgNearLandmarks';
import { canonicalRentPathForRentInSegment } from '@/lib/rentLegacyRedirects';

function hubSlugToPgSlug(hubSlug: string): string {
    return hubSlug === 'btm-layout' ? 'btm' : hubSlug;
}

/** Handles flat SEO URLs: /pg-in-*, /pg-for-*-in-*, /pg-near-*, /rent-in-* */
export default function ProgrammaticSeoCatchAll({ pathKey }: { pathKey: string }) {
    const path = pathKey.replace(/^\//, '');

    const rentIn = path.match(/^rent-in-(.+)$/);
    if (rentIn) {
        const target = canonicalRentPathForRentInSegment(rentIn[1]);
        return <Navigate to={target ?? '/rent'} replace />;
    }

    const near = PG_NEAR_LANDMARKS.find((e) => e.path === path);
    if (near) {
        return <PgNearLandmarkPage />;
    }

    const boys = path.match(/^pg-for-boys-in-(.+)$/);
    if (boys) return <PgGenderLocalityPage />;

    const girls = path.match(/^pg-for-girls-in-(.+)$/);
    if (girls) return <PgGenderLocalityPage />;

    const men = path.match(/^pg-for-men-in-(.+)$/);
    if (men) return <PgGenderLocalityPage />;

    const women = path.match(/^pg-for-women-in-(.+)$/);
    if (women) return <PgGenderLocalityPage />;

    const priceTier = path.match(/^pg-in-(.+)-under-(\d+)$/);
    if (priceTier) {
        const baseSlug = hubSlugToPgSlug(priceTier[1]);
        return <PGLocationPage overrideSlug={baseSlug} overrideMaxPrice={priceTier[2]} />;
    }

    const pgIn = path.match(/^pg-in-(.+)$/);
    if (pgIn) {
        const baseSlug = hubSlugToPgSlug(pgIn[1]);
        return <PGLocationPage overrideSlug={baseSlug} />;
    }

    notFound();
}
