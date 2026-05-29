'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LEGAL_ENTITY_NAME } from '@/lib/siteConfig';

export default function Terms() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Terms and Conditions</h1>
                    <p className="text-slate-500 mb-8">Last Updated: February 2026</p>

                    <div className="bg-white rounded-2xl p-5 md:p-12 shadow-sm prose prose-slate max-w-none text-slate-700">
                        <p>
                            These Terms and Conditions govern the use of <a href="http://www.makemystay.ai" className="text-brand-red hover:underline">www.makemystay.ai</a>, operated by <strong>{LEGAL_ENTITY_NAME}</strong>.
                        </p>
                        <p>By accessing or using our services, you agree to these Terms.</p>

                        <hr className="my-8 border-slate-200" />

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Use of Platform</h2>
                        <p>MakeMyStay provides an online platform to discover rental homes, PG accommodations, and real estate opportunities.</p>
                        <p>Users agree to:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Provide accurate information</li>
                            <li>Use the Platform only for lawful purposes</li>
                            <li>Not misuse or attempt to disrupt services</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">2. Eligibility</h2>
                        <p>You must be at least <strong>18 years of age</strong> to use our services.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">3. Role of MakeMyStay</h2>
                        <p>MakeMyStay acts as:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>A discovery platform</li>
                            <li>A facilitator between users and property providers in certain cases</li>
                        </ul>
                        <p>We do not own most listed properties unless explicitly stated.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">4. Property Information</h2>
                        <p>We strive to provide accurate information, but:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Availability and pricing may change</li>
                            <li>Final verification is the user’s responsibility</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">5. Bookings and Payments</h2>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Payments may be processed through <strong>Razorpay</strong>, an authorized payment gateway.</li>
                            <li>MakeMyStay does not store card or banking details.</li>
                            <li>Booking or service charges, if paid, may be subject to separate refund policies.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-brand-red mb-4 mt-8">6. Payment Safety Notice</h2>
                        <div className="bg-red-50 border-l-4 border-brand-red p-4 mb-4">
                            <p className="text-slate-900 font-bold mb-2">🚨 Protect Yourself from Fraud</p>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li><strong>Never</strong> pay in cash to any individuals or property representatives.</li>
                                <li><strong>Never</strong> use third-party payment links or direct personal transfers.</li>
                                <li>Payments must <strong>only</strong> be made through authorized MakeMyStay verified channels.</li>
                                <li>MakeMyStay representatives will never ask for payment via cash, personal UPI IDs, or unauthorized platforms.</li>
                                <li>If you are asked to pay outside the platform, please report it immediately to our support team.</li>
                            </ul>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">7. Cancellation and Refund</h2>
                        <p>Refunds, if applicable, will follow:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Booking terms displayed at time of payment</li>
                            <li>Service-specific policies</li>
                        </ul>
                        <p>Processing timelines may vary based on payment gateway rules.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">8. Intellectual Property</h2>
                        <p>All content, logos, text, and design on this Platform are the property of MakeMyStay and may not be used without permission.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">9. Limitation of Liability</h2>
                        <p>MakeMyStay is not responsible for:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Disputes between users and property owners</li>
                            <li>Third-party services</li>
                            <li>Temporary technical interruptions</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">10. Termination</h2>
                        <p>We reserve the right to suspend or terminate access to users who violate these Terms.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">11. Governing Law</h2>
                        <p>These Terms shall be governed by the laws of <strong>India</strong>, and courts in <strong>Bengaluru, Karnataka</strong> shall have jurisdiction.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">12. Contact and Support</h2>
                        <p>For any queries, payment issues, or to report suspicious activity, please reach out to us:</p>
                        <div className="bg-slate-50 rounded-xl p-4 mt-4 border border-slate-200">
                            <strong>{LEGAL_ENTITY_NAME} Support</strong><br />
                            Email: <a href="mailto:connect@makemystay.ai" className="text-brand-red font-bold hover:underline">connect@makemystay.ai</a><br />
                            Emergency: <a href="tel:+918150099911" className="text-slate-900 font-bold hover:underline">081500 99911</a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
