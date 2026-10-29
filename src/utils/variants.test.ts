import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveActiveVariant,
  canAddVariantToCart,
  getAvailableOptionValues,
  filterProducts,
} from './variants.ts';
import { Product, ProductVariant, FilterState } from '../types/index.ts';

const mockVariants: ProductVariant[] = [
  {
    id: 'v1',
    sku: 'TS-DI-100-2',
    name: 'DN100 x 2" BSP Flanged Saddle',
    size: 'DN100 (4")',
    nominalDiameter: 'DN100',
    outsideDiameterRange: '108 - 128 mm',
    material: 'Ductile Iron GGG50',
    connectionType: 'Threaded 2" BSP',
    pressureRating: 'PN16',
    weightKg: 4.8,
    price: 88.5,
    quotationRequired: false,
    stockStatus: 'in_stock',
    stockQuantity: 45,
  },
  {
    id: 'v2',
    sku: 'TS-DI-150-2',
    name: 'DN150 x 2" BSP Flanged Saddle',
    size: 'DN150 (6")',
    nominalDiameter: 'DN150',
    outsideDiameterRange: '159 - 182 mm',
    material: 'Ductile Iron GGG50',
    connectionType: 'Threaded 2" BSP',
    pressureRating: 'PN16',
    weightKg: 6.2,
    price: 112.0,
    quotationRequired: false,
    stockStatus: 'in_stock',
    stockQuantity: 20,
  },
  {
    id: 'v3',
    sku: 'TS-SS-300-4',
    name: 'DN300 Custom High-Pressure Saddle',
    size: 'DN300 (12")',
    nominalDiameter: 'DN300',
    outsideDiameterRange: '315 - 340 mm',
    material: '316 Stainless Steel',
    connectionType: 'Flanged PN25',
    pressureRating: 'PN25',
    weightKg: 18.5,
    price: null,
    quotationRequired: true,
    stockStatus: 'made_to_order',
    stockQuantity: 0,
  },
];

const mockProduct: Product = {
  id: 'p1',
  sku: 'TS-DI-100',
  name: 'Heavy Duty Ductile Iron Tapping Saddle',
  nameAr: 'سرج تفريع من حديد الدكتايل عالي التحمل',
  category: 'Tapping Saddles & Service Saddles',
  categorySlug: 'tapping-saddles',
  description: 'Precision engineered ductile iron tapping saddle with EPDM gasket.',
  descriptionAr: 'سرج تفريع عالي الدقة من حديد الدكتايل مع مانع تسرب EPDM.',
  material: 'Ductile Iron GGG50',
  nominalDiameter: 'DN100',
  outsideDiameter: '108 - 128 mm',
  availableDimensions: ['DN100 (4")', 'DN150 (6")', 'DN300 (12")'],
  connectionType: 'Threaded 2" BSP',
  pressureRating: 'PN16',
  compatiblePipeMaterials: ['Ductile Iron', 'Steel', 'PVC'],
  weightKg: 4.8,
  supplierStandardRef: 'EN 545 / ISO 2531',
  sourceUrl: 'https://standards.iso.org/iso/2531',
  verificationDate: '2026-10-15',
  stockStatus: 'in_stock',
  currency: 'USD',
  price: 88.5,
  quotationRequired: false,
  image: '/images/products/tapping-saddle.svg',
  variants: mockVariants,
  technicalSpecs: [
    { label: 'Body Material', labelAr: 'مادة الجسم', value: 'GGG50 Ductile Iron', valueAr: 'حديد دكتايل GGG50' },
  ],
  certifications: ['ISO 9001', 'WRAS'],
};

test('resolveActiveVariant returns correct variant matching chosen size', () => {
  const resolved = resolveActiveVariant(mockProduct, { size: 'DN150 (6")' });
  assert.ok(resolved);
  assert.equal(resolved?.sku, 'TS-DI-150-2');
  assert.equal(resolved?.price, 112.0);
});

