import React from 'react';
import { CATEGORIES } from '../../../constants';
import { ComplaintCategory } from '../../../types';
import { Construction, Droplets, Trash2, Lightbulb, Waves, Building2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CategoriesSection: React.FC = () => {
  const getIcon = (cat: ComplaintCategory) => {
    switch (cat) {
      case 'roads_potholes':
        return <Construction className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'water_supply':
        return <Droplets className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
      case 'garbage_management':
        return <Trash2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'streetlights':
        return <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />;
      case 'drainage':
        return <Waves className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
      case 'public_infrastructure':
        return <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const categoryKeys = Object.keys(CATEGORIES) as ComplaintCategory[];

  return (
    <section id="categories" className="py-20 bg-white dark:bg-[#0B1320]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-civic tracking-wider uppercase bg-civic/10 dark:bg-civic/20 px-3 py-1 rounded-full">
              Municipal Coverage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142B45] dark:text-white mt-3">
              Civic Issue Categories
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Each problem is matched directly with specialized municipal engineering departments
              for rapid inspection and repair.
            </p>
          </div>
          <Link
            to="/report"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-civic hover:text-blue-700 dark:hover:text-blue-400"
          >
            Submit an unlisted issue
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryKeys.map((key) => {
            const cat = CATEGORIES[key];
            return (
              <div
                key={key}
                className="rounded-2xl p-6 border border-slate-200/90 dark:border-[#22344D] bg-white dark:bg-[#131E30] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 hover:-translate-y-1 shadow-2xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-slate-50 dark:bg-[#0E1726] border border-slate-200/60 dark:border-slate-800">
                    {getIcon(key)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Assigned:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
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
