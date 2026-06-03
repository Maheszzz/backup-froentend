import { NextResponse } from 'next/server';
import { razorpayCreateOrder, getRazorpayCredentials } from '@/lib/razorpayServer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const amount = Number(body?.amount);
        if (!Number.isFinite(amount) || amount < 100) {
            return NextResponse.json({ message: 'Invalid amount (minimum ₹1)' }, { status: 400 });
        }

        const order = await razorpayCreateOrder({
            amount: Math.round(amount),
            currency: body?.currency ?? 'INR',
            receipt: `quickpay_${Date.now()}`,
            notes: {
                payment_type: body?.payment_type ?? 'manual',
                payer_name: String(body?.payer_name ?? ''),
                payer_email: String(body?.payer_email ?? ''),
                payer_phone: String(body?.payer_phone ?? ''),
            },
        });

        const creds = getRazorpayCredentials();

        return NextResponse.json({
            ...order,
            razorpay_key: creds?.keyId,
        });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to create order';
        console.error('[payments/create-order]', e);
        return NextResponse.json({ message }, { status: 500 });
    }
}
