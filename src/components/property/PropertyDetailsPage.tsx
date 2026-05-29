import PropertyDetails from '@/views/PropertyDetails';
import { PropertyPdpSeoHtml } from '@/components/property/PropertyPdpSeoHtml';
import {
    applyPropertyPdpRoute,
    resolvePropertyPdpRoute,
} from '@/lib/server/propertyPdpRoute';

type Props = {
    slug: string;
    currentPath: string;
};

export const revalidate = 3600;

export default async function PropertyDetailsPage({ slug, currentPath }: Props) {
    const route = await resolvePropertyPdpRoute(slug, currentPath);
    applyPropertyPdpRoute(route);

    if (route.kind !== 'render') {
        return null;
    }

    return (
        <>
            {route.property ? <PropertyPdpSeoHtml property={route.property} /> : null}
            <PropertyDetails initialProperty={route.property ?? undefined} slug={route.slug} />
        </>
    );
}
