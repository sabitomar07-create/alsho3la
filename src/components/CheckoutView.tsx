import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { calculateCartTotals } from '../utils/cart-rules.ts';
import { soundEngine } from '../utils/sound.ts';
import {
  ShieldCheck,
  CheckCircle2,
  Building2,
  CreditCard,
  FileCheck2,
  Truck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    clearCart,
    navigateTo,
    t,
    showNotification,
    isRtl,
  } = useApp();

  const totals = calculateCartTotals(cart);

  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('US');
  const [paymentMethod, setPaymentMethod] = useState<'invoice_po' | 'test_credit_card' | 'bank_wire'>('invoice_po');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<any | null>(null);

  if (orderConfirmation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold font-['Chakra_Petch'] text-white">
          {t('orderSuccessTitle')}
        </h2>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm inline-block">
          <span className="text-slate-400">{t('orderSuccessRef')}: </span>
          <span className="text-cyan-400 font-bold">{orderConfirmation.orderNumber}</span>
        </div>
        <p className="text-slate-300 max-w-lg mx-auto text-sm leading-relaxed font-sans">
          {t('orderSuccessNotice')}
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
          >
            {t('heroBrowseBtn')}
          </button>
          <button
            onClick={() => navigateTo('admin')}
            className="px-6 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
          >
            {t('navAdmin')}
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-['Chakra_Petch'] text-white">
          {t('cartEmpty')}
        </h2>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
        >
          {t('heroBrowseBtn')}
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !email || !street || !city) {
      soundEngine.playError();
      showNotification('Please fill in required contact and receiving address details', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          companyName,
          email,
          phone,
          shippingAddress: {
            street,
            city,
            stateOrProvince: stateProvince,
            postalCode,
            country,
          },
          items: cart,
          subtotal: totals.subtotal,
          shippingFreight: totals.estimatedFreight,
          estimatedTax: totals.tax,
          total: totals.total,
          currency: totals.currency,
          paymentMethod,
        }),
      });

      if (res.ok) {
        const orderData = await res.json();
        soundEngine.playSubmitSuccess();
        clearCart();
        setOrderConfirmation(orderData);
        showNotification(t('orderSuccessTitle'), 'success');
      } else {
        soundEngine.playError();
        showNotification('Order processing failed. Please check inputs.', 'error');
      }
    } catch (err) {
      soundEngine.playError();
      showNotification('Network communication error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#070C18] min-h-screen py-10 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch'] text-white">
            {t('checkoutTitle')}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 font-sans">
            {t('checkoutSubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Commercial Verification Banner */}
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-600/30 flex items-start gap-3 text-xs font-mono text-cyan-300">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">INDUSTRIAL B2B PROCUREMENT ENVIRONMENT</span>
                <span className="text-slate-400">
                  Orders generate official purchase order confirmations. Mill material test certificates (MTR 3.1) are matched to casting heats.
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold font-['Chakra_Petch'] text-white">
                1. Commercial Contact & Consignee
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Contact Officer / Engineer *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Vance Pipeline LLC"
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="procurement@company.com"
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Phone / Site Dispatch
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 0192"
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold font-['Chakra_Petch'] text-white">
                2. Heavy Cargo Delivery Bay / Warehouse
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    {t('street')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Industrial Dock 4, Receiving Warehouse"
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">
                      City / Port *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Houston"
                      className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">
                      {t('stateProvince')}
                    </label>
                    <input
                      type="text"
                      value={stateProvince}
                      onChange={(e) => setStateProvince(e.target.value)}
                      placeholder="TX"
                      className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">
                      {t('postalCode')}
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="77001"
                      className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold font-['Chakra_Petch'] text-white">
                3. {t('paymentMethod')}
              </h2>
              <div className="space-y-2 text-xs font-mono">
                <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'invoice_po'
                    ? 'bg-blue-950/70 border-cyan-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'invoice_po'}
                    onChange={() => setPaymentMethod('invoice_po')}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold block text-cyan-300">Commercial Purchase Order / Net 30 Terms</span>
                    <span className="text-[11px] text-slate-400 block font-sans">
                      Standard corporate invoicing upon bill-of-lading dispatch.
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'bank_wire'
                    ? 'bg-blue-950/70 border-cyan-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank_wire'}
                    onChange={() => setPaymentMethod('bank_wire')}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold block text-cyan-300">SWIFT / International Bank Wire Transfer</span>
                    <span className="text-[11px] text-slate-400 block font-sans">
                      Pro-forma invoice with wire instructions provided immediately.
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'test_credit_card'
                    ? 'bg-blue-950/70 border-cyan-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'test_credit_card'}
                    onChange={() => setPaymentMethod('test_credit_card')}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold block text-cyan-300">Test Credit Card (Sandbox Integration Mode)</span>
                    <span className="text-[11px] text-slate-400 block font-sans">
                      Merchant sandbox testing environment. No real funds charged.
                    </span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold font-['Chakra_Petch'] text-white pb-3 border-b border-slate-800">
                Order Review ({totals.itemCount} Units)
              </h2>

              <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-center text-xs font-mono py-1 border-b border-slate-800/60">
                    <div className="truncate max-w-[70%]">
                      <span className="text-cyan-300 font-bold">{item.sku}</span>
                      <span className="text-slate-400 block text-[10px]">{item.size} × {item.quantity}</span>
                    </div>
                    <span className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>{t('subtotal')}</span>
                  <span className="text-white">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Pallet Freight ({totals.totalWeightKg} kg)</span>
                  <span className="text-white">${totals.estimatedFreight.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800 font-['Chakra_Petch']">
                  <span>{t('total')}</span>
                  <span className="text-cyan-300">${totals.total.toFixed(2)} USD</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Processing Order...' : t('placeOrder')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
