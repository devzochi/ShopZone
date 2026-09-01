import React from 'react';
import { Heart, Plus, Star, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onQuickView(product)}
      className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden hover:shadow-md hover:border-neutral-300 transition-all duration-200 group flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Box */}
      <div className="relative bg-[#f0f3f8] aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
        {/* Badges */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] text-[11px] font-bold px-2 py-0.5 rounded-full tracking-wide">
              {product.badge.text}
            </span>
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-rose-600 hover:scale-110 active:scale-95 shadow-xs transition-all"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : 'stroke-[2]'
            }`}
          />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>

      {/* Product Details Box */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-semibold text-neutral-900 text-sm sm:text-base group-hover:text-[#ea580c] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1 text-xs text-neutral-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-neutral-800">{product.rating}</span>
            <span>({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price and Add Button */}
        <div className="flex items-center justify-between mt-4 pt-1">
          <div className="flex flex-col">
            <span className="font-bold text-neutral-950 text-base sm:text-lg">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through -mt-0.5">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all active:scale-95 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#e0e7ff] hover:bg-[#c7d2fe] text-[#3730a3]'
            }`}
          >
            {justAdded ? (
              <Check className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
