'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Property } from '@/types/api';
import { getLocalItem, setLocalItem } from '@/lib/browserStorage';

interface WishlistContextType {
    wishlist: Property[];
    isWishlisted: (id: string | number) => boolean;
    toggleWishlist: (property: Property) => void;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = 'mms_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<Property[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const stored = getLocalItem(STORAGE_KEY);
            const parsed = stored ? JSON.parse(stored) : [];
            setWishlist(Array.isArray(parsed) ? parsed : []);
        } catch {
            setWishlist([]);
        } finally {
            setHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        setLocalItem(STORAGE_KEY, JSON.stringify(wishlist));
    }, [wishlist, hydrated]);

    const isWishlisted = (id: string | number) => wishlist.some((p) => String(p.id) === String(id));

    const toggleWishlist = (property: Property) => {
        setWishlist((prev) =>
            prev.some((p) => p.id === property.id)
                ? prev.filter((p) => p.id !== property.id)
                : [...prev, property]
        );
    };

    const clearWishlist = () => setWishlist([]);

    return (
        <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
    return ctx;
}
