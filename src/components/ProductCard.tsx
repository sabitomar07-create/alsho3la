import React from 'react';
import { Product } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { Heart, ShoppingCart, FileText, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    t,
    language,
    navigateTo,
    addToCart,
    openRfq,
    isFavorite,
    toggleFavorite,
    isRtl,
  } = useApp();

  const isFav = isFavorite(product.id);
  const isQuoteOnly = product.quotationRequired || product.price === null;

  const handleCardClick = () => {
    navigateTo('product_detail', product.sku);
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isQuoteOnly) {
      openRfq(product);
    } else {
      addToCart(product, null, 1);
    }
  };

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  // Stock status badge formatting
  const getStockBadge = () => {
    switch (product.stockStatus) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-600/40 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {t('inStock')}
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-amber-950/70 border border-amber-600/40 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {t('lowStock')}
          </span>
        );
      case 'lead_time':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-blue-950/70 border border-blue-600/40 text-blue-300">
            {t('leadTime')}
          </span>
        );
      case 'made_to_order':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-purple-950/70 border border-purple-600/40 text-purple-300">
            {t('madeToOrder')}
          </span>
        );
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-xl bg-gradient-to-b from-slate-900/90 to-[#0A1224] border border-slate-800 hover:border-cyan-400/80 shadow-md hover:shadow-cyan-950/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      {/* Top Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-400 transition-all" />

      {/* Media Header & Badges */}
      <div className="relative aspect-square w-full p-6 bg-slate-950/80 flex items-center justify-center border-b border-slate-800/80 overflow-hidden">
        {/* Favorite Pin Button */}
        <button
          onClick={handleFavClick}
          className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all shadow"
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          aria-label="Toggle Favorite"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Pressure Rating Tag */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950/90 border border-blue-600/50 text-cyan-300 shadow">
            {product.pressureRating.split(' ')[0]}
          </span>
          {product.featured && (
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-950/90 border border-amber-600/50 text-amber-400">
              FEATURED
            </span>
          )}
        </div>

        {/* Product SVG Graphic */}
        <img
          src={product.image}
          alt={language === 'ar' ? product.nameAr : product.name}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Nominal Diameter HUD pill */}
        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
          DN: <span className="text-white font-semibold">{product.nominalDiameter}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span className="truncate max-w-[60%]">{product.category}</span>
            <span className="text-cyan-400 font-semibold">{product.sku}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 font-['Chakra_Petch'] leading-snug line-clamp-2 transition-colors mb-2">
            {language === 'ar' ? product.nameAr : product.name}
          </h3>

          {/* Technical Specs Summary */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80 mb-3">
            <div>
              <span className="text-slate-500 block text-[9px]">MATERIAL</span>
              <span className="text-slate-300 truncate block">{product.material.split('/')[0]}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">CONNECTION</span>
              <span className="text-slate-300 truncate block">{product.connectionType}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Row */}
        <div>
          <div className="flex items-center justify-between pt-2 mb-3 border-t border-slate-800/80">
            <div>
              <span className="text-[10px] font-mono text-slate-500 block">
                {isQuoteOnly ? t('priceType' as any) || 'PROCUREMENT' : 'LIST PRICE'}
              </span>
              {isQuoteOnly ? (
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                  {t('quoteRequiredBadge')}
                </span>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-mono text-slate-400">$</span>
                  <span className="text-lg font-bold font-mono text-white">
                    {product.price?.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{product.currency}</span>
                </div>
              )}
            </div>

            <div>{getStockBadge()}</div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleAction}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isQuoteOnly
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-amber-600/30'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-md shadow-blue-600/20'
            }`}
          >
            {isQuoteOnly ? (
              <>
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('requestQuote')}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{t('addToCart')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
