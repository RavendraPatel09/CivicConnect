import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../../components/ui/Button';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#142B45] via-[#10243C] to-[#0A1828] text-white">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-civic/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold uppercase tracking-wider text-teal-300 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Empowered Municipal Collaboration
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          Better Communities Start With Your Voice.
        </h2>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
          Join thousands of proactive citizens and city engineers collaborating every day to resolve potholes, restore streetlights, and maintain resilient public infrastructure.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/report" className="w-full sm:w-auto">
            <Button
              variant="civic"
              size="lg"
              className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Report a Civic Issue
            </Button>
          </Link>
          <Link to="/register" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              Create Free Account
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          No civic fees • Open public audits • Accessible on any mobile browser
        </p>
      </div>
    </section>
  );
};

export default CtaSection;
