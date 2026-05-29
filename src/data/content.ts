import {
    Users, TrendingUp, BarChart3, ShieldCheck, Zap,
    UserCheck, Star, Activity
} from 'lucide-react';

export const navigationLinks = [
    'Home', 'Services', 'About Us', 'Problem', 'Solution'
];

export const heroStats = [
    { label: "Conversion Rate", value: "4x", icon: TrendingUp },
    { label: "Lower CAC", value: "41%", icon: BarChart3 },
    { label: "More Leads", value: "3.2x", icon: Users },
    { label: "NPS Score", value: "87%", icon: Star },
];

export const aboutCards = [
    {
        title: "AI-Native OS",
        desc: "Built from the ground up to automate complex rental operations without human intervention.",
        icon: Activity
    },
    {
        title: "Mission Driven",
        desc: "Committed to eliminating broker commissions and transparency gaps in the rental market.",
        icon: ShieldCheck
    },
    {
        title: "First-Mover Edge",
        desc: "Trained on 100K+ meaningful rental conversations to understand intent perfectly.",
        icon: Zap
    },

];

export const problemCards = [
    {
        title: "High Broker Costs",
        desc: "Operators bleed ₹30-60K per tenant in commissions, killing margins.",
        val: "₹",
        theme: "red"
    },
    {
        title: "Lost Leads",
        desc: "Over 60% of potential tenants are lost due to delayed responses and follow-ups.",
        icon: Users,
        theme: "orange"
    },
    {
        title: "No Intelligence",
        desc: "Zero data ownership means no insights into pricing power or tenant preferences.",
        icon: BarChart3,
        theme: "purple"
    }
];

export const solutionFeatures = [
    {
        icon: TrendingUp,
        title: "Always-On Demand Generation",
        desc: "Multi-channel lead generation",
        text: "We automate listings across 15+ portals and social channels, ensuring your property is visible where it matters. Our AI optimizes ad spend in real-time.",
        stats: "3.2x More Qualified Leads",
        color: "from-emerald-500 to-emerald-600"
    },
    {
        icon: UserCheck,
        title: "24/7 AI Sales Agent",
        desc: "Instant response & qualification",
        text: "Our AI engages leads instantly via WhatsApp and Calls, answering queries, scheduling visits, and following up until conversion.",
        stats: "Zero Wait Time, 100% Response",
        color: "from-blue-500 to-blue-600"
    },
    {
        icon: BarChart3,
        title: "Revenue Intelligence",
        desc: "Dynamic pricing & insights",
        text: "Get real-time insights on market pricing, demand trends, and competitor analysis to maximize your RevPAR (Revenue Per Available Room).",
        stats: "15% Higher Yields",
        color: "from-purple-500 to-purple-600"
    },
    {
        icon: ShieldCheck,
        title: "Full Ownership",
        desc: "Your data, your customers",
        text: "Stop renting your customers from brokers. Build your own brand equity and own your customer data for lifetime value maximization.",
        stats: "100% Data Sovereignty",
        color: "from-orange-500 to-orange-600"
    }
];

export const comparisonData = [
    { label: "Monthly Cost", b: "₹30-60K/tenant", l: "₹5-10K + Comm", c: "₹10-15K", m: "₹3-5K" },
    { label: "Lead Ownership", b: "No", l: "Partial", c: "Yes", m: "Full" },
    { label: "24/7 Availability", b: "Manual", l: "Limited", c: "Manual", m: "AI-Powered" },
    { label: "Rental Intelligence", b: "None", l: "Basic", c: "Limited", m: "AI-Optimized" },
    { label: "Conversion Rate", b: "5-8%", l: "3-5%", c: "8-12%", m: "15-20%" },
    { label: "ROI Timeline", b: "N/A", l: "Unpredictable", c: "6-9 Months", m: "5-10 Days" },
];

export const caseStudyStats = [
    { value: "3.4x", label: "Qualified Leads" },
    { value: "18%", label: "Conversion Rate" },
    { value: "45%", label: "CAC Reduction" },
    { value: "94%", label: "Occupancy" },
];
