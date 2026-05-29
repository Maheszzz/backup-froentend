import { Calendar, MessageCircle, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@/lib/navigation';
import { contactApi } from '@/lib/api/contacts';

export function CTA() {
    const [showContactCard, setShowContactCard] = useState(false);

    return (
        <section className="py-14 md:py-20 bg-gradient-to-br from-brand-red via-brand-red to-red-700 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-diagonal-grid opacity-10 pointer-events-none"></div>

            {/* Subtle Accent */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-xl sm:text-2xl md:text-5xl font-bold mb-4 md:mb-6 font-heading leading-tight">
                    Stop Losing Profits to Brokers.<br className="hidden md:block" />{' '}
                    <span className="italic">Start Owning Your Growth.</span>
                </h2>
                <p className="text-base md:text-xl text-white/90 mb-2 md:mb-3 max-w-2xl mx-auto">
                    Join 50+ operators who have already automated their growth and reclaimed their profits.
                </p>
                <p className="text-sm md:text-base text-white/70 mb-8 md:mb-10 max-w-xl mx-auto">
                    Operators see results in as little as <span className="font-bold text-white">5–10 days</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center">
                    <Link
                        to="/schedule-demo"
                        className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-brand-red font-bold rounded-xl shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg"
                        style={{ boxShadow: '0 8px 32px rgba(255,255,255,0.25)' }}
                    >
                        <Calendar className="w-5 h-5" />
                        Schedule Demo
                    </Link>
                    <button
                        onClick={() => setShowContactCard(true)}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/70 text-white font-semibold rounded-xl hover:bg-white hover:text-brand-red transition-all duration-300"
                    >
                        <Phone className="w-4 h-4" />
                        Contact Sales
                    </button>
                </div>
            </div>

            {/* Contact Card Modal */}
            {showContactCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-8 text-center relative" style={{ background: 'linear-gradient(135deg,#B11226,#8B0D1C)' }}>
                            <button
                                onClick={() => setShowContactCard(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                            <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                                <span className="text-xl font-bold" style={{ color: '#B11226' }}>MS</span>
                            </div>
                            <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Talk to a Growth Advisor</h3>
                            <p className="text-white/80 mt-1.5 text-sm">See how operators increase occupancy in 5–10 days.</p>
                        </div>

                        {/* Primary CTA */}
                        <div className="px-6 pt-5 pb-2">
                            <Link
                                to="/contact-us?type=demo"
                                onClick={() => setShowContactCard(false)}
                                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl"
                                style={{ background: 'linear-gradient(135deg,#B11226,#8B0D1C)', boxShadow: '0 4px 16px rgba(177,18,38,0.3)' }}
                            >
                                <Calendar className="w-5 h-5" />
                                Schedule Free Strategy Call
                            </Link>
                        </div>

                        {/* Secondary Contacts */}
                        <div className="p-6 pt-3 space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-3">Or reach us directly</p>
                            <a
                                href="tel:+918150099911"
                                className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(177,18,38,0.08)' }}>
                                    <Phone className="w-4 h-4" style={{ color: '#B11226' }} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400">Call us</div>
                                    <div className="font-bold text-slate-900 text-sm">+91 81500 9911</div>
                                </div>
                            </a>

                            <a
                                href="https://wa.me/918150099911?text=Hi, I'm interested in MakeMyStay"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                    // Fire-and-forget lead creation
                                    contactApi.submitContactForm({
                                        name: 'WhatsApp User',
                                        phone: '918150099911', // Placeholder for now
                                        email: 'whatsapp@makemystay.ai',
                                        message: 'User clicked WhatsApp CTA on Website',
                                        source: 'Website - WhatsApp'
                                    }).catch(console.error);
                                }}
                                className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 hover:bg-green-50 border border-slate-100 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <MessageCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="flex-grow">
                                    <div className="text-xs text-slate-400">WhatsApp</div>
                                    <div className="font-bold text-slate-900 text-sm">Chat now → Response in 5 mins</div>
                                </div>
                            </a>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6">
                            <button
                                onClick={() => setShowContactCard(false)}
                                className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
