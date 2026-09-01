import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Bell, User, X, Sparkles, Shield, LogIn } from 'lucide-react';
import { CategoryItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: 'shop' | 'deals' | 'new';
  setActiveTab: (tab: 'shop' | 'deals' | 'new') => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  categories: CategoryItem[];
  cartCount: number;
  wishlistCount: number;
  unreadNotificationsCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenNotifications: () => void;
  onOpenUserMenu: () => void;
  onOpenSearch: () => void;
  onOpenAIChat: () => void;
  onOpenAdminDashboard: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  categories,
  cartCount,
  wishlistCount,
  unreadNotificationsCount,
  onOpenCart,
  onOpenWishlist,
  onOpenNotifications,
  onOpenUserMenu,
  onOpenSearch,
  onOpenAIChat,
  onOpenAdminDashboard,
  onOpenAuth,
  searchQuery,
  setSearchQuery,
}) => {
  const { user, userProfile, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top main nav row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          
          {/* Brand Logo & Admin pill */}
          <div className="flex items-center gap-4">
            <button
              id="brand-logo-btn"
              onClick={() => {
                setActiveTab('shop');
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className="text-2xl font-bold tracking-tight text-[#b93815] hover:opacity-90 transition-opacity flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              CommerceOS
            </button>

            {isAdmin && (
              <button
                onClick={onOpenAdminDashboard}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold border border-purple-200 transition cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm hidden sm:block relative">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                id="search-input-field"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={onOpenSearch}
                placeholder="Search products..."
                className="w-full bg-[#f4f4f5] hover:bg-[#ececee] focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder-neutral-500 rounded-xl pl-10 pr-9 py-2 border border-transparent focus:border-neutral-300 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-medium">
            <button
              id="nav-shop-tab"
              onClick={() => {
                setActiveTab('shop');
                setSelectedCategory(null);
              }}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === 'shop' && !selectedCategory
                  ? 'text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Shop
              {activeTab === 'shop' && !selectedCategory && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b93815] rounded-full" />
              )}
            </button>

            <button
              id="nav-deals-tab"
              onClick={() => {
                setActiveTab('deals');
                setSelectedCategory(null);
              }}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === 'deals'
                  ? 'text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Deals
              {activeTab === 'deals' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b93815] rounded-full" />
              )}
            </button>

            <button
              id="nav-new-tab"
              onClick={() => {
                setActiveTab('new');
                setSelectedCategory(null);
              }}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === 'new'
                  ? 'text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              What's New
              {activeTab === 'new' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b93815] rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Action Icons & AI Trigger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* AI Concierge Trigger */}
            <button
              id="ai-concierge-btn"
              onClick={onOpenAIChat}
              className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-2xs cursor-pointer group"
              aria-label="AI Shopping Concierge"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">AI Concierge</span>
            </button>

            {/* Mobile search toggle */}
            <button
              id="mobile-search-btn"
              onClick={onOpenSearch}
              className="sm:hidden p-2 text-neutral-700 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              id="wishlist-header-btn"
              onClick={onOpenWishlist}
              className="relative p-2 text-neutral-700 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#b93815] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              id="cart-header-btn"
              onClick={onOpenCart}
              className="relative p-2 text-neutral-700 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#b93815] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              id="notifications-header-btn"
              onClick={onOpenNotifications}
              className="relative p-2 text-neutral-700 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 stroke-[1.75]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ea580c] rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* User Profile / Sign In */}
            {user ? (
              <button
                id="user-profile-btn"
                onClick={onOpenUserMenu}
                className="p-1 text-neutral-700 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition focus:outline-none cursor-pointer"
                aria-label="User account"
                title={userProfile?.displayName || user.email || 'User Account'}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full object-cover border border-neutral-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center bg-[#b93815]/10 text-[#b93815] font-bold text-xs">
                    {(userProfile?.displayName || user.email || 'U').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('signin')}
                className="p-2 text-neutral-700 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                title="Sign In / Register"
              >
                <div className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center bg-neutral-50 text-neutral-700">
                  <User className="w-4 h-4" />
                </div>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Subcategory Navigation Row */}
      <div className="border-t border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center sm:justify-center overflow-x-auto py-2.5 no-scrollbar gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-neutral-600">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  id={`cat-nav-btn-${cat.slug}`}
                  onClick={() => {
                    setActiveTab('shop');
                    setSelectedCategory(isActive ? null : cat.slug);
                  }}
                  className={`whitespace-nowrap transition-all px-2.5 py-1 rounded-md cursor-pointer ${
                    isActive
                      ? 'text-[#b93815] bg-[#b93815]/10 font-semibold'
                      : 'hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
