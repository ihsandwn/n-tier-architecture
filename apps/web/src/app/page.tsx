'use client';

import LandingNavbar from '@/components/landing/landing-navbar';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import Pricing from '@/components/landing/pricing';
import Campaigns from '@/components/landing/campaigns';
import Contact from '@/components/landing/contact';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <main className="flex-grow bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans selection:bg-blue-500 selection:text-white">
        <Hero />
        <Features />
        <Campaigns />
        <Pricing />
        <Contact />
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 OmniLogistics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
