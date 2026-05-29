/**
 * Env helpers for Vite and Next.js.
 * Client bundles only inline `process.env.NEXT_PUBLIC_*` when accessed statically (not process.env[key]).
 */

function readServerEnv(key: string): string | undefined {
    if (typeof process !== 'undefined' && process.env[key] !== undefined) {
        return process.env[key];
    }
    return undefined;
}

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development' || readServerEnv('DEV') === 'true';
}

/** API base URL for axios (e.g. `/api/v1` or `http://localhost:8000/api/v1`). */
export function getApiBaseUrl(): string {
    const url =
        process.env.NEXT_PUBLIC_API_BASE_URL ??
        process.env.NEXT_PUBLIC_API_URL ??
        process.env.VITE_API_BASE_URL ??
        process.env.VITE_API_URL ??
        '';
    return url.trim();
}

/** Razorpay publishable key — checkout modal (must match RAZORPAY_KEY_ID server-side). */
export function getRazorpayKeyId(): string | undefined {
    const key =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ??
        process.env.VITE_RAZORPAY_KEY_ID ??
        readServerEnv('RAZORPAY_KEY_ID') ??
        '';
    const trimmed = key.trim();
    return trimmed || undefined;
}

export function getWhatsAppPhone(): string | undefined {
    const phone =
        process.env.NEXT_PUBLIC_WHATSAPP_PHONE ??
        process.env.VITE_WHATSAPP_PHONE ??
        '';
    const trimmed = phone.trim();
    return trimmed || undefined;
}
