import React from 'react';
import { useShop } from '../context/ShopContext';
import { ViewType } from '../types';
import { LayoutDashboard, ShoppingCart, Layers, Users, Menu } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: ViewType;
  onSelectTab: (tab: ViewType) => void;
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu
}) => {
  const { metrics } = useShop();

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 shadow-xl no-print"
    >
      <div className="flex items-center justify-around">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[11px] font-bold transition-colors ${
            currentTab === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectTab('sales')}
          className="relative flex flex-col items-center justify-center py-1 px-3 text-[11px] font-bold transition-all"
        >
          <div className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl -mt-6 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className={`mt-1 ${currentTab === 'sales' ? 'text-emerald-600 font-black' : 'text-slate-700'}`}>
            New Sale
          </span>
        </button>

        <button
          onClick={() => onSelectTab('stock')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[11px] font-bold transition-colors ${
            currentTab === 'stock' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'
          }`}
        >
          <div className="relative">
            <Layers className="w-5 h-5 mb-0.5" />
            {metrics.lowStockCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 ring-2 ring-white rounded-full animate-pulse" />
            )}
          </div>
          <span>Stock</span>
        </button>

        <button
          onClick={() => onSelectTab('udhaar')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[11px] font-bold transition-colors ${
            currentTab === 'udhaar' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Udhaar</span>
        </button>

        <button
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-[11px] font-bold text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Menu</span>
        </button>
      </div>
    </nav>
  );
};

