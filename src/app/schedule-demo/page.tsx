import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildNoindexUtilitySEO } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageSeoToMetadata(buildNoindexUtilitySEO('Schedule a Demo', '/schedule-demo'));

export { default } from '@/views/ScheduleDemo';
