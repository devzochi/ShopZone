import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Truck, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [placedOrderId, setPlacedOrderId] = useState<string>('');

  const [formData, setFormData] = useState({
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@example.com',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    cardNumber: '•••• •••• •••• 4242',
    expDate: '08/28',
    cvv: '921',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    const orderId = `COS-${Math.floor(10000 + Math.random() * 90000)}`;
    setPlacedOrderId(orderId);

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {}
      onOrderCompleted();
    }, 1000);
  };

  const resetAndClose = () => {
    setStep('details');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={resetAndClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
          
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Stepper Header */}
          {step !== 'success' && (
            <div className="mb-6 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-neutral-900">CommerceOS Checkout</span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ml-auto">
                  <Lock className="w-3 h-3" /> 256-Bit Encrypted
                </span>
              </div>
              
              <div className="flex items-center gap-4 mt-4 text-xs font-medium">
                <span className={`flex items-center gap-1.5 ${step === 'details' ? 'text-[#b93815] font-bold' : 'text-neutral-500'}`}>
                  1. Shipping Address
                </span>
                <span className="text-neutral-300">/</span>
                <span className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-[#b93815] font-bold' : 'text-neutral-500'}`}>
                  2. Payment Method
                </span>
              </div>
            </div>
          )}

          {/* STEP 1: Shipping Details */}
          {step === 'details' && (
            <form onSubmit={handleSubmitDetails} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">First Name</label>
                  <input
                    required
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#b93815]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Last Name</label>
                  <input
                    required
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#b93815]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#b93815]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Street Address</label>
                <input
                  required
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#b93815]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">City</label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#b93815]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">State</label>
                  <input
                    required
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#b93815]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">ZIP Code</label>
                  <input
                    required
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#b93815]"
                  />
                </div>
              </div>

              {/* Order total preview */}
              <div className="bg-neutral-50 rounded-xl p-3.5 flex justify-between items-center text-xs font-semibold text-neutral-700 mt-4">
                <span>Order Total ({items.length} items):</span>
                <span className="text-base text-neutral-950 font-bold">${total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#b93815] hover:bg-[#a03012] text-white font-semibold py-3.5 rounded-xl transition text-sm shadow-xs cursor-pointer"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {/* STEP 2: Payment */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#b93815]" />
                    <span className="text-sm font-bold text-neutral-900">Card Payment</span>
                  </div>
                  <span className="text-xs text-neutral-500">Visa / Mastercard / Amex</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">Expires</label>
                      <input
                        type="text"
                        value={formData.expDate}
                        onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery notice */}
              <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                <Truck className="w-4 h-4 text-[#b93815] shrink-0" />
                <span>Shipping to <strong>{formData.address}, {formData.city}</strong>. Estimated dispatch: 2-3 business days.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-3 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-[#b93815] hover:bg-[#a03012] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Confirming your order...</span>
                  ) : (
                    <span>Pay ${total.toFixed(2)} & Place Order</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Success */}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Order Confirmed!</h2>
              <p className="text-xs text-neutral-500 mt-1">Order #{placedOrderId}</p>
              
              <div className="bg-neutral-50 rounded-2xl p-5 my-6 text-left space-y-2 text-xs text-neutral-600 border border-neutral-100">
                <p><strong className="text-neutral-900">Recipient:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong className="text-neutral-900">Destination:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                <p><strong className="text-neutral-900">Email:</strong> {formData.email}</p>
                <p><strong className="text-neutral-900">Status:</strong> Order received — this is a front-end checkout demonstration.</p>
              </div>

              <button
                onClick={resetAndClose}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3 rounded-xl transition text-sm cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
