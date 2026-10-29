import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Product, ProductVariant } from '../types/index.ts';
import { resolveActiveVariant, canAddVariantToCart, getAvailableOptionValues } from '../utils/variants.ts';
import { ProductCard } from './ProductCard.tsx';
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Heart,
  ShoppingCart,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Truck,
  FileCheck2,
  ChevronRight,
  Copy,
} from 'lucide-react';

interface ProductDetailPageProps {
  sku: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ sku }) => {
  const {
    products,
    language,
    t,
    navigateTo,
    addToCart,
    openRfq,
    isFavorite,
    toggleFavorite,
    showNotification,
    isRtl,
  } = useApp();

  const product = products.find(
    (p) =>
      p.sku.toLowerCase() === sku.toLowerCase() ||
      p.id.toLowerCase() === sku.toLowerCase() ||
      p.variants?.some((v) => v.sku.toLowerCase() === sku.toLowerCase())
  );

  // Available options
  const optionValues = product ? getAvailableOptionValues(product) : { sizes: [], nominalDiameters: [], materials: [], connectionTypes: [] };

  // Variant selections
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedConnection, setSelectedConnection] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Active resolved variant
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    if (product) {
      // Find initial variant matching SKU or default to first
      const matchedVariant = product.variants?.find((v) => v.sku.toLowerCase() === sku.toLowerCase()) || product.variants?.[0] || null;
      if (matchedVariant) {
        setSelectedSize(matchedVariant.size || matchedVariant.nominalDiameter);
        setSelectedMaterial(matchedVariant.material);
        setSelectedConnection(matchedVariant.connectionType);
        setActiveVariant(matchedVariant);
      }
    }
  }, [product, sku]);

  // Update active variant when user changes option selections
  const handleSizeChange = (newSize: string) => {
    setSelectedSize(newSize);
    if (product) {
      const resolved = resolveActiveVariant(product, {
        size: newSize,
        material: selectedMaterial,
        connectionType: selectedConnection,
      });
      if (resolved) {
        setActiveVariant(resolved);
        // Update URL hash to reflect active variant SKU
        window.history.replaceState(null, '', `#product/${encodeURIComponent(resolved.sku)}`);
      }
    }
  };

  const handleMaterialChange = (newMat: string) => {
    setSelectedMaterial(newMat);
    if (product) {
      const resolved = resolveActiveVariant(product, {
        size: selectedSize,
        material: newMat,
        connectionType: selectedConnection,
      });
      if (resolved) {
        setActiveVariant(resolved);
        window.history.replaceState(null, '', `#product/${encodeURIComponent(resolved.sku)}`);
      }
    }
  };

  const handleConnectionChange = (newConn: string) => {
    setSelectedConnection(newConn);
    if (product) {
      const resolved = resolveActiveVariant(product, {
        size: selectedSize,
        material: selectedMaterial,
        connectionType: newConn,
      });
      if (resolved) {
        setActiveVariant(resolved);
        window.history.replaceState(null, '', `#product/${encodeURIComponent(resolved.sku)}`);
      }
    }
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-['Chakra_Petch'] text-white mb-4">
          Specification Not Found
        </h2>
        <p className="text-slate-400 mb-6">
          The requested pipeline product SKU could not be located in the certified catalog.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500"
        >
          {t('productDetailBack')}
        </button>
      </div>
    );
  }

  const isFav = isFavorite(product.id);
  const cartEligibility = canAddVariantToCart(activeVariant);
  const displayedSku = activeVariant ? activeVariant.sku : product.sku;
  const displayedPrice = activeVariant ? activeVariant.price : product.price;
  const isQuoteOnly = activeVariant
    ? activeVariant.quotationRequired || activeVariant.price === null
    : product.quotationRequired || product.price === null;

  const currentWeight = activeVariant ? activeVariant.weightKg : product.weightKg;
  const currentStockQty = activeVariant ? activeVariant.stockQuantity : 10;
  const currentStockStatus = activeVariant ? activeVariant.stockStatus : product.stockStatus;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showNotification(t('linkCopied'), 'success');
    }
  };

  const handleAddToCart = () => {
    if (!cartEligibility.allowed) {
      if (cartEligibility.reason === 'quote_required') {
        openRfq(product, activeVariant);
      } else {
        showNotification(t('unavailableVariantNotice'), 'error');
      }
      return;
    }
    addToCart(product, activeVariant, quantity);
  };

  // Related products from same category
  const related = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-[#070C18] min-h-screen py-8 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6 overflow-x-auto whitespace-nowrap">
          <button onClick={() => navigateTo('home')} className="hover:text-cyan-400 transition-colors">
            {t('navHome')}
          </button>
          <span>/</span>
          <button onClick={() => navigateTo('shop')} className="hover:text-cyan-400 transition-colors">
            {t('navShop')}
          </button>
          <span>/</span>
          <span className="text-slate-500 truncate max-w-[200px]">{product.category}</span>
          <span>/</span>
          <span className="text-cyan-300 font-bold">{displayedSku}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigateTo('shop')}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
        >
          {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          <span>{t('productDetailBack')}</span>
        </button>

        {/* Main Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Image Gallery & Technical Schematics */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-slate-900 to-[#0A1224] border border-slate-800 p-8 flex items-center justify-center overflow-hidden shadow-2xl">
              
              {/* Pressure Rating & Standards Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                <span className="px-2.5 py-1 rounded bg-blue-950/90 border border-blue-500/50 text-cyan-300 font-mono text-xs font-bold shadow">
                  {activeVariant?.pressureRating || product.pressureRating}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-slate-300 font-mono text-[10px]">
                  {product.supplierStandardRef}
                </span>
              </div>

              {/* Verified Product Image SVG */}
              <img
                src={product.image}
                alt={language === 'ar' ? product.nameAr : product.name}
                className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500"
              />

              {/* Watermark Details */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
                <span>VERIFIED: {product.verificationDate}</span>
                <span className="text-cyan-400 font-semibold">CAD DWG READY</span>
              </div>
            </div>

            {/* Compliance Guarantee Bar */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>MTR 3.1 & HYDROSTATIC TEST CERTIFIED</span>
              </div>
              <a
                href={product.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline text-[11px]"
              >
                {t('sourceUrl')} ↗
              </a>
            </div>
          </div>

          {/* Right Column: Dynamic Variant Configuration & Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header Titles */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-cyan-400 font-bold uppercase">{product.category}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                    title={t('share')}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(product)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                    title="Favorite"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch'] text-white leading-tight">
                {language === 'ar' ? product.nameAr : product.name}
              </h1>

              {/* Dynamic SKU Display */}
              <div className="flex items-center gap-2 mt-2 font-mono text-xs">
                <span className="text-slate-500">{t('selectedSku')}:</span>
                <span className="text-cyan-300 font-bold bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-600/40">
                  {displayedSku}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              {language === 'ar' ? product.descriptionAr : product.description}
            </p>

            {/* Dynamic Price Display */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">
                  {isQuoteOnly ? 'PROCUREMENT REQUIREMENT' : 'CERTIFIED COMMERCIAL PRICE'}
                </span>
                {isQuoteOnly ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-mono font-bold text-amber-400 bg-amber-950/80 px-3 py-1 rounded border border-amber-800/60">
                      {t('quoteRequiredBadge')}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-mono text-slate-400">$</span>
                    <span className="text-3xl font-bold font-mono text-white">
                      {displayedPrice?.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{product.currency} / Unit</span>
                  </div>
                )}
              </div>

              {/* Stock Status Indicator */}
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 block mb-1">AVAILABILITY</span>
                {currentStockStatus === 'in_stock' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-xs font-mono font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {currentStockQty} Units In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-400 text-xs font-mono font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {t(currentStockStatus as any) || 'Engineered'}
                  </span>
                )}
              </div>
            </div>

            {/* DYNAMIC VARIANT SELECTOR */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {t('availableVariants')}
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {product.variants?.length || 1} available size configurations
                </span>
              </div>

              {/* 1. Size / Nominal Diameter Options */}
              {optionValues.sizes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 block">
                    {t('dnSize')}: <span className="text-cyan-400 font-bold">{selectedSize}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {optionValues.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleSizeChange(sz)}
                        className={`px-3 py-2 rounded-lg text-xs font-mono transition-all border ${
                          selectedSize === sz
                            ? 'bg-blue-600 border-cyan-400 text-white font-bold shadow-md shadow-blue-500/30'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Connection Type Options (if variants differ) */}
              {optionValues.connectionTypes.length > 1 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 block">
                    {t('filterConnectionType')}: <span className="text-cyan-400 font-bold">{selectedConnection}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {optionValues.connectionTypes.map((conn) => (
                      <button
                        key={conn}
                        type="button"
                        onClick={() => handleConnectionChange(conn)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                          selectedConnection === conn
                            ? 'bg-blue-600 border-cyan-400 text-white font-bold shadow'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {conn}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Row: Quantity + Primary Button */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-4">
                {/* Quantity Stepper (for direct purchase) */}
                {!isQuoteOnly && (
                  <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-3 text-sm font-mono text-white font-bold min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(currentStockQty || 99, q + 1))}
                      className="px-3.5 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Primary Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isQuoteOnly
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg shadow-amber-600/20'
                      : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 border border-cyan-400/30'
                  }`}
                >
                  {isQuoteOnly ? (
                    <>
                      <FileText className="w-4 h-4 text-white" />
                      <span>{t('requestQuote')}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>{t('addToCart')} ({quantity})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Informative notice if quote required */}
              {isQuoteOnly && (
                <p className="text-xs text-amber-300/80 font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{t('cantAddToCartQuoteOnly')}</span>
                </p>
              )}
            </div>

            {/* Quick Logistics Policy */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs font-sans text-slate-400">
              <div className="flex items-center gap-2 text-slate-300 font-semibold font-mono">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>{t('deliveryPolicies')}</span>
              </div>
              <p className="leading-relaxed">
                {t('deliveryText')}
              </p>
            </div>

          </div>

        </div>

        {/* Technical Data Sheet Table */}
        <div className="mt-16 pt-10 border-t border-slate-800">
          <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white mb-6">
            {t('specifications')}
          </h2>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs font-mono">
              <tbody className="divide-y divide-slate-800">
                <tr className="bg-slate-950/40">
                  <td className="p-3.5 text-slate-400 w-1/3">Standard Specification SKU</td>
                  <td className="p-3.5 text-cyan-300 font-bold">{displayedSku}</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-slate-400">Nominal Diameter (DN)</td>
                  <td className="p-3.5 text-white">{activeVariant?.nominalDiameter || product.nominalDiameter}</td>
                </tr>
                <tr className="bg-slate-950/40">
                  <td className="p-3.5 text-slate-400">Outside Diameter Range (OD)</td>
                  <td className="p-3.5 text-white">{activeVariant?.outsideDiameterRange || product.outsideDiameter}</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-slate-400">Body & Component Material</td>
                  <td className="p-3.5 text-white">{activeVariant?.material || product.material}</td>
                </tr>
                <tr className="bg-slate-950/40">
                  <td className="p-3.5 text-slate-400">Working Pressure Rating</td>
                  <td className="p-3.5 text-emerald-400 font-semibold">{activeVariant?.pressureRating || product.pressureRating}</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-slate-400">{t('pipeCompatibility')}</td>
                  <td className="p-3.5 text-white">{product.compatiblePipeMaterials.join(', ')}</td>
                </tr>
                <tr className="bg-slate-950/40">
                  <td className="p-3.5 text-slate-400">{t('weight')}</td>
                  <td className="p-3.5 text-white">{currentWeight} kg</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-slate-400">{t('supplierReference')}</td>
                  <td className="p-3.5 text-white">{product.supplierStandardRef}</td>
                </tr>
                {product.technicalSpecs?.map((spec, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-slate-950/40' : ''}>
                    <td className="p-3.5 text-slate-400">{language === 'ar' ? spec.labelAr : spec.label}</td>
                    <td className="p-3.5 text-white">{language === 'ar' ? spec.valueAr : spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-800">
            <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white mb-6">
              {t('relatedProducts')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
