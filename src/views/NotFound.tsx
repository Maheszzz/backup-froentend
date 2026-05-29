'use client';

import { Link } from '@/lib/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center py-12 text-center w-full px-4 mt-20">
                <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center">
                    <div className="text-6xl mb-4">🏠</div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Page Not Found</h1>
                    <p className="text-slate-500 mb-8">
                        The page or property you are looking for doesn't exist, or the link may be broken.
                    </p>
                    <Link to="/properties">
                        <Button variant="primary" className="px-8">View All Properties</Button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