test('resolveActiveVariant falls back to first variant if no match', () => {
  const resolved = resolveActiveVariant(mockProduct, { size: 'DN900' });
  assert.ok(resolved);
  assert.equal(resolved?.sku, 'TS-DI-100-2');
});

test('canAddVariantToCart checks price and quotation requirements correctly', () => {
  // Variant 1: Priced and in stock -> should be allowed
  const check1 = canAddVariantToCart(mockVariants[0]);
  assert.equal(check1.allowed, true);

  // Variant 3: Quote required (price is null) -> should NOT be allowed
  const check3 = canAddVariantToCart(mockVariants[2]);
  assert.equal(check3.allowed, false);
  assert.equal(check3.reason, 'quote_required');

  // Null variant -> blocked
  const checkNull = canAddVariantToCart(null);
  assert.equal(checkNull.allowed, false);
});

test('getAvailableOptionValues extracts sizes, diameters and materials', () => {
  const options = getAvailableOptionValues(mockProduct);
  assert.ok(options.sizes.includes('DN100 (4")'));
  assert.ok(options.sizes.includes('DN150 (6")'));
  assert.ok(options.materials.includes('Ductile Iron GGG50'));
  assert.ok(options.materials.includes('316 Stainless Steel'));
});

test('filterProducts searches correctly across English, Arabic, SKU, and attributes', () => {
  const defaultFilter: FilterState = {
    searchQuery: '',
    category: 'all',
    material: 'all',
    nominalDiameter: 'all',
    outsideDiameter: 'all',
    connectionType: 'all',
    availability: 'all',
    priceType: 'all',
    sortBy: 'relevance',
  };

  // Search by SKU
  const searchSku = filterProducts([mockProduct], { ...defaultFilter, searchQuery: 'TS-DI-100' });
  assert.equal(searchSku.length, 1);

  // Search by Arabic name
  const searchAr = filterProducts([mockProduct], { ...defaultFilter, searchQuery: 'تفريع' });
  assert.equal(searchAr.length, 1);

  // Filter by matching material
  const filterMat = filterProducts([mockProduct], { ...defaultFilter, material: 'Ductile Iron' });
  assert.equal(filterMat.length, 1);

  // Filter by unmatching material
  const filterMatNo = filterProducts([mockProduct], { ...defaultFilter, material: 'Titanium' });
  assert.equal(filterMatNo.length, 0);

  // Filter by priceType: direct_purchase vs quote_required
  const directFilter = filterProducts([mockProduct], { ...defaultFilter, priceType: 'direct_purchase' });
  assert.equal(directFilter.length, 1);

  const quoteFilter = filterProducts([mockProduct], { ...defaultFilter, priceType: 'quote_required' });
  assert.equal(quoteFilter.length, 0);
});

import { initialProducts } from '../data/products.ts';
import { categories } from '../data/categories.ts';

test('catalog contains exactly 80 distinct products across 10 categories', () => {
  assert.equal(initialProducts.length, 80);
  assert.equal(categories.length, 10);

  const categoryCounts: Record<string, number> = {};
  initialProducts.forEach((p) => {
    categoryCounts[p.categorySlug] = (categoryCounts[p.categorySlug] || 0) + 1;
  });

  assert.equal(categoryCounts['tapping-saddles'], 12);
  assert.equal(categoryCounts['repair-clamps'], 10);
  assert.equal(categoryCounts['connectors-adapters'], 10);
  assert.equal(categoryCounts['elbows-bends'], 8);
  assert.equal(categoryCounts['tees-branches'], 8);
  assert.equal(categoryCounts['reducers'], 8);
  assert.equal(categoryCounts['flanges-adapters'], 6);
  assert.equal(categoryCounts['valves-control'], 6);
  assert.equal(categoryCounts['caps-plugs'], 6);
  assert.equal(categoryCounts['bolts-seals-gaskets'], 6);
});

