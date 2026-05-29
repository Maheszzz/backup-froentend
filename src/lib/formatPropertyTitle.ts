/**
 * Title-case each whitespace-delimited word for on-screen property names.
 * Does not change API payloads or URL slug generation — use raw title for routing.
 */
export function formatPropertyTitle(raw: string | undefined | null): string {
    if (raw == null || typeof raw !== 'string') return '';
    const t = raw.trim();
    if (!t) return '';
    return t
        .split(/\s+/)
        .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
        .join(' ');
}

/** "1 Review" vs "N Reviews" for UI copy */
export function reviewsLabel(count: number): string {
    const n = Math.max(0, Math.floor(Number(count) || 0));
    return n === 1 ? '1 Review' : `${n} Reviews`;
}
