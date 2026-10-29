import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { soundEngine } from '../utils/sound.ts';
import { X, FileText, CheckCircle2, ShieldCheck, Clock, Building, Send } from 'lucide-react';

export const QuotationModal: React.FC = () => {
  const {
    t,
    language,
    rfqModalOpen,
    closeRfq,
    rfqItem,
    showNotification,
    isRtl,
  } = useApp();

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Saudi Arabia');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [projectType, setProjectType] = useState<any>('municipal_water');
  const [urgency, setUrgency] = useState<any>('routine');
  const [quantity, setQuantity] = useState<number>(50);
  const [projectNotes, setProjectNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any | null>(null);

  if (!rfqModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email) {
      soundEngine.playError();
      showNotification('Please enter required company name and email', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const items = rfqItem
        ? [
            {
              productId: rfqItem.product.id,
              variantId: rfqItem.variant?.id,
              sku: rfqItem.variant?.sku || rfqItem.product.sku,
              name: rfqItem.variant?.name || rfqItem.product.name,
              nameAr: rfqItem.variant?.nameAr || rfqItem.product.nameAr,
              quantity,
              size: rfqItem.variant?.size || rfqItem.product.nominalDiameter,
              notes: projectNotes,
            },
          ]
        : [
            {
              productId: 'bulk-rfq-inquiry',
              sku: 'BULK-RFQ-SPEC',
              name: 'General Project Bill of Quantities',
              quantity,
              notes: projectNotes,
            },
          ];

      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          contactPerson,
          email,
          phone,
          country,
          deliveryCity,
          projectType,
          urgency,
          items,
          projectDescription: projectNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        soundEngine.playSubmitSuccess();
        setConfirmationData(data);
        showNotification(t('rfqSuccessTitle'), 'success');
      } else {
        soundEngine.playError();
        showNotification('Failed to submit RFQ. Please check information.', 'error');
      }
    } catch (err) {
      soundEngine.playError();
      showNotification('Network communication error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmationData(null);
    closeRfq();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#080E1C] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold font-['Chakra_Petch'] text-white">
                {t('rfqTitle')}
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                {t('rfqSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation State */}
        {confirmationData ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-['Chakra_Petch'] text-white">
              {t('rfqSuccessTitle')}
            </h3>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm inline-block">
              <span className="text-slate-400">{t('rfqSuccessDesc')}: </span>
              <span className="text-cyan-400 font-bold">{confirmationData.referenceNumber}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
              {t('rfqSuccessNotice')}
            </p>
            <div className="pt-4">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
              >
                {t('close')}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs font-sans">
            
            {/* Preselected Fitting Banner */}
            {rfqItem && (
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase block font-semibold">SELECTED SPECIFICATION</span>
                  <span className="text-sm font-bold text-white font-['Chakra_Petch']">
                    {language === 'ar' ? rfqItem.product.nameAr : rfqItem.product.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                    SKU: {rfqItem.variant?.sku || rfqItem.product.sku} • {rfqItem.variant?.size || rfqItem.product.nominalDiameter}
                  </span>
                </div>
                <div className="text-right">
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">TARGET QTY</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-20 h-8 px-2 bg-slate-900 border border-slate-700 rounded text-center text-white font-mono font-bold"
                  />
                </div>
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-slate-400 block mb-1">{t('companyName')} *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Saudi Water Authority / Marafiq"
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-mono text-slate-400 block mb-1">{t('contactPerson')} *</label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Eng. Abdullah Al-Ghamdi"
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-mono text-slate-400 block mb-1">{t('email')} *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="procurement@authority.gov"
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-mono text-slate-400 block mb-1">{t('phone')}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 50 000 0000"
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-mono text-slate-400 block mb-1">{t('country')}</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Saudi Arabia / UAE / USA"
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-mono text-slate-400 block mb-1">{t('city')}</label>
                <input
                  type="text"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  placeholder="Riyadh / Dammam Port / Dubai"
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-mono text-slate-400 block mb-1">{t('projectType')}</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full h-9 px-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans"
                >
                  <option value="municipal_water">{t('app1Title')}</option>
                  <option value="desalination">{t('app2Title')}</option>
                  <option value="industrial_cooling">{t('app3Title')}</option>
                  <option value="wastewater">{t('app4Title')}</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-slate-400 block mb-1">{t('urgency')}</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full h-9 px-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans"
                >
                  <option value="routine">{t('urgencyRoutine')}</option>
                  <option value="urgent">{t('urgencyUrgent')}</option>
                  <option value="emergency_shutdown">{t('urgencyShutdown')}</option>
                </select>
              </div>
            </div>

            {/* Project Notes */}
            <div>
              <label className="font-mono text-slate-400 block mb-1">{t('projectNotes')}</label>
              <textarea
                rows={3}
                value={projectNotes}
                onChange={(e) => setProjectNotes(e.target.value)}
                placeholder="Include custom drilling (e.g. PN25 / ANSI 150), SDR ratings, internal coatings, or pipe outer diameters..."
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white"
              >
                {t('close')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? t('rfqSubmitting') : t('submitRfq')}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
