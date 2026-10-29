import { CartItem } from '../types/index.ts';

export interface CartTotals {
  subtotal: number;
  totalWeightKg: number;
  estimatedFreight: number;
  tax: number;
  total: number;
  currency: string;
  itemCount: number;
}

/**
 * Calculates industrial order subtotals and freight estimations.
 * Heavy industrial pipeline parts (flanges, ductile iron valves, large saddles)
 * use weight-tiered freight rates rather than flat trivial retail rates.
 */
export function calculateCartTotals(
  items: CartItem[],
  destinationCountry: string = 'US'
): CartTotals {
  const currency = items[0]?.currency || 'USD';
  let subtotal = 0;
  let totalWeightKg = 0;
  let itemCount = 0;

  for (const item of items) {
    subtotal += item.price * item.quantity;
    totalWeightKg += (item.weightKg || 1) * item.quantity;
    itemCount += item.quantity;
  }

  // Weight-based freight tier (Industrial pallet freight)
  let estimatedFreight = 0;
  if (items.length > 0) {
    if (totalWeightKg <= 10) {
      estimatedFreight = 25; // Standard express parcel courier
    } else if (totalWeightKg <= 50) {
      estimatedFreight = 65; // Heavy parcel
    } else if (totalWeightKg <= 200) {
      estimatedFreight = 150; // Half-pallet regional LTL freight
    } else {
      estimatedFreight = 280; // Full freight pallet / industrial transport
    }

    // Country freight surcharge for international shipping
    if (destinationCountry !== 'US' && destinationCountry !== 'SA' && destinationCountry !== 'AE') {
      estimatedFreight = Math.round(estimatedFreight * 1.4);
    }
  }

  // Industrial B2B orders typically do not charge sales tax if tax-exempt or quoted ex-works
  const tax = 0;
  const total = subtotal + estimatedFreight + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalWeightKg: Math.round(totalWeightKg * 10) / 10,
    estimatedFreight,
    tax,
    total: Math.round(total * 100) / 100,
    currency,
    itemCount,
  };
}

/**
 * Validates whether requested quantity change is allowed based on max stock.
 */
export function validateQuantityChange(
  currentQty: number,
  delta: number,
  maxStock: number
): { valid: boolean; newQty: number; message?: string } {
  const newQty = currentQty + delta;
  if (newQty < 1) {
    return { valid: false, newQty: currentQty, message: 'Quantity cannot be less than 1' };
  }
  if (maxStock > 0 && newQty > maxStock) {
    return {
      valid: false,
      newQty: maxStock,
      message: `Maximum available inventory reached (${maxStock} units)`,
    };
  }
  return { valid: true, newQty };
}
