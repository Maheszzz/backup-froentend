'use client';

import { useParams } from '@/lib/navigation';
import ProgrammaticSeoCatchAll from '@/routes/ProgrammaticSeoCatchAll';

/** Required catch-all for flat SEO URLs (`/pg-in-*`, `/rent-in-*`, etc.) — does not match `/`. */
function pathSegments(path: string | string[] | undefined): string[] {
    if (!path) return [];
    return Array.isArray(path) ? path : [path];
}

export default function SeoCatchAllClient() {
    const params = useParams();
    const segments = pathSegments((params as { path?: string | string[] }).path);
    const pathKey = '/' + segments.join('/');
    return <ProgrammaticSeoCatchAll pathKey={pathKey} />;
}
