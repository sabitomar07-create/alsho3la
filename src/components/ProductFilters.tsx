import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { FilterState } from '../types/index.ts';
import { Filter, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';

export const ProductFilters: React.FC = () => {
  const { t, language, filters, setFilters, resetFilters, categories } = useApp();

  const materials = [
    { value: 'all', label: t('allMaterials') },
    { value: 'Ductile Iron', label: 'Ductile Iron (GGG50 / GJS-500)' },
    { value: 'Stainless Steel', label: 'Stainless Steel (AISI 316 / 304)' },
    { value: 'Carbon Steel', label: 'Forged Carbon Steel (ASTM A105 / A234)' },
    { value: 'PE100', label: 'Polyethylene (PE100 HDPE)' },
    { value: 'Bronze', label: 'Gunmetal Bronze (LG2)' },
  ];

  const nominalDiameters = [
    { value: 'all', label: t('allDiameters') },
    { value: 'DN50', label: 'DN50 (2")' },
    { value: 'DN80', label: 'DN80 (3")' },
    { value: 'DN100', label: 'DN100 (4")' },
    { value: 'DN125', label: 'DN125 (5")' },
    { value: 'DN150', label: 'DN150 (6")' },
    { value: 'DN200', label: 'DN200 (8")' },
    { value: 'DN250', label: 'DN250 (10")' },
    { value: 'DN300', label: 'DN300 (12")' },
    { value: 'DN400', label: 'DN400 (16")' },
    { value: 'DN500', label: 'DN500 (20")' },
    { value: 'DN600', label: 'DN600 (24")' },
  ];

  const connectionTypes = [
    { value: 'all', label: t('allConnections') },
    { value: 'Flanged', label: 'Flanged (EN 1092-2 PN16 / PN25)' },
    { value: 'Threaded', label: 'Threaded (BSP / NPT)' },
    { value: 'Socket', label: 'Tyton Push-On Socket' },
    { value: 'Restrained', label: 'Restrained Mechanical Grip' },
    { value: 'Electrofusion', label: 'PE Electrofusion Socket' },
    { value: 'Weld', label: 'Butt-Weld / Socket Weld' },
  ];

  const availabilityOptions = [
    { value: 'all', label: t('allStock') },
    { value: 'in_stock', label: t('inStock') },
    { value: 'low_stock', label: t('lowStock') },
    { value: 'lead_time', label: t('leadTime') },
    { value: 'made_to_order', label: t('madeToOrder') },
  ];

  return (
    <aside className="bg-gradient-to-b from-slate-900/90 to-[#0A1224] border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
      
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-['Chakra_Petch'] font-bold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span>{t('filterHeader')}</span>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t('clearFilters')}</span>
        </button>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300 block">
          {t('filterCategory')}
        </label>
        <select
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
        >
          <option value="all">{t('allCategories')}</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {language === 'ar' ? c.nameAr : c.name} ({c.count})
            </option>
          ))}
        </select>
      </div>

      {/* 2. Procurement Type (Direct vs Quote) */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300 block">
          {t('filterPriceType')}
        </label>
        <div className="grid grid-cols-1 gap-1.5 text-xs font-sans">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, priceType: 'all' }))}
            className={`p-2 rounded-lg text-left border transition-all ${
              filters.priceType === 'all'
                ? 'bg-blue-950/80 border-cyan-400 text-cyan-300 font-medium'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('filterPriceAll')}
          </button>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, priceType: 'direct_purchase' }))}
            className={`p-2 rounded-lg text-left border transition-all ${
              filters.priceType === 'direct_purchase'
                ? 'bg-blue-950/80 border-cyan-400 text-cyan-300 font-medium'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('filterDirectPurchase')}
          </button>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, priceType: 'quote_required' }))}
            className={`p-2 rounded-lg text-left border transition-all ${
              filters.priceType === 'quote_required'
                ? 'bg-amber-950/50 border-amber-500 text-amber-300 font-medium'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('filterQuoteRequired')}
          </button>
        </div>
      </div>

      {/* 3. Nominal Diameter (DN) Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300 block">
          {t('filterNominalDiameter')}
        </label>
        <select
          value={filters.nominalDiameter}
          onChange={(e) => setFilters((prev) => ({ ...prev, nominalDiameter: e.target.value }))}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
        >
          {nominalDiameters.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Body Material Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300 block">
          {t('filterMaterial')}
        </label>
        <select
          value={filters.material}
          onChange={(e) => setFilters((prev) => ({ ...prev, material: e.target.value }))}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
        >
          {materials.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Connection Type Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300 block">
          {t('filterConnectionType')}
        </label>
        <select
          value={filters.connectionType}
          onChange={(e) => setFilters((prev) => ({ ...prev, connectionType: e.target.value }))}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
        >
          {connectionTypes.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* 6. Availability Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300 block">
          {t('filterAvailability')}
        </label>
        <select
          value={filters.availability}
          onChange={(e) => setFilters((prev) => ({ ...prev, availability: e.target.value }))}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
        >
          {availabilityOptions.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {/* 7. Sort Order */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800">
        <label className="text-xs font-mono font-semibold text-slate-300 block">
          {t('filterSort')}
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
        >
          <option value="relevance">{t('sortRelevance')}</option>
          <option value="name_asc">{t('sortNameAsc')}</option>
          <option value="name_desc">{t('sortNameDesc')}</option>
          <option value="price_low">{t('sortPriceLow')}</option>
          <option value="price_high">{t('sortPriceHigh')}</option>
          <option value="newest">{t('sortNewest')}</option>
        </select>
      </div>

    </aside>
  );
};
