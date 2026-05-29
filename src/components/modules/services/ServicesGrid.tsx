import { ArrowRight, Building2, Wallet, Users, BarChart3 } from 'lucide-react';
import { Link } from '@/lib/navigation';

const services = [
    {
        id: 'property-management',
        title: 'Property Management',
        desc: 'Full-service operations & maintenance oversight',
        icon: Building2,
    },
    {
        id: 'revenue-optimization',
        title: 'Revenue Optimization',
        desc: 'Dynamic pricing powered by real-time market data',
        icon: Wallet,
    },
    {
        id: 'tenant-acquisition',
        title: 'Tenant Acquisition',
        desc: 'Verified tenant sourcing & seamless onboarding',
        icon: Users,
    },
    {
        id: 'market-intelligence',
        title: 'Market Intelligence',
        desc: 'Advanced rental insights & performance analytics',
        icon: BarChart3,
    },
];

const stats = [
    { value: '500+', label: 'Properties Managed' },
    { value: '95%', label: 'Occupancy Rate' },
    { value: '2,000+', label: 'Tenants Served' },
    { value: '4.8★', label: 'Avg. Rating' },
];

export function ServicesGrid() {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="relative group rounded-[20px] p-6 overflow-hidden"
                        style={{
                            background: '#F7F8FA',
                            border: '1px solid rgba(0,0,0,0.06)',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                        }}
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                                style={{ background: 'rgba(197,160,33,0.10)' }}
                            >
                                <service.icon className="w-6 h-6" style={{ color: '#B11226' }} />
                            </div>

                            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#B11226]">
                                {service.title}
                            </h3>

                            <p className="text-slate-600 text-sm leading-relaxed flex-1">{service.desc}</p>

                            <div className="mt-5 flex items-center justify-between">
                                <Link
                                    to={`/services/${service.id}`}
                                    className="flex items-center gap-1.5 text-sm font-semibold"
                                    style={{ color: '#B11226' }}
                                >
                                    Explore Service
                                    <span
                                        className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                                        style={{ background: 'rgba(177,18,38,0.08)' }}
                                    >
                                        <ArrowRight className="w-3.5 h-3.5" style={{ color: '#B11226' }} />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="text-center py-4 px-3 rounded-2xl"
                        style={{ background: '#F7F8FA', border: '1px solid rgba(0,0,0,0.05)' }}
                    >
                        <p className="text-xl font-bold" style={{ color: '#B11226' }}>
                            {stat.value}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            <p className="text-center text-sm text-slate-600 mt-6">
                Trusted by property owners across Bangalore.
            </p>
        </div>
    );
}
