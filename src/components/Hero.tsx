import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { t, navigateTo, openRfq, isRtl } = useApp();
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  return (
    <section className="relative overflow-hidden bg-[#070C18] border-b border-slate-800/80">
      {/* Background Industrial Textures & Gradient Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,102,255,0.25),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Metallic Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70" />

      {/* Restrained Animated Blue Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 animate-pulse" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Engineering Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-cyan-400 text-xs font-mono font-medium tracking-wider shadow-inner">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{t('heroBadge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-bold font-['Chakra_Petch'] text-white tracking-tight leading-[1.12]">
              {t('heroTitle')}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl">
              {t('heroSubtitle')}
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => navigateTo('shop')}
                className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 border border-cyan-300/40 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>{t('heroBrowseBtn')}</span>
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>

              <button
                onClick={() => openRfq()}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white font-semibold text-sm border border-slate-700 hover:border-cyan-400 transition-all hover:shadow-lg active:scale-95"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>{t('heroQuoteBtn')}</span>
              </button>
            </div>

            {/* Verified Technical Standards Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <p className="font-['Chakra_Petch'] text-xl font-bold text-cyan-400">{t('heroStat1Value')}</p>
                <p className="text-[11px] text-slate-400 font-sans">{t('heroStat1Label')}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <p className="font-['Chakra_Petch'] text-xl font-bold text-white">{t('heroStat2Value')}</p>
                <p className="text-[11px] text-slate-400 font-sans">{t('heroStat2Label')}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <p className="font-['Chakra_Petch'] text-xl font-bold text-white">{t('heroStat3Value')}</p>
                <p className="text-[11px] text-slate-400 font-sans">{t('heroStat3Label')}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <p className="font-['Chakra_Petch'] text-xl font-bold text-cyan-400">{t('heroStat4Value')}</p>
                <p className="text-[11px] text-slate-400 font-sans">{t('heroStat4Label')}</p>
              </div>
            </div>

          </div>

          {/* Right Column: High-Tech Technical Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-blue-500/30 bg-gradient-to-b from-slate-900/90 to-[#0A1128] p-4 shadow-2xl shadow-blue-950/50 group">
              
              {/* Technical Header HUD */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-cyan-300 font-semibold">HYDROSTATIC LAB 3.1</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title={isVideoPlaying ? t('videoPause') : t('videoPlay')}
                  >
                    {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title={isVideoMuted ? t('videoUnmute') : t('videoMute')}
                  >
                    {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Technical Visual Canvas / Media */}
              <div className="relative aspect-square sm:aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                {/* SVG Fitting Blueprint with Glow */}
                <img
                  src="/images/products/tapping-saddle-double-strap.svg"
                  alt="Ductile Iron Double Strap Tapping Saddle Technical Blueprint"
                  className={`w-full h-full object-contain p-4 transition-transform duration-700 ${
                    isVideoPlaying ? 'scale-105' : 'scale-100'
                  }`}
                  loading="eager"
                />

                {/* Simulated Real-Time Hydrostatic Sensor HUD Overlay */}
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 rounded-lg p-2.5 text-[10px] font-mono space-y-1">
                  <div className="text-cyan-400 font-bold">PRESSURE TEST ACTIVE</div>
                  <div className="text-slate-300">Target: <span className="text-emerald-400">24.0 Bar (PN16 x 1.5)</span></div>
                  <div className="text-slate-400">Hold Duration: <span className="text-white">600s PASSED</span></div>
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-700 rounded-lg p-2 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>WRAS APPROVED EPDM GASKET</span>
                </div>
              </div>

              {/* Spec Highlights Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>MODEL: TS-DI-100-2</span>
                <span className="text-cyan-400 font-semibold">$94.50 LIST PRICE</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
