import crypto from 'crypto';

/** Server-only Razorpay helpers (uses RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET from .env). */

export function getRazorpayCredentials(): { keyId: string; keySecret: string } | null {
    const keyId = (process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '').trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET ?? '').trim();
    if (!keyId || !keySecret) return null;
    return { keyId, keySecret };
}

export async function razorpayCreateOrder(params: {
    amount: number;
    currency?: string;
    receipt?: string;
    notes?: Record<string, string>;
}) {
    const creds = getRazorpayCredentials();
    if (!creds) {
        throw new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    }

    const auth = Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString('base64');
    const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
            amount: params.amount,
            currency: params.currency ?? 'INR',
            receipt: params.receipt ?? `mms_${Date.now()}`,
            notes: params.notes ?? {},
        }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg =
            typeof data === 'object' && data && 'error' in data
                ? JSON.stringify((data as { error: unknown }).error)
                : res.statusText;
        throw new Error(`Razorpay order failed: ${msg}`);
    }
    return data;
}

export function verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string,
): boolean {
    const creds = getRazorpayCredentials();
    if (!creds) return false;
    const expected = crypto
        .createHmac('sha256', creds.keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
    return expected === signature;
}
