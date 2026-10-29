import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCartTotals, validateQuantityChange } from './cart-rules.ts';
import { CartItem } from '../types/index.ts';

const mockCartItems: CartItem[] = [
  {
    cartItemId: 'p1_v1',
    productId: 'p1',
    variantId: 'v1',
    sku: 'TS-DI-100-2',
    name: 'DN100 x 2" BSP Flanged Saddle',
    nameAr: 'سرج تفريع من حديد الدكتايل',
    category: 'Tapping Saddles',
    size: 'DN100 (4")',
    nominalDiameter: 'DN100',
    connectionType: 'Threaded 2" BSP',
    material: 'Ductile Iron GGG50',
    price: 88.5,
    currency: 'USD',
    quantity: 2,
    maxStock: 50,
    weightKg: 4.8,
    image: '/images/products/tapping-saddle.svg',
  },
  {
    cartItemId: 'p2_v1',
    productId: 'p2',
    variantId: 'v2',
    sku: 'RC-SS-150',
    name: 'Stainless Steel Single Band Repair Clamp',
    nameAr: 'مربط إصلاح أنابيب من الفولاذ المقاوم للصدأ',
    category: 'Pipe Repair Clamps',
    size: 'DN150',
    nominalDiameter: 'DN150',
    connectionType: 'Bolted Band',
    material: '316 Stainless Steel',
    price: 135.0,
    currency: 'USD',
    quantity: 1,
    maxStock: 15,
    weightKg: 8.5,
    image: '/images/products/repair-clamp.svg',
  },
];

test('calculateCartTotals calculates subtotal, weight and freight tier accurately', () => {
  const totals = calculateCartTotals(mockCartItems, 'US');
  // Subtotal = 88.5 * 2 + 135 * 1 = 177 + 135 = 312
  assert.equal(totals.subtotal, 312);
  // Weight = 4.8 * 2 + 8.5 * 1 = 9.6 + 8.5 = 18.1 kg
  assert.equal(totals.totalWeightKg, 18.1);
  // Tier: 18.1 kg is in the 10 - 50 kg bracket ($65 freight)
  assert.equal(totals.estimatedFreight, 65);
  assert.equal(totals.total, 312 + 65);
  assert.equal(totals.itemCount, 3);
});

test('calculateCartTotals handles empty cart cleanly', () => {
  const totals = calculateCartTotals([], 'US');
  assert.equal(totals.subtotal, 0);
  assert.equal(totals.totalWeightKg, 0);
  assert.equal(totals.estimatedFreight, 0);
  assert.equal(totals.total, 0);
  assert.equal(totals.itemCount, 0);
});

test('validateQuantityChange prevents negative or zero quantity and honors maxStock', () => {
  // Lower bound check: delta -1 on qty 1 -> invalid
  const lowCheck = validateQuantityChange(1, -1, 10);
  assert.equal(lowCheck.valid, false);
  assert.equal(lowCheck.newQty, 1);

  // Upper bound check: delta +2 on qty 9 with maxStock 10 -> caps at 10
  const maxCheck = validateQuantityChange(9, 2, 10);
  assert.equal(maxCheck.valid, false);
  assert.equal(maxCheck.newQty, 10);

  // Valid change
  const validCheck = validateQuantityChange(2, 1, 10);
  assert.equal(validCheck.valid, true);
  assert.equal(validCheck.newQty, 3);
});
