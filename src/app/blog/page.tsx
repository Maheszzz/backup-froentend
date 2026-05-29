import type { Metadata } from 'next';
import { pageSeoToMetadata } from '@/lib/nextMetadata';
import { buildBlogIndexSEO } from '@/lib/seo';
import { BLOG_POSTS } from '@/data/blogPosts';

export const metadata: Metadata = pageSeoToMetadata(buildBlogIndexSEO(BLOG_POSTS.length));

export { default } from '@/views/BlogIndex';
