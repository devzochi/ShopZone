import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  LogOut, 
  CheckCircle, 
  Shield, 
  Sparkles, 
  LogIn, 
  Truck, 
  Clock, 
  Check, 
  Save, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { subscribeToUserOrders } from '../lib/firestoreStore';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenAdminDashboard?: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenAuth,
  onOpenAdminDashboard,
}) => {
  const { user, userProfile, isAdmin, logout, updateUserAddress, toggleAdminRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);

  // Address editing state
  const [addressForm, setAddressForm] = useState({
    fullName: userProfile?.address?.fullName || userProfile?.displayName || '',
    street: userProfile?.address?.street || '742 Evergreen Terrace',
    city: userProfile?.address?.city || 'San Francisco',
    state: userProfile?.address?.state || 'CA',
    zip: userProfile?.address?.zip || '94107',
    country: 'United States',
  });
  const [addressSaved, setAddressSaved] = useState(false);

  // Keep address form in sync with user profile
  useEffect(() => {
    if (userProfile?.address) {
      setAddressForm({
        fullName: userProfile.address.fullName || userProfile.displayName || '',
        street: userProfile.address.street || '',
        city: userProfile.address.city || '',
        state: userProfile.address.state || '',
        zip: userProfile.address.zip || '',
        country: userProfile.address.country || 'United States',
      });
    }
  }, [userProfile]);

  // Subscribe to user orders in Firestore
  useEffect(() => {
    if (isOpen && user) {
      const unsub = subscribeToUserOrders(user.uid, (userOrders) => {
        setOrders(userOrders);
      });
      return () => unsub();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserAddress(addressForm);
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-neutral-200">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-[#fafafa]">
            {user ? (
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-11 h-11 rounded-full object-cover border border-neutral-200"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#b93815]/10 text-[#b93815] flex items-center justify-center font-bold text-sm">
                    {(userProfile?.displayName || user.email || 'U').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-neutral-900 text-sm">
                      {userProfile?.displayName || user.displayName || 'CommerceOS Member'}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">{user.email}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">Guest Visitor</h3>
                  <span className="text-xs text-neutral-500">Sign in to sync your orders & wishlist</span>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Not signed in banner */}
          {!user && (
            <div className="p-6 bg-amber-50/60 border-b border-amber-200/60 space-y-3 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Unlock Member Capabilities</h4>
                <p className="text-xs text-neutral-600 mt-1">
                  Enjoy cloud persistent cart, order tracking, and AI-powered recommendations.
                </p>
              </div>
              <div className="flex gap-2 justify-center pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth('signin');
                  }}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth('signup');
                  }}
                  className="bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  <span>Sign Up Free</span>
                </button>
              </div>
            </div>
          )}

          {/* Admin shortcut button banner if user is Admin */}
          {isAdmin && (
            <div className="px-6 py-3 bg-purple-50 border-b border-purple-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-purple-900 font-semibold">
                <Shield className="w-4 h-4 text-purple-700" />
                <span>Admin Privileges Enabled</span>
              </div>
              {onOpenAdminDashboard && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdminDashboard();
                  }}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition cursor-pointer shadow-xs"
                >
                  <span>Open Admin Panel</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Navigation Pills */}
          <div className="flex border-b border-neutral-100 px-6 gap-6 text-xs font-semibold text-neutral-600 bg-white">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3.5 relative ${activeTab === 'orders' ? 'text-[#b93815]' : 'hover:text-neutral-900'}`}
            >
              Order History {orders.length > 0 && `(${orders.length})`}
              {activeTab === 'orders' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b93815]" />}
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`py-3.5 relative ${activeTab === 'addresses' ? 'text-[#b93815]' : 'hover:text-neutral-900'}`}
            >
              Shipping Address
              {activeTab === 'addresses' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b93815]" />}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3.5 relative ${activeTab === 'profile' ? 'text-[#b93815]' : 'hover:text-neutral-900'}`}
            >
              Settings & Roles
              {activeTab === 'profile' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b93815]" />}
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            
            {/* 1. Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-xs text-neutral-500 space-y-2">
                    <Package className="w-8 h-8 text-neutral-300 mx-auto" />
                    <p className="font-semibold text-neutral-700">No Orders Placed Yet</p>
                    <p className="text-neutral-400 max-w-xs mx-auto">
                      Explore precision products in our shop and complete your first checkout to view real-time tracking here.
                    </p>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div key={ord.id} className="border border-neutral-200 rounded-2xl p-4 space-y-2.5 bg-white shadow-2xs">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-neutral-900">Order #{ord.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          ord.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          ord.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                          'bg-neutral-100 text-neutral-700'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-neutral-600">
                        {ord.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-neutral-700">
                            <span>{item.name} <span className="text-neutral-400">×{item.quantity}</span></span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-xs pt-2.5 border-t border-neutral-100 text-neutral-500">
                        <span>{new Date(ord.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="font-bold text-neutral-900 text-sm">${ord.totalAmount?.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. Shipping Addresses Tab */}
            {activeTab === 'addresses' && (
              <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Full Recipient Name</label>
                  <input
                    type="text"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-900 focus:bg-white focus:border-[#b93815] focus:outline-none"
                    placeholder="e.g. Alex Morgan"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-900 focus:bg-white focus:border-[#b93815] focus:outline-none"
                    placeholder="742 Evergreen Terrace"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-900 focus:bg-white focus:border-[#b93815] focus:outline-none"
                      placeholder="San Francisco"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">State / Province</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-900 focus:bg-white focus:border-[#b93815] focus:outline-none"
                      placeholder="CA"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Postal / ZIP Code</label>
                    <input
                      type="text"
                      value={addressForm.zip}
                      onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-900 focus:bg-white focus:border-[#b93815] focus:outline-none"
                      placeholder="94107"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Country</label>
                    <input
                      type="text"
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-900 focus:bg-white focus:border-[#b93815] focus:outline-none"
                      placeholder="United States"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#b93815] hover:bg-[#a03012] text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer mt-3"
                >
                  {addressSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Address Saved to Firestore!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Default Shipping Address</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* 3. Settings & Role Toggle */}
            {activeTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">Current Role</span>
                    <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-800">
                      {isAdmin ? 'Store Administrator' : 'Verified Customer'}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">
                    Administrators have access to real-time product inventory editing, Firestore order status management, and the Gemini 3.5 AI Product Studio.
                  </p>
                  
                  {user && (
                    <button
                      type="button"
                      onClick={toggleAdminRole}
                      className="w-full mt-2 py-2 px-3 bg-white border border-neutral-300 hover:border-purple-500 text-purple-700 font-semibold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Switch to {isAdmin ? 'Customer Role' : 'Admin Role'}</span>
                    </button>
                  )}
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <span className="font-bold text-neutral-900 block">CommerceOS Security & Cloud Sync</span>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">
                    Authenticated with Firebase Auth and backed by Google Cloud Firestore database.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Footer with Sign In / Out */}
          <div className="p-5 border-t border-neutral-100 bg-[#fafafa]">
            {user ? (
              <button
                onClick={logout}
                className="w-full border border-neutral-300 hover:border-rose-300 text-neutral-700 hover:text-rose-600 font-semibold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 bg-white cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Account</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth('signin');
                }}
                className="w-full bg-[#b93815] hover:bg-[#a03012] text-white font-semibold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In or Register</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
