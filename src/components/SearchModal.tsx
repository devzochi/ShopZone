import React, { useRef, useEffect } from 'react';
import { Search, X, ArrowRight, Star } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = searchQuery.trim() === ''
    ? products.slice(0, 4)
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const quickTags = ['Headphones', 'Watch', 'Ceramic', 'Linen', 'Wallet', 'Kettle'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Search Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center gap-3">
            <Search className="w-5 h-5 text-[#ea580c]" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to search electronics, fashion, home, fitness..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-xs bg-neutral-100 text-neutral-600 font-semibold px-2.5 py-1 rounded-md hover:bg-neutral-200 transition"
            >
              ESC
            </button>
          </div>

          {/* Quick Tags */}
          <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-100 flex items-center gap-2 overflow-x-auto text-xs text-neutral-600">
            <span className="font-semibold text-neutral-800 whitespace-nowrap">Suggested:</span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="bg-white border border-neutral-200 hover:border-neutral-300 px-2.5 py-0.5 rounded-full whitespace-nowrap hover:text-neutral-900 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 divide-y divide-neutral-100">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-neutral-500">
                No products found matching "{searchQuery}"
              </div>
            ) : (
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-3 px-1">
                  {searchQuery ? `Search Results (${filtered.length})` : 'Popular Searches'}
                </p>
                <div className="space-y-2">
                  {filtered.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectProduct(item);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-neutral-50 flex items-center justify-between gap-4 cursor-pointer group transition"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-[#ea580c] transition-colors">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                            <span className="capitalize">{item.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {item.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-neutral-900 text-sm">
                          ${item.price.toFixed(2)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#ea580c] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
