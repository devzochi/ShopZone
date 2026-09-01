import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onNavigateTab: (tab: 'shop' | 'deals' | 'new') => void;
  onOpenSupportModal?: (topic: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateTab,
  onOpenSupportModal,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="border-t border-neutral-200 bg-white pt-12 pb-8 mt-16 text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-4 flex flex-col justify-start">
            <span className="text-xl font-bold text-[#b93815] tracking-tight">
              CommerceOS
            </span>
            <p className="mt-3 text-xs sm:text-sm text-neutral-600 max-w-xs leading-relaxed">
              Shop smarter. Buy better. Precision minimalist commerce for the modern buyer.
            </p>
          </div>

          {/* Nav Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs sm:text-sm">
            
            {/* Shop Column */}
            <div>
              <h5 className="font-semibold text-neutral-900 mb-3.5">Shop</h5>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => onSelectCategory('electronics')}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    Electronics
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectCategory('fashion')}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    Fashion
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectCategory('home')}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onNavigateTab('shop');
                      const el = document.getElementById('trending-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    Trending
                  </button>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h5 className="font-semibold text-neutral-900 mb-3.5">Company</h5>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => onOpenSupportModal?.('About Us')}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenSupportModal?.('Careers')}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenSupportModal?.('Press')}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    Press
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenSupportModal?.('Contact')}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h5 className="font-semibold text-neutral-900 mb-3.5">Support</h5>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => onOpenSupportModal?.('Help Center')}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenSupportModal?.('Returns')}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    Returns
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenSupportModal?.('Shipping')}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    Shipping
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenSupportModal?.('Order Status')}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    Order Status
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h5 className="font-semibold text-neutral-900 mb-3.5">Legal</h5>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => onOpenSupportModal?.('Privacy Policy')}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenSupportModal?.('Terms of Service')}
                    className="hover:text-neutral-900 transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="border-t border-neutral-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © 2024 CommerceOS. All rights reserved.
          </div>

          <div className="flex items-center gap-2">
            <button
              id="footer-share-btn"
              onClick={handleShare}
              className="p-2 text-neutral-500 hover:text-neutral-800 rounded-full hover:bg-neutral-100 transition flex items-center gap-1.5"
              aria-label="Share CommerceOS"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 text-xs font-medium">Link copied!</span>
                </>
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
