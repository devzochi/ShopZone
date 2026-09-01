import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';

interface HeroSectionProps {
  onExploreProducts: () => void;
  onViewTrending: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProducts,
  onViewTrending,
}) => {
  return (
    <section className="mb-12">
      <div className="bg-white border border-neutral-200/90 rounded-2xl lg:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
              Shop smarter. Buy better.
            </h1>
            
            <p className="mt-5 text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-lg">
              Discover products selected around what you actually need. Precision minimalist commerce.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                id="hero-explore-btn"
                onClick={onExploreProducts}
                className="bg-[#ea580c] hover:bg-[#c2410c] active:scale-[0.98] text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-lg shadow-sm transition-all flex items-center gap-2 group"
              >
                <span>Explore products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                id="hero-trending-btn"
                onClick={onViewTrending}
                className="bg-white hover:bg-neutral-50 active:scale-[0.98] border border-neutral-300 text-neutral-800 font-medium text-sm sm:text-base px-6 py-3 rounded-lg transition-all"
              >
                View trending
              </button>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-sm bg-neutral-100 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/11]">
              <img
                src={HERO_IMAGE}
                alt="Minimalist curated workstation"
                className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-neutral-900/5 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
