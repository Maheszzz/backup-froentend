import {
    ArrowRight,
    Bath,
    Bed,
    Heart,
    MapPin,
    MessageCircle,
    Star,
    Users,
    Utensils,
    Zap,
    ShieldCheck,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useListingFromUrl } from '@/lib/navigation';

import { useWishlist } from '@/context/WishlistContext';
import { amenityIconMap } from '@/lib/amenityIcons';
import { formatPropertyTitle } from '@/lib/formatPropertyTitle';
import { getPropertyPlaceholderFallback } from '@/lib/propertyPlaceholderImages';
import { getPropertyDetailPath } from '@/lib/propertyRouting';
import { buildPropertyWhatsappUrl } from '@/lib/whatsapp';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { FreshnessBadge } from '@/components/trust/FreshnessBadge';
import { getFreshnessBadges } from '@/lib/freshness';
import type { Property } from '@/types/api';

interface PropertyCardProps {
    property: Property;
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

export function PropertyCard({ property }: PropertyCardProps) {
    const { from: listingFrom } = useListingFromUrl();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const wishlisted = isWishlisted(String(property.id));

    const handleHeartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(property);
    };

    const fallbackImage = useMemo(() => getFallbackImageForType(property.type), [property.type]);

    const getImage = (prop: any) => {
        const imgs = Array.isArray(prop.images) ? prop.images : [];
        const ph = Array.isArray(prop.photos) ? prop.photos : [];
        
        const parsedImages = imgs.map((img: any) => (typeof img === 'string' ? img : img?.image_url)).filter(Boolean);
        const parsedPhotos = ph.map((img: any) => (typeof img === 'string' ? img : img?.image_url)).filter(Boolean);

        return parsedImages[0] || prop.image || parsedPhotos[0] || fallbackImage || '/default-property.jpg';
    };

    const initialDisplayImage = getImage(property);
    const [displayImage, setDisplayImage] = useState(initialDisplayImage);

    useEffect(() => {
        setDisplayImage(getImage(property));
    }, [property.id, property.image, property.images, fallbackImage]);
    const typeLower = (property.type || '').toLowerCase();
    const isServiceOriented = typeLower === 'pg' || typeLower === 'hostel';
    const isPlot = typeLower === 'plot';

    const areaLabel = useMemo(() => {
        if (typeof property.area === 'number' && property.area > 0) {
            return `${property.area.toLocaleString('en-IN')} sq ft`;
        }
        if (property.sqft && property.sqft !== 'On Request') {
            return property.sqft.toLowerCase().includes('sqft') ? property.sqft : `${property.sqft} sqft`;
        }
        return 'On Request';
    }, [property.area, property.sqft]);

    const amenities: string[] = [];
    if (property.wifi) amenities.push('WiFi');
    if (property.power_backup) amenities.push('Backup');
    if (property.ac) amenities.push('AC');
    if (property.food) amenities.push('Food');
    if (property.gym) amenities.push('Gym');
    if (property.pool) amenities.push('Pool');
    if (property.geyser) amenities.push('Geyser');
    if (property.cctv) amenities.push('Security');

    const propertyPath = getPropertyDetailPath(property);
    const displayTitle = useMemo(() => formatPropertyTitle(property.title), [property.title]);
    const waLink = buildPropertyWhatsappUrl(displayTitle || property.title, property.location || '');
    const unitsLeft = typeof property.units_remaining === 'number' && property.units_remaining > 0 ? property.units_remaining : null;
    const hasRating = (property.rating ?? 0) > 0;
    const secondaryBadge = property.listing_badge?.trim() || (property.is_available === false ? 'Fully booked' : '');
    const freshnessBadges = useMemo(
        () =>
            getFreshnessBadges({
                last_verified_at: property.last_verified_at,
                last_booked_at: property.last_booked_at,
                last_review_at: property.last_review_at,
                updated_at: property.updated_at,
            }),
        [property.last_verified_at, property.last_booked_at, property.last_review_at, property.updated_at],
    );

