import type { Metadata } from 'next';
import PropertyDetailsPage from '@/components/property/PropertyDetailsPage';
import { resolvePropertyPageMetadata } from '@/lib/propertyMetadata';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolvePropertyPageMetadata(slug);
}

export default async function PropertySlugPage({ params }: PageProps) {
    const { slug } = await params;
    return <PropertyDetailsPage slug={slug} currentPath={`/properties/${slug}`} />;
}
