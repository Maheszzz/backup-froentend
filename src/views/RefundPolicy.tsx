'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LEGAL_ENTITY_NAME } from '@/lib/siteConfig';

export default function RefundPolicy() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Refund and Cancellation Policy</h1>
                    <p className="text-slate-500 mb-8">Last Updated: February 2026</p>

                    <div className="bg-white rounded-2xl p-5 md:p-12 shadow-sm prose prose-slate max-w-none text-slate-700">
                        <p>
                            This Refund and Cancellation Policy outlines the terms applicable to payments made on <a href="http://www.makemystay.ai" className="text-brand-red hover:underline">www.makemystay.ai</a>, operated by <strong>MakeMyStay Realty</strong>, Bengaluru, India.
                        </p>
                        <p>By making a payment on our Platform, you agree to the terms described below.</p>

                        <hr className="my-8 border-slate-200" />

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Booking and Service Payments</h2>
                        <p>Payments made on MakeMyStay may include:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Property visit or service charges</li>
                            <li>Booking or token advance</li>
                            <li>Platform or consultation fees</li>
                        </ul>
                        <p>All payments are processed securely through authorized payment gateways such as <strong>Razorpay</strong>.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">2. Cancellation Policy</h2>
                        <p>Users may request cancellation of a booking or service by contacting our support team.</p>
                        <p>Cancellation eligibility depends on:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Type of service or booking</li>
                            <li>Time of cancellation request</li>
                            <li>Partner or property provider terms</li>
                        </ul>
                        <p>Certain service or consultation fees may be non-refundable if the service has already been delivered.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">3. Refund Policy</h2>
                        <p>Refunds, if applicable, may be issued under the following conditions:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Duplicate payment made by mistake</li>
                            <li>Payment failure where amount was deducted but service not provided</li>
                            <li>Booking cancelled within the eligible cancellation window</li>
                        </ul>
                        <p>Refunds may not be applicable in cases where:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>A site visit or service has already been completed</li>
                            <li>The user fails to attend a scheduled visit without prior notice</li>
                            <li>Payment was made toward non-refundable service charges clearly mentioned at the time of booking</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">4. Refund Processing Time</h2>
                        <p>Approved refunds are processed within <strong>5 to 10 working days</strong>.</p>
                        <p>The time taken for the amount to reflect depends on:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Payment method used</li>
                            <li>Bank or payment gateway processing timelines</li>
                        </ul>
                        <p>MakeMyStay is not responsible for delays caused by banks or payment providers.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">5. Mode of Refund</h2>
                        <p>Refunds will be issued to the <strong>original payment method</strong> used during the transaction unless otherwise required by applicable regulations.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">6. Disputes</h2>
                        <p>In case of any disputes related to payments or refunds, users are requested to contact MakeMyStay support first for resolution.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">7. Contact Information</h2>
                        <p>
                            {LEGAL_ENTITY_NAME}<br />
                            Bengaluru, Karnataka, India<br />
                            Email: <a href="mailto:connect@makemystay.ai" className="text-brand-red hover:underline">connect@makemystay.ai</a>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
