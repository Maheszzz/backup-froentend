"use client";

import { useState, useEffect } from 'react';
import { solutionFeatures } from '@/data/content';
import { CheckCircle2 } from 'lucide-react';

export function Solution() {
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 4);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="solution" className="py-14 md:py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-brand-red font-semibold tracking-wide uppercase text-sm">Our Solution</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-2">Full-Stack AI Growth Engine</h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                    {/* Features Menu */}
                    <div className="lg:w-1/3 flex flex-row lg:flex-col gap-3 lg:gap-4 overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory scrollbar-hide">
                        {solutionFeatures.map((feature, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveFeature(idx)}
                                className={`text-left p-4 lg:p-6 rounded-2xl transition-all duration-300 border flex-shrink-0 w-[240px] lg:w-auto snap-start ${activeFeature === idx
                                    ? 'bg-slate-50 border-brand-red/20 shadow-md lg:scale-105'
                                    : 'bg-white border-slate-100 lg:border-transparent hover:bg-slate-50'
                                    }`}
                            >
                                <h3 className={`text-lg font-bold mb-1 ${activeFeature === idx ? 'text-brand-red' : 'text-slate-500'}`}>
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate-500">{feature.desc}</p>
                            </button>
                        ))}
                    </div>

                    {/* Feature Display */}
                    <div className="lg:w-2/3">
                        <div className="relative h-full min-h-[320px] md:min-h-[400px] bg-brand-charcoal rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                            {/* Decorative Pattern */}
                            <div className="absolute inset-0 bg-diagonal-grid opacity-10 pointer-events-none"></div>
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-red/20 rounded-full blur-3xl opacity-50"></div>

                            <div className="relative p-6 md:p-12 h-full flex flex-col justify-center">
                                <div className="transition-all duration-500">
                                    {solutionFeatures.map((item, idx) => (
                                        activeFeature === idx && (
                                            <div key={idx} className="animate-in fade-in slide-in-from-right-8 duration-500">
                                                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10 shadow-glow">
                                                    <item.icon className="w-8 h-8 text-brand-red" />
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">{item.title}</h3>
                                                <p className="text-base md:text-lg text-slate-300 mb-6 md:mb-8 leading-relaxed max-w-xl">{item.text}</p>
                                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-red/10 text-brand-red border border-brand-red/20 text-sm font-bold">
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    {item.stats}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
