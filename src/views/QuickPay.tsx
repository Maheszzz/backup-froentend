'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { paymentApi } from '@/lib/api';
import { Shield, Lock, CheckCircle2, CreditCard, Smartphone, User, Phone, FileText, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { PaymentSuccessModal } from '@/components/modals/PaymentSuccessModal';
import { brandLogoUrl } from '@/lib/brand';
import { getRazorpayKeyId } from '@/lib/env';
import { SafetyPopup } from '@/components/modals/SafetyPopup';
export default function QuickPay() {
    const [amount, setAmount] = useState<string>('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [successData, setSuccessData] = useState<{
        isOpen: boolean; paymentId: string; amount: number; receiptUrl: string;
    }>({
        isOpen: false, paymentId: '', amount: 0, receiptUrl: ''
    });
    const [isSafetyPopupOpen, setIsSafetyPopupOpen] = useState(false);

    useEffect(() => {
        // Show safety popup on quick pay load if not shown in this session
        const hasShownQuickPaySafety = sessionStorage.getItem('hasShownQuickPaySafety');
        if (!hasShownQuickPaySafety) {
            setIsSafetyPopupOpen(true);
            sessionStorage.setItem('hasShownQuickPaySafety', 'true');
        }
    }, []);

    // Load Razorpay Script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        const amountNum = parseFloat(amount);
        if (!amount || isNaN(amountNum) || amountNum <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        if (!name || !phone) {
            alert("Please enter both name and phone number.");
            return;
        }

        try {
            setIsProcessing(true);

            // 1. Load Razorpay SDK
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert("Razorpay SDK failed to load. Are you online?");
                setIsProcessing(false);
                return;
            }

            // 2. Create Order
            const order = await paymentApi.createOrder({
                amount: amountNum * 100, // Convert to paise
                currency: "INR",
                payment_type: "manual",
                payer_name: name,
                payer_email: "quickpay@makemystay.ai",
                payer_phone: phone
            });

            // 3. Resolve Razorpay Key (prefer server response, fallback to build env)
            const key = order.razorpay_key || getRazorpayKeyId();
            if (!key) {
                alert("Error: Razorpay key is missing. Please set RAZORPAY_KEY_ID or NEXT_PUBLIC_RAZORPAY_KEY_ID in your deployment environment variables.");
                setIsProcessing(false);
                return;
            }

            // 4. Open Razorpay Checkout
            const options = {
                key: key,
                amount: order.amount,
                currency: order.currency,
                name: "MakeMyStay",
                description: description || `Quick Pay - ${name}`,
                image: brandLogoUrl(),
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        // 4. Verify Payment
                        const verification = await paymentApi.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        // Success!
                        const pId = verification.payment_id || response.razorpay_payment_id;
                        setSuccessData({
                            isOpen: true,
                            paymentId: pId,
                            amount: amountNum,
                            receiptUrl: paymentApi.getReceiptUrl(pId)
                        });

                        // Reset form
                        setAmount('');
                        setName('');
                        setPhone('');
                        setDescription('');
                    } catch (error: any) {
                        console.error("Payment Verification Failed", error);
                        const msg = error?.message || "Verification failed";
                        alert(`Payment verification failed: ${msg}`);
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: name,
                    contact: phone
                },
                theme: {
                    color: "#C5A021"
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert(`Payment Failed: ${response.error.description}`);
                setIsProcessing(false);
            });
            rzp.open();

        } catch (error: any) {
            console.error("Payment Error:", error);
            const msg = error?.message || "Unknown error";
            alert(`Payment Initialization Failed: ${msg}`);
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-4 md:p-8 pt-24 md:pt-32 pb-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden grid md:grid-cols-5 border border-slate-100"
                >

                    {/* Left Panel - Visual Side */}
                    <div className="hidden md:flex md:col-span-2 bg-slate-950 relative p-8 md:p-12 flex-col justify-between overflow-hidden">
                        {/* Premium Gradient Background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,33,0.15),transparent_70%)]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(197,160,33,0.05),transparent_70%)]"></div>
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

                        <div className="relative z-10">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                    <span className="text-white">MakeMyStay</span>
                                    <span className="text-brand-gold">.ai</span>
                                </h2>
                                <div className="h-1 w-12 bg-brand-gold rounded-full mb-4"></div>
                                <p className="text-white/80 text-lg font-light mb-1">Premium Property Payments</p>
                                <p className="text-white/40 text-sm leading-relaxed max-w-xs">Fast, secure payments for bookings, deposits &amp; professional services.</p>
                            </motion.div>
                        </div>

                        {/* 3D Layered Cards Visual */}
                        <div className="relative z-10 my-12 transform perspective-1000">
                            <motion.div
                                animate={{ 
                                    y: [0, -10, 0],
                                    rotateX: [0, 2, 0],
                                    rotateY: [0, 5, 0]
                                }}
                                transition={{ 
                                    duration: 6, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                                className="relative"
                            >
                                {/* Card 3 - Background */}
                                <div className="absolute top-0 left-4 right-4 h-48 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md rounded-2xl border border-white/10 transform -rotate-6 translate-y-8 shadow-2xl"></div>

                                {/* Card 2 - Middle */}
                                <div className="absolute top-0 left-2 right-2 h-48 bg-gradient-to-br from-brand-gold/10 to-transparent backdrop-blur-md rounded-2xl border border-brand-gold/20 transform -rotate-3 translate-y-4 shadow-2xl"></div>

                                {/* Main Card */}
                                <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-2xl border border-white/20 p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    
                                    <div className="flex justify-between items-start mb-12">
                                        <div className="w-14 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                                            <CreditCard className="w-7 h-7 text-white/40" />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <Shield className="w-7 h-7 text-brand-gold mb-1" />
                                            <span className="text-[10px] text-brand-gold uppercase tracking-tighter font-bold">Secure</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4 mb-10">
                                        <div className="h-2.5 w-3/4 bg-white/20 rounded-full"></div>
                                        <div className="h-2.5 w-1/2 bg-white/10 rounded-full"></div>
                                    </div>
                                    
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-xs text-white/30 uppercase tracking-widest mb-1 font-medium">Card Number</div>
                                            <div className="text-lg font-mono tracking-[0.2em] text-white/90">•••• •••• •••• 4242</div>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold via-amber-500 to-brand-gold p-[1px]">
                                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                                <Zap className="w-6 h-6 text-brand-gold fill-brand-gold/20" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="relative z-10 space-y-4">
                            {[
                                "SSL Encrypted Transaction",
                                "Instant Payment Confirmation",
                                "256-bit Encryption · Razorpay Secured",
                                "Instant receipt via SMS"
                            ].map((text, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (idx * 0.1) }}
                                    className="flex items-center gap-4 text-sm text-white/60 hover:text-white/90 transition-colors cursor-default group"
                                >
                                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-brand-gold/10 group-hover:border-brand-gold/30 transition-all">
                                        {idx === 3 ? <Zap className="w-4 h-4 text-brand-gold" /> : <CheckCircle2 className="w-4 h-4 text-brand-gold" />}
                                    </div>
                                    <span className="font-light">{text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="md:col-span-3 p-6 md:p-12 bg-white flex flex-col justify-center">
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-2">
                                <h1 className="text-3xl md:text-5xl font-bold text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                    Payment Details
                                </h1>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100"
                                >
                                    <Shield className="w-4 h-4 text-emerald-600" />
                                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">SSL Secured</span>
                                </motion.div>
                            </div>
                            <p className="text-slate-400 text-base font-light">Complete your secure transaction in seconds</p>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-6">

                            {/* 1. Payment Amount */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-3"
                            >
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                    Payment Amount
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                                        <span className="text-slate-400 font-medium text-2xl group-focus-within:text-brand-gold transition-colors mr-1">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full pl-12 pr-6 py-5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-gold/10 focus:border-brand-gold outline-none transition-all text-3xl font-bold text-slate-900 placeholder:text-slate-200 placeholder:font-normal shadow-sm"
                                        placeholder="0.00"
                                        required
                                        min="1"
                                        step="1"
                                        inputMode="numeric"
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                        <div className="px-2 py-1 bg-brand-gold/10 rounded-md text-[10px] font-bold text-brand-gold uppercase tracking-widest">INR</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium ml-1">
                                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                    <span>Enter the exact amount for booking, deposit or rent</span>
                                </div>
                            </motion.div>

                            {/* 2. Purpose / Reference */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-3"
                            >
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                    Purpose / Reference <span className="text-slate-300 lowercase font-normal italic">(Optional)</span>
                                </label>
                                <div className="relative group">
                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-gold transition-colors" />
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-gold/10 focus:border-brand-gold outline-none transition-all text-slate-700 placeholder:text-slate-300 text-sm"
                                        placeholder="e.g., Booking Fee for Villa 402"
                                    />
                                </div>
                            </motion.div>

                            {/* 3. Name and Phone - Side by Side */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                        Full Name
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-gold transition-colors" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-gold/10 focus:border-brand-gold outline-none transition-all text-slate-700 placeholder:text-slate-300 text-sm"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                        Phone Number
                                    </label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-gold transition-colors" />
                                        <input
                                            type="tel"
                                            inputMode="numeric"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-gold/10 focus:border-brand-gold outline-none transition-all text-slate-700 placeholder:text-slate-300 text-sm"
                                            placeholder="98765 43210"
                                            required
                                            maxLength={10}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="pt-4"
                            >
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        type="submit"
                                        variant="gold"
                                        className="w-full py-5 text-lg font-bold shadow-[0_15px_30px_-10px_rgba(197,160,33,0.4)] rounded-2xl transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
                                        disabled={isProcessing}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer"></div>
                                        {isProcessing ? (
                                            <>
                                                <LoadingSpinner size={20} className="text-white" />
                                                <span>Processing Securely...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                <span>
                                                    {amount && parseFloat(amount) > 0
                                                        ? `Pay ₹${Number(amount).toLocaleString('en-IN')} Now`
                                                        : 'Proceed to Payment'}
                                                </span>
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                                <div className="mt-4 flex items-center justify-center gap-2 text-slate-400">
                                    <Shield className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[10px] font-medium tracking-wide uppercase">Your payment data is fully encrypted</span>
                                </div>
                            </motion.div>

                            {/* Trust Indicators */}
                            <div className="pt-8 mt-4 border-t border-slate-100/80">
                                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                                    {[
                                        { icon: Shield, label: "Secure Payment" },
                                        { icon: Smartphone, label: "UPI Supported" },
                                        { icon: CreditCard, label: "All Cards" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 group cursor-default">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-gold/10 transition-colors">
                                                <item.icon className="w-4 h-4 text-slate-400 group-hover:text-brand-gold transition-colors" />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </main>

            <Footer />

            {/* Payment Processing Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md text-white animate-in fade-in duration-300">
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand-gold/20 blur-3xl rounded-full animate-pulse"></div>
                        <LoadingSpinner size={64} className="text-white relative z-10 mb-6" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Processing Payment
                    </h3>
                    <p className="text-white/70 text-sm md:text-base">Please complete the transaction on your device</p>
                    <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                        <Lock className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs text-white/90">Secure SSL Connection</span>
                    </div>
                </div>
            )}

            <PaymentSuccessModal
                isOpen={successData.isOpen}
                onClose={() => setSuccessData(prev => ({ ...prev, isOpen: false }))}
                paymentId={successData.paymentId}
                amount={successData.amount}
                receiptUrl={successData.receiptUrl}
            />

            <SafetyPopup 
                isOpen={isSafetyPopupOpen} 
                onClose={() => setIsSafetyPopupOpen(false)} 
            />
        </div>
    );
}
