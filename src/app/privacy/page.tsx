import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildPrivacyPageSEO } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(buildPrivacyPageSEO());

export { default } from '@/views/Privacy';
