import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  CircleDot,
  ShieldAlert,
  Layers,
  CornerUpRight,
  GitFork,
  Minimize2,
  Disc,
  Sliders,
  Octagon,
  Cpu,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  CircleDot,
  ShieldAlert,
  Layers,
  CornerUpRight,
  GitFork,
  Minimize2,
  Disc,
  Sliders,
  Octagon,
  Cpu,
};

export const CategoryGrid: React.FC = () => {
  const { categories, setFilters, navigateTo, t, language, isRtl } = useApp();

  const handleSelectCategory = (categorySlug: string) => {
    setFilters((prev) => ({ ...prev, category: categorySlug }));
    navigateTo('shop');
  };

  return (
    <section id="categories-section" className="py-16 md:py-24 bg-[#080D1A] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-2">
              ENGINEERED WATER INFRASTRUCTURE CLASSIFICATIONS
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-['Chakra_Petch'] text-white">
              {t('categoriesHeading')}
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mt-2 font-sans">
              {t('categoriesSubheading')}
            </p>
          </div>

          <button
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-semibold group self-start md:self-auto"
          >
            <span>{t('heroBrowseBtn')}</span>
            {isRtl ? (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>

        {/* 10 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            const IconComponent = iconMap[cat.iconName] || Layers;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.slug)}
                className="group relative p-5 rounded-xl bg-gradient-to-b from-slate-900/90 to-[#0A1224] border border-slate-800 hover:border-cyan-400/80 shadow-lg hover:shadow-cyan-900/20 text-left transition-all hover:-translate-y-1 focus:outline-none focus:ring-1 focus:ring-cyan-400 flex flex-col justify-between"
              >
                {/* Metallic Top Accent Bar */}
                <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-950/70 border border-blue-600/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-950 group-hover:border-cyan-400 transition-colors">
                      <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[11px] font-mono text-cyan-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900/60 font-semibold">
                      {cat.count} {t('itemsCount')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 font-['Chakra_Petch'] leading-snug mb-2 transition-colors">
                    {language === 'ar' ? cat.nameAr : cat.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans mb-4">
                    {language === 'ar' ? cat.descriptionAr : cat.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-medium group-hover:underline pt-2 border-t border-slate-800/80">
                  <span>{t('viewCategory')}</span>
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
