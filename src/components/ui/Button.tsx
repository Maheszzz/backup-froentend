import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'dark' | 'gold';
    icon?: typeof ArrowRight;
}

export function Button({ children, variant = 'primary', className = '', icon: Icon, ...props }: ButtonProps) {
    const baseStyles = "px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2";

    const variants = {
        primary: "bg-gradient-to-r from-brand-red to-orange-500 text-white font-semibold shadow-glow hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] active:scale-95",
        secondary: "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm",
        outline: "border-2 border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600",
        ghost: "text-slate-600 hover:bg-slate-100",
        dark: "bg-brand-navy text-white hover:bg-brand-dark shadow-glass border border-white/10",
        link: "text-emerald-600 hover:underline p-0 h-auto",
        gold: "bg-brand-gold text-white hover:bg-yellow-600 shadow-glow hover:shadow-[0_0_20px_rgba(197,160,33,0.5)]"
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            {children}
            {/* If icon is passed but not intended as left icon (logic adjustment needed if rigorous, but for now simple) */}
        </button>
    );
}
