import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

interface TrendingSectionProps {
  title?: string;
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isFiltered?: boolean;
  activeCategoryName?: string | null;
  onClearFilter?: () => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  title = "Trending right now",
  products,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  isFiltered = false,
  activeCategoryName = null,
  onClearFilter,
  sortBy,
  setSortBy,
}) => {
  return (
    <section id="trending-section" className="mb-14 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            {activeCategoryName ? `${activeCategoryName}` : title}
          </h2>
          {isFiltered && onClearFilter && (
            <button
              onClick={onClearFilter}
              className="text-xs text-[#ea580c] hover:underline flex items-center gap-1 font-medium bg-[#ea580c]/10 px-2.5 py-1 rounded-full"
            >
              <span>Reset filter</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Sort selector for catalog views */}
        {isFiltered && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sort:</span>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-neutral-800 focus:outline-none focus:border-neutral-500"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        )}
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl p-8">
          <p className="text-neutral-500 text-sm">No products found matching your current filter.</p>
          {onClearFilter && (
            <button
              onClick={onClearFilter}
              className="mt-4 px-4 py-2 bg-[#ea580c] text-white text-xs font-semibold rounded-lg hover:bg-[#c2410c] transition"
            >
              View all products
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </section>
  );
};
