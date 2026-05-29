'use client';

import { Link, useLocation } from '@/lib/navigation';
import { Heart, ArrowLeft, Trash2, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/components/modules/listings/PropertyCard';
import { useWishlist } from '@/context/WishlistContext';
import { useEffect } from 'react';
import { useSmartBack } from '@/hooks';

export default function Wishlist() {
    const { wishlist, clearWishlist } = useWishlist();
    const location = useLocation();
    const goBack = useSmartBack({ fallback: '/properties' });
    // Minimal scroll restore for back/forward navigations
    useEffect(() => {
        const saved = sessionStorage.getItem(`scroll:${location.key}`);
        if (!saved) return;
        const y = Number(saved);
        if (!Number.isFinite(y)) return;
        requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'auto' }));
    }, [location.key]);

    useEffect(() => {
        const key = location.key;
        return () => {
            try {
                sessionStorage.setItem(`scroll:${key}`, String(window.scrollY || 0));
            } catch {
                // ignore
            }
        };
    }, [location.key]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center gap-1.5 text-slate-500 text-sm hover:text-brand-red transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
                            <p className="text-slate-500 mt-1">
                                {wishlist.length === 0
                                    ? 'No saved properties yet'
                                    : `${wishlist.length} saved ${wishlist.length === 1 ? 'property' : 'properties'}`}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {wishlist.length > 1 && (
                                <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border" style={{ color: '#B11226', background: 'rgba(177,18,38,0.05)', borderColor: 'rgba(177,18,38,0.15)' }}>
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    {wishlist.length} properties saved
                                </div>
                            )}
                            {Array.isArray(wishlist) && wishlist.length > 0 && (
                                <button
                                    onClick={clearWishlist}
                                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors border border-slate-200 hover:border-red-200 px-4 py-2 rounded-xl"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {wishlist.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                            <Heart className="w-9 h-9 text-brand-red/40" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Your wishlist is empty</h2>
                        <p className="text-slate-400 mb-8 max-w-xs">
                            Tap the heart icon on any property to save it here for later.
                        </p>
                        <Link
                            to="/properties"
                            className="bg-brand-red text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-red/90 transition-colors"
                        >
                            Browse Properties
                        </Link>
                    </div>
                )}

                {/* Wishlist Grid */}
                {wishlist.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
