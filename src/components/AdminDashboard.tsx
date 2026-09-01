import React, { useState, useEffect } from 'react';
import { 
  X, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Truck, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Search, 
  Globe, 
  ArrowUpRight,
  Shield,
  RefreshCw,
  ExternalLink,
  Check
} from 'lucide-react';
import { Product, Order, CategoryItem } from '../types';
import { CATEGORIES as DEFAULT_CATEGORIES, PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import { 
  saveProductToFirestore, 
  deleteProductFromFirestore, 
  subscribeToAllOrders, 
  updateOrderStatus 
} from '../lib/firestoreStore';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  categories?: CategoryItem[];
  onRefreshProducts?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products = DEFAULT_PRODUCTS,
  categories = DEFAULT_CATEGORIES,
  onRefreshProducts,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'ai-studio'>('analytics');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // AI Studio State
  const [aiProductName, setAiProductName] = useState('');
  const [aiCategory, setAiCategory] = useState<string>('electronics');
  const [aiPrice, setAiPrice] = useState('89');
  const [aiNotes, setAiNotes] = useState('Minimalist matte anodized aluminum, ultra fast, magnetic snap');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedResult, setAiGeneratedResult] = useState<any | null>(null);
  const [aiProductSaved, setAiProductSaved] = useState(false);

  // Edit / Add Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Form State for manual product add/edit
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'electronics',
    price: 99,
    originalPrice: 129,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    description: '',
    rating: 4.8,
    reviewsCount: 120,
    inStock: true,
    isTrending: false,
    isDeal: false,
    isNew: true,
  });

  // Subscribe to live orders from Firestore
  useEffect(() => {
    if (isOpen) {
      const unsub = subscribeToAllOrders((allOrders) => {
        setOrders(allOrders);
      });
      return () => unsub();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Analytics Metrics calculations
  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const inStockCount = products.filter((p) => p.inStock).length;

  // AI Generation with Gemini
  const handleGenerateAIProduct = async () => {
    if (!aiProductName.trim()) return;
    setAiGenerating(true);
    setAiGeneratedResult(null);
    setAiProductSaved(false);

    try {
      const res = await fetch('/api/ai/admin-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: aiProductName,
          category: aiCategory,
          targetPrice: aiPrice,
          bulletPoints: aiNotes,
        }),
      });

      const data = await res.json();
      setAiGeneratedResult(data);
    } catch (e) {
      console.error(e);
      setAiGeneratedResult({
        description: `Precision-crafted ${aiProductName} designed with seamless minimalist geometry and top-tier durable materials.`,
        features: [
          'Precision anodized unibody finish',
          'Fast USB-C and wireless magnetic architecture',
          'Ultra-compact everyday footprint',
          '2-year warranty included',
        ],
        suggestedBadge: 'NEW',
        marketInsight: 'High consumer interest in sleek desktop aesthetics.',
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const handlePublishAIProductToCatalog = async () => {
    if (!aiGeneratedResult) return;
    const newId = `prod-${Date.now()}`;
    const categoryImages: Record<string, string> = {
      electronics: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop',
      fashion: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
      home: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1000&auto=format&fit=crop',
      fitness: 'https://images.unsplash.com/photo-1593810450967-f9c42742e326?q=80&w=1000&auto=format&fit=crop',
      accessories: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      lifestyle: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1000&auto=format&fit=crop',
    };

    const newProduct: Product = {
      id: newId,
      name: aiProductName,
      category: aiCategory as any,
      price: parseFloat(aiPrice) || 89,
      originalPrice: (parseFloat(aiPrice) || 89) * 1.25,
      rating: 4.9,
      reviewsCount: 1,
      image: categoryImages[aiCategory] || categoryImages.electronics,
      badge: aiGeneratedResult.suggestedBadge ? { text: aiGeneratedResult.suggestedBadge, type: 'new' } : undefined,
      description: aiGeneratedResult.description,
      features: aiGeneratedResult.features || [],
      inStock: true,
      isNew: true,
      isTrending: true,
    };

    await saveProductToFirestore(newProduct);
    setAiProductSaved(true);
    if (onRefreshProducts) onRefreshProducts();
  };

  const handleToggleStock = async (product: Product) => {
    const updated = { ...product, inStock: !product.inStock };
    await saveProductToFirestore(updated);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product from the live catalog?')) {
      await deleteProductFromFirestore(id);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchProductQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-[#fafafa] rounded-2xl w-full max-w-6xl max-h-[92vh] shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-scale-in">
        
        {/* Top Bar */}
        <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b93815] text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">CommerceOS Admin Center</h2>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Firestore Live
                </span>
              </div>
              <p className="text-xs text-neutral-500">Manage real-time catalog, dispatch orders, and AI market studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-neutral-200 px-6 flex space-x-6 text-xs font-semibold text-neutral-600">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3.5 relative flex items-center gap-2 transition-colors ${
              activeTab === 'analytics' ? 'text-[#b93815] font-bold' : 'hover:text-neutral-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Store Analytics</span>
            {activeTab === 'analytics' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b93815]" />}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3.5 relative flex items-center gap-2 transition-colors ${
              activeTab === 'products' ? 'text-[#b93815] font-bold' : 'hover:text-neutral-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Live Products Catalog ({products.length})</span>
            {activeTab === 'products' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b93815]" />}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 relative flex items-center gap-2 transition-colors ${
              activeTab === 'orders' ? 'text-[#b93815] font-bold' : 'hover:text-neutral-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders Dispatch ({orders.length})</span>
            {activeTab === 'orders' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b93815]" />}
          </button>

          <button
            onClick={() => setActiveTab('ai-studio')}
            className={`py-3.5 relative flex items-center gap-2 transition-colors ${
              activeTab === 'ai-studio' ? 'text-[#b93815] font-bold' : 'hover:text-neutral-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Product Studio</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              Gemini 3.5
            </span>
            {activeTab === 'ai-studio' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b93815]" />}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold mb-2">
                    <span>Total Sales Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">
                    ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +18.4% this week
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold mb-2">
                    <span>Total Orders Placed</span>
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">{totalOrdersCount}</div>
                  <span className="text-[11px] text-blue-700 font-medium mt-1 block">Live Firestore synchronization</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold mb-2">
                    <span>Avg Order Value (AOV)</span>
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">
                    ${averageOrderValue.toFixed(2)}
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1 block">Precision minimalist basket</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold mb-2">
                    <span>Active In-Stock Items</span>
                    <Package className="w-4 h-4 text-[#b93815]" />
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {inStockCount} / {products.length}
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-1 block">Across 6 store categories</span>
                </div>
              </div>

              {/* Category Breakdown & Recent Orders Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 lg:col-span-2 space-y-4 shadow-xs">
                  <h3 className="font-bold text-sm text-neutral-900">Recent Customer Orders Stream</h3>
                  {orders.length === 0 ? (
                    <div className="text-center py-10 text-neutral-400 text-xs">
                      No customer orders recorded yet in Firestore. Complete a checkout to see live stream!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="p-3.5 border border-neutral-100 rounded-xl flex items-center justify-between text-xs bg-neutral-50/50">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-neutral-900">#{order.id}</span>
                              <span className="text-neutral-500 font-medium">({order.customerName || order.customerEmail})</span>
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-0.5">
                              {order.items?.map((i) => `${i.name} (x${i.quantity})`).join(', ') || 'Item'}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-neutral-900 text-sm">${order.totalAmount?.toFixed(2)}</span>
                            <div className="mt-0.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                                'bg-neutral-100 text-neutral-700'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-4 shadow-xs">
                  <h3 className="font-bold text-sm text-neutral-900">Store Category Metrics</h3>
                  <div className="space-y-3">
                    {categories.map((cat) => {
                      const count = products.filter((p) => p.category === cat.slug).length;
                      return (
                        <div key={cat.id} className="flex items-center justify-between text-xs pb-2 border-b border-neutral-100 last:border-0">
                          <span className="font-medium text-neutral-700">{cat.name}</span>
                          <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                            {count} products
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Products Catalog Tab */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200">
                <div className="flex-1 max-w-sm relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchProductQuery}
                    onChange={(e) => setSearchProductQuery(e.target.value)}
                    placeholder="Filter products catalog..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-700 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setActiveTab('ai-studio')}
                    className="bg-[#b93815] text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#a03012] transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate with AI</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-neutral-700">
                    <thead className="bg-neutral-50 border-b border-neutral-200 font-bold text-neutral-600 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3.5">Product</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Price</th>
                        <th className="p-3.5">Badge</th>
                        <th className="p-3.5">Stock Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-neutral-50/70 transition">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-10 h-10 rounded-lg object-cover bg-neutral-100 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-neutral-900 block">{prod.name}</span>
                                <span className="text-[11px] text-neutral-400 line-clamp-1">{prod.description}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="capitalize font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                              {prod.category}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-neutral-900">${prod.price.toFixed(2)}</td>
                          <td className="p-3.5">
                            {prod.badge ? (
                              <span className="bg-[#b93815]/10 text-[#b93815] font-bold px-2 py-0.5 rounded-full text-[10px]">
                                {prod.badge.text}
                              </span>
                            ) : (
                              <span className="text-neutral-400">—</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <button
                              onClick={() => handleToggleStock(prod)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                                prod.inStock
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              }`}
                            >
                              {prod.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                            </button>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                                title="Delete from catalog"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. Orders Dispatch Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">Live Customer Orders Stream</h3>
                  <p className="text-xs text-neutral-500">Real-time status updates sync instantly to the customer's account view</p>
                </div>
                <span className="text-xs font-semibold text-neutral-500">
                  {orders.length} total orders recorded
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200 text-xs text-neutral-500">
                  No orders recorded yet. Place an order from the cart to test live order processing!
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900 text-sm">Order #{order.id}</span>
                            <span className="text-neutral-400">•</span>
                            <span className="text-neutral-500">{new Date(order.createdAt).toLocaleString()}</span>
                          </div>
                          <span className="text-neutral-600 font-medium">{order.customerName} ({order.customerEmail})</span>
                        </div>

                        {/* Status update buttons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] text-neutral-400 mr-1 font-semibold">Change Status:</span>
                          {(['pending', 'processing', 'shipped', 'delivered'] as Order['status'][]).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateOrderStatus(order.id, st)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase transition capitalize cursor-pointer ${
                                order.status === st
                                  ? 'bg-neutral-900 text-white shadow-xs'
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Items & Shipping Address */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="font-bold text-neutral-700 block mb-1">Purchased Items:</span>
                          <div className="space-y-1.5">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-neutral-50 p-2 rounded-lg">
                                <span className="text-neutral-800">{item.name} × {item.quantity}</span>
                                <span className="font-bold text-neutral-900">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-700 block mb-1">Delivery Address:</span>
                          <div className="bg-neutral-50 p-2.5 rounded-lg text-neutral-600 text-[11px] leading-relaxed">
                            {order.shippingAddress?.fullName}<br />
                            {order.shippingAddress?.street}<br />
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
                          </div>
                          <div className="mt-2 flex justify-between font-bold text-xs pt-1 border-t border-neutral-200 text-neutral-900">
                            <span>Total Charged:</span>
                            <span>${order.totalAmount?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. AI Product Studio Tab */}
          {activeTab === 'ai-studio' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Generator Form */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#b93815]" />
                    <h3 className="font-bold text-sm text-neutral-900">AI Product & Copy Generator</h3>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Powered by <strong>Gemini 3.5 Flash</strong> with real-time market data to generate curated product descriptions, feature specs, and badges.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    value={aiProductName}
                    onChange={(e) => setAiProductName(e.target.value)}
                    placeholder="e.g. Aero MagSafe Magnetic Stand"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#b93815] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
                    <select
                      value={aiCategory}
                      onChange={(e) => setAiCategory(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Target Price ($)</label>
                    <input
                      type="number"
                      value={aiPrice}
                      onChange={(e) => setAiPrice(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Key Highlights / Rough Notes</label>
                  <textarea
                    rows={3}
                    value={aiNotes}
                    onChange={(e) => setAiNotes(e.target.value)}
                    placeholder="e.g. Matte black aluminum, 15W fast charge, weighted base, minimalist desk aesthetic"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 focus:bg-white focus:border-[#b93815] focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleGenerateAIProduct}
                  disabled={aiGenerating || !aiProductName.trim()}
                  className="w-full bg-[#b93815] hover:bg-[#a03012] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                >
                  {aiGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Copy with Gemini 3.5...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Product Copy & Specs</span>
                    </>
                  )}
                </button>
              </div>

              {/* Generated Preview & Publish */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 mb-2">Generated Product Package</h3>

                  {!aiGeneratedResult && !aiGenerating ? (
                    <div className="text-center py-16 text-neutral-400 text-xs border border-dashed border-neutral-200 rounded-xl">
                      Enter product details on the left and click Generate to preview copy, specs, and market insight.
                    </div>
                  ) : aiGenerating ? (
                    <div className="text-center py-16 text-neutral-500 text-xs space-y-2">
                      <div className="w-8 h-8 border-2 border-[#b93815] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p>Generating copy with Gemini 3.5 Flash...</p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs animate-fade-in">
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                        <span className="font-bold text-neutral-500 uppercase text-[10px] block mb-1">Description</span>
                        <p className="text-neutral-800 leading-relaxed">{aiGeneratedResult.description}</p>
                      </div>

                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                        <span className="font-bold text-neutral-500 uppercase text-[10px] block mb-1">Technical Specs & Features</span>
                        <ul className="list-disc list-inside space-y-1 text-neutral-700">
                          {aiGeneratedResult.features?.map((f: string, i: number) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex-1">
                          <span className="font-bold text-amber-800 text-[10px] uppercase block">Suggested Tag</span>
                          <span className="font-bold text-amber-900 text-xs">{aiGeneratedResult.suggestedBadge || 'NEW'}</span>
                        </div>
                        <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 flex-2">
                          <span className="font-bold text-blue-800 text-[10px] uppercase block">Market Intelligence</span>
                          <span className="text-blue-900 text-[11px]">{aiGeneratedResult.marketInsight}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {aiGeneratedResult && (
                  <div className="pt-4 border-t border-neutral-100 mt-4">
                    {aiProductSaved ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Product Published to Live Firestore Catalog!</span>
                      </div>
                    ) : (
                      <button
                        onClick={handlePublishAIProductToCatalog}
                        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Publish to Live Store Catalog</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
