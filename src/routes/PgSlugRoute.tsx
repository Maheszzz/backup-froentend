'use client';

import { useParams } from '@/lib/navigation';
import { SEOHead } from '@/components/seo/SEOHead';
import { absoluteUrl } from '@/lib/seo';
import { getPgLocationBySlug } from '@/data/pgLocations';
import { getStaticPgPropertyRedirect } from '@/lib/seoPropertyRedirects';
import { usePrerenderReady, useSafeReplace } from '@/hooks';
import PropertyDetails from '@/views/PropertyDetails';
import PGBangaloreHub from '@/views/PGBangaloreHub';
import PGHyderabadHub from '@/views/PGHyderabadHub';
import PGPuneHub from '@/views/PGPuneHub';
import PgFeatureLandingPage from '@/views/PgFeatureLandingPage';
import PgVsFlatBangalore from '@/views/PgVsFlatBangalore';
import PGLocationPage from '@/views/PGLocationPage';

function PgProperty301Redirect({ to }: { to: string }) {
    usePrerenderReady(true, [to]);
    useSafeReplace(to, true);
    const target = absoluteUrl(to);
    return (
        <SEOHead
            title="Redirecting"
            description=""
            canonicalHref={target}
            prerenderStatus={301}
            prerenderHeaders={{ Location: target }}
        />
    );
}

export default function PgSlugRoute() {
    const { slug } = useParams<{ slug: string }>();
    const param = (slug || '').toLowerCase();

    if (/^(\d+)(-|$)/.test(param)) {
        const staticTo = getStaticPgPropertyRedirect(param);
        if (staticTo) return <PgProperty301Redirect to={staticTo} />;
        return <PropertyDetails />;
    }

    if (param === 'bangalore') return <PGBangaloreHub />;
    if (param === 'hyderabad') return <PGHyderabadHub />;
    if (param === 'pune') return <PGPuneHub />;
    if (['pg-with-wifi', 'pg-with-food', 'pg-with-ac'].includes(param)) return <PgFeatureLandingPage />;
    if (param === 'pg-vs-flat-bangalore') return <PgVsFlatBangalore />;

    if (getPgLocationBySlug(param)) {
        return <PGLocationPage />;
    }

    return <PropertyDetails />;
}
