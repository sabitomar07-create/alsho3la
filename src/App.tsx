import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { CategoryGrid } from './components/CategoryGrid.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ProductFilters } from './components/ProductFilters.tsx';
import { ProductDetailPage } from './components/ProductDetailPage.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutView } from './components/CheckoutView.tsx';
import { FavoritesView } from './components/FavoritesView.tsx';
import { QuotationModal } from './components/QuotationModal.tsx';
import { VideoSection } from './components/VideoSection.tsx';
import { ApplicationsSection } from './components/ApplicationsSection.tsx';
import { Newsletter } from './components/Newsletter.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { Footer } from './components/Footer.tsx';
import { filterProducts } from './utils/variants.ts';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Truck,
  Award,
  Layers,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeView,
    navigateTo,
    selectedProductSku,
    products,
    filters,
    resetFilters,
    t,
    openRfq,
    notification,
    isRtl,
  } = useApp();

  const filteredProducts = filterProducts(products, filters);
  const featuredProducts = products.filter((p) => p.featured || (p.salesRank && p.salesRank <= 6)).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#070C18] text-slate-100 selection:bg-cyan-500 selection:text-black">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3">
          <div
            className={`px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-2.5 text-xs font-mono backdrop-blur-md ${
              notification.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200'
                : notification.type === 'error'
                ? 'bg-rose-950/95 border-rose-500 text-rose-200'
                : 'bg-blue-950/95 border-cyan-400 text-cyan-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header />

      {/* Dynamic Views */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME */}
        {activeView === 'home' && (
          <>
            <Hero />
            
            <CategoryGrid />

            {/* Featured Industrial Pipeline Products */}
            <section className="py-16 md:py-24 bg-[#070C18] border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                  <div>
                    <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
                      VERIFIED FACTORY SPECIFICATIONS
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-bold font-['Chakra_Petch'] text-white">
                      Featured Industrial Fittings
                    </h2>
                  </div>

                  <button
                    onClick={() => navigateTo('shop')}
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold group"
                  >
                    <span>View All 80 Products</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </section>

            <VideoSection />

            <ApplicationsSection />

            {/* Why Choose Us / Technical Assurance */}
            <section className="py-16 md:py-20 bg-[#080E1C] border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                  <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                    ENGINEERING CREDIBILITY
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch'] text-white">
                    Why Engineers Choose HydroCore
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-950 flex items-center justify-center text-cyan-400 border border-blue-500/30">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold font-['Chakra_Petch'] text-white">
                      100% Hydrostatic Proof Testing
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      Every single valve, saddle, and adapter body undergoes shell hydrostatic pressure testing up to 1.5× rated working pressure before dispatch.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-950 flex items-center justify-center text-cyan-400 border border-blue-500/30">
                      <Award className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold font-['Chakra_Petch'] text-white">
                      Material Test Reports (MTR 3.1)
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      Full metallurgical traceability from ductile iron GGG50 to 316 stainless steel with heat numbers, chemical breakdown, and elongation values.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-950 flex items-center justify-center text-cyan-400 border border-blue-500/30">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold font-['Chakra_Petch'] text-white">
                      Reinforced Industrial Export Packaging
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      Protected in heat-treated ISPM-15 export wooden crates with flange surface protectors and desiccant bags for long ocean transits.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Bulk Order Quotation Banner */}
            <section className="py-12 bg-gradient-to-r from-blue-950 via-[#0B1736] to-blue-950 border-b border-blue-900/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch'] text-white">
                    Need Custom Flange Drill Patterns or Large Diameter Headers?
                  </h3>
                  <p className="text-xs sm:text-sm text-cyan-300 font-sans mt-1">
                    Submit your pipe drawings, SDR ratings, or Bill of Quantities for direct factory pricing.
                  </p>
                </div>
                <button
                  onClick={() => openRfq()}
                  className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider shadow-lg shadow-cyan-500/20 active:scale-95 shrink-0"
                >
                  {t('heroQuoteBtn')}
                </button>
              </div>
            </section>

            <Newsletter />
          </>
        )}

        {/* VIEW 2: SHOP / CATALOG (80 PRODUCTS) */}
        {activeView === 'shop' && (
          <div className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Heading */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-800 pb-6">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold font-['Chakra_Petch'] text-white">
                    {t('catalogHeading')}
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 font-sans">
                    {t('catalogSubheading')}
                  </p>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
                  <span>
                    {t('showingProducts')} <strong className="text-cyan-400">{filteredProducts.length}</strong> {t('ofTotal')}{' '}
                    <strong className="text-white">{products.length}</strong> {t('products')}
                  </span>
                </div>
              </div>

              {/* 2-Column Responsive Filter & Product Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                
                {/* Left Filter Sidebar */}
                <div className="lg:col-span-1">
                  <ProductFilters />
                </div>

                {/* Right Product Grid */}
                <div className="lg:col-span-3">
                  {filteredProducts.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                      <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                        {t('noProductsFound')}
                      </h3>
                      <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
                        {t('noProductsFoundDesc')}
                      </p>
                      <button
                        onClick={resetFilters}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                      >
                        {t('clearFilters')}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredProducts.map((prod) => (
                        <ProductCard key={prod.id} product={prod} />
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* VIEW 3: CATEGORIES ONLY */}
        {activeView === 'categories' && <CategoryGrid />}

        {/* VIEW 4: PRODUCT DETAIL PAGE */}
        {activeView === 'product_detail' && (
          <ProductDetailPage sku={selectedProductSku || products[0].sku} />
        )}

        {/* VIEW 5: CHECKOUT */}
        {activeView === 'checkout' && <CheckoutView />}

        {/* VIEW 6: FAVORITES */}
        {activeView === 'favorites' && <FavoritesView />}

        {/* VIEW 7: ADMIN PORTAL */}
        {activeView === 'admin' && <AdminDashboard />}

      </main>

      {/* Cart Drawer Slide-over */}
      <CartDrawer />

      {/* Quotation Request RFQ Modal */}
      <QuotationModal />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
