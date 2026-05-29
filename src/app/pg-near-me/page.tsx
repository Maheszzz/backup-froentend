import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildPgNearMeSEO } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(buildPgNearMeSEO());

export { default } from '@/views/PgNearMe';
