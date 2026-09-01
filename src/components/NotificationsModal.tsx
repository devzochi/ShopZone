import React from 'react';
import { X, Bell, CheckCheck, Package, Tag, Info } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div onClick={onClose} className="fixed inset-0 bg-black/30 backdrop-blur-xs" />

      <div className="fixed top-18 right-4 sm:right-8 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-50 animate-scale-in">
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#ea580c]" />
            <h3 className="font-bold text-neutral-900 text-sm">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] text-[#ea580c] hover:underline font-medium flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-neutral-100">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-neutral-500">No new notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 transition ${
                  n.read ? 'bg-white' : 'bg-orange-50/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 flex-shrink-0 mt-0.5">
                    {n.type === 'order' && <Package className="w-3.5 h-3.5 text-[#ea580c]" />}
                    {n.type === 'discount' && <Tag className="w-3.5 h-3.5 text-emerald-600" />}
                    {n.type === 'system' && <Info className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900 text-xs">{n.title}</h4>
                    <p className="text-[11px] text-neutral-600 mt-0.5 leading-snug">{n.description}</p>
                    <span className="text-[10px] text-neutral-400 mt-1 block">{n.timestamp}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
