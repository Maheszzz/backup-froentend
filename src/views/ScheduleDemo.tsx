'use client';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { contactApi } from '@/lib/api';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    Building2,
    Calendar as CalendarIcon,
    CheckCircle2,
    ChevronLeft, ChevronRight,
    Clock,
    MessageCircle,
    Phone,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { Link } from '@/lib/navigation';

const TIME_SLOTS = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM"
];

const STATS = [
    { icon: TrendingUp, label: "Avg occupancy increase", value: "+23%" },
    { icon: Zap, label: "Days to first results", value: "5–10" },
    { icon: Users, label: "Operators on platform", value: "50+" },
];

function generateBookingId() {
    return 'MMS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function ScheduleDemo() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [bookingId] = useState(generateBookingId);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        units: '',
    });
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();
        const days: { day: number | null; current: boolean }[] = [];
        for (let i = 0; i < firstDay; i++) days.push({ day: null, current: false });
        for (let i = 1; i <= lastDay; i++) days.push({ day: i, current: true });
        return days;
    };

    const getDateFromDay = (day: number) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    const isDateDisabled = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Disable past dates and Sundays (0)
        return date < today || date.getDay() === 0;
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // Build Google Calendar link
    const getGoogleCalendarLink = () => {
        if (!selectedDate || !selectedTime) return '#';
        const [time, period] = selectedTime.split(' ');
        const [hStr, mStr] = time.split(':');
        let h = parseInt(hStr);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        const start = new Date(selectedDate);
        start.setHours(h, parseInt(mStr), 0, 0);
        const end = new Date(start);
        end.setHours(end.getHours() + 1);
        const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=MakeMyStay+Growth+Demo&dates=${fmt(start)}/${fmt(end)}&details=Demo+with+MakeMyStay.ai+Growth+Team&sf=true&output=xml`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !selectedTime) return;
        setLoading(true);
        try {
            const [time, period] = selectedTime.split(' ');
            const [hStr, mStr] = time.split(':');
            let h = parseInt(hStr);
            if (period === 'PM' && h !== 12) h += 12;
            if (period === 'AM' && h === 12) h = 0;
            const finalDate = new Date(selectedDate);
            finalDate.setHours(h, parseInt(mStr), 0, 0);
            await contactApi.scheduleDemo({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                company: formData.company,
                units: formData.units,
                selected_slot: finalDate.toISOString(),
            });
            // Google tag (gtag.js) - Added to submit button
            const w = window as any;
            w.dataLayer = w.dataLayer || [];
            function gtagTracker(..._args: any[]) { w.dataLayer.push(arguments); }
            gtagTracker('js', new Date());
            gtagTracker('config', 'AW-11313350010');

            if (typeof w.gtag_report_conversion === 'function') {
                w.gtag_report_conversion();
            }
            setStep(3);
        } catch (err: any) {
            alert(err.message || 'Failed to schedule. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const prevMonthDisabled = currentMonth.getFullYear() === new Date().getFullYear() &&
        currentMonth.getMonth() <= new Date().getMonth();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-20 md:pt-24 pb-16 md:pb-20 px-4">
                <div className="max-w-5xl mx-auto">

                    {/* ─── B2B Hero ─── */}
                    {step === 1 && (
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border"
                                style={{ color: '#B11226', background: 'rgba(177,18,38,0.06)', borderColor: 'rgba(177,18,38,0.15)' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#B11226] animate-pulse inline-block" />
                                Free Strategy Session · 30 mins
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                Book Your <span style={{ color: '#B11226' }}>Growth Demo</span>
                            </h1>
                            <p className="text-slate-500 max-w-xl mx-auto text-base md:text-lg mb-8">
                                See exactly how operators increase occupancy and cut broker dependency — live, in 30 minutes.
                            </p>
                            {/* Stats row */}
                            <div className="flex flex-wrap justify-center gap-6 mb-4">
                                {STATS.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-center gap-2 text-sm text-slate-600">
                                        <Icon className="w-4 h-4 shrink-0" style={{ color: '#B11226' }} />
                                        <span className="font-bold text-slate-900">{value}</span>
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="text-center mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                Almost there — tell us about you
                            </h1>
                            <p className="text-slate-500 mt-2 text-sm">We'll tailor the demo to your portfolio size.</p>
                        </div>
                    )}

                    <AnimatePresence mode="wait">

                        {/* ─── Step 1: Calendar + Slots ─── */}
                        {step === 1 && (
                            <motion.div key="step1"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    {/* Calendar */}
                                    <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-100">
                                        <div className="flex items-center justify-between mb-5">
                                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                                <CalendarIcon className="w-5 h-5" style={{ color: '#B11226' }} />
                                                Select Date
                                            </h3>
                                            <div className="flex gap-1">
                                                <button
                                                    disabled={prevMonthDisabled}
                                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-center mb-4 font-semibold text-slate-700 text-sm">
                                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 text-center mb-1">
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                                                <div key={d} className={`text-[10px] font-bold uppercase py-2 ${i === 0 ? 'text-red-300' : 'text-slate-400'}`}>{d}</div>
                                            ))}
                                            {getDaysInMonth(currentMonth).map((d, i) => {
                                                if (d.day === null) return <div key={`e-${i}`} />;
                                                const date = getDateFromDay(d.day);
                                                const disabled = isDateDisabled(date);
                                                const isSel = selectedDate?.toDateString() === date.toDateString();
                                                const isTdy = isToday(date);
                                                const isSun = date.getDay() === 0;
                                                return (
                                                    <button
                                                        key={i}
                                                        disabled={disabled}
                                                        onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                                                        className={`
                                                            aspect-square flex items-center justify-center rounded-xl text-xs font-semibold transition-all
                                                            ${disabled ? 'text-slate-200 cursor-not-allowed' : 'hover:bg-red-50 text-slate-700 cursor-pointer'}
                                                            ${isSel ? 'text-white shadow-md' : ''}
                                                            ${isTdy && !isSel ? 'border text-[#B11226]' : ''}
                                                            ${isSun && !disabled ? 'text-red-300' : ''}
                                                        `}
                                                        style={isSel ? { background: '#B11226', borderColor: '#B11226' } : (isTdy && !isSel ? { borderColor: 'rgba(177,18,38,0.3)' } : {})}
                                                    >
                                                        {d.day}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <p className="text-[10px] text-slate-400 text-center mt-2">Sundays unavailable · Mon–Sat only</p>
                                    </div>

                                    {/* Time Slots */}
                                    <div className="p-6 md:p-8 bg-slate-50/50 flex flex-col">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-5">
                                            <Clock className="w-5 h-5" style={{ color: '#B11226' }} />
                                            {selectedDate
                                                ? `Slots for ${selectedDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`
                                                : 'Available Slots'}
                                        </h3>

                                        {!selectedDate ? (
                                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center px-6 py-12">
                                                <CalendarIcon className="w-10 h-10 mb-3 opacity-20" />
                                                <p className="text-sm">Pick a date to see available time slots</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2.5 flex-1">
                                                {TIME_SLOTS.map(time => (
                                                    <button
                                                        key={time}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`py-3 px-3 rounded-xl text-sm font-semibold transition-all border ${selectedTime === time
                                                            ? 'text-white border-transparent shadow-md'
                                                            : 'bg-white border-slate-200 text-slate-600 hover:border-[#B11226]/40 hover:text-[#B11226]'
                                                            }`}
                                                        style={selectedTime === time ? { background: '#B11226', boxShadow: '0 4px 12px rgba(177,18,38,0.2)' } : {}}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-6">
                                            <button
                                                disabled={!selectedDate || !selectedTime}
                                                onClick={() => setStep(2)}
                                                className={`w-full py-4 rounded-xl font-bold text-base transition-all ${selectedDate && selectedTime
                                                    ? 'text-white hover:-translate-y-0.5 hover:shadow-lg'
                                                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                                    }`}
                                                style={(selectedDate && selectedTime) ? {
                                                    background: 'linear-gradient(135deg,#B11226,#8B0D1C)',
                                                    boxShadow: '0 4px 16px rgba(177,18,38,0.25)'
                                                } : {}}
                                            >
                                                Confirm Slot →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── Step 2: Operator Details ─── */}
                        {step === 2 && (
                            <motion.div key="step2"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-12 max-w-2xl mx-auto"
                            >
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors mb-8 text-sm font-medium"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Calendar
                                </button>

                                {/* Selected slot summary */}
                                <div className="mb-8 p-4 rounded-2xl flex items-center gap-4 border" style={{ background: 'rgba(177,18,38,0.04)', borderColor: 'rgba(177,18,38,0.12)' }}>
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: 'rgba(177,18,38,0.08)' }}>
                                        <CalendarIcon className="w-5 h-5" style={{ color: '#B11226' }} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Your Selected Slot</div>
                                        <div className="font-bold text-slate-900">
                                            {selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })} · {selectedTime}
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name *</label>
                                            <input required type="text" placeholder="Enter your name"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#B11226]/20 focus:border-[#B11226] outline-none transition-all bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone *</label>
                                            <input required type="tel" inputMode="numeric" placeholder="Enter your phone number"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#B11226]/20 focus:border-[#B11226] outline-none transition-all bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Work Email *</label>
                                        <input required type="email" placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#B11226]/20 focus:border-[#B11226] outline-none transition-all bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                                                <Building2 className="w-3.5 h-3.5" /> Company / PG Name
                                            </label>
                                            <input type="text" placeholder="Enter your company name"
                                                value={formData.company}
                                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#B11226]/20 focus:border-[#B11226] outline-none transition-all bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5" /> No. of Beds / Units
                                            </label>
                                            <select
                                                value={formData.units}
                                                onChange={e => setFormData({ ...formData, units: e.target.value })}
                                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#B11226]/20 focus:border-[#B11226] outline-none transition-all bg-slate-50/50 text-slate-700"
                                            >
                                                <option value="">Select range</option>
                                                <option value="1-10">1 – 10 beds</option>
                                                <option value="11-30">11 – 30 beds</option>
                                                <option value="31-80">31 – 80 beds</option>
                                                <option value="80+">80+ beds</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full py-4 rounded-xl font-bold text-base transition-all mt-2 flex items-center justify-center gap-2 ${loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-white hover:-translate-y-0.5 hover:shadow-lg'
                                            }`}
                                        style={!loading ? {
                                            background: 'linear-gradient(135deg,#B11226,#8B0D1C)',
                                            boxShadow: '0 4px 16px rgba(177,18,38,0.25)'
                                        } : {}}
                                    >
                                        {loading ? 'Scheduling...' : '🔒 Confirm & Schedule Demo'}
                                    </button>
                                    <p className="text-center text-xs text-slate-400">
                                        No spam · You'll receive a confirmation on WhatsApp & email
                                    </p>
                                </form>
                            </motion.div>
                        )}

                        {/* ─── Step 3: Confirmation ─── */}
                        {step === 3 && (
                            <motion.div key="step3"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="max-w-2xl mx-auto"
                            >
                                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-14 text-center">
                                    {/* Icon */}
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
                                        style={{ background: 'rgba(16,185,129,0.1)' }}>
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                    </div>

                                    <div className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 text-emerald-600 bg-emerald-50 border border-emerald-100">
                                        Demo Scheduled
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3"
                                        style={{ fontFamily: "'Playfair Display', serif" }}>
                                        You're All Set, {formData.name.split(' ')[0]}! 🎉
                                    </h2>
                                    <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                                        A confirmation has been sent to <strong className="text-slate-700">{formData.email}</strong>.<br />
                                        Our growth advisor will join the call — be ready to take notes!
                                    </p>

                                    {/* Booking details card */}
                                    <div className="rounded-2xl border border-slate-100 p-6 mb-8 text-left space-y-3 bg-slate-50">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Booking ID</span>
                                            <span className="font-mono font-bold text-slate-900">{bookingId}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">📅 Date</span>
                                            <span className="font-semibold text-slate-900">
                                                {selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">🕒 Time</span>
                                            <span className="font-semibold text-slate-900">{selectedTime} IST</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">📍 Format</span>
                                            <span className="font-semibold text-slate-900">Google Meet (link sent to email)</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-3">
                                        <a
                                            href={getGoogleCalendarLink()}
                                            target="_blank" rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-700"
                                        >
                                            <CalendarIcon className="w-4 h-4" />
                                            Add to Google Calendar
                                        </a>
                                        <Link to="/">
                                            <button className="w-full py-3.5 rounded-xl font-semibold text-sm text-slate-400 hover:text-slate-600 transition-colors">
                                                Return to Homepage
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Urgent fallback */}
                                <div className="mt-6 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                    <p className="text-center text-sm font-semibold text-slate-600 mb-4">📞 Need to reach us sooner?</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <a href="tel:+918150099911"
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all">
                                            <Phone className="w-4 h-4" style={{ color: '#B11226' }} />
                                            Call Now
                                        </a>
                                        <a href="https://wa.me/918150099911?text=Hi, I just scheduled a demo on MakeMyStay.ai"
                                            target="_blank" rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-all">
                                            <MessageCircle className="w-4 h-4" />
                                            WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
}
