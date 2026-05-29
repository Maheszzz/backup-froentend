'use client';

import { Link, Navigate, useParams } from '@/lib/navigation';
import { motion } from 'framer-motion';
import { Clock, Calendar, ChevronLeft, Share2, Bookmark, ArrowRight, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BLOG_POSTS, getBlogPost } from '@/data/blogPosts';
import { getBlogCoverImage, handleBlogCoverImageError } from '@/lib/blogAssets';
import { buildPageSEO } from '@/lib/seo';
import { SITE_URL } from '@/lib/siteConfig';
import { buildBreadcrumbSchema } from '@/lib/schema';

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const post = getBlogPost(slug);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    const canonical = `${SITE_URL}/blog/${post.slug}`;
    const coverImage = getBlogCoverImage(post);
    const coverAbsolute = coverImage.startsWith('http')
        ? coverImage
        : `${SITE_URL}${coverImage}`;
    const helmet = buildPageSEO({
        title: post.title,
        description: post.description,
        canonicalUrl: canonical,
    });

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt ?? post.publishedAt,
        author: {
            '@type': post.authorType ?? 'Organization',
            name: post.authorName ?? 'MakeMyStay.ai',
        },
        image: coverAbsolute,
        publisher: { '@type': 'Organization', name: 'MakeMyStay.ai' },
        mainEntityOfPage: canonical,
    };

    const faqSchema = post.faqs && post.faqs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer
            }
        }))
    } : null;

    const breadcrumbSchema = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: `/blog/${post.slug}` },
    ]);

    const others = BLOG_POSTS.filter((p) => p.slug !== post.slug);
    const sameCategory = others.filter((p) => p.category === post.category);
    const relatedPosts = [...sameCategory, ...others.filter((p) => p.category !== post.category)].slice(
        0,
        3,
    );

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <SEOHead {...helmet} ogType="article" />
            <JsonLd data={articleSchema} id="blog-article-schema" />
            <JsonLd data={breadcrumbSchema} id="blog-breadcrumb-schema" />
            {faqSchema && <JsonLd data={faqSchema} id="blog-faq-schema" />}

            <Navbar />

            <main id="main-content" className="flex-grow pt-24 pb-24">
                {/* Progress Bar */}
                <motion.div 
                    className="fixed top-[64px] md:top-[80px] left-0 h-1 bg-brand-red z-50 origin-left"
                    initial={{ scaleX: 0 }}
                    style={{ scaleX: 0 }} // This would normally be handled by scroll progress
                />

                <article className="max-w-4xl mx-auto px-4 sm:px-6">
                    {/* Header Metadata */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <Link to="/blog" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-brand-red transition-colors group">
                            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Back to Insights
                        </Link>
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                                <Bookmark className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <header className="mb-12">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                            {post.category || 'Guides'}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-8">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red font-bold mr-3 border border-brand-red/20">
                                    MS
                                </div>
                                <div>
                                    <p className="text-slate-900 font-bold leading-none mb-1">{post.authorName || 'MakeMyStay Team'}</p>
                                    <p className="text-xs uppercase tracking-wider">{post.authorType || 'Editorial'}</p>
                                </div>
                            </div>
                            <div className="hidden sm:block w-px h-8 bg-slate-200" />
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {post.readTimeMin} min read
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {coverImage && (
                        <motion.div 
                            className="mb-16 relative rounded-[2.5rem] overflow-hidden shadow-2xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <img
                                src={coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover aspect-[21/9]"
                                onError={handleBlogCoverImageError}
                            />
                        </motion.div>
                    )}

                    {/* Article Body */}
                    <div className="prose prose-lg prose-slate max-w-none">
                        <p className="text-xl text-slate-600 leading-relaxed font-medium italic mb-10 border-l-4 border-brand-red pl-8 py-2">
                            {post.description}
                        </p>
                        
                        <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
                            {post.body.map((para, i) => (
                                <p key={i} className="mb-4">{para}</p>
                            ))}
                        </div>
                    </div>

                    {/* FAQs */}
                    {post.faqs && post.faqs.length > 0 && (
                        <div className="mt-20 pt-16 border-t border-slate-100">
                            <h2 className="text-3xl font-bold text-slate-900 mb-10 flex items-center">
                                <CheckCircle className="w-8 h-8 text-brand-red mr-3" />
                                Common Questions
                            </h2>
                            <div className="grid gap-6">
                                {post.faqs.map((faq, i) => (
                                    <motion.div 
                                        key={i} 
                                        className="rounded-3xl border border-slate-100 bg-slate-50 p-8 hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                    >
                                        <h3 className="text-lg font-bold text-slate-900 mb-3">{faq.question}</h3>
                                        <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Call to Action */}
                    <div className="mt-20 p-10 rounded-[2.5rem] bg-slate-900 relative overflow-hidden text-center">
                        <div className="absolute inset-0 bg-diagonal-grid opacity-10" />
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Looking for your next home?</h3>
                            <p className="text-slate-400 mb-8 max-w-xl mx-auto">Skip the broker hassle. Browse 100% verified PGs and rentals in Bangalore's top tech hubs.</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link to="/pg/bangalore" className="px-8 py-3.5 bg-brand-red text-white font-bold rounded-2xl shadow-glow hover:shadow-[0_0_25px_rgba(217,32,39,0.5)] transition-all">
                                    Browse PGs
                                </Link>
                                <Link to="/contact-us" className="px-8 py-3.5 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                                    Talk to Expert
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Related Hubs */}
                    {post.relatedRentHubs && post.relatedRentHubs.length > 0 && (
                        <div className="mt-16 flex flex-wrap gap-3">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest w-full mb-2">Related Areas:</span>
                            {post.relatedRentHubs.map((hub) => (
                                <Link
                                    key={hub.path}
                                    to={hub.path}
                                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-brand-red hover:text-white transition-all"
                                >
                                    {hub.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </article>

                {/* More Articles Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-32">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-bold text-slate-900">Recommended <span className="text-brand-red">Stories</span></h2>
                        <Link to="/blog" className="text-slate-900 font-bold hover:text-brand-red transition-colors flex items-center">
                            View All <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedPosts.map((p) => (
                            <Link 
                                key={p.slug} 
                                to={`/blog/${p.slug}`} 
                                className="group block overflow-hidden"
                            >
                                <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-4 shadow-sm border border-slate-100">
                                    <img
                                        src={getBlogCoverImage(p)}
                                        alt={p.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={handleBlogCoverImageError}
                                    />
                                </div>
                                <h3 className="font-bold text-slate-900 group-hover:text-brand-red transition-colors line-clamp-2 leading-tight">
                                    {p.title}
                                </h3>
                                <div className="flex items-center gap-3 mt-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                    <span>{p.category || 'Guides'}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span>{p.readTimeMin} min read</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
