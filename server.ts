import express from 'express';
import path from 'path';
import fs from 'fs';
import { db } from './src/server/db.ts';
import { filterProducts } from './src/utils/variants.ts';
import { FilterState } from './src/types/index.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// API Routes

// 1. Products API with search and filtering
app.get('/api/products', (req, res) => {
  try {
    const products = db.getAllProducts();
    const query = req.query;

    const filters: FilterState = {
      searchQuery: (query.search as string) || '',
      category: (query.category as string) || 'all',
      material: (query.material as string) || 'all',
      nominalDiameter: (query.nominalDiameter as string) || 'all',
      outsideDiameter: (query.outsideDiameter as string) || 'all',
      connectionType: (query.connectionType as string) || 'all',
      availability: (query.availability as string) || 'all',
      priceType: (query.priceType as FilterState['priceType']) || 'all',
      minPrice: query.minPrice ? Number(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
      sortBy: (query.sortBy as FilterState['sortBy']) || 'relevance',
    };

    const filtered = filterProducts(products, filters);
    res.json({
      total: filtered.length,
      products: filtered,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

app.get('/api/products/:sku', (req, res) => {
  const product = db.getProductBySku(req.params.sku);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.put('/api/products/:sku', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : undefined;
  if (!db.validateToken(token)) {
    return res.status(401).json({ error: 'Unauthorized. Admin token required.' });
  }

  const updated = db.updateProduct(req.params.sku, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(updated);
});

app.post('/api/products', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : undefined;
  if (!db.validateToken(token)) {
    return res.status(401).json({ error: 'Unauthorized. Admin token required.' });
  }

  const newProd = db.createProduct(req.body);
  res.status(201).json(newProd);
});

app.post('/api/reset-catalog', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : undefined;
  if (!db.validateToken(token)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const reset = db.resetCatalogToDefault();
  res.json({ success: true, count: reset.length });
});

// 2. Categories API
app.get('/api/categories', (_req, res) => {
  res.json(db.getCategories());
});

// 3. Cart API
app.get('/api/cart', (req, res) => {
  const sessionId = (req.query.sessionId as string) || 'guest';
  res.json(db.getCart(sessionId));
});

app.post('/api/cart', (req, res) => {
  const { sessionId = 'guest', items = [] } = req.body;
  const saved = db.saveCart(sessionId, items);
  res.json(saved);
});

// 4. Favorites API
app.get('/api/favorites', (req, res) => {
  const sessionId = (req.query.sessionId as string) || 'guest';
  res.json(db.getFavorites(sessionId));
});

app.post('/api/favorites', (req, res) => {
  const { sessionId = 'guest', items = [] } = req.body;
  const saved = db.saveFavorites(sessionId, items);
  res.json(saved);
});

// 5. Quotation Requests (RFQ) API
app.post('/api/quotations', (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, country, deliveryCity, projectType, urgency, items, projectDescription } = req.body;
    if (!companyName || !email || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required RFQ fields' });
    }

    const rfq = db.createQuotation({
      companyName,
      contactPerson: contactPerson || 'Project Engineer',
      email,
      phone: phone || '',
      country: country || 'International',
      deliveryCity: deliveryCity || '',
      projectType: projectType || 'municipal_water',
      urgency: urgency || 'routine',
      items,
      projectDescription: projectDescription || '',
    });

    res.status(201).json(rfq);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create quotation request' });
  }
});

app.get('/api/quotations', (req, res) => {
  res.json(db.getQuotations());
});

app.put('/api/quotations/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : undefined;
  if (!db.validateToken(token)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { status, adminNotes } = req.body;
  const updated = db.updateQuotationStatus(req.params.id, status, adminNotes);
  if (!updated) return res.status(404).json({ error: 'Quotation not found' });
  res.json(updated);
});

// 6. Orders API
app.post('/api/orders', (req, res) => {
  try {
    const { customerName, companyName, email, phone, shippingAddress, items, subtotal, shippingFreight, estimatedTax, total, currency, paymentMethod } = req.body;
    if (!customerName || !email || !items || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    const order = db.createOrder({
      customerName,
      companyName,
      email,
      phone: phone || '',
      shippingAddress: shippingAddress || {
        street: 'Commercial Bay 1',
        city: 'Metropolis',
        stateOrProvince: '',
        postalCode: '',
        country: 'US',
      },
      items,
      subtotal: Number(subtotal),
      shippingFreight: Number(shippingFreight),
      estimatedTax: Number(estimatedTax || 0),
      total: Number(total),
      currency: currency || 'USD',
      status: 'pending_configuration',
      paymentMethod: paymentMethod || 'invoice_po',
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Order placement failed' });
  }
});

app.get('/api/orders', (req, res) => {
  res.json(db.getOrders());
});

app.put('/api/orders/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : undefined;
  if (!db.validateToken(token)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const updated = db.updateOrderStatus(req.params.id, req.body.status);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
});

// 7. Newsletter
app.post('/api/newsletter', (req, res) => {
  const { email, consent } = req.body;
  if (!consent || !email) {
    return res.status(400).json({ error: 'Email and explicit consent required' });
  }
  const success = db.addNewsletterSubscriber(email, consent);
  res.json({ success, message: 'Subscribed to Technical Engineering Bulletin' });
});

// 8. Admin Authentication & Analytics
app.post('/api/admin/login', (req, res) => {
  const { passkey } = req.body;
  const result = db.verifyAdminAuth(passkey);
  if (result.success) {
    res.json({ success: true, token: result.token });
  } else {
    res.status(401).json({ error: 'Invalid administrator security credentials' });
  }
});

app.get('/api/admin/stats', (req, res) => {
  res.json(db.getDashboardStats());
});

// Setup Frontend Server
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HydroCore Pipeline Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
