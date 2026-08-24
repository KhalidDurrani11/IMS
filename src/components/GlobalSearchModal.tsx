import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, X, Package, Users, Truck, ShoppingCart } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, extraData?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { products, customers, suppliers, sales, formatMoney, getStockStatus } = useShop();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedProducts = trimmed
    ? products.filter(
        p =>
          p.name.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed)
      ).slice(0, 5)
    : [];

  const matchedCustomers = trimmed
    ? customers.filter(
        c =>
          c.name.toLowerCase().includes(trimmed) ||
          c.phone.toLowerCase().includes(trimmed)
      ).slice(0, 5)
    : [];

  const matchedSuppliers = trimmed
    ? suppliers.filter(
        s =>
          s.name.toLowerCase().includes(trimmed) ||
          s.phone.toLowerCase().includes(trimmed) ||
          s.productsSupplied.toLowerCase().includes(trimmed)
      ).slice(0, 5)
    : [];

  const matchedSales = trimmed
    ? sales.filter(
        s =>
          s.receiptNumber.toLowerCase().includes(trimmed) ||
          (s.customerName && s.customerName.toLowerCase().includes(trimmed))
      ).slice(0, 4)
    : [];

  const hasResults =
    matchedProducts.length > 0 ||
    matchedCustomers.length > 0 ||
    matchedSuppliers.length > 0 ||
    matchedSales.length > 0;

  return (
    <div
      id="global-search-modal"
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-16 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            id="global-search-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products, stock, customers, udhaar, suppliers, receipts..."
            className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 text-base focus:outline-hidden"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-300"
          >
            ESC
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!trimmed ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              Type anything to quickly find products, customers, suppliers, or sales...
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {/* Products */}
              {matchedProducts.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" /> Products ({matchedProducts.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedProducts.map(p => {
                      const status = getStockStatus(p);
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            onNavigate('products', p.name);
                            onClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors border border-slate-100"
                        >
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">{p.name}</div>
                            <div className="text-xs text-slate-500">{p.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-900">
                              {formatMoney(p.sellingPrice)}
                            </div>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                                status === 'in_stock'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : status === 'low_stock'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              Stock: {p.quantity} {p.unit}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Customers & Udhaar */}
              {matchedCustomers.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Customers & Udhaar ({matchedCustomers.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedCustomers.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onNavigate('udhaar', c.name);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors border border-slate-100"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{c.name}</div>
                          <div className="text-xs text-slate-500">{c.phone}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Udhaar Balance</div>
                          <div
                            className={`text-sm font-bold ${
                              c.totalUdhaar > 0 ? 'text-amber-700' : 'text-emerald-700'
                            }`}
                          >
                            {formatMoney(c.totalUdhaar)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suppliers */}
              {matchedSuppliers.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> Suppliers ({matchedSuppliers.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedSuppliers.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onNavigate('suppliers', s.name);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors border border-slate-100"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{s.name}</div>
                          <div className="text-xs text-slate-500">{s.phone}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Money to Pay</div>
                          <div className="text-sm font-bold text-rose-700">
                            {formatMoney(s.amountOwed)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sales */}
              {matchedSales.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5" /> Sales Receipts ({matchedSales.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedSales.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onNavigate('dashboard');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors border border-slate-100"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{s.receiptNumber}</div>
                          <div className="text-xs text-slate-500">
                            {s.customerName || 'Walk-in Customer'} • {new Date(s.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-700">
                            {formatMoney(s.total)}
                          </div>
                          <div className="text-[11px] text-slate-400 capitalize">{s.paymentMethod}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
