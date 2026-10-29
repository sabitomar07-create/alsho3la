import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Layers, ShieldCheck, Mail, MapPin, Phone, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, categories, setFilters, navigateTo, language } = useApp();

  return (
    <footer className="bg-[#050811] text-slate-400 text-xs font-sans border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-cyan-300">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-['Chakra_Petch'] text-xl font-bold tracking-wider text-white">
                {t('brandName')}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              {t('footerDesc')}
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-cyan-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>QUALITY MANAGEMENT SYSTEM ISO 9001:2015</span>
            </div>
          </div>

          {/* Quick Categories Column 1 */}
          <div className="space-y-3">
            <h4 className="text-white font-mono font-bold uppercase tracking-wider text-xs">
              {t('footerQuickLinks')}
            </h4>
            <ul className="space-y-2 font-mono text-[11px]">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, category: cat.slug }));
                      navigateTo('shop');
                    }}
                    className="hover:text-cyan-400 transition-colors text-left"
                  >
                    {language === 'ar' ? cat.nameAr : cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Categories Column 2 */}
          <div className="space-y-3">
            <h4 className="text-white font-mono font-bold uppercase tracking-wider text-xs">
              {t('footerCompliance')}
            </h4>
            <ul className="space-y-2 font-mono text-[11px]">
              {categories.slice(5, 10).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, category: cat.slug }));
                      navigateTo('shop');
                    }}
                    className="hover:text-cyan-400 transition-colors text-left"
                  >
                    {language === 'ar' ? cat.nameAr : cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Compliance & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-mono font-bold uppercase tracking-wider text-xs">
              {t('footerContactTitle')}
            </h4>
            <div className="space-y-2.5 font-mono text-[11px]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Heavy Industrial Zone, Port Berth 12, Logistics Park</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>engineering@hydrocore-pipeline.example</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>+1 (800) 555-FLOW / +966 11 000 0000</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <p>© {new Date().getFullYear()} {t('footerCopyright')}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">EN 545 / ISO 2531</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">AWWA C219</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">WRAS Potable</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
