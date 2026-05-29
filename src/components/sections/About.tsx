import { ArrowRight, Award, CheckCircle, Heart, Lightbulb, Phone, Target, Users } from 'lucide-react';
import { Link } from '@/lib/navigation';

const whatWeDo = [
    { icon: CheckCircle, title: 'Verified & quality-checked listings', desc: 'Every property is reviewed for accuracy before it goes live.' },
    { icon: Lightbulb, title: 'Smart property recommendations', desc: 'AI-powered matching surfaces the right homes for your needs.' },
    { icon: Award, title: 'Transparent pricing & insights', desc: 'No hidden costs. Clear data to help you decide with confidence.' },
    { icon: Users, title: 'Assistance from search to move-in', desc: 'A dedicated team guides you through every step.' },
    { icon: Target, title: 'Digital tools that eliminate follow-ups', desc: 'Seamless workflows that save you time and energy.' },
    { icon: Heart, title: 'Technology powered by real estate expertise', desc: 'Built by people who understand both sides of the transaction.' },
];

const trustMetrics = [
    { value: '1,000+', label: 'Properties Listed' },
    { value: '500+', label: 'Happy Residents' },
    { value: '24/7', label: 'Assistance Available' },
    { value: '100%', label: 'Verified Listings' },
];

export function About() {
    return (
        <section id="about-us" className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Header ── */}
                <div className="text-center mb-14 md:mb-20">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#C5A021' }}>
                        Who We Are
                    </p>
                    <h2
                        className="text-3xl sm:text-5xl font-bold text-slate-900 mb-5 leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Redefining How India<br className="hidden sm:block" /> Finds Homes
                    </h2>
                    <div className="w-16 h-0.5 mx-auto rounded-full mb-6" style={{ background: 'linear-gradient(90deg,#C5A021,#A8761A)' }} />
                    <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
                        MakeMyStay.ai is a technology-driven real estate platform built to make property discovery simple, transparent, and intelligent.
                    </p>
                </div>

                {/* ── Manifesto Quote ── */}
                <div className="max-w-4xl mx-auto mb-16 md:mb-20 text-center">
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
                        Finding the right place to stay shouldn't be complicated. Whether you're searching for a rental home, a PG, or an investment opportunity, MakeMyStay helps you explore verified properties, compare options, and make confident decisions — all in one place.
                    </p>
                    <div className="relative inline-block">
                        <p
                            className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug pb-2"
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                            Our goal is simple: make finding a place to live<br className="hidden sm:block" /> as easy as booking a trip.
                        </p>
                        {/* Gold underline accent */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-3/4 rounded-full" style={{ background: 'linear-gradient(90deg,transparent,#C5A021,transparent)' }} />
                    </div>
                </div>

                {/* ── Trust Metrics ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16 md:mb-20">
                    {trustMetrics.map((m, i) => (
                        <div key={i} className="text-center py-6 px-4 rounded-2xl" style={{ background: '#F7F8FA', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <p className="text-3xl font-bold mb-1" style={{ color: '#B11226', fontFamily: "'Playfair Display', serif" }}>{m.value}</p>
                            <p className="text-xs text-slate-500 tracking-wide">{m.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Our Story ── */}
                <div className="mb-16 md:mb-20">
                    <div
                        className="rounded-2xl p-7 md:p-12"
                        style={{
                            background: '#F7F8FA',
                            borderLeft: '4px solid #C5A021',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                        }}
                    >
                        <h3
                            className="text-2xl md:text-3xl font-bold text-slate-900 mb-8"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Our Story
                        </h3>
                        <div className="space-y-5 text-slate-600 leading-[1.85] text-base md:text-[17px]">
                            <p>
                                MakeMyStay was founded in <strong className="text-slate-900">2026</strong> in <strong className="text-slate-900">Bengaluru</strong> with a single vision: modernize the way people search for homes.
                            </p>
                            <p>
                                The traditional property search process is riddled with scattered information, opaque pricing, and exhausting follow-ups. We built MakeMyStay to eliminate that friction — bringing everything into one{' '}
                                <strong className="text-slate-900">seamless digital platform</strong> where users can discover, evaluate, and choose properties efficiently.
                            </p>
                            <p>
                                Today, we're building a smarter, more transparent real estate ecosystem — one trusted listing at a time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── What We Do ── */}
                <div className="mb-16 md:mb-20">
                    <div className="text-center mb-10">
                        <h3
                            className="text-2xl md:text-3xl font-bold text-slate-900 mb-3"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            What We Do
                        </h3>
                        <p className="text-slate-500 max-w-2xl mx-auto">MakeMyStay simplifies the property journey from search to decision:</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {whatWeDo.map((item, idx) => (
                            <div
                                key={idx}
                                className="group flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                            >
                                {/* Gold circle icon */}
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all group-hover:scale-110"
                                    style={{ background: 'linear-gradient(135deg,rgba(197,160,33,0.15),rgba(168,118,26,0.08))', border: '1px solid rgba(197,160,33,0.25)' }}
                                >
                                    <item.icon className="w-5 h-5" style={{ color: '#B11226' }} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1 group-hover:text-[#B11226] transition-colors">{item.title}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Vision & Mission ── */}
                <div className="grid md:grid-cols-2 gap-6 mb-16 md:mb-20">
                    {/* Vision */}
                    <div className="rounded-2xl p-10 text-white flex flex-col" style={{ background: 'linear-gradient(135deg,#B11226,#8B0D1C)', boxShadow: '0 8px 32px rgba(177,18,38,0.25)' }}>
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.12)' }}>
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xs font-bold tracking-[0.25em] uppercase text-white/50 mb-2">Our Vision</p>
                        <h3 className="text-xl font-bold mb-5 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                            India's most trusted home discovery platform.
                        </h3>
                        <p className="text-white/80 leading-[1.85] text-[15px] flex-1">
                            To become the platform where every Indian discovers, compares, and secures a home with complete transparency — no confusion, no friction, just confidence.
                        </p>
                    </div>
                    {/* Mission */}
                    <div className="rounded-2xl p-10 text-white flex flex-col" style={{ background: 'linear-gradient(135deg,#1E1E2E,#0D0D18)', border: '1px solid rgba(197,160,33,0.15)' }}>
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(197,160,33,0.12)' }}>
                            <Lightbulb className="w-5 h-5" style={{ color: '#D4AF37' }} />
                        </div>
                        <p className="text-xs font-bold tracking-[0.25em] uppercase mb-2" style={{ color: 'rgba(197,160,33,0.5)' }}>Our Mission</p>
                        <h3 className="text-xl font-bold mb-5 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Simplify. Empower. Deliver.
                        </h3>
                        <ul className="space-y-4 text-white/75 flex-1">
                            {['Simplify property discovery for everyone', 'Bring transparency & trust to every transaction', 'Use technology to delight, not complicate', 'Help people find homes that match their lives'].map((m, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                                    <span className="text-[14px] leading-relaxed">{m}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── Founder ── */}
                <div className="mb-16 md:mb-20 rounded-2xl p-8 md:p-12" style={{ background: '#F7F8FA', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Our Founder</h3>
                    <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-8">
                        {/* Avatar */}
                        <div className="shrink-0">
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                                style={{ background: 'linear-gradient(135deg,#B11226,#8B0D1C)', boxShadow: '0 4px 20px rgba(177,18,38,0.25)' }}
                            >
                                M
                            </div>
                        </div>
                        {/* Content */}
                        <div className="text-center sm:text-left">
                            <h4 className="text-xl font-bold text-slate-900 mb-0.5">Madhava R</h4>
                            <p className="text-sm font-medium mb-4" style={{ color: '#B11226' }}>Founder, MakeMyStay</p>
                            <p className="text-slate-600 leading-[1.85] mb-5">
                                Madhava founded MakeMyStay with a mission to bring transparency, efficiency, and technology-driven solutions to the real estate ecosystem — making property discovery faster, simpler, and more reliable for modern customers.
                            </p>
                            {/* Founder quote */}
                            <blockquote
                                className="relative pl-4 text-slate-500 italic text-[15px] leading-relaxed"
                                style={{ borderLeft: '3px solid #C5A021' }}
                            >
                                "Real estate should empower people, not confuse them."
                            </blockquote>
                        </div>
                    </div>
                </div>

                {/* ── Trust Strip ── */}
                <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { icon: CheckCircle, label: '1,000+ Verified Listings' },
                        { icon: Phone, label: '24/7 Support' },
                        { icon: Award, label: 'Transparent Pricing' },
                        { icon: Heart, label: 'Trusted Across Bangalore' },
                    ].map((t, i) => (
                        <div key={i} className="flex items-center gap-2 p-4 rounded-2xl" style={{ background: '#F7F8FA', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <t.icon className="w-4 h-4 shrink-0" style={{ color: '#C5A021' }} />
                            <span className="text-xs font-semibold text-slate-700 leading-snug">{t.label}</span>
                        </div>
                    ))}
                </div>

                {/* ── Final CTA ── */}
                <div
                    className="rounded-3xl p-10 md:p-20 text-center text-white"
                    style={{ background: 'linear-gradient(135deg,#0D0D18 0%,#1A0A0E 100%)', border: '1px solid rgba(197,160,33,0.12)' }}
                >
                    <Heart className="w-10 h-10 mx-auto mb-6" style={{ color: '#D4AF37' }} />
                    <h3
                        className="text-3xl sm:text-5xl font-bold mb-5 leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Ready to Find<br className="hidden sm:block" />{' '}
                        <em style={{ fontStyle: 'italic', color: '#D4AF37' }}>Your Next Home?</em>
                    </h3>
                    <p className="text-white/55 mb-12 max-w-lg mx-auto leading-relaxed">
                        Browse verified listings across Bangalore — from premium rentals to PGs and investment plots.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/properties"
                            className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                            style={{
                                background: 'linear-gradient(135deg,#C5A021,#A8761A)',
                                boxShadow: '0 4px 20px rgba(197,160,33,0.35), 0 0 40px rgba(197,160,33,0.15)',
                            }}
                        >
                            Explore Properties
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a
                            href="https://wa.me/918150099911?text=Hi%2C%20I%20want%20to%20find%20a%20home%20through%20MakeMyStay."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl font-semibold transition-all hover:-translate-y-0.5 hover:bg-[rgba(197,160,33,0.08)]"
                            style={{ border: '1.5px solid rgba(197,160,33,0.45)', color: '#D4AF37' }}
                        >
                            <Phone className="w-4 h-4" />
                            Talk to an Advisor
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
