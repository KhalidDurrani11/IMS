import React from 'react';
import { useShop } from '../context/ShopContext';
import { ViewType } from '../types';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  Users,
  Truck,
  Receipt,
  FileText,
  Settings,
  Store,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  mobileOpen = false,
  onCloseMobile = () => {}
}) => {
  const { metrics, userRole, settings } = useShop();

  const navItems: { id: ViewType; label: string; icon: React.ElementType; badge: React.ReactNode; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'sales', label: 'Sales (POS)', icon: ShoppingCart, badge: null },
    { id: 'products', label: 'Products', icon: Package, badge: metrics.totalProductsCount },
    {
      id: 'stock',
      label: 'Stock Alert',
      icon: Layers,
      badge: metrics.lowStockCount > 0 ? `${metrics.lowStockCount} Low` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    },
    {
      id: 'udhaar',
      label: 'Customer Udhaar',
      icon: Users,
      badge: metrics.moneyToReceive > 0 ? 'Active' : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    },
    { id: 'purchases', label: 'Purchases', icon: Truck, badge: null },
    { id: 'suppliers', label: 'Suppliers Ledger', icon: Truck, badge: null },
    { id: 'expenses', label: 'Shop Expenses', icon: Receipt, badge: null },
    { id: 'reports', label: 'Reports & P&L', icon: FileText, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  const getInitials = (name: string) => {
    if (!name) return 'SR';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen md:h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div
            onClick={() => {
              onNavigate('dashboard');
              onCloseMobile();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-white text-base font-black tracking-tight leading-tight uppercase">
                {settings.shopName || 'Shop Register'}
              </h1>
              <p className="text-slate-400 text-xs font-medium mt-0.5">Digital Shop Register</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3.5 space-y-1.5 custom-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-left group ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4.5 h-4.5 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-indigo-700/80 text-white'
                        : item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Role Info Box in Sidebar */}
        <div className="p-3 bg-slate-800/60 m-3 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20 shrink-0">
              {getInitials(settings.shopName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">
                {userRole === 'owner' ? 'Owner Mode' : 'Worker Mode'}
              </p>
              <button
                onClick={() => {
                  onNavigate('settings');
                  onCloseMobile();
                }}
                className="text-slate-400 hover:text-indigo-300 text-[11px] underline font-medium block transition-colors"
              >
                Shop Settings
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
