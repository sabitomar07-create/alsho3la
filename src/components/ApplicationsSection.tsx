import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Droplet, Waves, Factory, Recycle, ArrowRight, ArrowLeft } from 'lucide-react';

export const ApplicationsSection: React.FC = () => {
  const { t, setFilters, navigateTo, isRtl } = useApp();

  const applications = [
    {
      title: t('app1Title'),
      desc: t('app1Desc'),
      icon: Droplet,
      specCat: 'tapping-saddles',
      tag: 'DRINKING WATER MAINS',
    },
    {
      title: t('app2Title'),
      desc: t('app2Desc'),
      icon: Waves,
      specCat: 'repair-clamps',
      tag: 'CORROSIVE SEAWATER',
    },
    {
      title: t('app3Title'),
      desc: t('app3Desc'),
      icon: Factory,
      specCat: 'valves-control',
      tag: 'HIGH PRESSURE POWER',
    },
    {
      title: t('app4Title'),
      desc: t('app4Desc'),
      icon: Recycle,
      specCat: 'connectors-adapters',
      tag: 'EFFLUENT & CHEMICAL',
    },
  ];

  return (
    <section id="applications-section" className="py-16 md:py-24 bg-[#070C18] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            INFRASTRUCTURE DEPLOYMENT SECTORS
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-['Chakra_Petch'] text-white">
            {t('applicationsTitle')}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
            {t('applicationsSubtitle')}
          </p>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {applications.map((app, idx) => {
            const Icon = app.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0A1224] border border-slate-800 hover:border-cyan-400/70 shadow-lg hover:shadow-cyan-950/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {app.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 font-['Chakra_Petch'] mb-2 transition-colors">
                    {app.title}
                  </h3>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed mb-6">
                    {app.desc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, category: app.specCat }));
                    navigateTo('shop');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-semibold group-hover:underline pt-3 border-t border-slate-800/80"
                >
                  <span>Filter Sector Specs</span>
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
