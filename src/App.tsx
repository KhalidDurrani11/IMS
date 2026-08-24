import React, { useState } from 'react';
import { ShopProvider } from './context/ShopContext';
import { ViewType } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Dashboard } from './components/Dashboard';
import { Products } from './components/Products';
import { Stock } from './components/Stock';
import { Sales } from './components/Sales';
import { PurchasesSuppliers } from './components/PurchasesSuppliers';
import { Udhaar } from './components/Udhaar';
import { Expenses } from './components/Expenses';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { GlobalSearchModal } from './components/GlobalSearchModal';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900" style={{ backgroundColor: '#f8fafc' }}>
      {/* Desktop & Mobile Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Navigation Bar */}
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Dynamic Center Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          {currentView === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {currentView === 'sales' && <Sales />}
          {currentView === 'products' && <Products />}
          {currentView === 'stock' && <Stock />}
          {currentView === 'purchases' && (
            <PurchasesSuppliers initialTab="purchases" />
          )}
          {currentView === 'suppliers' && (
            <PurchasesSuppliers initialTab="suppliers" />
          )}
          {currentView === 'udhaar' && <Udhaar />}
          {currentView === 'expenses' && <Expenses />}
          {currentView === 'reports' && <Reports />}
          {currentView === 'settings' && <Settings />}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentView}
        onSelectTab={handleNavigate}
        onOpenMobileMenu={() => setMobileSidebarOpen(true)}
      />

      {/* Universal Instant Search Modal (Ctrl+K or Header search button) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

