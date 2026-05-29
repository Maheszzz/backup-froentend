import { useMemo, useState } from 'react';
import { Link } from '@/lib/navigation';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import {
    ArrowRight,
    Bath,
    Bed,
    ChevronLeft,
    ChevronRight,
    Heart,
    MapPin,
    Sparkles,
    Star,
    Thermometer,
} from 'lucide-react';

import { useWishlist } from '@/context/WishlistContext';
import { FEATURED_LAUNCH } from '@/data/featuredLaunch';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
import type { Property } from '@/types/api';

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85';

const TENANT_AVATARS = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
];

interface NewLaunchSpotlightProps {
    property: Property;
}

function collectImages(property: Property): string[] {
    const fromList = (property.images ?? []).filter(Boolean);
    if (fromList.length > 0) return fromList;
    if (property.image) return [property.image];
    return [FALLBACK_IMAGE];
}

function formatPriceMonthly(price: string): string {
    const p = price.trim();
    if (!p) return FEATURED_LAUNCH.priceFromLabel;
    if (p.toLowerCase().includes('/mo') || p.toLowerCase().includes('month')) return p.startsWith('From') ? p : `From ${p}`;
    return `From ${p}/mo`;
}

export function NewLaunchSpotlight({ property }: NewLaunchSpotlightProps) {
    const detailHref = getPropertyDetailPath(property);
    const images = useMemo(() => collectImages(property), [property]);
    const [activeImage, setActiveImage] = useState(0);
    const { isWishlisted, toggleWishlist } = useWishlist();
    const wishlisted = isWishlisted(String(property.id));

    const title = property.title || 'Urban Homes';
    const location = property.location || 'HSR Layout, Bangalore';
    const priceDisplay = formatPriceMonthly(property.price?.trim() || '₹25,000');
    const rating =
        Number(property.rating ?? property.average_rating ?? FEATURED_LAUNCH.socialProof.rating) || 4.9;
    const reviewCount =
        property.reviews ?? property.review_count ?? FEATURED_LAUNCH.socialProof.reviewCount;
    const waLink = buildPropertyWhatsappUrl(title, location);

    const goImage = (dir: -1 | 1) => {
        setActiveImage((i) => (i + dir + images.length) % images.length);
    };

    return (
        <section className="mb-5 md:mb-6" aria-label="Newly launched property">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50/80 shadow-[0_16px_48px_-28px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/[0.04] lg:max-h-[320px]">
                        <div
                            aria-hidden
                            className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-red-500/[0.06] pointer-events-none"
                        />

                <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-0 lg:max-h-[320px]">
                    {/* Copy */}
                    <div className="relative z-10 flex flex-col justify-center p-4 sm:p-5 lg:py-4 lg:px-6 order-2 lg:order-1 lg:overflow-hidden">
                        <div className="inline-flex items-center gap-1.5 w-fit rounded-full border border-red-100 bg-red-50/90 px-2.5 py-1 mb-2.5 shadow-sm">
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" aria-hidden />
                            <Sparkles className="w-3.5 h-3.5 text-brand-red" />
                            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-red">
                                {FEATURED_LAUNCH.badge}
                            </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold text-slate-900 leading-tight tracking-tight font-luxury">
                            {FEATURED_LAUNCH.headlineLead}{' '}
                            <span className="text-brand-red italic">{FEATURED_LAUNCH.headlineAccent}</span>
                        </h2>
                        <p className="mt-1.5 text-sm text-slate-600 leading-snug max-w-md">
                            {FEATURED_LAUNCH.subheadline}
                        </p>

                        <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
                            {FEATURED_LAUNCH.bullets.map((item) => (
                                <li key={item} className="flex items-center gap-1.5 text-xs text-slate-700">
                                    <span className="h-1 w-1 shrink-0 rounded-full bg-brand-red" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
                            <span className="inline-flex items-center gap-1.5">
                                <Bed className="w-3.5 h-3.5 text-slate-400" />
                                {property.beds || 1} Bed
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Bath className="w-3.5 h-3.5 text-slate-400" />
                                {property.baths || 1} Bath
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-brand-red" />
                                HSR Layout
                            </span>
                        </div>

                        <div className="mt-2 inline-flex w-fit rounded-full bg-red-50 border border-red-100 px-3 py-1">
                            <span className="text-xs font-bold text-brand-red tabular-nums">{priceDisplay}</span>
                        </div>

                        <div className="mt-2.5 flex flex-col sm:flex-row gap-2">
                            <Link
                                to={detailHref}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-red px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-500/25 hover:bg-red-700 transition-all"
                            >
                                View Listing
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#25D366" aria-hidden>
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Chat on WhatsApp
                            </a>
                        </div>

                        <div className="mt-2.5 hidden sm:flex items-center gap-2 pt-2.5 border-t border-slate-100">
                            <div className="flex -space-x-2">
                                {TENANT_AVATARS.map((src, i) => (
                                    <img
                                        key={src}
                                        src={src}
                                        alt=""
                                        className="h-7 w-7 rounded-full border-2 border-white object-cover shadow-sm"
                                        style={{ zIndex: TENANT_AVATARS.length - i }}
                                    />
                                ))}
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-900">{FEATURED_LAUNCH.socialProof.label}</p>
                                <p className="flex items-center gap-1 text-[11px] text-slate-600">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span className="font-bold text-slate-800">{rating.toFixed(1)}</span>
                                    <span>({reviewCount} reviews)</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="relative order-1 lg:order-2 min-h-[180px] sm:min-h-[200px] lg:min-h-0 lg:h-full lg:max-h-[320px] aspect-[4/3] lg:aspect-auto">
                        <OptimizedImage
                            key={images[activeImage]}
                            src={images[activeImage]}
                            alt={title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-slate-900/10 lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-slate-900/5" />

                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => goImage(-1)}
                                    className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-md hover:bg-white transition-colors"
                                    aria-label="Previous photo"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => goImage(1)}
                                    className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-md hover:bg-white transition-colors lg:right-24"
                                    aria-label="Next photo"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        )}

                        <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap gap-1.5">
                            <span className="rounded-md bg-white/95 backdrop-blur px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                                {property.type || '1BHK'}
                            </span>
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-white/95 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-slate-900 shadow-sm">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {rating.toFixed(1)}
                                <span className="font-medium text-slate-500">({reviewCount})</span>
                            </span>
                        </div>

                        <button
                            type="button"
                            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                            onClick={() => toggleWishlist(property)}
                            className="absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur hover:bg-white transition-colors"
                        >
                            <Heart
                                className={`h-4 w-4 transition-colors ${wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
                            />
                        </button>

                        <div className="absolute bottom-2.5 right-2.5 left-2.5 sm:left-auto sm:w-[min(100%,200px)] z-20">
                            <div className="rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 p-2.5 shadow-xl text-white">
                                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                    Property price
                                </p>
                                <p className="mt-0.5 text-lg font-extrabold tabular-nums leading-tight">
                                    {property.price?.trim() || '₹25,000'}
                                    {!property.price?.includes('/mo') && (
                                        <span className="text-sm font-semibold text-slate-400">/mo</span>
                                    )}
                                </p>
                                <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] font-medium text-slate-300">
                                    <span className="inline-flex items-center gap-1">
                                        <Bed className="w-3.5 h-3.5" />
                                        {property.beds || 1} Beds
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <Bath className="w-3.5 h-3.5" />
                                        {property.baths || 1} Baths
                                    </span>
                                    {property.geyser && (
                                        <span className="inline-flex items-center gap-1 text-red-300">
                                            <Thermometer className="w-3.5 h-3.5" />
                                            Geyser
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-4 flex gap-1.5 z-20 sm:hidden">
                                {images.slice(0, 5).map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        aria-label={`Photo ${i + 1}`}
                                        onClick={() => setActiveImage(i)}
                                        className={`h-1.5 rounded-full transition-all ${
                                            i === activeImage ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
