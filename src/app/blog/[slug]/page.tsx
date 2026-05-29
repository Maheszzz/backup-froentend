import type { Metadata } from 'next';
import { resolveBlogSlugMetadata } from '@/lib/routeMetadata';
import BlogPost from '@/views/BlogPost';


type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return resolveBlogSlugMetadata(slug);
}

export default function BlogSlugPage() {
    return <BlogPost />;
}
