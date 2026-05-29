import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { build1BhkSEO } from '@/lib/seo';
import Properties from '@/views/Properties';


export const metadata: Metadata = pageSeoToMetadata(build1BhkSEO());

export default function Page() {
    return <Properties key="1bhk" initialCategory="rent" pageTitle="1BHK for Rent in Bangalore" />;
}
