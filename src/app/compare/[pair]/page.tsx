import type { Metadata } from 'next';
import { resolveComparisonMetadata } from '@/lib/routeMetadata';
import LocalityComparePage from '@/views/LocalityComparePage';

type PageProps = { params: Promise<{ pair: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { pair } = await params;
    return resolveComparisonMetadata(pair);
}

export default function ComparePairPage() {
    return <LocalityComparePage />;
}
