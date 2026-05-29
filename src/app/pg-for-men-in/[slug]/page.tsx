import type { Metadata } from 'next';
import { resolvePgGenderLocalityMetadata } from '@/lib/routeMetadata';
import PgGenderLocalityPage from '@/views/PgGenderLocalityPage';


type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolvePgGenderLocalityMetadata(slug, 'men');
}

export default function Page() {
    return <PgGenderLocalityPage />;
}
