import type { Metadata } from 'next';
import { resolveCatchAllPathMetadata } from '@/lib/routeMetadata';
import SeoCatchAllClient from './SeoCatchAllClient';


type PageProps = { params: Promise<{ path: string[] }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { path } = await params;
    const pathKey = '/' + (path ?? []).join('/');
    return resolveCatchAllPathMetadata(pathKey);
}

export default function SeoCatchAllPage() {
    return <SeoCatchAllClient />;
}
