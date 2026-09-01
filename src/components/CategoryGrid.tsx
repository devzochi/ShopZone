import React from 'react';
import { CategoryItem } from '../types';

interface CategoryGridProps {
  categories: CategoryItem[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Explore categories
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              id={`category-card-${cat.slug}`}
              onClick={() => onSelectCategory(cat.slug)}
              className={`group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] w-full text-left transition-all duration-300 transform active:scale-98 ${
                isSelected
                  ? 'ring-2 ring-[#ea580c] ring-offset-2 shadow-md'
                  : 'hover:shadow-md'
              }`}
            >
              {/* Category Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                referrerPolicy="no-referrer"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-opacity group-hover:opacity-90" />

              {/* Label */}
              <div className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 z-10">
                <span className="text-white font-semibold text-sm sm:text-base tracking-tight drop-shadow-sm">
                  {cat.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
