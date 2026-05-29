import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildNoindexUtilitySEO } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageSeoToMetadata(buildNoindexUtilitySEO('Wishlist', '/wishlist'));

export { default } from '@/views/Wishlist';
