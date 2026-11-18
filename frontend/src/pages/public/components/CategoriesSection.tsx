import React from 'react';
import { CATEGORIES } from '../../../constants';
import { ComplaintCategory } from '../../../types';
import { Construction, Droplets, Trash2, Lightbulb, Waves, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CategoriesSection: React.FC = () => {
  const getIcon = (cat: ComplaintCategory) => {
    switch (cat) {
      case 'roads_potholes':
        return <Construction className="w-5 h-5 text-[#B7791F]" />;
      case 'water_supply':
        return <Droplets className="w-5 h-5 text-[#2563EB]" />;
      case 'garbage_management':
        return <Trash2 className="w-5 h-5 text-[#23845B]" />;
      case 'streetlights':
        return <Lightbulb className="w-5 h-5 text-[#B7791F]" />;
      case 'drainage':
        return <Waves className="w-5 h-5 text-[#3B8278]" />;
      case 'public_infrastructure':
        return <Building2 className="w-5 h-5 text-[#183B3A] dark:text-[#96BCB9]" />;
    }
  };

  const categoryKeys = Object.keys(CATEGORIES) as ComplaintCategory[];

  return (
    <section id="categories" className="py-20 bg-[#FAFAF7] dark:bg-[#0B1320] border-b border-[#E5E8E4] dark:border-[#22344D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#183B3A]/[0.06] dark:bg-white/[0.08] text-[#183B3A] dark:text-[#96BCB9] text-xs font-bold tracking-widest uppercase mb-3 font-heading">
              Service Directory
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#183B3A] dark:text-white font-heading">
              Public Service Categories
            </h2>
            <p className="mt-3 text-base text-[#66736F] dark:text-slate-400 max-w-xl">
              Incidents are automatically routed to the designated municipal engineering authority for formal inspection.
            </p>
          </div>
          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] pb-1 self-start md:self-auto"
          >
            File custom public inquiry
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Structured Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryKeys.map((key) => {
            const cat = CATEGORIES[key];
            return (
              <div
                key={key}
                className="rounded-lg p-5 border border-[#E5E8E4] dark:border-[#22344D] bg-white dark:bg-[#131E30] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="w-9 h-9 rounded-md flex items-center justify-center bg-[#FAFAF7] dark:bg-[#0E1624] border border-[#E5E8E4] dark:border-[#22344D]">
                      {getIcon(key)}
                    </div>
                    <h3 className="text-base font-bold text-[#183B3A] dark:text-white font-heading">
                      {cat.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#66736F] dark:text-slate-400 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E8E4] dark:border-[#22344D] flex items-center justify-between text-xs">
                  <span className="text-[#66736F] dark:text-slate-500 font-medium">Jurisdiction:</span>
                  <span className="font-semibold text-[#183B3A] dark:text-slate-300 truncate max-w-[200px]">
                    {cat.department}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
