import type { Metadata } from 'next';
import PropertyDetailsPage from '@/components/property/PropertyDetailsPage';
import { resolvePgSlugMetadata } from '@/lib/routeMetadata';
import { isPropertySlugParam } from '@/lib/propertyMetadata';
import PgSlugRoute from '@/routes/PgSlugRoute';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolvePgSlugMetadata(slug);
}

export default async function PgSlugPage({ params }: PageProps) {
    const { slug } = await params;
    if (isPropertySlugParam(slug)) {
        return <PropertyDetailsPage slug={slug} currentPath={`/pg/${slug}`} />;
    }
    return <PgSlugRoute />;
}
