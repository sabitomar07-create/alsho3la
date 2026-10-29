import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Play, Pause, Volume2, VolumeX, ShieldCheck, Award, Gauge } from 'lucide-react';

export const VideoSection: React.FC = () => {
  const { t, openRfq } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="py-16 md:py-24 bg-[#080D1A] border-b border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-cyan-400 text-xs font-mono font-medium">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>FACTORY WITNESS TESTING (EN 12266-1)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-['Chakra_Petch'] text-white">
            {t('videoSectionTitle')}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
            {t('videoSectionDesc')}
          </p>
        </div>

        {/* Video Canvas Container */}
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl relative group">
          
          {/* Active Visual / Video player simulation with controls */}
          <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
            
            {/* Background Blueprint Canvas */}
            <img
              src="/images/products/gate-valve.svg"
              alt="Hydrostatic Valve Testing Demonstration"
              className={`w-full h-full object-contain p-8 transition-transform duration-1000 ${
                isPlaying ? 'scale-110 blur-[1px]' : 'scale-100'
              }`}
            />

            {/* Pulsing Hydrostatic Test Pressure Graphic */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-6">
              
              {/* Top HUD */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 px-3 py-1 rounded bg-slate-900/90 border border-slate-700 text-xs font-mono text-cyan-300">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                  {isPlaying ? 'LIVE HYDROSTATIC BURST CHAMBER' : 'TEST CHAMBER READY'}
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-300">
                  RIG #04 • 25.0 BAR HOLD
                </span>
              </div>

              {/* Center Play Button Overlay */}
              {!isPlaying && (
                <div className="self-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 border border-cyan-300/40 transition-all hover:scale-110 active:scale-95"
                    aria-label="Play video demonstration"
                  >
                    <Play className="w-7 h-7 ml-1" />
                  </button>
                </div>
              )}

              {/* Bottom Telemetry Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                  <div>PRESSURE: <span className="text-cyan-400 font-bold">24.8 BAR</span></div>
                  <div>TEMPERATURE: <span className="text-white">21.5°C</span></div>
                  <div>LEAKAGE RATE: <span className="text-emerald-400 font-bold">0.00 ml/min</span></div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 font-mono px-2.5"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? t('videoPause') : t('videoPlay')}</span>
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title={isMuted ? t('videoUnmute') : t('videoMute')}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Video Footer Quality Note */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              100% of all fittings undergo hydrostatic body shell and seat pressure testing prior to dispatch.
            </span>
            <button
              onClick={() => openRfq()}
              className="text-cyan-400 hover:text-cyan-300 hover:underline font-semibold"
            >
              Request Test Certificates ↗
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
