import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlusCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#183B3A] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 text-white/90 text-xs font-bold tracking-widest uppercase mb-5 font-heading">
          Civic Collaboration
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading leading-tight">
          Better Communities Start With Your Voice.
        </h2>

        <p className="mt-4 text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
          Report civic problems, monitor municipal repair progress, and help build responsive public infrastructure for your neighborhood.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/report" className="w-full sm:w-auto">
            <Button
              variant="civic"
              size="lg"
              className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Report a Civic Issue
            </Button>
          </Link>
          <Link to="/register" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
            >
              Create Account
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-xs text-white/60">
          Open municipal service • No fees required • Verified audit history
        </p>
      </div>
    </section>
  );
};

export default CtaSection;
