import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { calculateCartTotals } from '../utils/cart-rules.ts';
import { X, Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    t,
    language,
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    removeFromCart,
    updateCartQuantity,
    navigateTo,
    isRtl,
  } = useApp();

  if (!cartDrawerOpen) return null;

  const totals = calculateCartTotals(cart);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setCartDrawerOpen(false)}
      />

      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div className="w-screen max-w-md bg-[#080E1C] border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold font-['Chakra_Petch'] text-white">
                {t('cartTitle')}
              </h2>
              <span className="text-xs font-mono text-cyan-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                {totals.itemCount}
              </span>
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-white font-['Chakra_Petch']">
                  {t('cartEmpty')}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto font-sans leading-relaxed">
                  {t('cartEmptyDesc')}
                </p>
                <button
                  onClick={() => {
                    setCartDrawerOpen(false);
                    navigateTo('shop');
                  }}
                  className="mt-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  {t('heroBrowseBtn')}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg bg-slate-950 object-contain p-1 border border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white truncate font-['Chakra_Petch']">
                          {language === 'ar' ? item.nameAr : item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-slate-500 hover:text-rose-400 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] font-mono text-cyan-400">{item.sku}</p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {item.size} • {item.weightKg} kg/ea
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <div className="flex items-center border border-slate-700 rounded bg-slate-950 overflow-hidden text-xs">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, -1)}
                        className="px-2 py-1 text-slate-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 font-mono text-white font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, 1)}
                        className="px-2 py-1 text-slate-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Totals */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-900/90 space-y-3">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>{t('subtotal')}</span>
                  <span className="text-white">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-cyan-400" />
                    Freight ({totals.totalWeightKg} kg)
                  </span>
                  <span className="text-white">${totals.estimatedFreight.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800 font-['Chakra_Petch']">
                  <span>{t('total')}</span>
                  <span className="text-cyan-300">${totals.total.toFixed(2)} USD</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigateTo('checkout');
                }}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>{t('proceedToCheckout')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <p className="text-[10px] text-center text-slate-500 font-mono">
                {t('checkoutNotice')}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
