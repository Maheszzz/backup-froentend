import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';


type PageProps = { params: Promise<{ serviceId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { serviceId } = await params;
    const label = serviceId.replace(/-/g, ' ');
    return pageSeoToMetadata({
        title: `${label} — MakeMyStay services`,
        description: `Learn about ${label} on MakeMyStay.ai — verified PG and rental services in Bangalore.`,
        path: `/services/${serviceId}`,
    });
}

export { default } from '@/views/ServiceDetail';
