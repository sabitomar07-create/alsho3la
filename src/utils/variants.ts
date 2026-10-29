import { Product, ProductVariant, FilterState } from '../types/index.ts';

/**
 * Resolves the active variant matching the user's selected attributes
 * or falls back to the closest match or first variant.
 */
export function resolveActiveVariant(
  product: Product,
  selectedOptions: {
    size?: string;
    nominalDiameter?: string;
    material?: string;
    connectionType?: string;
  }
): ProductVariant | null {
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  // 1. Try exact match on size/DN + connectionType + material
  const exactMatch = product.variants.find((v) => {
    const sizeMatches =
      !selectedOptions.size ||
      v.size === selectedOptions.size ||
      v.nominalDiameter === selectedOptions.size ||
      v.nominalDiameter === selectedOptions.nominalDiameter;
    const materialMatches =
      !selectedOptions.material || v.material.includes(selectedOptions.material);
    const connMatches =
      !selectedOptions.connectionType ||
      v.connectionType.includes(selectedOptions.connectionType);
    return sizeMatches && materialMatches && connMatches;
  });

  if (exactMatch) return exactMatch;

  // 2. Try match on size/DN only
  if (selectedOptions.size || selectedOptions.nominalDiameter) {
    const targetSize = selectedOptions.size || selectedOptions.nominalDiameter;
    const sizeMatch = product.variants.find(
      (v) => v.size === targetSize || v.nominalDiameter === targetSize
    );
    if (sizeMatch) return sizeMatch;
  }

  // 3. Fallback to the first variant
  return product.variants[0];
}

/**
 * Checks whether a given variant can be purchased directly through the cart.
 * If price is null or product requires quotation or out of stock, direct cart add is blocked.
 */
export function canAddVariantToCart(variant: ProductVariant | null): {
  allowed: boolean;
  reason?: 'no_variant' | 'quote_required' | 'out_of_stock' | 'zero_stock';
} {
  if (!variant) {
    return { allowed: false, reason: 'no_variant' };
  }

  if (variant.quotationRequired || variant.price === null || variant.price <= 0) {
    return { allowed: false, reason: 'quote_required' };
  }

  if (variant.stockQuantity <= 0 && variant.stockStatus !== 'made_to_order') {
    return { allowed: false, reason: 'zero_stock' };
  }

  return { allowed: true };
}

/**
 * Extracts unique available options across product variants
 */
export function getAvailableOptionValues(product: Product): {
  sizes: string[];
  nominalDiameters: string[];
  materials: string[];
  connectionTypes: string[];
} {
  const sizes = new Set<string>();
  const nominalDiameters = new Set<string>();
  const materials = new Set<string>();
  const connectionTypes = new Set<string>();

  if (product.variants && product.variants.length > 0) {
    product.variants.forEach((v) => {
      if (v.size) sizes.add(v.size);
      if (v.nominalDiameter) nominalDiameters.add(v.nominalDiameter);
      if (v.material) materials.add(v.material);
      if (v.connectionType) connectionTypes.add(v.connectionType);
    });
  } else {
    if (product.nominalDiameter) {
      sizes.add(product.nominalDiameter);
      nominalDiameters.add(product.nominalDiameter);
    }
    if (product.material) materials.add(product.material);
    if (product.connectionType) connectionTypes.add(product.connectionType);
  }

  return {
    sizes: Array.from(sizes),
    nominalDiameters: Array.from(nominalDiameters),
    materials: Array.from(materials),
    connectionTypes: Array.from(connectionTypes),
  };
}

/**
 * Advanced product filtering and sorting logic
 */
export function filterProducts(
  products: Product[],
  filters: FilterState
): Product[] {
  return products
    .filter((product) => {
      // 1. Text search across name, SKU, category, material, DN, OD, connectionType, standards
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesMain =
          product.name.toLowerCase().includes(query) ||
          product.nameAr.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.material.toLowerCase().includes(query) ||
          product.nominalDiameter.toLowerCase().includes(query) ||
          product.outsideDiameter.toLowerCase().includes(query) ||
          product.connectionType.toLowerCase().includes(query) ||
          product.supplierStandardRef.toLowerCase().includes(query);

        const matchesVariant = product.variants?.some(
          (v) =>
            v.sku.toLowerCase().includes(query) ||
            v.nominalDiameter.toLowerCase().includes(query) ||
            v.outsideDiameterRange.toLowerCase().includes(query) ||
            v.material.toLowerCase().includes(query) ||
            v.connectionType.toLowerCase().includes(query)
        );

        if (!matchesMain && !matchesVariant) return false;
      }

      // 2. Category filter
      if (filters.category && filters.category !== 'all') {
        if (
          product.categorySlug !== filters.category &&
          product.category !== filters.category
        ) {
          return false;
        }
      }

      // 3. Material filter
      if (filters.material && filters.material !== 'all') {
        const targetMat = filters.material.toLowerCase();
        const matchesProduct = product.material.toLowerCase().includes(targetMat);
        const matchesVariant = product.variants?.some((v) =>
          v.material.toLowerCase().includes(targetMat)
        );
        if (!matchesProduct && !matchesVariant) return false;
      }

      // 4. Nominal Diameter (DN) filter
      if (filters.nominalDiameter && filters.nominalDiameter !== 'all') {
        const targetDN = filters.nominalDiameter.toLowerCase();
        const matchesProduct = product.nominalDiameter.toLowerCase().includes(targetDN);
        const matchesVariant = product.variants?.some((v) =>
          v.nominalDiameter.toLowerCase().includes(targetDN)
        );
        if (!matchesProduct && !matchesVariant) return false;
      }

      // 5. Outside Diameter (OD) filter
      if (filters.outsideDiameter && filters.outsideDiameter !== 'all') {
        const targetOD = filters.outsideDiameter.toLowerCase();
        const matchesProduct = product.outsideDiameter.toLowerCase().includes(targetOD);
        const matchesVariant = product.variants?.some((v) =>
          v.outsideDiameterRange.toLowerCase().includes(targetOD)
        );
        if (!matchesProduct && !matchesVariant) return false;
      }

      // 6. Connection Type filter
      if (filters.connectionType && filters.connectionType !== 'all') {
        const targetConn = filters.connectionType.toLowerCase();
        const matchesProduct = product.connectionType.toLowerCase().includes(targetConn);
        const matchesVariant = product.variants?.some((v) =>
          v.connectionType.toLowerCase().includes(targetConn)
        );
        if (!matchesProduct && !matchesVariant) return false;
      }

      // 7. Availability filter
      if (filters.availability && filters.availability !== 'all') {
        if (product.stockStatus !== filters.availability) {
          return false;
        }
      }

      // 8. Price Type filter (Direct Purchase vs Quote Required)
      if (filters.priceType === 'direct_purchase') {
        if (product.quotationRequired || product.price === null) return false;
      } else if (filters.priceType === 'quote_required') {
        if (!product.quotationRequired && product.price !== null) return false;
      }

      // 9. Price range (only applied to items with real confirmed prices)
      if (product.price !== null) {
        if (filters.minPrice !== undefined && product.price < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'price_low':
          // Sort items with price lowest to highest, quotation items at end
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return a.price - b.price;
        case 'price_high':
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return b.price - a.price;
        case 'newest':
          return (
            new Date(b.verificationDate).getTime() -
            new Date(a.verificationDate).getTime()
          );
        case 'relevance':
        default:
          return (a.salesRank ?? 999) - (b.salesRank ?? 999);
      }
    });
}
