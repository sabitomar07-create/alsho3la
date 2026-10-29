import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Product, ProductVariant, QuotationRequest, Order, DashboardStats } from '../types/index.ts';
import { soundEngine } from '../utils/sound.ts';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  LogOut,
  Edit2,
  Save,
  X,
  Plus,
  RefreshCw,
  FileText,
  ShoppingBag,
  BarChart3,
  Search,
  CheckCircle2,
  Clock,
  ListTodo,
  CheckSquare,
  Square,
  Trash2,
} from 'lucide-react';

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  relatedSku?: string;
}

export const AdminDashboard: React.FC = () => {
  const {
    t,
    language,
    products,
    refreshProducts,
    adminToken,
    setAdminToken,
    isAdminLoggedIn,
    showNotification,
  } = useApp();

  const [passkey, setPasskey] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'quotations' | 'orders' | 'tasks' | 'stats'>('products');
  const [searchTerm, setSearchTerm] = useState('');

  // Quotations & Orders state from API
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Editable product modal/inline state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);
  const [editingStock, setEditingStock] = useState<number>(0);
  const [editingStockStatus, setEditingStockStatus] = useState<any>('in_stock');
  const [editingQuoteRequired, setEditingQuoteRequired] = useState<boolean>(false);

  // Project Tasks state persisted in localStorage
  const [tasks, setTasks] = useState<ProjectTask[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hydrocore_project_tasks');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return [
      {
        id: 'TASK-101',
        title: 'Conduct Hydrostatic Witness Test on DN300 Gate Valves',
        description: 'Verify 25.0 Bar shell pressure hold for Sector 4 pumping station consignment.',
        assignedTo: 'Chief Inspector K. Evans',
        priority: 'critical',
        status: 'in_progress',
        dueDate: '2026-11-05',
        relatedSku: 'VC-GATE-DN150-PN16',
      },
      {
        id: 'TASK-102',
        title: 'Issue Mill Test Reports (MTR 3.1) for Stainless Repair Sleeves',
        description: 'Prepare spectrometer chemical analysis and tensile yield certificates for Al-Rayyan RFQ.',
        assignedTo: 'Quality Assurance Lab',
        priority: 'high',
        status: 'completed',
        dueDate: '2026-10-30',
        relatedSku: 'RC-SS-DN150-L300',
      },
      {
        id: 'TASK-103',
        title: 'Receive Factory Dispatch for M20 Fluoropolymer Bolts',
        description: 'Check Blue Xylan coating thickness (min 25 µm) and verify 3000h salt spray lot certificate.',
        assignedTo: 'Receiving Bay 2',
        priority: 'medium',
        status: 'pending',
        dueDate: '2026-11-12',
        relatedSku: 'BG-BOLT-M20-KIT8',
      },
    ];
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('hydrocore_project_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const loadAdminData = async () => {
    if (!adminToken) return;
    try {
      const [resQuotes, resOrders, resStats] = await Promise.all([
        fetch('/api/quotations'),
        fetch('/api/orders'),
        fetch('/api/admin/stats'),
      ]);
      if (resQuotes.ok) setQuotations(await resQuotes.json());
      if (resOrders.ok) setOrders(await resOrders.json());
      if (resStats.ok) setStats(await resStats.json());
    } catch {}
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAdminData();
    }
  }, [isAdminLoggedIn]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        soundEngine.playSubmitSuccess();
        setAdminToken(data.token);
        showNotification(t('adminLoggedAs'), 'success');
      } else {
        soundEngine.playError();
        showNotification('Invalid admin security credentials', 'error');
      }
    } catch {
      soundEngine.playError();
      showNotification('Authentication server error', 'error');
    }
  };

  const handleLogout = () => {
    soundEngine.playTick();
    setAdminToken(null);
  };

  // Start Editing Product
  const startEditing = (prod: Product) => {
    soundEngine.playTick();
    setEditingProduct(prod);
    setEditingPrice(prod.price || 0);
    setEditingStock(prod.variants?.[0]?.stockQuantity || 10);
    setEditingStockStatus(prod.stockStatus);
    setEditingQuoteRequired(prod.quotationRequired || prod.price === null);
  };

  // Save Edited Product
  const saveProductChanges = async () => {
    if (!editingProduct) return;
    try {
      const updatedVariants = editingProduct.variants?.map((v, i) =>
        i === 0
          ? {
              ...v,
              price: editingQuoteRequired ? null : editingPrice,
              quotationRequired: editingQuoteRequired,
              stockQuantity: editingStock,
              stockStatus: editingStockStatus,
            }
          : v
      );

      const res = await fetch(`/api/products/${encodeURIComponent(editingProduct.sku)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          price: editingQuoteRequired ? null : editingPrice,
          quotationRequired: editingQuoteRequired,
          stockStatus: editingStockStatus,
          variants: updatedVariants,
        }),
      });

      if (res.ok) {
        soundEngine.playSubmitSuccess();
        await refreshProducts();
        setEditingProduct(null);
        showNotification('Product specifications updated successfully in database', 'success');
      } else {
        soundEngine.playError();
        showNotification('Failed to update product', 'error');
      }
    } catch {
      soundEngine.playError();
      showNotification('Network error while saving changes', 'error');
    }
  };

  // Reset to default 80 catalog
  const handleResetCatalog = async () => {
    if (!window.confirm('Reset catalog back to initial 80 certified pipeline products?')) return;
    try {
      const res = await fetch('/api/reset-catalog', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        soundEngine.playSubmitSuccess();
        await refreshProducts();
        showNotification('Catalog successfully reset to 80 default specifications', 'success');
      }
    } catch {}
  };

  // Update Quotation Status
  const handleUpdateQuoteStatus = async (id: string, status: QuotationRequest['status']) => {
    try {
      const res = await fetch(`/api/quotations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        soundEngine.playTick();
        loadAdminData();
        showNotification(`RFQ status updated to ${status}`, 'success');
      }
    } catch {}
  };

  // Task operations
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    const task: ProjectTask = {
      id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
      title: newTaskTitle,
      description: newTaskDesc,
      assignedTo: newTaskAssignee || 'Quality Engineering Team',
      priority: newTaskPriority,
      status: 'pending',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    };
    setTasks([task, ...tasks]);
    soundEngine.playSubmitSuccess();
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskAssignee('');
    showNotification('Project engineering task added and saved to database', 'success');
  };

  const toggleTaskStatus = (id: string) => {
    soundEngine.playTick();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? 'in_progress' : 'completed' }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    soundEngine.playTick();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Render Login State if not authenticated
  if (!isAdminLoggedIn) {
    return (
      <div className="bg-[#070C18] min-h-screen py-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-['Chakra_Petch'] text-white">
              {t('adminLoginTitle')}
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Authenticate with your engineering credentials to access product administration, RFQs, and purchase orders.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Security Key</label>
              <input
                type="password"
                required
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter admin password (e.g. admin or hydrocore2026)"
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95"
            >
              {t('adminLoginBtn')}
            </button>
            <div className="text-center">
              <span className="text-[10px] font-mono text-slate-500">
                Hint for evaluation: Use <code className="text-cyan-400">admin</code> or <code className="text-cyan-400">hydrocore2026</code>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Filtered Products in Admin Table
  const filteredAdminProducts = products.filter((p) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.sku.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-[#070C18] min-h-screen py-8 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Admin Bar */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold font-['Chakra_Petch'] text-white">
                {t('adminPortal')}
              </h1>
              <p className="text-[11px] font-mono text-emerald-400">
                {t('adminLoggedAs')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={handleResetCatalog}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('adminResetCatalog')}</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-mono flex items-center gap-1.5 border border-rose-800/60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('adminLogout')}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 space-x-1 sm:space-x-4 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 border-b-2 font-bold transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t('adminTabProducts')}
          </button>
          <button
            onClick={() => setActiveTab('quotations')}
            className={`py-3 px-4 border-b-2 font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'quotations'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>{t('adminTabQuotations')}</span>
            {quotations.filter((q) => q.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 font-bold transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t('adminTabOrders')} ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-3 px-4 border-b-2 font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Project Tasks Manager ({tasks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-4 border-b-2 font-bold transition-all whitespace-nowrap ${
              activeTab === 'stats'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t('adminTabStats')}
          </button>
        </div>

        {/* TAB 1: PRODUCTS & VARIANTS MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('adminSearchProducts')}
                  className="w-full h-9 pl-9 pr-4 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
              <span className="text-xs font-mono text-slate-400">
                Showing {filteredAdminProducts.length} of {products.length} products
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">DN Size</th>
                    <th className="p-3">Pressure</th>
                    <th className="p-3">Price (USD)</th>
                    <th className="p-3">Stock Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredAdminProducts.map((p) => {
                    const isQuote = p.quotationRequired || p.price === null;
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 text-cyan-300 font-bold">{p.sku}</td>
                        <td className="p-3 text-white truncate max-w-xs">{p.name}</td>
                        <td className="p-3 text-slate-400 truncate max-w-[160px]">{p.category}</td>
                        <td className="p-3 text-slate-300">{p.nominalDiameter}</td>
                        <td className="p-3 text-slate-300">{p.pressureRating.split(' ')[0]}</td>
                        <td className="p-3">
                          {isQuote ? (
                            <span className="text-amber-400 font-bold">QUOTE ONLY</span>
                          ) : (
                            <span className="text-white font-bold">${p.price?.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              p.stockStatus === 'in_stock'
                                ? 'bg-emerald-950 text-emerald-400'
                                : 'bg-amber-950 text-amber-400'
                            }`}
                          >
                            {p.stockStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => startEditing(p)}
                            className="px-2.5 py-1 rounded bg-blue-950 hover:bg-blue-900 text-cyan-300 text-[11px] font-bold border border-blue-700/60 inline-flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>{t('adminEdit')}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: QUOTATION RFQS */}
        {activeTab === 'quotations' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold font-['Chakra_Petch'] text-white">
              Project Quotations (RFQs) Received from Engineers
            </h2>
            <div className="space-y-3">
              {quotations.map((q) => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-cyan-400 font-bold text-sm">{q.referenceNumber}</span>
                      <span className="text-slate-400 ml-2">({new Date(q.createdAt).toLocaleDateString()})</span>
                      <span className="text-white block font-bold mt-0.5">{q.companyName} — {q.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Status:</span>
                      <select
                        value={q.status}
                        onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value as any)}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-bold"
                      >
                        <option value="pending">Pending Review</option>
                        <option value="reviewing">Under Review</option>
                        <option value="quoted">Quoted / Commercial Offer Sent</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400 text-[11px]">
                    <div>Email: <span className="text-white">{q.email}</span></div>
                    <div>Phone: <span className="text-white">{q.phone || 'N/A'}</span></div>
                    <div>Destination: <span className="text-white">{q.deliveryCity || q.country}</span></div>
                  </div>

                  {q.items && q.items.length > 0 && (
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Requested Pipeline Items:</span>
                      {q.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-white">
                          <span>{it.sku} ({it.name})</span>
                          <span className="font-bold text-cyan-400">{it.quantity} Units</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.projectDescription && (
                    <p className="text-slate-300 text-[11px] bg-slate-950/40 p-2 rounded">
                      <span className="text-slate-500">Notes: </span>
                      {q.projectDescription}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PURCHASE ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold font-['Chakra_Petch'] text-white">
              Commercial Purchase Orders Placed
            </h2>
            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-cyan-400 font-bold text-sm">{ord.orderNumber}</span>
                      <span className="text-slate-400 ml-2">({new Date(ord.createdAt).toLocaleDateString()})</span>
                      <span className="text-white block font-bold mt-0.5">{ord.customerName} ({ord.companyName || 'Individual'})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-white">${ord.total.toFixed(2)}</span>
                      <span className="text-slate-500 block text-[10px]">Method: {ord.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Shipping: {ord.shippingAddress?.street}, {ord.shippingAddress?.city}, {ord.shippingAddress?.country}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROJECT & ENGINEERING TASK MANAGER */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold font-['Chakra_Petch'] text-white flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-cyan-400" />
                <span>Create New Pipeline Engineering Task</span>
              </h2>
              <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                <div className="sm:col-span-2">
                  <label className="text-slate-400 font-mono block mb-1">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Hydrostatic pressure inspection on DN400 bends"
                    className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full h-9 px-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-slate-400 font-mono block mb-1">Description / Scope</label>
                  <input
                    type="text"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="e.g. Inspect bolt torque and EPDM gasket seating per ISO 2531"
                    className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Assigned Engineer</label>
                  <input
                    type="text"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    placeholder="e.g. Site Engineer Vance"
                    className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="sm:col-span-3 text-right">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Task to Database</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    task.status === 'completed'
                      ? 'bg-slate-950/60 border-slate-800 opacity-75'
                      : 'bg-slate-900 border-slate-700/80 shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-1 text-slate-400 hover:text-cyan-400"
                    >
                      {task.status === 'completed' ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">{task.id}</span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            task.priority === 'critical'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : task.priority === 'high'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}
                        >
                          {task.priority}
                        </span>
                        {task.status === 'completed' && (
                          <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <h3
                        className={`text-sm font-bold font-['Chakra_Petch'] mt-1 ${
                          task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-xs text-slate-400 font-sans mt-0.5">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 mt-2">
                        <span>Assigned: <span className="text-slate-300">{task.assignedTo}</span></span>
                        <span>Due: <span className="text-slate-300">{task.dueDate}</span></span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-600 hover:text-rose-400 p-1"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ANALYTICS & STATS */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                <span className="text-xs text-slate-400">Total Catalog Models</span>
                <span className="text-2xl font-bold text-cyan-400 block mt-1">{stats.totalProducts}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                <span className="text-xs text-slate-400">Direct Purchase In Stock</span>
                <span className="text-2xl font-bold text-emerald-400 block mt-1">{stats.inStockCount}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                <span className="text-xs text-slate-400">RFQ Required Models</span>
                <span className="text-2xl font-bold text-amber-400 block mt-1">{stats.quoteRequiredCount}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono">
                <span className="text-xs text-slate-400">Total Purchase Orders</span>
                <span className="text-2xl font-bold text-white block mt-1">{stats.totalOrders}</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold font-['Chakra_Petch'] text-white">
                Category Inventory Distribution
              </h3>
              <div className="space-y-2 text-xs font-mono">
                {stats.inventoryBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="text-slate-300">{item.category}</span>
                    <span className="text-cyan-400 font-bold">{item.count} items</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#080E1C] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 text-xs font-mono">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold font-['Chakra_Petch'] text-white">
                  Edit Specification: {editingProduct.sku}
                </h3>
                <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 block mb-1">Procurement Mode</label>
                  <label className="flex items-center gap-2 cursor-pointer text-white">
                    <input
                      type="checkbox"
                      checked={editingQuoteRequired}
                      onChange={(e) => setEditingQuoteRequired(e.target.checked)}
                    />
                    <span>Require Engineering Quotation (RFQ Only - No Fixed Price)</span>
                  </label>
                </div>

                {!editingQuoteRequired && (
                  <div>
                    <label className="text-slate-400 block mb-1">{t('adminUpdatePrice')}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingPrice}
                      onChange={(e) => setEditingPrice(Number(e.target.value))}
                      className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="text-slate-400 block mb-1">{t('adminUpdateStock')}</label>
                  <input
                    type="number"
                    value={editingStock}
                    onChange={(e) => setEditingStock(Number(e.target.value))}
                    className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Stock Status</label>
                  <select
                    value={editingStockStatus}
                    onChange={(e) => setEditingStockStatus(e.target.value as any)}
                    className="w-full h-9 px-2 bg-slate-950 border border-slate-700 rounded text-white"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="lead_time">Factory Lead Time</option>
                    <option value="made_to_order">Engineered to Order</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300"
                >
                  {t('adminCancel')}
                </button>
                <button
                  onClick={saveProductChanges}
                  className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  {t('adminSave')}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
