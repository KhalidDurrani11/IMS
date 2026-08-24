import React from 'react';
import { useShop } from '../context/ShopContext';
import { ViewType } from '../types';
import {
  Search,
  AlertTriangle,
  UserCheck,
  Shield,
  Plus,
  Package,
  Menu
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenSearch: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenSearch,
  onToggleMobileSidebar = () => {}
}) => {
  const { userRole, setUserRole, metrics } = useShop();

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          id="mobile-menu-toggle-btn"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          title="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Product or Customer */}
        <div className="relative w-full max-w-xs sm:max-w-md">
          <button
            id="nav-search-trigger"
            onClick={onOpenSearch}
            className="w-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 rounded-full py-2.5 pl-10 sm:pl-12 pr-4 text-xs sm:text-sm text-slate-500 flex items-center justify-between transition-all text-left shadow-xs focus:ring-2 focus:ring-indigo-500"
          >
            <span className="truncate">Search Product or Customer...</span>
            <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-white border border-slate-200 rounded-full shadow-xs">
              Ctrl + K
            </kbd>
          </button>
          <span className="absolute left-3.5 top-2.5 text-slate-400 pointer-events-none text-base">
            <Search className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Right: Low Stock, Role Switcher & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Low Stock Warning Pill */}
        {metrics.lowStockCount > 0 && (
          <button
            onClick={() => onNavigate('stock')}
            className="hidden xs:flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold transition-all shadow-xs"
            title="View Low Stock Items"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Low Stock:</span>
            <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-black">
              {metrics.lowStockCount}
            </span>
          </button>
        )}

        {/* User Role Switcher Pill */}
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 shadow-xs">
          <button
            onClick={() => setUserRole('owner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              userRole === 'owner'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Owner Mode: View all profits and wholesale costs"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Owner</span>
          </button>
          <button
            onClick={() => setUserRole('worker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              userRole === 'worker'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Worker Mode: Safe for staff (hides profit numbers)"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">Worker</span>
          </button>
        </div>

        {/* Add Stock Quick Button */}
        <button
          onClick={() => onNavigate('stock')}
          className="hidden sm:inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 px-5 rounded-full text-xs sm:text-sm border border-indigo-200 transition-all shadow-xs active:scale-95"
        >
          <Package className="w-4 h-4" />
          <span>Add Stock</span>
        </button>

        {/* New Sale Button */}
        <button
          id="nav-new-sale-btn"
          onClick={() => onNavigate('sales')}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 sm:py-2.5 px-4 sm:px-6 rounded-full shadow-lg shadow-emerald-500/20 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>New Sale</span>
        </button>
      </div>
    </header>
  );
};
