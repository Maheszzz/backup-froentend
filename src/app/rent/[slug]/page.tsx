import type { Metadata } from 'next';
import PropertyDetailsPage from '@/components/property/PropertyDetailsPage';
import { resolveRentSlugMetadata } from '@/lib/routeMetadata';
import { isPropertySlugParam } from '@/lib/propertyMetadata';
import RentSlugRoute from '@/routes/RentSlugRoute';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolveRentSlugMetadata(slug);
}

export default async function RentSlugPage({ params }: PageProps) {
    const { slug } = await params;
    if (isPropertySlugParam(slug)) {
        return <PropertyDetailsPage slug={slug} currentPath={`/rent/${slug}`} />;
    }
    return <RentSlugRoute />;
}