    return (
        <Link
            to={propertyPath}
            state={{ from: listingFrom }}
            className="block h-full group outline-none"
            aria-label={`View details for ${displayTitle} in ${property.location}`}
        >
            <div className="bg-white rounded-[2.5rem] transition-all duration-500 ease-out border border-slate-200/80 shadow-[0_18px_46px_-24px_rgba(15,23,42,0.2)] hover:shadow-[0_44px_90px_-26px_rgba(15,23,42,0.28)] hover:-translate-y-2 h-full flex flex-col overflow-hidden ring-1 ring-slate-900/[0.03]">
                
                {/* 1. Image Section */}
                <div className="relative w-full h-[240px] shrink-0 overflow-hidden bg-slate-100">
                    {displayImage ? (
                        <OptimizedImage
                            src={displayImage}
                            alt={displayTitle}
                            fill
                            size="medium"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={() => {
                                const next = getPropertyPlaceholderFallback(
                                    { id: property.id, property_type: property.type },
                                    displayImage,
                                );
                                if (next !== displayImage) setDisplayImage(next);
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                            <Star className="w-8 h-8 text-white/10" />
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25 opacity-85" />

                    {/* Wishlist */}
                    <button
                        type="button"
                        onClick={handleHeartClick}
                        className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl border border-white"
                        aria-label={wishlisted ? `Remove ${displayTitle} from wishlist` : `Add ${displayTitle} to wishlist`}
                    >
                        <Heart className={`w-[20px] h-[20px] transition-colors ${wishlisted ? 'fill-brand-red text-brand-red' : 'text-slate-400'}`} />
                    </button>

                    {/* Badges Overlay */}
                    <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                        <span className="inline-flex px-3.5 py-1.5 rounded-xl bg-brand-red text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-red/30 transition-transform duration-300 group-hover:-translate-y-0.5">
                            {property.category === 'buy' ? 'For Sale' : isPlot ? 'Plot' : 'For Rent'}
                        </span>
                        {secondaryBadge && (
                            <span className="inline-flex px-3.5 py-1.5 rounded-xl bg-brand-charcoal/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/10 transition-transform duration-300 group-hover:-translate-y-0.5">
                                {secondaryBadge}
                            </span>
                        )}
                    </div>

                    {/* Bottom Image Stats */}
                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-[12px] font-black text-slate-900">
                                {hasRating ? (property.rating ?? 0).toFixed(1) : 'New'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                                {property.reviews ? `(${property.reviews})` : ''}
                            </span>
                        </div>
                        {property.type && (
                            <span className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-lg">
                                {property.type}
                            </span>
                        )}
                    </div>
                </div>

                {/* 2. Content Section */}
                <div className="flex flex-col flex-1 p-6 sm:p-7 bg-gradient-to-b from-white via-white to-slate-50/40">
                    <div className="mb-4">
                        <h3 className="text-lg font-extrabold text-slate-900 leading-snug line-clamp-2 mb-2 group-hover:text-brand-red transition-colors duration-300">
                            {displayTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <MapPin className="w-4 h-4 shrink-0 text-brand-red/70" />
                            <span className="truncate">{property.location}</span>
                        </div>
                        <FreshnessBadge items={freshnessBadges} className="mt-2" />
                    </div>

                    {/* Property Specs Row */}
                    <div className="grid grid-cols-2 gap-x-4 py-4 border-t border-b border-slate-100 mb-4 items-center">
                        {isPlot ? (
                            <div className="col-span-2 flex items-center gap-2 text-slate-700">
                                <Zap className="w-4 h-4 text-brand-red/60" />
                                <span className="text-xs font-bold uppercase tracking-wider">Plot Area: <span className="text-slate-500">{areaLabel}</span></span>
                            </div>
                        ) : isServiceOriented ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                        <Users className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700 leading-none">
                                        {Array.isArray(property.sharing) ? property.sharing[0] : 'Shared'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                        <Utensils className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700 leading-none">
                                        {property.food ? 'Food Incl.' : 'No Food'}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                        <Bed className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700 leading-none">{property.beds || '—'} Beds</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                        <Bath className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700 leading-none">{property.baths || '—'} Baths</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Amenities Checklist */}
                    <div className="grid grid-cols-2 gap-2.5 mb-6 content-start">
                        {amenities.length > 0 ? (
                            amenities.slice(0, 4).map((amenity) => {
                                const icon = amenityIconMap[amenity.toLowerCase()];
                                return (
                                    <div 
                                        key={amenity}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white text-[10px] font-bold text-slate-700 border border-slate-200/80 transition-colors hover:border-brand-red/20 hover:bg-brand-red/[0.03]"
                                    >
                                        <span className="text-brand-red/70 shrink-0">{icon}</span>
                                        <span className="truncate">{amenity}</span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-2 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-slate-500">
                                <ShieldCheck className="w-4 h-4 text-brand-red/40" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Verified Listing</span>
                            </div>
                        )}
                        {amenities.length > 4 && (
                            <div className="flex items-center justify-center px-3 py-2 rounded-xl bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                +{amenities.length - 4} More
                            </div>
                        )}
                    </div>

                    {/* Pricing and Actions */}
                    <div className="mt-auto pt-4 border-t border-slate-50/50">
                        <div className="flex items-end justify-between mb-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                                    {isServiceOriented ? 'Monthly Rent' : 'Property Price'}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[28px] font-black text-slate-900 tracking-tighter leading-none">
                                        {property.price}
                                    </span>
                                    {isServiceOriented && (
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">/ MONTH</span>
                                    )}
                                </div>
                            </div>
                            {unitsLeft != null && (
                                <div className="flex flex-col items-end">
                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full mb-1.5 overflow-hidden">
                                        <div 
                                            className="h-full bg-brand-red rounded-full shadow-[0_0_8px_rgba(231,53,61,0.4)]" 
                                            style={{ width: `${Math.max(10, (unitsLeft / 10) * 100)}%` }} 
                                        />
                                    </div>
                                    <p className="text-[9px] font-black text-brand-red uppercase tracking-[0.1em]">
                                        Only {unitsLeft} Left
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <span 
                                className="relative overflow-hidden flex-grow h-[52px] bg-gradient-to-r from-slate-900 via-slate-900 to-brand-charcoal text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-1.5 hover:from-brand-red hover:to-red-900 transition-all duration-300 shadow-[0_12px_28px_-10px_rgba(15,23,42,0.35)] hover:shadow-[0_16px_32px_-10px_rgba(231,53,61,0.45)] cursor-pointer"
                            >
                                <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-white/20 blur-xl -skew-x-12 transition-all duration-700 group-hover:left-[110%]" />
                                View Details
                                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open(waLink, '_blank', 'noopener,noreferrer');
                                }}
                                className="w-[52px] h-[52px] bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all duration-300 border border-emerald-200 shadow-[0_8px_20px_-12px_rgba(16,185,129,0.5)] flex items-center justify-center group/wa shrink-0"
                                aria-label={`Contact about ${displayTitle} on WhatsApp`}
                            >
                                <MessageCircle className="w-5 h-5 transition-transform duration-300 group-hover/wa:scale-110 group-hover/wa:rotate-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
