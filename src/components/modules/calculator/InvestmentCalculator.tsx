"use client";

import { useState } from 'react';


export function InvestmentCalculator() {
    const [price, setPrice] = useState<string | number>(500000);
    const [downPayment, setDownPayment] = useState<string | number>(20);
    const [rate, setRate] = useState<string | number>(6.5);
    const [term, setTerm] = useState<string | number>(30);

    const calculatePayment = () => {
        const numPrice = Number(price);
        const numDownPayment = Number(downPayment);
        const numRate = Number(rate);
        const numTerm = Number(term);

        const principal = numPrice * (1 - numDownPayment / 100);
        const monthlyRate = numRate / 100 / 12;
        const months = numTerm * 12;

        if (months === 0) return 0;
        if (numRate === 0) return principal / months;

        return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    };

    const monthlyPayment = calculatePayment();
    const numPrice = Number(price);
    const numDownPayment = Number(downPayment);
    const numTerm = Number(term);

    const totalPayment = monthlyPayment * numTerm * 12;
    const totalInterest = totalPayment - (numPrice * (1 - numDownPayment / 100));

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    {/* Left: Inputs */}
                    <div>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Investment Calculator</h2>
                                <p className="text-slate-500">Calculate your monthly mortgage payments</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Property Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Down Payment (%)</label>
                                <input
                                    type="number"
                                    value={downPayment}
                                    onChange={(e) => setDownPayment(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition-colors mb-2"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={downPayment === '' ? 0 : downPayment}
                                    onChange={(e) => setDownPayment(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Interest Rate (%)</label>
                                <input
                                    type="number"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Loan Term (Years)</label>
                                <input
                                    type="number"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Results */}
                    <div>
                        <div className="bg-[#1e3a8a] text-white rounded-3xl p-8 mb-8 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="text-blue-100 text-sm mb-1">Estimated Monthly Payment</div>
                                <div className="text-5xl font-bold mb-8">₹{monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <div className="text-blue-200 text-sm mb-1">Total Payment</div>
                                        <div className="text-xl font-bold">₹{totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                    </div>
                                    <div>
                                        <div className="text-blue-200 text-sm mb-1">Total Interest</div>
                                        <div className="text-xl font-bold">₹{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pl-4">
                            {[
                                { title: "Pre-Approved Rates", desc: "Get the best rates available" },
                                { title: "Secure Process", desc: "Your data is protected" },
                                { title: "Quick Approval", desc: "Get approved in 24 hours" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full border border-emerald-500 text-emerald-500 flex items-center justify-center mt-0.5 mr-4">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                                        <div className="text-slate-500 text-xs">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
