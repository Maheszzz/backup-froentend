import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { pgVsFlatBangaloreSeo } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(pgVsFlatBangaloreSeo());

export { default } from '@/views/PgVsFlatBangalore';
