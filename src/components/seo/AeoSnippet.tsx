import React from 'react';
import { Property } from '@/types/api';
import { SITE_NAME } from '@/lib/siteConfig';

interface AeoSnippetProps {
    property: Property;
}

/**
 * AEO (Answer Engine Optimization) Snippet.
 * Provides a high-intent, semantic summary designed for ChatGPT, Google SGE, and Voice Search.
 */
export const AeoSnippet: React.FC<AeoSnippetProps> = ({ property }) => {
    if (!property) return null;

    const type = property.type || 'property';
    const location = property.location;
    const price = property.price;
    const isPG = property.category === 'pg' || type === 'PG' || type === 'Hostel';

    const intro = isPG 
        ? `This ${type} in ${location} Bangalore is available for rent`
        : `This ${type} flat in ${location} Bangalore is available for rent`;

    const summaryText = `${intro} starting from ${price}. It features verified listings, modern amenities, and excellent commute connectivity. Book a direct visit or enquire online through ${SITE_NAME}.`;

    return (
        <div 
            id="aeo-summary"
            className="mb-8 p-5 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl shadow-sm"
            aria-label="Property Summary"
        >
            <p className="text-[15px] text-slate-600 leading-relaxed font-medium italic opacity-90">
                "{summaryText}"
            </p>
            <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">AI Optimized Summary</span>
            </div>
        </div>
    );
};
