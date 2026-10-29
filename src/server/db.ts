import fs from 'fs';
import path from 'path';
import { Product, Category, QuotationRequest, Order, CartItem, FavoriteItem, DashboardStats } from '../types/index.ts';
import { initialProducts } from '../data/products.ts';
import { categories } from '../data/categories.ts';

const DATA_DIR = path.resolve('data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  version: number;
  lastInitialized: string;
  products: Product[];
  categories: Category[];
  quotations: QuotationRequest[];
  orders: Order[];
  carts: Record<string, CartItem[]>; // sessionId -> items
  favorites: Record<string, FavoriteItem[]>; // sessionId -> items
  newsletter: { email: string; subscribedAt: string; consentGiven: boolean }[];
  adminSessionTokens: string[];
}

class PersistentDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrInitialize();
  }

  private loadOrInitialize(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.products && parsed.products.length >= 80) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read existing database, re-initializing...', err);
    }

    // Seed database
    const initialDb: DatabaseSchema = {
      version: 1,
      lastInitialized: new Date().toISOString(),
      products: JSON.parse(JSON.stringify(initialProducts)),
      categories: JSON.parse(JSON.stringify(categories)),
      quotations: [
        {
          id: 'RFQ-2026-001',
          referenceNumber: 'RFQ-HC-8821',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          companyName: 'Al-Rayyan Municipal Water Authority',
          contactPerson: 'Eng. Fahad Al-Mansoor',
          email: 'f.almansoor@mwa-gov.example',
          phone: '+966 50 123 4567',
          country: 'Saudi Arabia',
          deliveryCity: 'Riyadh Logistics Central Hub',
          projectType: 'municipal_water',
          urgency: 'routine',
          items: [
            {
              productId: 'prod-ts-01',
              sku: 'TS-DI-DN150-2-BSP',
              name: 'DN150 Main x 2" BSP Tapping Saddle',
              quantity: 120,
              size: 'DN150 (6")',
              notes: 'Required with WRAS potable EPDM waffle gaskets',
            },
            {
              productId: 'prod-rc-01',
              sku: 'RC-SS-150-300',
              name: 'DN150 OD 159-170mm Repair Clamp',
              quantity: 80,
              size: 'DN150 (6")',
              notes: '316 stainless band with teflon bolts',
            },
          ],
          projectDescription: 'Secondary municipal distribution rehabilitation project for Sector 4 mains expansion.',
          status: 'reviewing',
          adminNotes: 'Mill test certificates MTR 3.1 requested. Freight rate via Dammam port calculated.',
        },
      ],
      orders: [
        {
          id: 'ORD-2026-101',
          orderNumber: 'PO-HC-4401',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          customerName: 'Marcus Vance',
          companyName: 'Vance Pipeline Contracting LLC',
          email: 'procurement@vancepipeline.example',
          phone: '+1 713 555 0192',
          shippingAddress: {
            street: '1420 Industrial Parkway, Dock 4',
            city: 'Houston',
            stateOrProvince: 'TX',
            postalCode: '77001',
            country: 'United States',
          },
          items: [
            {
              cartItemId: 'prod-ts-01_var-ts-01-1',
              productId: 'prod-ts-01',
              variantId: 'var-ts-01-1',
              sku: 'TS-DI-DN100-2-BSP',
              name: 'DN100 (4") Main x 2" BSP Outlet',
              nameAr: 'قطر رئيسي DN100 مع مخرج 2 بوصة BSP',
              category: 'Tapping Saddles & Service Saddles',
              size: 'DN100 (4")',
              nominalDiameter: 'DN100',
              connectionType: 'Threaded 2" BSP Female',
              material: 'Ductile Iron GGG50 & SS316 Straps',
              price: 94.50,
              currency: 'USD',
              quantity: 6,
              maxStock: 42,
              weightKg: 5.4,
              image: '/images/products/tapping-saddle-double-strap.svg',
            },
            {
              cartItemId: 'prod-ca-01_var-ca-01-2',
              productId: 'prod-ca-01',
              variantId: 'var-ca-01-2',
              sku: 'CA-FL-100-PN16',
              name: 'DN100 Flange Adapter (OD 107-132mm)',
              nameAr: 'DN100 محول فلانشة',
              category: 'Pipe Connectors & Adapters',
              size: 'DN100 (4")',
              nominalDiameter: 'DN100',
              connectionType: 'Flanged PN16',
              material: 'Ductile Iron GGG50',
              price: 124.00,
              currency: 'USD',
              quantity: 4,
              maxStock: 50,
              weightKg: 8.5,
              image: '/images/products/flange-adapter.svg',
            },
          ],
          subtotal: 1063.00,
          shippingFreight: 150.00,
          estimatedTax: 0,
          total: 1213.00,
          currency: 'USD',
          status: 'processing',
          paymentMethod: 'invoice_po',
        },
      ],
      carts: {},
      favorites: {},
      newsletter: [
        {
          email: 'waterengineer@municipal-infra.example',
          subscribedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          consentGiven: true,
        },
      ],
      adminSessionTokens: ['hc-admin-authorized-token-2026'],
    };

    this.persist(initialDb);
    return initialDb;
  }

  private persist(data?: DatabaseSchema) {
    const toSave = data || this.data;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmp = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(toSave, null, 2), 'utf-8');
      fs.renameSync(tmp, DB_FILE);
    } catch (err) {
      console.error('Failed to write database:', err);
    }
  }

  // Product Operations
  public getAllProducts(): Product[] {
    return this.data.products;
  }

  public getProductBySku(skuOrId: string): Product | null {
    const search = skuOrId.toLowerCase();
    return (
      this.data.products.find(
        (p) =>
          p.sku.toLowerCase() === search ||
          p.id.toLowerCase() === search ||
          p.variants.some((v) => v.sku.toLowerCase() === search)
      ) || null
    );
  }

  public updateProduct(sku: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(
      (p) => p.sku.toLowerCase() === sku.toLowerCase() || p.id === sku
    );
    if (idx === -1) return null;

    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      verificationDate: new Date().toISOString().split('T')[0],
    };
    this.persist();
    return this.data.products[idx];
  }

  public createProduct(product: Product): Product {
    this.data.products.push(product);
    this.persist();
    return product;
  }

  public resetCatalogToDefault(): Product[] {
    this.data.products = JSON.parse(JSON.stringify(initialProducts));
    this.persist();
    return this.data.products;
  }

  // Categories
  public getCategories(): Category[] {
    return this.data.categories;
  }

  // Cart persistence
  public getCart(sessionId: string): CartItem[] {
    return this.data.carts[sessionId] || [];
  }

  public saveCart(sessionId: string, items: CartItem[]): CartItem[] {
    this.data.carts[sessionId] = items;
    this.persist();
    return items;
  }

  // Favorites persistence
  public getFavorites(sessionId: string): FavoriteItem[] {
    return this.data.favorites[sessionId] || [];
  }

  public saveFavorites(sessionId: string, items: FavoriteItem[]): FavoriteItem[] {
    this.data.favorites[sessionId] = items;
    this.persist();
    return items;
  }

  // Quotations
  public getQuotations(): QuotationRequest[] {
    return this.data.quotations;
  }

  public createQuotation(rfq: Omit<QuotationRequest, 'id' | 'referenceNumber' | 'createdAt' | 'status'>): QuotationRequest {
    const refNum = `RFQ-HC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRfq: QuotationRequest = {
      ...rfq,
      id: `RFQ-${Date.now()}`,
      referenceNumber: refNum,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    this.data.quotations.unshift(newRfq);
    this.persist();
    return newRfq;
  }

  public updateQuotationStatus(id: string, status: QuotationRequest['status'], adminNotes?: string): QuotationRequest | null {
    const rfq = this.data.quotations.find((q) => q.id === id || q.referenceNumber === id);
    if (!rfq) return null;
    rfq.status = status;
    if (adminNotes !== undefined) rfq.adminNotes = adminNotes;
    this.persist();
    return rfq;
  }

  // Orders
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      orderNumber: `PO-HC-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.orders.unshift(newOrder);

    // Decrement stock for purchased variants
    for (const item of newOrder.items) {
      const prod = this.data.products.find((p) => p.id === item.productId);
      if (prod && prod.variants) {
        const variant = prod.variants.find((v) => v.id === item.variantId || v.sku === item.sku);
        if (variant && variant.stockQuantity > 0) {
          variant.stockQuantity = Math.max(0, variant.stockQuantity - item.quantity);
          if (variant.stockQuantity === 0) {
            variant.stockStatus = 'low_stock';
          }
        }
      }
    }

    this.persist();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: Order['status']): Order | null {
    const order = this.data.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.status = status;
    this.persist();
    return order;
  }

  // Newsletter
  public addNewsletterSubscriber(email: string, consent: boolean): boolean {
    if (!consent || !email || !email.includes('@')) return false;
    const exists = this.data.newsletter.some((n) => n.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      this.data.newsletter.push({
        email: email.trim().toLowerCase(),
        subscribedAt: new Date().toISOString(),
        consentGiven: true,
      });
      this.persist();
    }
    return true;
  }

  // Admin Verification
  public verifyAdminAuth(passkey: string): { success: boolean; token?: string } {
    // Industrial admin security key
    if (passkey === 'admin' || passkey === 'hydrocore2026' || passkey === 'admin123') {
      const token = `hc-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      this.data.adminSessionTokens.push(token);
      this.persist();
      return { success: true, token };
    }
    return { success: false };
  }

  public validateToken(token?: string): boolean {
    if (!token) return false;
    return this.data.adminSessionTokens.includes(token);
  }

  // Stats
  public getDashboardStats(): DashboardStats {
    const inStockCount = this.data.products.filter((p) => p.stockStatus === 'in_stock').length;
    const quoteRequiredCount = this.data.products.filter((p) => p.quotationRequired || p.price === null).length;
    const pendingQuotations = this.data.quotations.filter((q) => q.status === 'pending').length;

    const inventoryMap: Record<string, number> = {};
    for (const p of this.data.products) {
      inventoryMap[p.category] = (inventoryMap[p.category] || 0) + 1;
    }

    return {
      totalProducts: this.data.products.length,
      totalCategories: this.data.categories.length,
      inStockCount,
      quoteRequiredCount,
      totalQuotations: this.data.quotations.length,
      pendingQuotations,
      totalOrders: this.data.orders.length,
      inventoryBreakdown: Object.entries(inventoryMap).map(([category, count]) => ({ category, count })),
    };
  }
}

export const db = new PersistentDatabase();
