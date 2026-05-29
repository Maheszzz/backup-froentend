import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildHowWeVerifyPageSEO } from '@/lib/seo';

export const metadata: Metadata = pageSeoToMetadata(buildHowWeVerifyPageSEO());

export { default } from '@/views/HowWeVerify';
