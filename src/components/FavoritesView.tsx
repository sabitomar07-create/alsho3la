import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { Heart, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { favorites, products, navigateTo, t, isRtl } = useApp();

  const favoriteProducts = products.filter((p) =>
    favorites.some((f) => f.productId === p.id)
  );

  return (
    <div className="bg-[#070C18] min-h-screen py-10 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase mb-1">
              <Heart className="w-4 h-4 fill-rose-500" />
              <span>SAVED SPECIFICATIONS</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-['Chakra_Petch'] text-white">
              {t('favoritesTitle')}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 font-sans">
              {t('favoritesSubtitle')}
            </p>
          </div>

          <button
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-xs font-mono font-semibold"
          >
            <span>{t('heroBrowseBtn')}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Content */}
        {favoriteProducts.length === 0 ? (
          <div className="py-24 text-center space-y-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-['Chakra_Petch'] text-white">
              {t('favoritesEmpty')}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans leading-relaxed">
              {t('favoritesEmptyDesc')}
            </p>
            <button
              onClick={() => navigateTo('shop')}
              className="mt-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              {t('heroBrowseBtn')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
