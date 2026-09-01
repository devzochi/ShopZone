import React from 'react';
import { X, CheckCircle, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface InfoModalProps {
  topic: string | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ topic, onClose }) => {
  if (!topic) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold text-neutral-900 mb-3">{topic}</h3>

          <div className="text-xs sm:text-sm text-neutral-600 space-y-3 leading-relaxed">
            {topic === 'About Us' && (
              <>
                <p>
                  CommerceOS is built on a philosophy of precision minimalist commerce. We reject clutter, endless synthetic choices, and low-quality goods.
                </p>
                <p>
                  Every piece in our catalog is tested, curated, and selected around functional utility, enduring aesthetics, and high-performance durability.
                </p>
              </>
            )}

            {topic === 'Returns' && (
              <>
                <p>
                  We offer a comprehensive <strong>30-day money-back guarantee</strong> on all products.
                </p>
                <p>
                  If you are not 100% satisfied with your item, generate a pre-paid return label in your account dashboard and drop it off at any local carrier location.
                </p>
              </>
            )}

            {topic === 'Shipping' && (
              <>
                <p>
                  All orders over $100 receive <strong>Free 2-3 Business Day Express Shipping</strong> with real-time end-to-end tracking.
                </p>
                <p>
                  Orders placed before 2:00 PM PST are packaged and dispatched on the exact same business day.
                </p>
              </>
            )}

            {topic === 'Help Center' && (
              <>
                <p>
                  Need assistance with an order, sizing, or product specifications? Our concierge team is on standby 24/7.
                </p>
                <p>
                  Reach us via email at <strong>support@commerceos.io</strong> or live chat directly through your member portal.
                </p>
              </>
            )}

            {topic !== 'About Us' && topic !== 'Returns' && topic !== 'Shipping' && topic !== 'Help Center' && (
              <p>
                CommerceOS guarantees industry-standard encryption, respectful data practices, and stringent privacy protocols. We never resell your personal information or transaction history.
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100">
            <button
              onClick={onClose}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-2.5 rounded-xl transition text-xs"
            >
              Got it
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
