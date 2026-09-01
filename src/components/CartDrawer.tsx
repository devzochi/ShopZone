import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0;
  const freeShippingThreshold = 100;
  const shipping = subtotal > freeShippingThreshold || subtotal === 0 ? 0 : 9.99;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'COMMERCE10' || code === 'MINIMAL10') {
      setAppliedDiscount({ code, percent: 10 });
      setPromoCode('');
    } else if (code === 'SAVE20') {
      setAppliedDiscount({ code, percent: 20 });
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Try "COMMERCE10"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-neutral-900">Your Cart</h2>
              <span className="text-xs bg-neutral-100 text-neutral-600 font-semibold px-2 py-0.5 rounded-full">
                {items.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#fafafa] px-6 py-3 border-b border-neutral-100 text-xs">
            {subtotal >= freeShippingThreshold ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                You unlocked Free Express Shipping!
              </span>
            ) : (
              <div>
                <p className="text-neutral-600">
                  Add <span className="font-bold text-neutral-900">${(freeShippingThreshold - subtotal).toFixed(2)}</span> more for Free Shipping
                </p>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-[#ea580c] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-neutral-100 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                  <Tag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-neutral-900 text-base">Your cart is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs mt-1">
                  Explore our curated catalog and add minimal essentials to your bag.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-semibold rounded-lg transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumb */}
                  <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-semibold text-neutral-900 text-sm line-clamp-1">
                          {item.product.name}
                        </h4>
                        {item.selectedColor && (
                          <span className="text-[11px] text-neutral-500 block mt-0.5">
                            Color: {item.selectedColor}
                          </span>
                        )}
                        <span className="text-xs font-bold text-neutral-900 mt-1 block">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-neutral-900 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-[#fafafa] space-y-4">
              {/* Promo Code input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. COMMERCE10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 uppercase"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition"
                >
                  Apply
                </button>
              </form>
              {promoError && <p className="text-[11px] text-rose-600">{promoError}</p>}
              {appliedDiscount && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✓ Code {appliedDiscount.code} applied ({appliedDiscount.percent}% off)
                </p>
              )}

              {/* Subtotals breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between text-sm font-bold text-neutral-950">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="checkout-btn"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-[#ea580c] hover:bg-[#c2410c] active:scale-98 text-white font-semibold py-3.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2 group text-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
