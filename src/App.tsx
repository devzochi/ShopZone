import React, { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { CategoryGrid } from "./components/CategoryGrid";
import { TrendingSection } from "./components/TrendingSection";
import { ValueProps } from "./components/ValueProps";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { WishlistDrawer } from "./components/WishlistDrawer";
import { ProductModal } from "./components/ProductModal";
import { CheckoutModal } from "./components/CheckoutModal";
import { SearchModal } from "./components/SearchModal";
import { InfoModal } from "./components/InfoModal";
import { CATEGORIES, PRODUCTS } from "./data/products";
import { CartItem, Product } from "./types";

const load = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"shop" | "deals" | "new">("shop");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    load("shopzone_cart", []),
  );
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    load("shopzone_wishlist", []),
  );
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [infoModalTopic, setInfoModalTopic] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => {
    localStorage.setItem("shopzone_cart", JSON.stringify(cartItems));
  }, [cartItems]);
  useEffect(() => {
    localStorage.setItem("shopzone_wishlist", JSON.stringify(wishlistIds));
  }, [wishlistIds]);
  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 2500);
  };
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
  ) => {
    setCartItems((items) => {
      const match = items.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor,
      );
      return match
        ? items.map((item) =>
            item === match
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...items, { product, quantity, selectedColor }];
    });
    showToast(`Added “${product.name}” to cart`);
  };
  const removeFromCart = (id: string) =>
    setCartItems((items) => items.filter((item) => item.product.id !== id));
  const updateQuantity = (id: string, quantity: number) =>
    quantity <= 0
      ? removeFromCart(id)
      : setCartItems((items) =>
          items.map((item) =>
            item.product.id === id ? { ...item, quantity } : item,
          ),
        );
  const toggleWishlist = (product: Product) =>
    setWishlistIds((ids) =>
      ids.includes(product.id)
        ? ids.filter((id) => id !== product.id)
        : [...ids, product.id],
    );
  const wishlistedProducts = useMemo(
    () => PRODUCTS.filter((product) => wishlistIds.includes(product.id)),
    [wishlistIds],
  );
  const totalCartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );
  const displayedProducts = useMemo(() => {
    let products = [...PRODUCTS];
    if (activeTab === "deals")
      products = products.filter(
        (p) =>
          p.isDeal || p.badge?.type === "discount" || p.badge?.type === "sale",
      );
    if (activeTab === "new")
      products = products.filter((p) => p.isNew || p.badge?.type === "new");
    if (selectedCategory)
      products = products.filter((p) => p.category === selectedCategory);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter((p) =>
        [p.name, p.category, p.description].some((value) =>
          value.toLowerCase().includes(query),
        ),
      );
    }
    if (sortBy === "price-asc") products.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc")
      products.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") products.sort((a, b) => b.rating - a.rating);
    else
      products.sort(
        (a, b) => Number(Boolean(b.isTrending)) - Number(Boolean(a.isTrending)),
      );
    return products;
  }, [activeTab, selectedCategory, searchQuery, sortBy]);
  const isFiltered = Boolean(
    selectedCategory || activeTab !== "shop" || searchQuery.trim(),
  );
  const activeCategoryName = selectedCategory
    ? (CATEGORIES.find((c) => c.slug === selectedCategory)?.name ??
      selectedCategory)
    : activeTab === "deals"
      ? "Special Deals & Offers"
      : activeTab === "new"
        ? "New Arrivals"
        : searchQuery.trim()
          ? `Results for “${searchQuery}”`
          : null;
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col selection:bg-[#b93815]/20 selection:text-neutral-900">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}
      <Header
        {...{
          activeTab,
          setActiveTab,
          selectedCategory,
          setSelectedCategory,
          categories: CATEGORIES,
          cartCount: totalCartCount,
          wishlistCount: wishlistIds.length,
          searchQuery,
          setSearchQuery,
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {!isFiltered ? (
          <>
            <HeroSection
              onExploreProducts={() =>
                document
                  .getElementById("explore-categories-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              onViewTrending={() =>
                document
                  .getElementById("trending-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            />
            <div id="explore-categories-section">
              <CategoryGrid
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={(slug) => {
                  setSelectedCategory(slug);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
            <TrendingSection
              title="Trending right now"
              products={PRODUCTS.filter((p) => p.isTrending)}
              wishlistIds={wishlistIds}
              onToggleWishlist={toggleWishlist}
              onAddToCart={addToCart}
              onQuickView={setQuickViewProduct}
              isFiltered={false}
              {...{ sortBy, setSortBy }}
            />
          </>
        ) : (
          <div className="py-2">
            <TrendingSection
              title="Products"
              products={displayedProducts}
              wishlistIds={wishlistIds}
              onToggleWishlist={toggleWishlist}
              onAddToCart={addToCart}
              onQuickView={setQuickViewProduct}
              isFiltered
              activeCategoryName={activeCategoryName}
              onClearFilter={() => {
                setSelectedCategory(null);
                setActiveTab("shop");
                setSearchQuery("");
              }}
              {...{ sortBy, setSortBy }}
            />
          </div>
        )}
        <ValueProps />
      </main>
      <Footer
        onSelectCategory={(category) => {
          setSelectedCategory(category);
          setActiveTab("shop");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setSelectedCategory(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenSupportModal={setInfoModalTopic}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistedProducts}
        onRemoveItem={(id) =>
          setWishlistIds((ids) => ids.filter((itemId) => itemId !== id))
        }
        onAddToCart={addToCart}
        onMoveAllToCart={() => {
          wishlistedProducts.forEach((product) => addToCart(product));
          setWishlistIds([]);
          setIsWishlistOpen(false);
          setIsCartOpen(true);
        }}
      />
      <ProductModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={
          quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false
        }
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderCompleted={() => setCartItems([])}
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        products={PRODUCTS}
        {...{ searchQuery, setSearchQuery }}
        onSelectProduct={setQuickViewProduct}
      />
      <InfoModal
        topic={infoModalTopic}
        onClose={() => setInfoModalTopic(null)}
      />
    </div>
  );
}
