/**
 * Core Type Definitions for HydroCore Industrial Pipeline Dynamics
 */

export type Language = 'en' | 'ar';

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  count: number;
  iconName: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  nameAr?: string;
  size: string; // e.g., "DN100 (4\")"
  nominalDiameter: string; // e.g., "DN100"
  outsideDiameterRange: string; // e.g., "108 - 128 mm"
  material: string; // e.g., "Ductile Iron GGG50 / SS316"
  connectionType: string; // e.g., "Flanged PN16", "Threaded 2\" BSP", "Universal Grip"
  pressureRating: string; // e.g., "PN16 (16 Bar / 232 PSI)"
  weightKg: number;
  price: number | null; // null indicates quotation required
  quotationRequired: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'made_to_order' | 'lead_time';
  stockQuantity: number;
  leadTimeWeeks?: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameAr: string;
  category: string;
  categorySlug: string;
  description: string;
  descriptionAr: string;
  material: string;
  materialAr?: string;
  nominalDiameter: string; // Base / default DN
  outsideDiameter: string; // Base / default OD range
  availableDimensions: string[]; // List of available sizes
  connectionType: string; // Base connection type
  pressureRating: string; // Base pressure rating
  compatiblePipeMaterials: string[]; // e.g., ["Ductile Iron", "Steel", "HDPE", "PVC", "Cast Iron"]
  weightKg: number;
  supplierStandardRef: string; // e.g. "EN 545 / ISO 2531 / AWWA C219"
  sourceUrl: string; // Reliable technical research source URL
  verificationDate: string; // e.g. "2026-10-15"
  stockStatus: 'in_stock' | 'low_stock' | 'made_to_order' | 'lead_time';
  currency: 'USD' | 'EUR' | 'SAR' | 'AED';
  price: number | null; // null if quote required
  quotationRequired: boolean;
  image: string;
  imageAlt?: string;
  imageAltAr?: string;
  videoUrl?: string;
  featured?: boolean;
  salesRank?: number;
  variants: ProductVariant[];
  technicalSpecs: {
    label: string;
    labelAr: string;
    value: string;
    valueAr: string;
  }[];
  certifications: string[]; // e.g. ["ISO 9001", "WRAS Approved EPDM", "CE Marked"]
}

export interface FilterState {
  searchQuery: string;
  category: string;
  material: string;
  nominalDiameter: string;
  outsideDiameter: string;
  connectionType: string;
  availability: string;
  priceType: 'all' | 'direct_purchase' | 'quote_required';
  minPrice?: number;
  maxPrice?: number;
  sortBy: 'relevance' | 'name_asc' | 'name_desc' | 'price_low' | 'price_high' | 'newest';
}

export interface CartItem {
  cartItemId: string; // unique item id in cart (productId + variantId)
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  nameAr: string;
  category: string;
  size: string;
  nominalDiameter: string;
  connectionType: string;
  material: string;
  price: number;
  currency: string;
  quantity: number;
  maxStock: number;
  weightKg: number;
  image: string;
}

export interface FavoriteItem {
  productId: string;
  sku: string;
  name: string;
  nameAr: string;
  category: string;
  price: number | null;
  quotationRequired: boolean;
  currency: string;
  image: string;
  addedAt: string;
}

export interface QuotationRequestItem {
  productId: string;
  variantId?: string;
  sku: string;
  name: string;
  nameAr?: string;
  quantity: number;
  size?: string;
  targetDate?: string;
  notes?: string;
}

export interface QuotationRequest {
  id: string;
  referenceNumber: string;
  createdAt: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  deliveryCity: string;
  projectType: 'municipal_water' | 'wastewater' | 'industrial_cooling' | 'desalination' | 'pipeline_repair' | 'other';
  urgency: 'routine' | 'urgent' | 'emergency_shutdown';
  items: QuotationRequestItem[];
  projectDescription: string;
  specificationsFile?: string;
  status: 'pending' | 'reviewing' | 'quoted' | 'archived';
  adminNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  companyName?: string;
  email: string;
  phone: string;
  shippingAddress: {
    street: string;
    city: string;
    stateOrProvince: string;
    postalCode: string;
    country: string;
  };
  items: CartItem[];
  subtotal: number;
  shippingFreight: number;
  estimatedTax: number;
  total: number;
  currency: string;
  status: 'pending_configuration' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: 'invoice_po' | 'test_credit_card' | 'bank_wire';
}

export interface AudioSettings {
  enabled: boolean;
  volume: number; // 0 to 1
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  inStockCount: number;
  quoteRequiredCount: number;
  totalQuotations: number;
  pendingQuotations: number;
  totalOrders: number;
  inventoryBreakdown: { category: string; count: number }[];
}
