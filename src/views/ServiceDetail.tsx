'use client';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useSmartBack } from '@/hooks';
import { ArrowLeft, ArrowRight, BarChart3, Building2, CheckCircle, Phone, Users, Wallet } from 'lucide-react';
import { Link, useParams } from '@/lib/navigation';

export default function ServiceDetail() {
    const { serviceId } = useParams();
    const goBack = useSmartBack({ fallback: '/#services' });

    const servicesData: Record<string, any> = {
        'property-management': {
            title: 'Elevated Property Management',
            shortTitle: 'Property Management',
            icon: Building2,
            tagline: 'Premium Asset Oversight',
            description: 'Comprehensive asset management tailored for premium properties — from tenant onboarding to maintenance and performance tracking.',
            fullDescription: 'We handle every aspect of your property lifecycle with transparent reporting and dedicated support, so you enjoy returns without the hassle.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
            features: [
                'Tenant onboarding & documentation',
                'Preventive maintenance scheduling',
                'Issue resolution & escalation support',
                'Monthly performance reports',
                'Long-term value preservation',
                'Dedicated relationship manager',
            ],
            stats: [
                { value: '500+', label: 'Units Managed' },
                { value: '95%', label: 'Occupancy Rate' },
                { value: '24/7', label: 'Tenant Support' },
                { value: '4.8★', label: 'Owner Rating' },
            ],
        },
        'revenue-optimization': {
            title: 'Intelligent Revenue Optimization',
            shortTitle: 'Revenue Optimization',
            icon: Wallet,
            tagline: 'Maximize Your Returns',
            description: 'Dynamic pricing powered by real-time market data — designed to maximize occupancy and rental income simultaneously.',
            fullDescription: 'Our AI-driven pricing engine continuously analyses demand signals and competitor rates to ensure your property earns its full potential.',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
            features: [
                'Real-time market demand analysis',
                'Dynamic pricing automation',
                'Occupancy gap identification',
                'Competitive positioning reports',
                'Revenue performance tracking',
                'Monthly optimization reviews',
            ],
            stats: [
                { value: '30%', label: 'Avg. Revenue Lift' },
                { value: '95%', label: 'Occupancy Rate' },
                { value: '2x', label: 'Faster Leasing' },
                { value: '4.8★', label: 'Owner Rating' },
            ],
        },
        'tenant-acquisition': {
            title: 'Premium Tenant Acquisition',
            shortTitle: 'Tenant Acquisition',
            icon: Users,
            tagline: 'Quality Tenant Matching',
            description: 'Verified tenant sourcing & seamless onboarding — reducing vacancy time without compromising on quality.',
            fullDescription: 'Our structured screening process connects your property with professionals and families who meet your standards, fast.',
            image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200',
            features: [
                'Multi-channel prospect sourcing',
                'Background & employment verification',
                'Streamlined digital onboarding',
                'Reduced vacancy periods',
                'Tenant quality scoring',
                'End-to-end leasing support',
            ],
            stats: [
                { value: '2,000+', label: 'Tenants Placed' },
                { value: '7 Days', label: 'Avg. Fill Time' },
                { value: '98%', label: 'Retention Rate' },
                { value: '4.9★', label: 'Tenant Rating' },
            ],
        },
        'market-intelligence': {
            title: 'Advanced Market Intelligence',
            shortTitle: 'Market Intelligence',
            icon: BarChart3,
            tagline: 'Data-Driven Decisions',
            description: 'Advanced rental insights & performance analytics — so you always invest with confidence.',
            fullDescription: 'We combine live rental market data with historical trends to give property owners a clear picture of where to invest and when.',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
            features: [
                'Hyperlocal rental trend analysis',
                'Pricing benchmark comparisons',
                'Demand pattern forecasting',
                'Location-based opportunity maps',
                'Property type performance data',
                'Strategic investment advisory',
            ],
            stats: [
                { value: '50+', label: 'Micro-markets Tracked' },
                { value: 'Live', label: 'Data Refresh' },
                { value: '10+', label: 'Data Sources' },
                { value: '4.8★', label: 'Advisor Rating' },
            ],
        },
    };

    const service = servicesData[serviceId || ''];

    if (!service) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Service Not Found</h1>
                    <button
                        type="button"
                        onClick={goBack}
                        className="text-brand-red hover:underline"
                    >
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    const ServiceIcon = service.icon;

    return (
        <div className="min-h-screen bg-black">
            <Navbar />

            {/* ── Hero Section ── */}
            <section className="relative min-h-[75vh] overflow-hidden flex items-center">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.70)' }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
                    {/* Subtle radial glow */}
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(197,160,33,0.06) 0%, transparent 60%)' }} />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-10 lg:mb-14 transition-colors group -ml-2 p-2"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs tracking-widest uppercase">Back</span>
                    </button>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Content */}
                        <div>
                            {/* Gold Badge */}
                            <div
                                className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full mb-8"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(184,150,46,0.10))',
                                    border: '1px solid rgba(197,160,33,0.35)',
                                    boxShadow: '0 0 20px rgba(197,160,33,0.12)',
                                }}
                            >
                                <ServiceIcon className="w-4 h-4" style={{ color: '#D4AF37' }} />
                                <span
                                    className="text-xs font-semibold tracking-[0.25em] uppercase"
                                    style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}
                                >
                                    {service.tagline}
                                </span>
                            </div>

                            {/* Headline */}
                            <h1
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white mb-6 leading-[1.08] tracking-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {service.title}
                            </h1>

                            {/* Description */}
                            <p className="text-lg lg:text-xl text-white/80 leading-relaxed mb-5 max-w-xl">
                                {service.description}
                            </p>
                            <p className="text-base text-white/60 leading-relaxed mb-10 max-w-xl">
                                {service.fullDescription}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/contact-us"
                                    className="group px-8 py-4 text-white font-semibold rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                                    style={{ background: 'linear-gradient(135deg,#B11226,#8B0D1C)', boxShadow: '0 4px 20px rgba(177,18,38,0.3)' }}
                                >
                                    Schedule a Consultation
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a
                                    href="https://wa.me/918150099911?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20services."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group px-8 py-4 font-semibold rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto transition-all duration-300 hover:-translate-y-0.5"
                                    style={{
                                        background: 'transparent',
                                        border: '1.5px solid rgba(197,160,33,0.5)',
                                        color: '#D4AF37',
                                    }}
                                >
                                    <Phone className="w-4 h-4" />
                                    Talk to an Expert
                                </a>
                            </div>
                        </div>

                        {/* Right — Icon Display */}
                        <div className="flex items-center justify-center mt-8 lg:mt-0">
                            <div className="relative">
                                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full blur-3xl absolute inset-0" style={{ background: 'radial-gradient(circle, rgba(177,18,38,0.25) 0%, rgba(197,160,33,0.15) 100%)' }} />
                                <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-3xl backdrop-blur-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}>
                                    <ServiceIcon className="w-24 h-24 lg:w-32 lg:h-32" style={{ color: '#B11226' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats Row ── */}
            <section className="py-10 bg-black border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                        {service.stats.map((stat: { value: string; label: string }, i: number) => (
                            <div key={i}>
                                <p className="text-3xl font-bold mb-1" style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}>{stat.value}</p>
                                <p className="text-sm text-white/50 tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features Section ── */}
            <section className="relative py-24 bg-gradient-to-b from-black to-[#0D0D0D]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2
                            className="text-4xl md:text-5xl font-medium text-white mb-4"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            What You Gain With Us
                        </h2>
                        <div className="w-16 h-0.5 mx-auto" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8962E)' }} />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.features.map((feature: string, idx: number) => (
                            <div
                                key={idx}
                                className="group relative p-7 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                }}
                            >
                                {/* Hover glow border */}
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ boxShadow: '0 0 0 1px rgba(197,160,33,0.3) inset' }}
                                />

                                <div className="flex items-start gap-4 relative z-10">
                                    {/* Gold circle icon */}
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                                        style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.2),rgba(184,150,46,0.1))', border: '1px solid rgba(197,160,33,0.3)' }}
                                    >
                                        <CheckCircle className="w-4 h-4" style={{ color: '#D4AF37' }} />
                                    </div>
                                    <p className="text-white/85 font-medium leading-relaxed pt-1">{feature}</p>
                                </div>

                                {/* Bottom gold bar */}
                                <div
                                    className="absolute bottom-0 left-0 h-[2px] w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-b-2xl"
                                    style={{ background: 'linear-gradient(90deg,#D4AF37,#B8962E)' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Final CTA Section ── */}
            <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D0D0D 0%, #1A0A0E 100%)' }}>
                {/* Gold radial glow */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(197,160,33,0.07) 0%, transparent 65%)' }} />

                <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2
                        className="text-4xl md:text-5xl font-medium text-white mb-5 leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Maximize Your Property's{' '}
                        <em style={{ fontStyle: 'italic', color: '#D4AF37' }}>Potential Today</em>
                    </h2>
                    <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Partner with a dedicated management team focused on performance, protection, and profitability.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact-us"
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            style={{ background: 'linear-gradient(135deg,#B11226,#8B0D1C)', boxShadow: '0 4px 24px rgba(177,18,38,0.35)' }}
                        >
                            Book a Strategy Call
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="tel:+918150099911"
                            className="inline-flex items-center justify-center gap-2 px-10 py-5 font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1"
                            style={{ border: '1.5px solid rgba(197,160,33,0.4)', color: '#D4AF37', background: 'transparent' }}
                        >
                            <Phone className="w-4 h-4" />
                            Call Now
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
