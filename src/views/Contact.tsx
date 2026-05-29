'use client';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { contactApi } from '@/lib/api';
import { CheckCircle, Mail, MapPin, Phone, Send, ChevronRight, MessageSquare, Building2, Star } from 'lucide-react';
import { FormEvent, useState } from 'react';
import locJson from '@/data/pg-locations.json';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        location: '',
        property_type: '',
        units: '',
        current_occupancy: '',
        monthly_revenue: '',
        uses_brokers: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (formData.phone.length < 10) {
            setError('Phone number must be at least 10 digits');
            setLoading(false);
            return;
        }

        try {
            const submissionData = {
                ...formData,
                source: 'Website - Contact'
            };
            await contactApi.submitContactForm(submissionData);

            const w = window as any;
            w.dataLayer = w.dataLayer || [];
            function gtagTracker(..._args: any[]) { w.dataLayer.push(arguments); }
            gtagTracker('js', new Date());
            gtagTracker('config', 'AW-11313350010');

            if (typeof w.gtag_report_conversion === 'function') {
                w.gtag_report_conversion();
            }

            setSuccess(true);
            setFormData({ name: '', phone: '', email: '', location: '', property_type: '', units: '', current_occupancy: '', monthly_revenue: '', uses_brokers: '', message: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#fbfbfd] min-h-screen font-sans selection:bg-brand-red/10 selection:text-brand-red">
            <Navbar />

            <main className="pb-24">
                {/* ─── Premium Hero Section ─── */}
                <section className="relative pt-32 md:pt-48 pb-24 md:pb-32 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] -translate-y-1/2" />
                        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] translate-y-1/2" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 mb-8">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Growth Team Active</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-8">
                                Let's Scale Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-red/70">Rental Empire</span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
                                Experience 2x occupancy growth with our proprietary property management framework. <br className="hidden md:block" />
                                Join 500+ successful property owners who trust MakeMyStay.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                        
                        {/* ─── LEFT: Contact Channels ─── */}
                        <div className="lg:col-span-4 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="space-y-6"
                            >
                                <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.1)] hover:shadow-[0_40px_80px_-25px_rgba(15,23,42,0.15)] transition-all group">
                                    <div className="w-14 h-14 rounded-2xl bg-brand-red/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Phone className="w-6 h-6 text-brand-red" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Growth Desk</p>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4">Talk to an expert</h3>
                                    <p className="text-slate-500 text-sm font-medium mb-6">Personalized consultation for large-scale operations.</p>
                                    <a href="tel:+918150099911" className="inline-flex items-center gap-2 text-brand-red font-black text-lg hover:gap-3 transition-all">
                                        +91 81500 99911
                                        <ChevronRight className="w-5 h-5" />
                                    </a>
                                </div>

                                <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.1)] hover:shadow-[0_40px_80px_-25px_rgba(15,23,42,0.15)] transition-all group">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Support</p>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4">Business Inquiries</h3>
                                    <p className="text-slate-500 text-sm font-medium mb-6">Detailed proposals and partnership queries.</p>
                                    <a href="mailto:connect@makemystay.ai" className="text-blue-600 font-black text-lg hover:underline">
                                        connect@makemystay.ai
                                    </a>
                                </div>

                                <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.1)] hover:shadow-[0_40px_80px_-25px_rgba(15,23,42,0.15)] transition-all group">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Office HQ</p>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4">Bangalore Base</h3>
                                    <address className="not-italic text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                                        1142, 6th Main Rd, 7th Sector, <br />
                                        HSR Layout, Bengaluru, 560102
                                    </address>
                                    <a 
                                        href="https://www.google.com/maps/search/1142,+6th+Main+Rd,+7th+Sector,+HSR+Layout,+Bengaluru,+Karnataka+560102"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-900 font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:text-brand-red transition-colors"
                                    >
                                        View on Maps <ChevronRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </motion.div>
                        </div>

                        {/* ─── RIGHT: Conversion Form ─── */}
                        <div className="lg:col-span-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(15,23,42,0.15)] overflow-hidden"
                            >
                                <div className="p-8 md:p-16">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                        <div>
                                            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Get Your Growth Plan</h2>
                                            <p className="text-slate-400 font-medium text-lg">Customized occupancy strategy in under 4 hours.</p>
                                        </div>
                                        <div className="flex -space-x-3">
                                            {[
                                                'MakeMyStay growth advisor',
                                                'Property onboarding specialist',
                                                'Rental support representative',
                                                'Customer success manager',
                                            ].map((avatarAlt, i) => (
                                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 overflow-hidden">
                                                    <img
                                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                                        alt={avatarAlt}
                                                        width={48}
                                                        height={48}
                                                    />
                                                </div>
                                            ))}
                                            <div className="w-12 h-12 rounded-full border-4 border-white bg-brand-red flex items-center justify-center text-[10px] font-black text-white">
                                                500+
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {success && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mb-10 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-4"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                                                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-emerald-900 tracking-tight">Submission Received!</p>
                                                    <p className="text-emerald-700/80 text-sm font-medium">Our team is reviewing your profile right now.</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                                            <input type="text" id="name" value={formData.name} onChange={handleChange} required
                                                className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                                                placeholder="Enter name" />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
                                            <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required
                                                className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                                                placeholder="+91 XXXXX XXXXX" />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Business Email</label>
                                            <input type="email" id="email" value={formData.email} onChange={handleChange} required
                                                className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                                                placeholder="you@company.com" />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="location" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Property Location</label>
                                            <div className="relative">
                                                <select id="location" value={formData.location} onChange={handleChange} required
                                                    className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none font-bold text-slate-900 appearance-none cursor-pointer">
                                                    <option value="" disabled>Select Area</option>
                                                    {locJson.map(loc => (
                                                        <option key={loc.slug} value={loc.name}>{loc.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ChevronRight className="w-5 h-5 text-slate-300 rotate-90" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="property_type" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Property Type</label>
                                            <div className="relative">
                                                <select id="property_type" value={formData.property_type} onChange={handleChange} required
                                                    className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none font-bold text-slate-900 appearance-none cursor-pointer">
                                                    <option value="" disabled>Select Type</option>
                                                    <option value="PG">PG / Hostel</option>
                                                    <option value="1RK">1RK</option>
                                                    <option value="1BHK">1BHK</option>
                                                    <option value="2BHK">2BHK</option>
                                                    <option value="3BHK">3BHK</option>
                                                    <option value="4BHK">4BHK</option>
                                                    <option value="Villa">Villa / Bungalow</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ChevronRight className="w-5 h-5 text-slate-300 rotate-90" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Notes (Optional)</label>
                                            <textarea id="message" rows={4} value={formData.message} onChange={handleChange}
                                                className="w-full p-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300 resize-none"
                                                placeholder="Share your goals or challenges..."
                                            ></textarea>
                                        </div>

                                        {error && (
                                            <p className="md:col-span-2 text-sm font-semibold text-red-600" role="alert">
                                                {error}
                                            </p>
                                        )}
                                        <div className="md:col-span-2 pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="group relative w-full h-20 bg-slate-900 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-brand-red to-brand-red/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="relative z-10 flex items-center justify-center gap-3">
                                                    <span className="text-white text-sm font-black uppercase tracking-[0.2em]">
                                                        {loading ? 'Processing...' : 'Generate Growth Plan'}
                                                    </span>
                                                    <Send className="w-5 h-5 text-white transition-transform group-hover:translate-x-2" />
                                                </div>
                                            </button>
                                        </div>

                                        <div className="md:col-span-2 text-center pt-4">
                                            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-slate-300" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Ready</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Star className="w-4 h-4 text-amber-400" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Rated 2024</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">24/7 Priority Support</span>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
