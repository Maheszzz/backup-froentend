'use client';

import { useMemo, useState } from 'react';
import { Link } from '@/lib/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, ArrowRight, BookOpen, Search, Sparkles, MapPin } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { BLOG_POSTS, type BlogPost } from '@/data/blogPosts';
import { buildPageSEO } from '@/lib/seo';
import { SITE_URL } from '@/lib/siteConfig';
import { buildBreadcrumbSchema } from '@/lib/schema';
import {
    BLOG_FILTER_CATEGORIES,
    type BlogFilterCategory,
    getBlogCategoryStyle,
    getBlogCoverImage,
    handleBlogCoverImageError,
} from '@/lib/blogAssets';

const FEATURED_SLUG = 'pg-in-bangalore-guide';

const TOPIC_HUBS = [
    { label: 'PG in Bangalore', path: '/pg/bangalore' },
    { label: 'Flats for rent', path: '/flats-in-bangalore' },
    { label: 'Rent in Whitefield', path: '/rent/whitefield' },
    { label: 'Rent in HSR', path: '/rent/hsr-layout' },
    { label: 'Plots in Bangalore', path: '/plots' },
] as const;

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function BlogIndex() {
    const [activeCategory, setActiveCategory] = useState<BlogFilterCategory>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const helmet = buildPageSEO({
        title: 'Guides & Insights — PG, Rent & Bangalore Living (2026)',
        description:
            `${BLOG_POSTS.length}+ expert guides on PG in Bangalore, area-wise rent, legal checklists, safety, and verified rentals — updated for 2026.`,
        path: '/blog',
    });

    const breadcrumbSchema = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
    ]);

    const itemListSchema = useMemo(
        () => ({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'MakeMyStay Guides & Insights',
            description: helmet.description,
            numberOfItems: BLOG_POSTS.length,
            itemListElement: BLOG_POSTS.map((post, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${SITE_URL}/blog/${post.slug}`,
                name: post.title,
            })),
        }),
        [helmet.description],
    );

    const filteredPosts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return BLOG_POSTS.filter((post) => {
            const catOk =
                activeCategory === 'All' ||
                (post.category ?? 'Guides') === activeCategory;
            if (!catOk) return false;
            if (!q) return true;
            const haystack = [post.title, post.description, post.category, post.slug]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [activeCategory, searchQuery]);

    const featuredPost =
        filteredPosts.find((p) => p.slug === FEATURED_SLUG) ??
        filteredPosts[0] ??
        BLOG_POSTS[0];

    const gridPosts = filteredPosts.filter((p) => p.slug !== featuredPost?.slug);
    const editorsPicks = gridPosts.slice(0, 3);
    const restPosts = gridPosts.slice(3);

    return (
        <motion.div
            className="min-h-screen bg-[#f8f9fc] font-sans flex flex-col overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
        >
            <SEOHead {...helmet} />
            <JsonLd data={breadcrumbSchema} id="blog-index-breadcrumb-schema" />
            <JsonLd data={itemListSchema} id="blog-index-itemlist-schema" />
            <Navbar />

            <main id="main-content" className="flex-grow pt-20">
                {/* Hero */}
                <section className="relative overflow-hidden border-b border-slate-200/80 bg-white">
                    <motion.div
                        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(217,32,39,0.12),transparent)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-diagonal-grid opacity-[0.35]" />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                        <div className="max-w-3xl">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-brand-red text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
                                <Sparkles className="w-3.5 h-3.5" />
                                {BLOG_POSTS.length} guides · Bangalore 2026
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.08]">
                                Guides &{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-600">
                                    Insights
                                </span>
                            </h1>
                            <p className="mt-5 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
                                Research-backed articles on PG rent, area guides, legal checklists, and
                                verified rentals — built for search and answer engines.
                            </p>
                        </div>

                        <div className="mt-10 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                            <div className="relative max-w-xl w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search guides, areas, PG, rent…"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red/40"
                                />
                            </div>
                            <motion.div
                                className="flex flex-wrap gap-2"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                {TOPIC_HUBS.map((hub) => (
                                    <Link
                                        key={hub.path}
                                        to={hub.path}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-brand-red/40 hover:text-brand-red transition-colors"
                                    >
                                        <MapPin className="w-3 h-3" />
                                        {hub.label}
                                    </Link>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Sticky filters */}
                <div className="sticky top-[72px] z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
                    <motion.div
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto no-scrollbar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {BLOG_FILTER_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveCategory(cat)}
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                    activeCategory === cat
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <AnimatePresence mode="wait">
                        {filteredPosts.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-24 text-center"
                            >
                                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-600 font-medium">No guides match your filters.</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setActiveCategory('All');
                                    }}
                                    className="mt-4 text-sm font-bold text-brand-red hover:underline"
                                >
                                    Clear filters
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`${activeCategory}-${searchQuery}`}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35 }}
                            >
                                {featuredPost && (
                                    <FeaturedCard post={featuredPost} className="mb-14" />
                                )}

                                {editorsPicks.length > 0 && (
                                    <section className="mb-14">
                                        <div className="flex items-end justify-between gap-4 mb-6">
                                            <motion.div
                                                initial={{ opacity: 0, x: -8 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                            >
                                                <h2 className="text-2xl font-bold text-slate-900">
                                                    Editor&apos;s picks
                                                </h2>
                                                <p className="text-slate-500 text-sm mt-1">
                                                    High-intent reads for movers and operators
                                                </p>
                                            </motion.div>
                                        </div>
                                        <motion.div className="grid md:grid-cols-3 gap-6">
                                            {editorsPicks.map((post, i) => (
                                                <BlogCard
                                                    key={post.slug}
                                                    post={post}
                                                    index={i}
                                                    compact
                                                />
                                            ))}
                                        </motion.div>
                                    </section>
                                )}

                                {restPosts.length > 0 && (
                                    <section>
                                        <div className="flex items-end justify-between gap-4 mb-8">
                                            <motion.div
                                                initial={{ opacity: 0, x: -8 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                            >
                                                <h2 className="text-2xl font-bold text-slate-900">
                                                    All articles
                                                </h2>
                                                <p className="text-slate-500 text-sm mt-1 tabular-nums">
                                                    {filteredPosts.length} guide
                                                    {filteredPosts.length === 1 ? '' : 's'}
                                                </p>
                                            </motion.div>
                                        </div>
                                        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {restPosts.map((post, i) => (
                                                <BlogCard key={post.slug} post={post} index={i} />
                                            ))}
                                        </motion.div>
                                    </section>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CTA */}
                    <motion.section
                        className="mt-20 rounded-[2rem] bg-slate-900 p-8 md:p-14 relative overflow-hidden"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 via-transparent to-transparent" />
                        <motion.div
                            className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -12 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <BookOpen className="w-10 h-10 text-brand-red mb-4" />
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                    Ready to shortlist your stay?
                                </h2>
                                <p className="text-slate-400 max-w-lg leading-relaxed">
                                    Browse verified PG and rent listings in Bangalore with zero brokerage
                                    and transparent pricing.
                                </p>
                            </motion.div>
                            <motion.div
                                className="flex flex-col sm:flex-row gap-3 shrink-0"
                                initial={{ opacity: 0, x: 12 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    to="/pg/bangalore"
                                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-brand-red text-white font-bold hover:bg-red-600 transition-colors"
                                >
                                    Explore PG in Bangalore
                                </Link>
                                <Link
                                    to="/properties"
                                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors"
                                >
                                    All properties
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.section>
                </div>
            </main>
            <Footer />
        </motion.div>
    );
}

function FeaturedCard({ post, className = '' }: { post: BlogPost; className?: string }) {
    const cover = getBlogCoverImage(post);
    const style = getBlogCategoryStyle(post.category);

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <Link
                to={`/blog/${post.slug}`}
                className={`group block overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.18)] border border-slate-100 ring-1 ring-slate-900/[0.04] hover:shadow-[0_32px_80px_-28px_rgba(217,32,39,0.25)] transition-all duration-500 ${style.ring}`}
            >
                <motion.div
                    className="grid lg:grid-cols-2 gap-0"
                    whileHover={{ scale: 1.005 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                    <div className="aspect-[16/10] lg:aspect-auto lg:min-h-[340px] relative overflow-hidden">
                        <img
                            src={cover}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="eager"
                            onError={handleBlogCoverImageError}
                        />
                        <div
                            className={`absolute inset-0 bg-gradient-to-tr ${style.accent} to-transparent opacity-60`}
                        />
                        <div className="absolute top-5 left-5 flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-brand-red text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                                Featured
                            </span>
                            <span
                                className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${style.pill}`}
                            >
                                {post.category ?? 'Guides'}
                            </span>
                        </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-slate-500 text-sm mb-4">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.publishedAt)}
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <Clock className="w-4 h-4" />
                            {post.readTimeMin} min read
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 group-hover:text-brand-red transition-colors leading-tight">
                            {post.title}
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed line-clamp-3 mb-8">
                            {post.description}
                        </p>
                        <span className="inline-flex items-center text-slate-900 font-bold group-hover:gap-3 gap-2 transition-all">
                            Read full guide
                            <ArrowRight className="w-5 h-5 text-brand-red" />
                        </span>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}

function BlogCard({
    post,
    index,
    compact = false,
}: {
    post: BlogPost;
    index: number;
    compact?: boolean;
}) {
    const cover = getBlogCoverImage(post);
    const style = getBlogCategoryStyle(post.category);

    return (
        <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25) }}
        >
            <Link
                to={`/blog/${post.slug}`}
                className={`group flex flex-col h-full bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ring-1 ring-slate-900/[0.03] ${style.ring}`}
            >
                <div
                    className={`relative overflow-hidden ${compact ? 'aspect-[16/11]' : 'aspect-[16/10]'}`}
                >
                    <img
                        src={cover}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                        loading="lazy"
                        onError={handleBlogCoverImageError}
                    />
                    <motion.div
                        className={`absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                    <div className="absolute top-4 left-4">
                        <span
                            className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest backdrop-blur-md bg-white/90 ${style.pill}`}
                        >
                            {post.category ?? 'Guides'}
                        </span>
                    </div>
                </div>
                <div className={`flex flex-col flex-grow ${compact ? 'p-5' : 'p-6'}`}>
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.publishedAt)}
                        <span className="text-slate-200">·</span>
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTimeMin} min
                    </div>
                    <h3
                        className={`font-bold text-slate-900 mb-2 group-hover:text-brand-red transition-colors leading-snug ${
                            compact ? 'text-lg' : 'text-xl'
                        }`}
                    >
                        {post.title}
                    </h3>
                    <p
                        className={`text-slate-600 line-clamp-3 flex-grow mb-4 ${
                            compact ? 'text-sm' : 'text-sm'
                        }`}
                    >
                        {post.description}
                    </p>
                    <span className="inline-flex items-center text-sm font-bold text-slate-800 group-hover:text-brand-red transition-colors">
                        Read article
                        <ArrowRight className="ml-1.5 w-4 h-4" />
                    </span>
                </div>
            </Link>
        </motion.article>
    );
}
