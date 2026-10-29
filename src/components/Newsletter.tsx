import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { soundEngine } from '../utils/sound.ts';
import { Mail, CheckCircle2, ShieldCheck, Send } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const { t, showNotification } = useApp();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      soundEngine.playError();
      showNotification('Please confirm consent checkbox to receive engineering bulletins', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent }),
      });
      if (res.ok) {
        soundEngine.playSubmitSuccess();
        setSubscribed(true);
        showNotification(t('newsletterSuccess'), 'success');
      }
    } catch {
      soundEngine.playError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-[#080E1C] border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/20 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Mail className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch'] text-white">
              {t('newsletterTitle')}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              {t('newsletterSubtitle')}
            </p>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{t('newsletterSuccess')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left pt-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletterPlaceholder')}
                    className="flex-1 h-11 px-4 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('newsletterSubmit')}</span>
                  </button>
                </div>

                <label className="flex items-start gap-2.5 text-[11px] text-slate-400 font-sans cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500"
                  />
                  <span className="leading-relaxed">
                    {t('newsletterConsent')}
                  </span>
                </label>
              </form>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
