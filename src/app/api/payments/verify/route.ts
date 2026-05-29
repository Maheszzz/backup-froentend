import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpayServer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const orderId = String(body?.razorpay_order_id ?? '');
        const paymentId = String(body?.razorpay_payment_id ?? '');
        const signature = String(body?.razorpay_signature ?? '');

        if (!orderId || !paymentId || !signature) {
            return NextResponse.json({ message: 'Missing payment fields' }, { status: 400 });
        }

        const valid = verifyRazorpaySignature(orderId, paymentId, signature);
        if (!valid) {
            return NextResponse.json({ message: 'Invalid payment signature' }, { status: 400 });
        }

        return NextResponse.json({ status: 'success', payment_id: paymentId });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Verification failed';
        console.error('[payments/verify]', e);
        return NextResponse.json({ message }, { status: 500 });
    }
}
