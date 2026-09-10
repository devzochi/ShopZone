import React from "react";
import { X, Trash2, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import { Product } from "../types";

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveItem: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onMoveAllToCart: () => void;
}

export const WishlistDrawer = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onAddToCart,
  onMoveAllToCart,
}: WishlistDrawerProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h2 className="text-lg font-bold text-neutral-900">
                  Saved Wishlist
                </h2>
                <span className="text-xs bg-neutral-100 text-neutral-600 font-semibold px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <button
                type="button"
                aria-label="Close wishlist"
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item list */}
            <div className="flex-1 overflow-y-auto p-6 divide-y divide-neutral-100 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-4">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-neutral-900 text-base">
                    Your wishlist is empty
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs mt-1">
                    Tap the heart icon on any product to save items you want to
                    buy later.
                  </p>
                </div>
              ) : (
                items.map((product) => (
                  <div key={product.id} className="pt-4 first:pt-0 flex gap-4">
                    <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-neutral-900 text-sm line-clamp-1">
                            {product.name}
                          </h4>
                          <button
                            type="button"
                            aria-label={`Remove ${product.name} from wishlist`}
                            onClick={() => onRemoveItem(product.id)}
                            className="text-neutral-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-neutral-900 mt-1 block">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            onAddToCart(product);
                            onRemoveItem(product.id);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e0e7ff] hover:bg-[#c7d2fe] text-[#3730a3] text-xs font-semibold rounded-lg transition"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-100 bg-[#fafafa]">
                <button
                  type="button"
                  onClick={onMoveAllToCart}
                  className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-xs"
                >
                  <span>Add All to Cart</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
