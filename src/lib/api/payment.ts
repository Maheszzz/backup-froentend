export interface CreateOrderRequest {
    amount: number;
    currency?: string;
    payment_type?: string;
    payer_name?: string;
    payer_email?: string;
    payer_phone?: string;
}

export interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    offer_id: string | null;
    status: string;
    attempts: number;
    notes: any[];
    created_at: number;
}

export interface VerifyPaymentRequest {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg =
            typeof data === 'object' && data && 'message' in data
                ? String((data as { message: unknown }).message)
                : res.statusText;
        throw new Error(msg || 'Payment request failed');
    }
    return data as T;
}

export const paymentApi = {
    /** Next.js route — uses RAZORPAY_* from .env (no Python backend required). */
    createOrder: async (data: CreateOrderRequest): Promise<RazorpayOrder> => {
        return postJson<RazorpayOrder>('/api/payments/create-order', data);
    },

    verifyPayment: async (data: VerifyPaymentRequest): Promise<{ status: string; payment_id: string }> => {
        return postJson<{ status: string; payment_id: string }>('/api/payments/verify', data);
    },

    getReceiptUrl: (paymentId: string): string => {
        return `https://dashboard.razorpay.com/app/payments/${encodeURIComponent(paymentId)}`;
    },
};
