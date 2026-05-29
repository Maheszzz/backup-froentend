'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LEGAL_ENTITY_NAME } from '@/lib/siteConfig';

export default function Privacy() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
                    <p className="text-slate-500 mb-8">Last Updated: February 2026</p>

                    <div className="bg-white rounded-2xl p-5 md:p-12 shadow-sm prose prose-slate max-w-none text-slate-700">
                        <p>
                            This Privacy Policy describes how <strong>{LEGAL_ENTITY_NAME}, Bengaluru, India</strong> collects, uses, and protects information when you use <a href="http://www.makemystay.ai" className="text-brand-red hover:underline">www.makemystay.ai</a> and related services.
                        </p>
                        <p>By using our Platform, you agree to the practices described in this Policy.</p>

                        <hr className="my-8 border-slate-200" />

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                        <p>We may collect the following information:</p>

                        <h3 className="text-xl font-semibold text-slate-900 mb-2 mt-4">Personal Information</h3>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Name</li>
                            <li>Phone number</li>
                            <li>Email address</li>
                            <li>Location preferences</li>
                            <li>Property requirements</li>
                            <li>Information submitted through forms or chat</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-slate-900 mb-2 mt-4">Transaction Information</h3>
                        <p>Payments made through our Platform are processed securely by <strong>Razorpay</strong>. We do not store debit/credit card or banking details.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">2. How We Use Information</h2>
                        <p>We use collected information to:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Provide property recommendations and services</li>
                            <li>Respond to inquiries and schedule visits</li>
                            <li>Improve our services and website</li>
                            <li>Process bookings or service payments</li>
                            <li>Communicate updates and offers</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">3. Sharing of Information</h2>
                        <p>We may share limited information with:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Property owners or partners to fulfill requests</li>
                            <li>Payment gateway providers</li>
                            <li>Service providers assisting in operations</li>
                            <li>Authorities when required by law</li>
                        </ul>
                        <p>We do not sell user data.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">4. Data Security</h2>
                        <p>We use reasonable technical and organizational safeguards to protect personal information. However, no online system can guarantee absolute security.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">5. Cookies</h2>
                        <p>Our Platform may use cookies to improve functionality and analyze usage. Users can control cookies through browser settings.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">6. User Rights</h2>
                        <p>You may request:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>Access to personal data</li>
                            <li>Correction of information</li>
                            <li>Deletion requests (subject to legal obligations)</li>
                        </ul>
                        <p>Requests may be sent to: <strong><a href="mailto:connect@makemystay.ai" className="text-brand-red hover:underline">connect@makemystay.ai</a></strong></p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">7. Changes to Policy</h2>
                        <p>We may update this Privacy Policy from time to time. Updated versions will be posted on this page.</p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">8. Contact Information</h2>
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
