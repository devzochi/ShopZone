import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryGrid } from './components/CategoryGrid';
import { TrendingSection } from './components/TrendingSection';
import { ValueProps } from './components/ValueProps';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductModal } from './components/ProductModal';
import { CheckoutModal } from './components/CheckoutModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SearchModal } from './components/SearchModal';
import { UserAccountModal } from './components/UserAccountModal';
import { InfoModal } from './components/InfoModal';
import { AuthModal } from './components/AuthModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { CATEGORIES, PRODUCTS as STATIC_PRODUCTS } from './data/products';
import { CartItem, Product, NotificationItem } from './types';
import { Check, Sparkles, Bot, Shield } from 'lucide-react';
import { subscribeToProducts, seedDefaultProducts } from './lib/firestoreStore';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Gemini AI Concierge Live',
    description: 'Try asking our multi-turn AI Concierge for personalized gear recommendations or low-latency review summaries.',
    timestamp: 'Just now',
    read: false,
    type: 'discount',
  },
  {
    id: 'n-2',
    title: 'Flash Deal Active',
    description: 'Use code COMMERCE10 for 10% off your first precision minimalist order.',
    timestamp: '10 mins ago',
    read: false,
    type: 'discount',
  },
  {
    id: 'n-3',
    title: 'Cloud Sync Online',
    description: 'Your orders, addresses, and wishlist now sync directly with Google Cloud Firestore.',
    timestamp: '2 hours ago',
    read: true,
    type: 'order',
  },
];

