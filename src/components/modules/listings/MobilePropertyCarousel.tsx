import { Link, useListingFromUrl } from '@/lib/navigation';
import { useRef, useState } from 'react';
import { ArrowRight, BadgeCheck, MapPin, MessageCircle, Star } from 'lucide-react';
import { formatPropertyTitle, reviewsLabel } from '@/lib/formatPropertyTitle';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import type { Property } from '@/types/api';

interface MobilePropertyCarouselProps {
    properties: Property[];
}

function getFallbackImageForType(type?: string): string {
    const t = (type || '').toLowerCase();
    if (t === 'pg' || t === 'hostel') {
        return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80';
    }
    if (t === 'plot') {
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80';
    }
    if (t.includes('villa') || t.includes('4bhk') || t.includes('3bhk')) {
        return 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80';
    }
    return 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80';
}

function SwipeableImageGallery({ images, fallbackImg, title }: { images: string[], fallbackImg: string, title: string }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const index = Math.round(el.scrollLeft / el.clientWidth);
        if (index !== currentIndex) {
            setCurrentIndex(index);
        }
    };

    const displayImages = images.length > 0 ? images : [fallbackImg];

    return (
        <>
            {/* Carousel */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {displayImages.map((img, i) => (
                    <div key={i} className="min-w-full h-full snap-center relative shrink-0">
                        <img
                            src={img}
                            alt={`${title} - view ${i + 1}`}
                            className="w-full h-full object-cover object-center transition-opacity duration-500"
                            draggable={false}
                            loading="lazy"
                            onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src !== fallbackImg) {
                                    target.src = fallbackImg;
                                } else {
                                    target.style.display = 'none';
                                }
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Dots */}
            {displayImages.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 pointer-events-none z-10">
                    {displayImages.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                currentIndex === i
                                    ? "bg-white scale-125 shadow-sm"
                                    : "bg-white/50 shadow-sm"
                            }`}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

export function MobilePropertyCarousel({ properties }: MobilePropertyCarouselProps) {
    const list = Array.isArray(properties) ? properties : [];
    if (list.length === 0) return null;
    const { from } = useListingFromUrl();

    return (
        <div className="md:hidden px-4 flex flex-col gap-4">
            {list.map((property) => {
                const rawImages =
                    Array.isArray(property.images) && property.images.length > 0
                        ? property.images
                        : property.image
                          ? [property.image]
                          : [];
                const images = rawImages.map((img: any) => typeof img === 'string' ? img : img?.image_url).filter(Boolean);
                const propertyPath = getPropertyDetailPath(property);
                const contactNumber = '918150099911';
                const displayTitle = formatPropertyTitle(property.title);

                const rooms = ((Number(property.id) || 0) % 3) + 1;

                const waLink = `https://wa.me/${contactNumber}?text=${encodeURIComponent(`Hi! I'm interested in ${displayTitle} at ${property.location}. Please share more details.`)}`;

                return (
                    <div
                        key={property.id}
                        className="group bg-gradient-to-b from-stone-50 via-white to-white rounded-[1.1rem] overflow-hidden border border-stone-200/90 shadow-[0_14px_30px_-16px_rgba(15,23,42,0.32)]"
                    >
                        <div className="relative w-full bg-slate-900" style={{ aspectRatio: '16/9' }}>
                            <div className="absolute inset-0">
                                <SwipeableImageGallery
                                    images={images}
                                    fallbackImg={getFallbackImageForType(property.type)}
                                    title={displayTitle}
                                />
                            </div>
                            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
                                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.12em] uppercase leading-tight px-2.5 py-1 rounded-md bg-white/95 text-stone-800 shadow-sm backdrop-blur-md border border-stone-200/90 transition-transform duration-300 group-hover:-translate-y-0.5">
                                    {property.category === 'buy' ? 'For Sale' : 'For Rent'}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold tracking-wide uppercase leading-tight px-2.5 py-1 rounded-md text-white bg-slate-900/84 backdrop-blur-sm shadow-sm border border-white/10 transition-transform duration-300 group-hover:-translate-y-0.5">
                                    <BadgeCheck className="w-3 h-3 shrink-0 text-emerald-300" aria-hidden />
                                    Verified
                                </span>
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 bg-gradient-to-b from-white to-stone-50/40">
                            <div className="flex items-center gap-1.5 mb-2">
                                {(property.rating ?? 0) > 0 ? (
                                    <>
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        <span className="text-xs font-semibold text-stone-700">{(property.rating ?? 0).toFixed(1)}</span>
                                        <span className="text-xs text-stone-500">({reviewsLabel(property.reviews || 0)})</span>
                                    </>
                                ) : (
                                    <>
                                        <Star className="w-3.5 h-3.5 fill-slate-200 text-slate-200" />
                                        <span className="text-xs font-medium text-stone-400">New Listing</span>
                                    </>
                                )}
                            </div>

                            <h3 className="text-[15px] font-semibold text-stone-900 leading-snug line-clamp-2 mb-1">{displayTitle}</h3>

                            <div className="flex items-center text-stone-500 text-xs gap-1 mb-4">
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-brand-red/60" />
                                <span className="truncate">
                                    <span className="font-medium text-stone-700">{property.location?.split(',')[0]}</span>
                                    {property.location?.includes(',')
                                        ? `, ${property.location.split(',').slice(1).join(',').trim()}`
                                        : ''}
                                </span>
                            </div>

                            <div className="flex flex-col gap-2.5 mb-4">
                                <div>
                                    <p className="text-xs text-stone-500 leading-tight mb-1">Starting at</p>
                                    <p className="text-[1.15rem] font-bold leading-tight text-brand-red">{property.price}</p>
                                    {property.category === 'rent' && (
                                        <p className="text-xs text-stone-500 mt-1">Per month</p>
                                    )}
                                </div>
                                <span className="inline-flex self-start items-center rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-600 border border-stone-200/80">
                                    Only {rooms} Rooms Left
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    to={propertyPath}
                                    state={{ from }}
                                    className="relative overflow-hidden flex-1 text-center py-2.5 rounded-xl text-white text-xs font-semibold tracking-wide bg-gradient-to-br from-brand-red to-red-900 shadow-md shadow-brand-red/20 active:scale-[0.98] transition-transform"
                                >
                                    <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-white/20 blur-xl -skew-x-12 transition-all duration-700 group-hover:left-[110%]" />
                                    <span className="relative inline-flex items-center gap-1">
                                        Book a Visit
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                                    </span>
                                </Link>
                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border active:scale-[0.98] text-stone-700 border-stone-300/80 bg-white/95 hover:bg-emerald-50/40 hover:border-emerald-300/50 hover:text-emerald-900 shadow-[0_8px_20px_-14px_rgba(16,185,129,0.55)]"
                                    aria-label="WhatsApp chat"
                                >
                                    <MessageCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" aria-hidden />
                                    Chat
                                </a>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
