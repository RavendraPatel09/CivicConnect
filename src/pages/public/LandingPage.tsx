import React, { useEffect } from 'react';
import PublicNavbar from '../../components/navigation/PublicNavbar';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import CategoriesSection from './components/CategoriesSection';
import LiveExplorerSection from './components/LiveExplorerSection';
import TransparencySection from './components/TransparencySection';
import CtaSection from './components/CtaSection';
import FooterSection from './components/FooterSection';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    document.title = 'CivicConnect AI — Your City. Your Voice. Real Action.';
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FA] dark:bg-[#0B1320] text-[#172B3A] dark:text-[#F1F5F9]">
      <PublicNavbar />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorksSection />
        <CategoriesSection />
        <LiveExplorerSection />
        <TransparencySection />
        <CtaSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default LandingPage;
