export interface FreshnessInput {
    last_verified_at?: string | null;
    last_booked_at?: string | null;
    last_review_at?: string | null;
    updated_at?: string | null;
    created_at?: string | null;
}

function parseDate(value?: string | null): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}

function hoursAgo(d: Date): number {
    return (Date.now() - d.getTime()) / (1000 * 60 * 60);
}

function daysAgo(d: Date): number {
    return hoursAgo(d) / 24;
}

export type FreshnessBadgeKind = 'verified' | 'updated' | 'booked' | 'reviewed';

export interface FreshnessBadgeItem {
    kind: FreshnessBadgeKind;
    label: string;
    priority: number;
}

/**
 * Marketplace freshness labels for cards and PDP (trust + CTR).
 */
export function getFreshnessBadges(input: FreshnessInput, max = 2): FreshnessBadgeItem[] {
    const items: FreshnessBadgeItem[] = [];
    const verified = parseDate(input.last_verified_at) ?? parseDate(input.updated_at);
    const booked = parseDate(input.last_booked_at);
    const reviewed = parseDate(input.last_review_at);

    if (verified) {
        const h = hoursAgo(verified);
        if (h < 24) {
            items.push({ kind: 'verified', label: 'Verified today', priority: 1 });
        } else if (daysAgo(verified) < 7) {
            items.push({ kind: 'verified', label: 'Verified this week', priority: 2 });
        }
    }

    if (booked) {
        const d = daysAgo(booked);
        if (d < 3) {
            items.push({ kind: 'booked', label: 'Booked recently', priority: 3 });
        }
    }

    if (reviewed) {
        const d = daysAgo(reviewed);
        if (d < 7) {
            items.push({ kind: 'reviewed', label: 'Reviewed this week', priority: 4 });
        }
    }

    const updated = parseDate(input.updated_at);
    if (updated && items.length < max) {
        const h = hoursAgo(updated);
        if (h < 6) {
            items.push({ kind: 'updated', label: 'Updated just now', priority: 5 });
        } else if (h < 24) {
            items.push({ kind: 'updated', label: `Updated ${Math.max(1, Math.round(h))}h ago`, priority: 6 });
        } else if (daysAgo(updated) < 3) {
            items.push({ kind: 'updated', label: 'Updated recently', priority: 7 });
        }
    }

    return items.sort((a, b) => a.priority - b.priority).slice(0, max);
}
