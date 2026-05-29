import React, { useState, useEffect } from 'react';
import { X, Send, Phone, Calendar, ClipboardCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { contactApi } from '@/lib/api/contacts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    source: string;
    actionLabel?: string;
    propertyTitle?: string;
    propertyLocation?: string;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    source,
    actionLabel = "Submit Request",
    propertyTitle,
    propertyLocation
}) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Reset status when opening
            setStatus('idle');
            setErrorMsg('');
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (formData.phone.length < 10) {
            setErrorMsg('Please enter a valid 10-digit phone number');
            setStatus('error');
            return;
        }

        setStatus('loading');
        try {
            const contextMsg = propertyTitle 
                ? `Inquiry for ${propertyTitle} in ${propertyLocation || 'N/A'}. ${formData.message}`
                : formData.message;

            await contactApi.submitContactForm({
                name: formData.name,
                phone: formData.phone,
                email: formData.email || 'web@makemystay.ai',
                message: contextMsg || `Automated request from ${source}`,
                source: source,
                location: propertyLocation,
                property_type: 'Inquiry'
            });

            setStatus('success');
            setTimeout(() => {
                onClose();
                // Reset form after closing
                setFormData({ name: '', phone: '', email: '', message: '' });
            }, 3000);
        } catch (err: any) {
            console.error('Lead submission failed:', err);
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 transform transition-all duration-500 scale-100 opacity-100">
                {/* Top Design Element */}
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-red via-red-500 to-orange-500" />
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 sm:p-10">
                    {status === 'success' ? (
                        <div className="py-10 text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                                <ClipboardCheck className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received!</h3>
                            <p className="text-slate-500">Our team will contact you within 4 business hours to finalize the details.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/5 text-brand-red text-xs font-bold uppercase tracking-wider mb-4 border border-brand-red/10">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Instant Confirmation</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                                    {title}
                                </h2>
                                <p className="text-slate-500 text-sm sm:text-base">
                                    {subtitle}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="modal-name" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        id="modal-name" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="modal-phone" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold border-r border-slate-200 pr-3 mr-3">
                                            +91
                                        </div>
                                        <input 
                                            type="tel" 
                                            id="modal-phone" 
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                                            className="w-full pl-16 pr-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-red focus:bg-white transition-all outline-none text-slate-900 font-medium tracking-wider"
                                            placeholder="Enter Your Mobile Number "
                                        />
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <p className="text-red-500 text-xs font-bold ml-1 animate-pulse">{errorMsg}</p>
                                )}

                                <div className="pt-4">
                                    <Button 
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full py-4 text-base font-extrabold rounded-2xl bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-brand-red shadow-xl shadow-brand-red/20 hover:shadow-brand-red/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] border-0 text-white flex items-center justify-center gap-2"
                                    >
                                        {status === 'loading' ? (
                                            <LoadingSpinner size={20} className="text-white" />
                                        ) : (
                                            <>
                                                <span>{actionLabel}</span>
                                                <Send className="w-4 h-4 ml-1" />
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">
                                        🔒 Your data is secure · No spam ever
                                    </p>
                                </div>
                            </form>
                        </>
                    )}
                </div>

                {/* Bottom Trust Row */}
                <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-around">
                    <div className="flex flex-col items-center gap-1">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Fast Call</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div className="flex flex-col items-center gap-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Daily Slots</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div className="flex flex-col items-center gap-1">
                        <ClipboardCheck className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Verified</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