function CommerceApp() {
  const { user, isAdmin } = useAuth();

  // Navigation & Filtering State
  const [activeTab, setActiveTab] = useState<'shop' | 'deals' | 'new'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');

  // Products State (synced from Firestore with fallback to static)
  const [allProducts, setAllProducts] = useState<Product[]>(STATIC_PRODUCTS);

  // Persistence State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('commerceos_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals & Drawers State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [infoModalTopic, setInfoModalTopic] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New AI & Auth & Admin Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiChatInitialPrompt, setAiChatInitialPrompt] = useState<string | undefined>(undefined);
  const [aiChatContextProduct, setAiChatContextProduct] = useState<Product | undefined>(undefined);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Subscribe to real-time Firestore products
  useEffect(() => {
    // Seed initial products if needed
    seedDefaultProducts(STATIC_PRODUCTS).catch(console.error);

    const unsub = subscribeToProducts((firestoreProds) => {
      if (firestoreProds && firestoreProds.length > 0) {
        setAllProducts(firestoreProds);
      }
    });

    return () => unsub();
  }, []);

  // Sync cart and wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('commerceos_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('commerceos_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.selectedColor === selectedColor);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to wishlist`);
        return [...prev, product.id];
      }
    });
  };

  const handleMoveAllWishlistToCart = () => {
    wishlistedProducts.forEach((p) => {
      handleAddToCart(p, 1);
    });
    setWishlistIds([]);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
    showToast('Moved all saved items to cart!');
  };

  // Open Auth modal helper
  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Ask AI about product helper
  const handleAskAIAboutProduct = (product: Product, prompt?: string) => {
    setAiChatContextProduct(product);
    setAiChatInitialPrompt(prompt || `Can you explain the key features and durability of ${product.name}?`);
    setIsAIChatOpen(true);
  };

  // Wishlist products list
  const wishlistedProducts = useMemo(() => {
    return allProducts.filter((p) => wishlistIds.includes(p.id));
  }, [allProducts, wishlistIds]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Filtering & Sorting Products
  const displayedProducts = useMemo(() => {
    let list = [...allProducts];

    if (activeTab === 'deals') {
      list = list.filter((p) => p.isDeal || p.badge?.type === 'discount' || p.badge?.type === 'sale');
    } else if (activeTab === 'new') {
      list = list.filter((p) => p.isNew || p.badge?.type === 'new');
    }

    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: trending / popular order
      list.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
    }

    return list;
  }, [allProducts, activeTab, selectedCategory, searchQuery, sortBy]);

  const isFiltered = Boolean(selectedCategory || activeTab !== 'shop' || searchQuery.trim());

  const activeCategoryName = useMemo(() => {
    if (selectedCategory) {
      const found = CATEGORIES.find((c) => c.slug === selectedCategory);
      return found ? found.name : selectedCategory;
    }
    if (activeTab === 'deals') return 'Special Deals & Offers';
    if (activeTab === 'new') return 'New Arrivals';
    if (searchQuery.trim()) return `Results for "${searchQuery}"`;
    return null;
  }, [selectedCategory, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col selection:bg-[#b93815]/20 selection:text-neutral-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-20 z-50 bg-neutral-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-slide-up">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating AI Concierge Quick Trigger Button */}
      <button
        id="floating-ai-concierge-fab"
        onClick={() => {
          setAiChatContextProduct(undefined);
          setAiChatInitialPrompt(undefined);
          setIsAIChatOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 bg-[#b93815] hover:bg-[#a03012] text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center cursor-pointer group"
        title="Chat with AI Shopping Concierge"
      >
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform text-amber-300" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
          AI Concierge
        </span>
      </button>

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={CATEGORIES}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenUserMenu={() => setIsUserMenuOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenAIChat={() => {
          setAiChatContextProduct(undefined);
          setAiChatInitialPrompt(undefined);
          setIsAIChatOpen(true);
        }}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenAuth={handleOpenAuth}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Only show Hero & Category preview when on main unfiltered Shop view */}
        {!isFiltered ? (
          <>
            {/* Hero Section */}
            <HeroSection
              onExploreProducts={() => {
                const el = document.getElementById('explore-categories-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onViewTrending={() => {
                const el = document.getElementById('trending-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Explore Categories Section */}
            <div id="explore-categories-section">
              <CategoryGrid
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={(slug) => {
                  setSelectedCategory(slug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

            {/* Trending Right Now (The 4 cards shown in the screenshot) */}
            <TrendingSection
              title="Trending right now"
              products={allProducts.filter((p) => p.isTrending)}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
              isFiltered={false}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </>
        ) : (
          /* Filtered View for Active Category, Deals, What's New, or Search */
          <div className="py-2">
            <TrendingSection
              title="Products"
              products={displayedProducts}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
              isFiltered={true}
              activeCategoryName={activeCategoryName}
              onClearFilter={() => {
                setSelectedCategory(null);
                setActiveTab('shop');
                setSearchQuery('');
              }}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        )}

        {/* Value Props & Trust Badges */}
        <ValueProps />

      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setSelectedCategory(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupportModal={(topic) => setInfoModalTopic(topic)}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Slide-over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistedProducts}
        onRemoveItem={(id) => setWishlistIds((prev) => prev.filter((i) => i !== id))}
        onAddToCart={handleAddToCart}
        onMoveAllToCart={handleMoveAllWishlistToCart}
      />

      {/* Quick View Product Modal with Fast AI & Search Grounding */}
      <ProductModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onAskAIAboutProduct={handleAskAIAboutProduct}
      />

      {/* Checkout Flow Modal with Firestore integration */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderCompleted={() => setCartItems([])}
      />

      {/* Notifications Popover */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        products={allProducts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectProduct={(product) => setQuickViewProduct(product)}
      />

      {/* User Account Drawer */}
      <UserAccountModal
        isOpen={isUserMenuOpen}
        onClose={() => setIsUserMenuOpen(false)}
        onOpenAuth={handleOpenAuth}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Support / Info Modal */}
      <InfoModal
        topic={infoModalTopic}
        onClose={() => setInfoModalTopic(null)}
      />

      {/* Firebase Auth & Sign-up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Multi-Turn AI Shopping Concierge Drawer with Model Switcher & Search Grounding */}
      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        contextProduct={aiChatContextProduct}
        initialPrompt={aiChatInitialPrompt}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      {/* Admin Dashboard & AI Product Studio */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        products={allProducts}
        categories={CATEGORIES}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CommerceApp />
    </AuthProvider>
  );
}
