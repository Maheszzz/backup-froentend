import type { FreshnessBadgeItem } from '@/lib/freshness';
import { BadgeCheck, Clock, MessageCircle, Sparkles } from 'lucide-react';

const ICONS = {
    verified: BadgeCheck,
    updated: Clock,
    booked: Sparkles,
    reviewed: MessageCircle,
} as const;

const STYLES = {
    verified: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    updated: 'bg-slate-50 text-slate-700 border-slate-200/80',
    booked: 'bg-violet-50 text-violet-800 border-violet-200/80',
    reviewed: 'bg-amber-50 text-amber-900 border-amber-200/80',
};

interface FreshnessBadgeProps {
    items: FreshnessBadgeItem[];
    className?: string;
}

export function FreshnessBadge({ items, className = '' }: FreshnessBadgeProps) {
    if (items.length === 0) return null;

    return (
        <div className={`flex flex-wrap gap-1.5 ${className}`}>
            {items.map((item) => {
                const Icon = ICONS[item.kind];
                return (
                    <span
                        key={`${item.kind}-${item.label}`}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STYLES[item.kind]}`}
                    >
                        <Icon className="w-3 h-3 shrink-0" aria-hidden />
                        {item.label}
                    </span>
                );
            })}
        </div>
    );
}
