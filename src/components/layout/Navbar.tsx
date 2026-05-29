"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Menu, Phone, ArrowRight, Search, Heart, CreditCard, Video, BookOpen, MapPin, ChevronDown, Check } from 'lucide-react';
import { navigationLinks } from '@/data/content';
import { Button } from '@/components/ui/Button';
import { Link, useLocation, useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
/** Public path only — never pass a bundled SVG import (breaks as `[object Object]` in prod). */
const LOGO_SRC = '/logo-nav.jpg';

const NAV_CITIES = [
    { slug: 'bangalore', label: 'Bangalore' },
    { slug: 'pune', label: 'Pune' },
    { slug: 'hyderabad', label: 'Hyderabad' },
] as const;

type NavCitySlug = typeof NAV_CITIES[number]['slug'];

interface CityDropdownProps {
    selectedCity: NavCitySlug;
    onSelect: (slug: NavCitySlug) => void;
}

function CityDropdown({ selectedCity, onSelect }: CityDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const currentLabel = NAV_CITIES.find((c) => c.slug === selectedCity)?.label ?? 'Bangalore';

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="hidden md:inline-flex min-w-[132px] items-center justify-between gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 hover:shadow transition-all"
            >
                <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                    {currentLabel}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-label="Select city"
                    className="absolute left-0 top-full mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-xl p-1 z-50"
                >
                    {NAV_CITIES.map((c) => {
                        const active = c.slug === selectedCity;
                        return (
                            <button
                                key={c.slug}
                                type="button"
                                role="option"
                                aria-selected={active}
                                onClick={() => {
                                    onSelect(c.slug);
                                    setOpen(false);
                                }}
                                className={`w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                                    active
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <MapPin className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-400'}`} />
                                    {c.label}
                                </span>
                                {active && <Check className="w-4 h-4" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState<NavCitySlug>('bangalore');
    const location = useLocation();
    const navigate = useNavigate();
    useAuth();

    const handleCitySelect = (slug: NavCitySlug) => {
        setSelectedCity(slug);
        navigate(`/pg/${slug}`);
    };

    useEffect(() => {
        const parts = location.pathname.toLowerCase().split('/').filter(Boolean);
        if (parts[0] === 'pg' && parts[1] && NAV_CITIES.some((c) => c.slug === parts[1] as NavCitySlug)) {
            setSelectedCity(parts[1] as NavCitySlug);
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    // Handle scroll after navigation to home
    useEffect(() => {
        if (location.pathname === '/' && location.hash) {
            const sectionId = location.hash.replace('#', '');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location]);

    const handleNavClick = (item: string, e: React.MouseEvent) => {
        const sectionId = item.toLowerCase().replace(' ', '-');

        if (item === 'Home') {
            e.preventDefault();
            if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                navigate('/');
            }
            setIsMenuOpen(false);
            return;
        }



        if (location.pathname === '/') {
            e.preventDefault();
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Navigate to home with hash
            navigate(`/#${sectionId}`);
        }
        setIsMenuOpen(false);
    };

    const isHomePage = location.pathname === '/';
    const showScrolledStyle = isScrolled || !isHomePage;
    const navLinkDesktop = `font-semibold whitespace-nowrap transition-colors cursor-pointer text-slate-700 hover:text-brand-red ${isHomePage && !showScrolledStyle ? 'text-[0.93rem]' : 'text-sm'}`;
    const importantNavItems = navigationLinks.filter((item) => ['Home', 'Services', 'About Us'].includes(item));

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${showScrolledStyle ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5 md:py-3.5 border-b border-slate-200' : 'bg-white py-3 md:py-4.5 border-b border-slate-100'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
                    <div className="flex items-center justify-between md:grid md:grid-cols-[auto_auto_1fr_auto] md:items-center md:gap-4 lg:gap-8">
                        <div className="flex items-center gap-2 shrink-0">
                            <img src={LOGO_SRC} alt="MakeMyStay.ai logo" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 max-w-[32px] max-h-[32px] md:max-w-[40px] md:max-h-[40px] shrink-0 rounded-lg object-contain shadow-sm bg-white" />
                            <Link to="/" aria-label="MakeMyStay Home" className="text-xl md:text-[1.95rem] font-bold tracking-tight font-heading transition-colors text-slate-900 leading-none">
                                MakeMyStay<span className="text-brand-red">.ai</span>
                            </Link>
                        </div>

                        <CityDropdown selectedCity={selectedCity} onSelect={handleCitySelect} />

                        <div className={`hidden md:flex items-center justify-self-center min-w-0 ${isHomePage && !showScrolledStyle ? 'gap-x-5 lg:gap-x-7' : 'gap-x-6 lg:gap-x-8'}`}>
                            {importantNavItems.map((item) => (
                                <a
                                    key={item}
                                    href={item === 'Home' ? '/' : `/#${item.toLowerCase().replace(' ', '-')}`}
                                    onClick={(e) => handleNavClick(item, e)}
                                    className={navLinkDesktop}
                                >
                                    {item}
                                </a>
                            ))}
                            <Link to="/blog" className={navLinkDesktop}>
                                Blog
                            </Link>
                            <Link to="/quick-pay" className={navLinkDesktop}>
                                Quick Pay
                            </Link>
                            <Link
                                to="/schedule-demo"
                                className={`flex items-center gap-1.5 ${navLinkDesktop}`}
                            >
                                <Video className="w-4 h-4 shrink-0" />
                                Schedule a Demo
                            </Link>
                        </div>

                        <div className="flex items-center justify-end justify-self-end shrink-0 gap-2">
                            <Link
                                to="/pg/bangalore"
                                aria-label="List your PG in Bangalore"
                                className={`md:hidden inline-flex items-center rounded-full border px-2.5 py-1.5 text-[10px] font-bold tracking-wide transition-colors bg-brand-red text-white border-brand-red hover:bg-red-600`}
                            >
                                List PG
                            </Link>
                            <Link to="/contact-us" className="hidden md:block">
                                <Button variant="primary" className="px-5 lg:px-6 py-2.5 text-sm shadow-sm hover:shadow-md transition-shadow">Contact Us</Button>
                            </Link>
                            <button
                                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`md:hidden p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-800 hover:bg-slate-100`}
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Full-Screen Mobile Menu Overlay — rendered outside nav for correct z-index */}
            <div
                className={`fixed inset-0 z-[60] md:hidden transition-all duration-500 ${isMenuOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Menu Panel */}
                <div
                    className={`absolute top-0 right-0 w-[85%] max-w-[360px] h-full bg-brand-charcoal shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Menu Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div className="flex items-center space-x-2">
                            <img src={LOGO_SRC} alt="MakeMyStay.ai logo" width={32} height={32} className="w-8 h-8 rounded-lg object-contain" />
                            <span className="text-lg font-bold text-white font-heading">
                                MakeMyStay<span className="text-brand-red">.ai</span>
                            </span>
                        </div>
                        <button
                            aria-label="Close menu"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <div className="flex-1 overflow-y-auto py-4 px-5">

                        {/* ── Primary Booking Actions ── */}
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 px-1 mb-3">Quick Actions</p>
                        <div className="space-y-1.5 mb-5">
                            <Link
                                to="/properties"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(197,160,33,0.15)' }}>
                                    <Search className="w-4 h-4" style={{ color: '#C5A021' }} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Find Homes</div>
                                    <div className="text-[11px] text-slate-400">Browse verified PG & rentals</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </Link>

                            <Link
                                to="/wishlist"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-red-500/15">
                                    <Heart className="w-4 h-4 text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Wishlist</div>
                                    <div className="text-[11px] text-slate-400">Your saved properties</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </Link>

                            <Link
                                to="/blog"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-amber-500/15">
                                    <BookOpen className="w-4 h-4 text-amber-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Blog</div>
                                    <div className="text-[11px] text-slate-400">Guides &amp; Bangalore tips</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </Link>

                            <Link
                                to="/quick-pay"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/15">
                                    <CreditCard className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Quick Pay</div>
                                    <div className="text-[11px] text-slate-400">Pay booking fee securely</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        </div>

                        <Link
                            to="/schedule-demo"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-500/15">
                                <Video className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-sm">Schedule a Demo</div>
                                <div className="text-[11px] text-slate-400">Book a live walkthrough</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        {/* ── Divider ── */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex-1 h-px bg-white/8" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">More</p>
                            <div className="flex-1 h-px bg-white/8" />
                        </div>

                        {/* ── Info Pages ── */}
                        <div className="space-y-0.5">
                            {navigationLinks.map((item, idx) => (
                                <a
                                    key={item}
                                    href={item === 'Home' ? '/' : `/#${item.toLowerCase().replace(' ', '-')}`}
                                    onClick={(e) => handleNavClick(item, e)}
                                    className="flex items-center justify-between py-3 px-2 text-sm font-medium text-slate-400 hover:text-white border-b border-white/5 transition-colors group"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <span>{item}</span>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Menu Footer */}
                    <div className="p-6 border-t border-white/10 space-y-4">
                        <Link to="/contact-us" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="primary" className="w-full py-3.5 text-base shadow-glow">
                                Contact Us
                            </Button>
                        </Link>
                        <a
                            href="tel:+918150099911"
                            className="flex items-center justify-center gap-2 py-3 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            +91 81500 99911
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
