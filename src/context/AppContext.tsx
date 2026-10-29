import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  Category,
  ProductVariant,
  CartItem,
  FavoriteItem,
  FilterState,
  Language,
  QuotationRequest,
  Order,
} from '../types/index.ts';
import { initialProducts } from '../data/products.ts';
import { categories } from '../data/categories.ts';
import { getTranslation, translations } from '../i18n/translations.ts';
import { soundEngine } from '../utils/sound.ts';
import { canAddVariantToCart, resolveActiveVariant } from '../utils/variants.ts';
import { validateQuantityChange } from '../utils/cart-rules.ts';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
  isRtl: boolean;

  soundEnabled: boolean;
  toggleSound: () => void;

  products: Product[];
  categories: Category[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  activeView: 'home' | 'shop' | 'categories' | 'product_detail' | 'cart' | 'favorites' | 'admin' | 'checkout';
  navigateTo: (view: 'home' | 'shop' | 'categories' | 'product_detail' | 'cart' | 'favorites' | 'admin' | 'checkout', sku?: string) => void;
  selectedProductSku: string | null;

  cart: CartItem[];
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant | null, quantity?: number) => { success: boolean; message?: string };
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;

  favorites: FavoriteItem[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;

  rfqModalOpen: boolean;
  rfqItem: { product: Product; variant: ProductVariant | null } | null;
  openRfq: (product?: Product, variant?: ProductVariant | null) => void;
  closeRfq: () => void;

  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  isAdminLoggedIn: boolean;

  notification: { message: string; type: 'success' | 'info' | 'error' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;

  refreshProducts: () => Promise<void>;
}

const defaultFilters: FilterState = {
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hydrocore_lang');
      if (saved === 'ar' || saved === 'en') return saved;
    }
    return 'en';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundEngine.isEnabled());
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categoriesList] = useState<Category[]>(categories);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const [activeView, setActiveView] = useState<'home' | 'shop' | 'categories' | 'product_detail' | 'cart' | 'favorites' | 'admin' | 'checkout'>('home');
  const [selectedProductSku, setSelectedProductSku] = useState<string | null>(null);

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [rfqItem, setRfqItem] = useState<{ product: Product; variant: ProductVariant | null } | null>(null);

  const [adminToken, setAdminTokenState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hydrocore_admin_token');
    }
    return null;
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('hydrocore_cart');
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return [];
  });

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('hydrocore_favorites');
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return [];
  });

  // Sync Language and RTL attribute
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('hydrocore_lang', language);
  }, [language]);

  // Sync Cart to local storage & backend
  useEffect(() => {
    localStorage.setItem('hydrocore_cart', JSON.stringify(cart));
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: 'guest', items: cart }),
    }).catch(() => {});
  }, [cart]);

  // Sync Favorites to local storage & backend
  useEffect(() => {
    localStorage.setItem('hydrocore_favorites', JSON.stringify(favorites));
    fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: 'guest', items: favorites }),
    }).catch(() => {});
  }, [favorites]);

  // Fetch live products from backend on mount
  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      }
    } catch {}
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // Sync Hash URL Navigation (#product/SKU, #shop, #favorites, #cart, #admin)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product/')) {
        const sku = decodeURIComponent(hash.replace('#product/', ''));
        setSelectedProductSku(sku);
        setActiveView('product_detail');
      } else if (hash === '#shop') {
        setActiveView('shop');
      } else if (hash === '#categories') {
        setActiveView('categories');
      } else if (hash === '#favorites') {
        setActiveView('favorites');
      } else if (hash === '#cart') {
        setActiveView('cart');
      } else if (hash === '#checkout') {
        setActiveView('checkout');
      } else if (hash === '#admin') {
        setActiveView('admin');
      } else {
        setActiveView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: 'home' | 'shop' | 'categories' | 'product_detail' | 'cart' | 'favorites' | 'admin' | 'checkout', sku?: string) => {
    soundEngine.playTick();
    if (view === 'product_detail' && sku) {
      setSelectedProductSku(sku);
      setActiveView('product_detail');
      window.location.hash = `#product/${encodeURIComponent(sku)}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSelectedProductSku(null);
      setActiveView(view);
      window.location.hash = view === 'home' ? '' : `#${view}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const setLanguage = (lang: Language) => {
    soundEngine.playTick();
    setLanguageState(lang);
    showNotification(lang === 'ar' ? 'تم تحويل اللغة إلى العربية (RTL)' : 'Language switched to English (LTR)', 'info');
  };

  const toggleSound = () => {
    const next = soundEngine.toggle();
    setSoundEnabled(next);
    showNotification(next ? getTranslation(language, 'soundToggleOn') : getTranslation(language, 'soundToggleOff'), 'info');
  };

  const setAdminToken = (token: string | null) => {
    setAdminTokenState(token);
    if (token) {
      localStorage.setItem('hydrocore_admin_token', token);
    } else {
      localStorage.removeItem('hydrocore_admin_token');
    }
  };

  const resetFilters = () => {
    soundEngine.playTick();
    setFilters(defaultFilters);
  };

  // Cart Operations
  const addToCart = (product: Product, variant: ProductVariant | null, quantity: number = 1): { success: boolean; message?: string } => {
    const activeVar = variant || resolveActiveVariant(product, {});
    const check = canAddVariantToCart(activeVar);

    if (!check.allowed) {
      soundEngine.playError();
      if (check.reason === 'quote_required') {
        openRfq(product, activeVar);
        return {
          success: false,
          message: language === 'ar' ? 'هذا المنتج الهندسي يتطلب تسعيراً رسمياً (RFQ).' : 'This engineered item requires an official quotation (RFQ).',
        };
      }
      return {
        success: false,
        message: language === 'ar' ? 'هذا القياس غير متوفر للشراء المباشر.' : 'This configuration is not currently available for direct purchase.',
      };
    }

    if (!activeVar) return { success: false };

    const cartItemId = `${product.id}_${activeVar.id}`;
    const price = activeVar.price || 0;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        const val = validateQuantityChange(existing.quantity, quantity, activeVar.stockQuantity);
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: val.newQty } : item
        );
      } else {
        const newItem: CartItem = {
          cartItemId,
          productId: product.id,
          variantId: activeVar.id,
          sku: activeVar.sku,
          name: activeVar.name || product.name,
          nameAr: activeVar.nameAr || product.nameAr,
          category: product.category,
          size: activeVar.size,
          nominalDiameter: activeVar.nominalDiameter,
          connectionType: activeVar.connectionType,
          material: activeVar.material,
          price,
          currency: product.currency,
          quantity,
          maxStock: activeVar.stockQuantity,
          weightKg: activeVar.weightKg,
          image: product.image,
        };
        return [...prev, newItem];
      }
    });

    soundEngine.playAddToCart();
    showNotification(
      language === 'ar'
        ? `تمت إضافة ${activeVar.sku} إلى عربة التوريد`
        : `Added ${activeVar.sku} to procurement cart`,
      'success'
    );
    setCartDrawerOpen(true);
    return { success: true };
  };

  const removeFromCart = (cartItemId: string) => {
    soundEngine.playTick();
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const check = validateQuantityChange(item.quantity, delta, item.maxStock);
            if (!check.valid && delta > 0) {
              soundEngine.playError();
              showNotification(check.message || 'Maximum inventory reached', 'error');
              return item;
            }
            soundEngine.playTick();
            return { ...item, quantity: check.newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Favorites Operations
  const isFavorite = (productId: string) => {
    return favorites.some((f) => f.productId === productId);
  };

  const toggleFavorite = (product: Product) => {
    const exists = isFavorite(product.id);
    if (exists) {
      soundEngine.playFavorite(false);
      setFavorites((prev) => prev.filter((f) => f.productId !== product.id));
      showNotification(
        language === 'ar' ? 'تمت إزالة المنتج من المفضلة' : 'Removed specification from favorites',
        'info'
      );
    } else {
      soundEngine.playFavorite(true);
      const newFav: FavoriteItem = {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        nameAr: product.nameAr,
        category: product.category,
        price: product.price,
        quotationRequired: product.quotationRequired,
        currency: product.currency,
        image: product.image,
        addedAt: new Date().toISOString(),
      };
      setFavorites((prev) => [...prev, newFav]);
      showNotification(
        language === 'ar' ? 'تم حفظ المواصفة في المفضلة' : 'Specification saved to favorites',
        'success'
      );
    }
  };

  // RFQ Quotation Modal
  const openRfq = (product?: Product, variant?: ProductVariant | null) => {
    soundEngine.playTick();
    if (product) {
      setRfqItem({ product, variant: variant || null });
    } else {
      setRfqItem(null);
    }
    setRfqModalOpen(true);
  };

  const closeRfq = () => {
    setRfqModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t: (key) => getTranslation(language, key),
        isRtl: language === 'ar',
        soundEnabled,
        toggleSound,
        products,
        categories: categoriesList,
        filters,
        setFilters,
        resetFilters,
        activeView,
        navigateTo,
        selectedProductSku,
        cart,
        cartDrawerOpen,
        setCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        favorites,
        toggleFavorite,
        isFavorite,
        rfqModalOpen,
        rfqItem,
        openRfq,
        closeRfq,
        adminToken,
        setAdminToken,
        isAdminLoggedIn: !!adminToken,
        notification,
        showNotification,
        refreshProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
