/**
 * Normalize API/feature strings for deduplication and icon lookup.
 * Handles snake_case, casing drift, and common synonyms.
 */

/** Lowercase, underscores → spaces, collapse whitespace */
export function normalizeFeatureKey(raw: string): string {
    return raw
        .trim()
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ');
}

/** Preferred display copy when multiple raw strings collapse to one key */
const PREFERRED_LABEL: Record<string, string> = {
    'high-speed wifi': 'High-speed WiFi',
    wifi: 'High-speed WiFi',
    'wi-fi': 'High-speed WiFi',
    'ro water purifier': 'RO water purifier',
    'ro water': 'RO water purifier',
    'power backup': 'Power backup',
    '24/7 security': '24/7 security',
    'daily housekeeping': 'Daily housekeeping',
    housekeeping: 'Daily housekeeping',
    'washing machine': 'Washing machine',
    refrigerator: 'Refrigerator',
    fridge: 'Refrigerator',
    'nutritious food': 'Nutritious food',
    food: 'Nutritious food',
    'bike parking': 'Bike parking',
    parking: 'Parking',
    'cctv security': 'CCTV security',
    cctv: 'CCTV security',
    security: '24/7 security',
};

/**
 * When both keys exist, drop the generic one (keep the more specific label).
 * Keys must already be normalized with normalizeFeatureKey.
 */
const GENERIC_WHEN_SPECIFIC: [string, string][] = [
    ['wifi', 'high-speed wifi'],
    ['wi fi', 'high-speed wifi'],
    ['ro water', 'ro water purifier'],
    ['water purifier', 'ro water purifier'],
    ['security', '24/7 security'],
    ['cctv', 'cctv security'],
    ['housekeeping', 'daily housekeeping'],
    ['housekeeping', 'professional housekeeping'],
    ['tv', 'smart tv'],
    ['parking', 'bike parking'],
    ['parking', 'car parking'],
    ['parking', 'indoor & outdoor parking'],
    ['kitchen', 'common kitchen'],
    ['kitchen', 'shared kitchen'],
    ['kitchen', 'modern kitchen'],
    ['kitchen', 'fully equipped kitchen'],
    ['fridge', 'refrigerator'],
    ['food', 'nutritious food'],
];

function titleCaseWords(key: string): string {
    return key
        .split(' ')
        .filter(Boolean)
        .map((w) => {
            if (w === 'tv') return 'TV';
            if (w === 'wifi' || w === 'wi-fi') return 'WiFi';
            if (w.includes('/')) return w; // 24/7
            return w.charAt(0).toUpperCase() + w.slice(1);
        })
        .join(' ');
}

function displayLabelForKey(key: string, rawOriginal: string): string {
    if (PREFERRED_LABEL[key]) return PREFERRED_LABEL[key];
    const cleaned = rawOriginal.trim().replace(/_/g, ' ');
    if (/^[a-z_]+$/.test(rawOriginal.trim()) && rawOriginal.includes('_')) {
        return titleCaseWords(key);
    }
    if (cleaned && cleaned !== cleaned.toLowerCase() && cleaned.length > 2) {
        return cleaned;
    }
    return titleCaseWords(key);
}

function pickBetterDisplay(a: string, b: string): string {
    const score = (s: string) => {
        let sc = 0;
        if (!s.includes('_')) sc += 2;
        if (/[A-Z]/.test(s)) sc += 1;
        sc += Math.min(s.length, 40) * 0.01;
        return sc;
    };
    return score(a) >= score(b) ? a : b;
}

/**
 * Deduplicates feature strings, merges known synonyms, returns sorted display labels.
 */
export function dedupePropertyFeatures(rawFeatures: string[]): string[] {
    const list = rawFeatures.map((f) => (typeof f === 'string' ? f : String(f))).filter(Boolean);

    const byCanonical = new Map<string, string>();

    for (const raw of list) {
        const key = normalizeFeatureKey(raw);
        if (!key) continue;

        const label = displayLabelForKey(key, raw);
        const existing = byCanonical.get(key);
        if (!existing) {
            byCanonical.set(key, label);
        } else {
            byCanonical.set(key, pickBetterDisplay(existing, label));
        }
    }

    const keys = new Set(byCanonical.keys());
    for (const [generic, specific] of GENERIC_WHEN_SPECIFIC) {
        if (keys.has(generic) && keys.has(specific)) {
            byCanonical.delete(generic);
        }
    }

    return Array.from(byCanonical.values()).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}
