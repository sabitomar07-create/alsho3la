import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Layers,
  Search,
  ShoppingCart,
  Heart,
  Globe,
  Volume2,
  VolumeX,
  Menu,
  X,
  ShieldCheck,
  Cpu,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    soundEnabled,
    toggleSound,
    cart,
    favorites,
    activeView,
    navigateTo,
    filters,
    setFilters,
    setCartDrawerOpen,
    isRtl,
    isAdminLoggedIn,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchQuery);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, searchQuery: searchInput }));
    navigateTo('shop');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080D1A]/95 backdrop-blur-md border-b border-slate-800 shadow-xl transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-[#0B1530] to-blue-950 border-b border-blue-900/50 py-1.5 px-4 text-xs font-mono text-cyan-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="tracking-wider uppercase">{t('announcement')}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 hover:text-cyan-300 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              ISO 9001:2015 & EN 545
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">CAD / BIM SPEC SHEETS</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Wordmark */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3.5 text-left group focus:outline-none"
            aria-label="HydroCore Home"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 border border-blue-400/40 shadow-lg shadow-blue-500/20 group-hover:border-cyan-400 transition-all">
              <Layers className="w-6 h-6 text-cyan-300 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 rounded-lg bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Chakra_Petch'] text-2xl font-bold tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                  {t('brandName')}
                </span>
                <span className="text-[10px] font-mono uppercase bg-blue-900/60 text-cyan-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                  IND.
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans tracking-tight max-w-[210px] truncate">
                {t('brandSubtitle')}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-2 rounded-md transition-colors ${
                activeView === 'home'
                  ? 'text-cyan-400 bg-blue-950/60 border border-blue-800/60'
                  : 'hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {t('navHome')}
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                activeView === 'shop'
                  ? 'text-cyan-400 bg-blue-950/60 border border-blue-800/60'
                  : 'hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <span>{t('navShop')}</span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded border border-cyan-800">
                80
              </span>
            </button>
            <button
              onClick={() => navigateTo('categories')}
              className={`px-3 py-2 rounded-md transition-colors ${
                activeView === 'categories'
                  ? 'text-cyan-400 bg-blue-950/60 border border-blue-800/60'
                  : 'hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {t('navCategories')}
            </button>
            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  document.getElementById('applications-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3 py-2 rounded-md hover:text-white hover:bg-slate-800/40 transition-colors"
            >
              {t('navApplications')}
            </button>
            <button
              onClick={() => navigateTo('admin')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1 ${
                activeView === 'admin'
                  ? 'text-amber-400 bg-amber-950/40 border border-amber-800/50'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/40'
              }`}
              title="Admin Portal"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{t('navAdmin')}</span>
              {isAdminLoggedIn && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          </nav>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex relative flex-1 max-w-xs xl:max-w-md items-center"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full h-10 pl-9 pr-9 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
            />
            <Search className={`w-4 h-4 text-slate-400 absolute ${isRtl ? 'right-3' : 'left-3'} pointer-events-none`} />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setFilters((prev) => ({ ...prev, searchQuery: '' }));
                }}
                className={`absolute ${isRtl ? 'left-3' : 'right-3'} text-slate-400 hover:text-white text-xs`}
              >
                ✕
              </button>
            )}
          </form>

          {/* Action Icons: Sound, Language, Favorites, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Audio Feedback Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg border transition-all ${
                soundEnabled
                  ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:border-cyan-400'
                  : 'border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300'
              }`}
              title={soundEnabled ? t('soundToggleOn') : t('soundToggleOff')}
              aria-label="Toggle Audio Feedback"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Language Selector (EN / AR) */}
            <div className="relative">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-mono text-slate-200 hover:border-cyan-400 transition-all"
                title="Switch Language (English / العربية)"
                aria-label="Language Selector"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold">{language === 'en' ? 'EN' : 'عربي'}</span>
              </button>
            </div>

            {/* Favorites Button */}
            <button
              onClick={() => navigateTo('favorites')}
              className={`relative p-2 rounded-lg border transition-all ${
                activeView === 'favorites'
                  ? 'border-cyan-400 bg-blue-950/50 text-cyan-300'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
              title={t('navFavorites')}
              aria-label="Favorites"
            >
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs shadow-lg shadow-blue-500/20 border border-cyan-400/30 transition-all active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline font-mono">{t('navCart')}</span>
              {totalCartCount > 0 && (
                <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-slate-950 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-400/40">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
              aria-label="Mobile Menu Toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        <div className="md:hidden py-2 border-t border-slate-800/80">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full h-9 pl-9 pr-4 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <Search className={`w-3.5 h-3.5 text-slate-400 absolute ${isRtl ? 'right-3' : 'left-3'} top-3`} />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#080D1A] px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => {
              navigateTo('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm ${
              activeView === 'home' ? 'text-cyan-400 bg-blue-950/60' : 'text-slate-300'
            }`}
          >
            <span>{t('navHome')}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4 text-slate-500" /> : <ArrowRight className="w-4 h-4 text-slate-500" />}
          </button>
          <button
            onClick={() => {
              navigateTo('shop');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm ${
              activeView === 'shop' ? 'text-cyan-400 bg-blue-950/60' : 'text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{t('navShop')}</span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800">
                80 Products
              </span>
            </div>
            {isRtl ? <ArrowLeft className="w-4 h-4 text-slate-500" /> : <ArrowRight className="w-4 h-4 text-slate-500" />}
          </button>
          <button
            onClick={() => {
              navigateTo('categories');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm ${
              activeView === 'categories' ? 'text-cyan-400 bg-blue-950/60' : 'text-slate-300'
            }`}
          >
            <span>{t('navCategories')} (10)</span>
            {isRtl ? <ArrowLeft className="w-4 h-4 text-slate-500" /> : <ArrowRight className="w-4 h-4 text-slate-500" />}
          </button>
          <button
            onClick={() => {
              navigateTo('favorites');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm text-slate-300"
          >
            <span>{t('navFavorites')}</span>
            <span className="text-xs text-rose-400 font-mono">({favorites.length})</span>
          </button>
          <button
            onClick={() => {
              navigateTo('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm text-amber-400 border border-amber-900/50 bg-amber-950/20"
          >
            <span>{t('navAdmin')}</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      )}
    </header>
  );
};
