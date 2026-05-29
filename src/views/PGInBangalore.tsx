'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPageSEO, pgBangaloreHubSeo } from '@/lib/seo';
import { SITE_NAME } from '@/lib/siteConfig';
import { PropertyGrid } from '@/components/modules/listings/PropertyGrid';
import { motion } from 'framer-motion';
import { MapPin, Shield, Star, Wifi, Coffee, Zap } from 'lucide-react';

export default function PGInBangalore() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the average rent for a PG in Bangalore?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The average rent for a PG in Bangalore ranges from ₹5,000 for shared rooms to ₹18,000 for premium single-occupancy rooms in tech hubs like Whitefield or HSR Layout."
        }
      },
      {
        "@type": "Question",
        "name": "Which areas in Bangalore are best for PGs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Top localities for PGs include HSR Layout, Koramangala, BTM Layout, Marathahalli, Whitefield, and Electronic City due to their proximity to IT offices and vibrant social life."
        }
      },
      {
        "@type": "Question",
        "name": "Are food and WiFi included in the PG rent?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, most professional PGs on ${SITE_NAME} include 3 nutritious meals, high-speed WiFi, laundry services, and power backup as part of the monthly rent.`
        }
      }
    ]
  };

  return (
    <div className="bg-white min-h-screen">
      <SEOHead {...buildPageSEO(pgBangaloreHubSeo())} />
      <JsonLd id="pg-in-bangalore-faq" data={schemaData} />

      <Navbar />

      <main className="pt-24 pb-16">
        {/* AEO Highlight Block */}
        <div className="bg-emerald-50 border-y border-emerald-100 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="bg-emerald-500 text-white p-2 rounded-lg shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <p className="text-emerald-900 text-sm sm:text-base leading-relaxed">
                <strong>Best PG in Bangalore:</strong> {SITE_NAME} offers verified PG accommodations in Bangalore's prime hubs like <strong>Whitefield, Marathahalli, and HSR Layout</strong>. With rent ranging from <strong>₹5,000 to ₹15,000</strong>, our stays include 3 meals, high-speed WiFi, 24/7 security, and power backup.
              </p>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Top-Rated PGs in Bangalore for Gents, Ladies & Unisex Stay
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl">
              Finding a home away from home shouldn't be hard. {SITE_NAME} simplifies your search for the best Paying Guest (PG) in Bangalore with zero brokerage options and fully managed facilities.
            </p>
          </motion.div>

          {/* Quick Stats/Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { icon: Coffee, text: "Home-Style Food" },
              { icon: Wifi, text: "Fiber WiFi" },
              { icon: Shield, text: "24/7 Security" },
              { icon: Zap, text: "No Power Cuts" }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                <item.icon className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-slate-700 text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Dynamic Property Grid filtered for Bangalore PG */}
          <div className="mb-16">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Current Openings in Bangalore</h2>
                <span className="text-emerald-600 font-bold text-sm">Real-time Verified</span>
             </div>
             <PropertyGrid category="pg" searchQuery="" />
          </div>

          {/* Rich SEO Content Section */}
          <div className="prose prose-slate max-w-none grid md:grid-cols-2 gap-12 mt-20">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why choose {SITE_NAME} for your PG in Bangalore?</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We take the guesswork out of PG hunting. Unlike generic listing sites, every property on our platform undergoes a strict verification process. We check for hygiene, security, and the quality of amenities provided.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                  <span><strong>Zero Brokerage:</strong> Connect directly with owners/managers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                  <span><strong>Flexible Stay:</strong> Short-term and long-term stay options available.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                  <span><strong>Vibrant Communities:</strong> Stay with like-minded professionals and students.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Popular Localities for PGs in Bangalore</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Bangalore is a city of neighborhoods. Here are the most sought-after spots:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {['HSR Layout', 'Whitefield', 'Koramangala', 'Electronic City', 'Indiranagar', 'Marathahalli'].map(city => (
                  <div key={city} className="flex items-center gap-2 text-slate-700 font-medium">
                    <MapPin className="w-4 h-4 text-brand-red" />
                    <span>{city}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Internal Linking / Secondary CTA */}
          <div className="mt-20 p-8 bg-brand-red/5 rounded-3xl border border-brand-red/10 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Looking for something else?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/flats-in-bangalore" className="px-6 py-3 bg-white border border-brand-red/20 text-brand-red font-bold rounded-xl hover:bg-brand-red hover:text-white transition-all">Flats in Bangalore</a>
              <a href="/pg-in-hsr-layout" className="px-6 py-3 bg-white border border-brand-red/20 text-brand-red font-bold rounded-xl hover:bg-brand-red hover:text-white transition-all">PG in HSR Layout</a>
              <a href="/pg" className="px-6 py-3 bg-brand-red text-white font-bold rounded-xl shadow-lg shadow-brand-red/20 hover:scale-105 transition-all">All PG Listings</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
