import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  Check, 
  Truck, 
  ShieldCheck, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Sparkles, 
  Zap, 
  Globe, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, color?: string) => void;
  onAskAIAboutProduct?: (product: Product, initialPrompt?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onAskAIAboutProduct,
}) => {
  if (!isOpen || !product) return null;

  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  // AI Low-Latency & Search Grounding States
  const [fastAiSummary, setFastAiSummary] = useState<string | null>(null);
  const [loadingFastSummary, setLoadingFastSummary] = useState(false);
  const [searchGroundingData, setSearchGroundingData] = useState<{ summary: string; sources: any[] } | null>(null);
  const [loadingSearchGrounding, setLoadingSearchGrounding] = useState(false);

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor || undefined);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  // Low-latency response using gemini-3.1-flash-lite
  const handleFetchFastAISummary = async () => {
    if (fastAiSummary || loadingFastSummary) return;
    setLoadingFastSummary(true);
    try {
      const res = await fetch('/api/ai/fast-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'review-summary',
          prompt: `Summarize key reasons to buy "${product.name}" priced at $${product.price}. Description: ${product.description}`,
          context: product,
        }),
      });
      const data = await res.json();
      setFastAiSummary(data.result || 'Precision designed with top ergonomics and material durability.');
    } catch (e) {
      console.error(e);
      setFastAiSummary('• Minimalist precision profile.\n• Engineered for daily longevity.\n• Exceptional tactile and ergonomic satisfaction.');
    } finally {
      setLoadingFastSummary(false);
    }
  };

  // Search Grounding with Gemini 3.5 Flash & Google Search
  const handleFetchSearchGrounding = async () => {
    if (searchGroundingData || loadingSearchGrounding) return;
    setLoadingSearchGrounding(true);
    try {
      const res = await fetch('/api/ai/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `${product.name} ${product.category} modern review benchmark`,
          category: product.category,
        }),
      });
      const data = await res.json();
      setSearchGroundingData({
        summary: data.summary,
        sources: data.sources || [],
      });
    } catch (e) {
      console.error(e);
      setSearchGroundingData({
        summary: '2026 market standards prioritize sustainable composite housings, USB-C fast charging, and understated matte finishes.',
        sources: [],
      });
    } finally {
      setLoadingSearchGrounding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl sm:rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-500 hover:text-neutral-900 shadow-xs transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left: Gallery & AI Insights */}
            <div className="p-6 sm:p-8 bg-[#f5f6f8] flex flex-col justify-between space-y-4">
              <div>
                {/* Main Image */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-xs">
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {product.badge.text}
                      </span>
                    </div>
                  )}
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`w-13 h-13 rounded-lg overflow-hidden border-2 transition ${
                          activeImage === img ? 'border-[#b93815]' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Intelligence Actions */}
              <div className="space-y-2.5 pt-2 border-t border-neutral-200/80">
                <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#b93815]" />
                    AI Intelligence Suite
                  </span>
                </div>

                {/* Quick AI Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleFetchFastAISummary}
                    disabled={loadingFastSummary}
                    className="px-2.5 py-2 bg-white border border-neutral-200 hover:border-amber-400 rounded-xl text-left transition shadow-2xs group"
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-800 group-hover:text-amber-700">
                      <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Low-Latency Summary</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Gemini 3.1 Flash Lite</span>
                  </button>

                  <button
                    onClick={handleFetchSearchGrounding}
                    disabled={loadingSearchGrounding}
                    className="px-2.5 py-2 bg-white border border-neutral-200 hover:border-blue-400 rounded-xl text-left transition shadow-2xs group"
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-800 group-hover:text-blue-700">
                      <Globe className="w-3 h-3 text-blue-500 shrink-0" />
                      <span>Search Grounding</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Live Google Search</span>
                  </button>
                </div>

                {/* Fast AI Summary Output */}
                {loadingFastSummary && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-600 animate-spin shrink-0" />
                    <span>Generating ultra low-latency review summary...</span>
                  </div>
                )}
                {fastAiSummary && !loadingFastSummary && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-950 space-y-1 animate-fade-in">
                    <div className="flex items-center justify-between font-bold text-[10px] uppercase text-amber-800">
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-600" /> Fast Verdict (3.1 Lite)</span>
                    </div>
                    <div className="whitespace-pre-line leading-relaxed text-amber-900">{fastAiSummary}</div>
                  </div>
                )}

                {/* Search Grounding Output */}
                {loadingSearchGrounding && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
                    <span>Querying Google Search Grounding data...</span>
                  </div>
                )}
                {searchGroundingData && !loadingSearchGrounding && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-950 space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between font-bold text-[10px] uppercase text-blue-800">
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-blue-600" /> Grounded Market Intel</span>
                    </div>
                    <p className="leading-relaxed text-blue-900">{searchGroundingData.summary}</p>
                    {searchGroundingData.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1 border-t border-blue-200">
                        {searchGroundingData.sources.slice(0, 2).map((s, idx) => (
                          <a
                            key={idx}
                            href={s.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-[9px] bg-white text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 hover:underline"
                          >
                            <span>{s.title || 'Source'}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Info & Actions */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
                      {product.category}
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      In Stock
                    </span>
                  </div>

                  {/* Ask AI Concierge Button */}
                  {onAskAIAboutProduct && (
                    <button
                      onClick={() => {
                        onClose();
                        onAskAIAboutProduct(product, `Tell me more about ${product.name} and how it compares to others.`);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-[#b93815] bg-[#b93815]/10 hover:bg-[#b93815]/20 font-semibold px-2.5 py-1 rounded-lg transition"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat with Concierge</span>
                    </button>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-neutral-900 mt-1.5">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-neutral-800">{product.rating}</span>
                  <span className="text-xs text-neutral-500">({product.reviewsCount} verified reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2.5 mt-4">
                  <span className="text-2xl font-black text-neutral-950">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Color Variants */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-5">
                    <label className="text-xs font-semibold text-neutral-900 block mb-2">
                      Color / Finish: <span className="font-normal text-neutral-600">{selectedColor}</span>
                    </label>
                    <div className="flex gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedColor === c.name ? 'border-[#b93815] scale-110' : 'border-neutral-200 hover:scale-105'
                          }`}
                          title={c.name}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Features */}
                {product.features && (
                  <div className="mt-5 space-y-1.5 border-t border-neutral-100 pt-4">
                    {product.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-neutral-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 px-2 py-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-semibold text-sm text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 font-semibold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#b93815] hover:bg-[#a03012] text-white'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add ${(product.price * quantity).toFixed(2)} to Cart</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist toggle */}
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className="p-3 rounded-xl border border-neutral-300 text-neutral-700 hover:text-rose-600 hover:bg-neutral-50 transition cursor-pointer"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Trust info */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-[#b93815]" /> Free delivery over $100
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#b93815]" /> 30-Day Hassle-Free Return
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
