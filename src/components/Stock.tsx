import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import {
  Layers,
  AlertTriangle,
  PlusCircle,
  MinusCircle,
  Edit3,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  History
} from 'lucide-react';

interface StockProps {
  initialFilter?: string;
}

export const Stock: React.FC<StockProps> = ({ initialFilter = 'all' }) => {
  const {
    products,
    stockLogs,
    addStock,
    removeStock,
    correctStock,
    getStockStatus,
    metrics
  } = useShop();

  const [activeTab, setActiveTab] = useState<'all' | 'low' | 'out' | 'logs'>(
    initialFilter === 'low' ? 'low' : 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [modalMode, setModalMode] = useState<'add' | 'remove' | 'correct' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [amountInput, setAmountInput] = useState('');
  const [reasonInput, setReasonInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const openActionModal = (p: Product, mode: 'add' | 'remove' | 'correct') => {
    setSelectedProduct(p);
    setModalMode(mode);
    setAmountInput(mode === 'correct' ? p.quantity.toString() : '10');
    setReasonInput(
      mode === 'add'
        ? 'Restocked from supplier shipment'
        : mode === 'remove'
        ? 'Damaged / Expired item'
        : 'Physical stock audit correction'
    );
    setErrorMessage('');
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !modalMode) return;

    const val = Number(amountInput);
    if (isNaN(val) || val < 0) {
      setErrorMessage('Please enter a valid positive number');
      return;
    }

    if (modalMode === 'add') {
      addStock(selectedProduct.id, val, reasonInput);
    } else if (modalMode === 'remove') {
      if (val > selectedProduct.quantity) {
        setErrorMessage(
          `Cannot remove ${val}. Only ${selectedProduct.quantity} currently available in stock.`
        );
        return;
      }
      removeStock(selectedProduct.id, val, reasonInput);
    } else if (modalMode === 'correct') {
      correctStock(selectedProduct.id, val, reasonInput);
    }

    setModalMode(null);
    setSelectedProduct(null);
  };

  // Filtered list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const status = getStockStatus(p);

      if (activeTab === 'low') return matchesSearch && status === 'low_stock';
      if (activeTab === 'out') return matchesSearch && status === 'out_of_stock';
      return matchesSearch;
    });
  }, [products, searchQuery, activeTab, getStockStatus]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            Stock & Inventory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor inventory counts, restock, and log audit corrections
          </p>
        </div>

        {/* 3 Status Summary Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>In Stock: {products.length - metrics.lowStockCount - metrics.outOfStockCount}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-2xl text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Low: {metrics.lowStockCount}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>Out: {metrics.outOfStockCount}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              All Items ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('low')}
              className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'low'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Low Stock ({metrics.lowStockCount})
            </button>

            <button
              onClick={() => setActiveTab('out')}
              className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'out'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              Out of Stock ({metrics.outOfStockCount})
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'logs'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Stock History Logs ({stockLogs.length})
            </button>
          </div>

          {/* Search */}
          {activeTab !== 'logs' && (
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search stock..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-indigo-600"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Stock Table or History Logs */}
      {activeTab !== 'logs' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                  <th className="py-4 px-5">Product</th>
                  <th className="py-4 px-5">Category</th>
                  <th className="py-4 px-5 text-center">Current Quantity</th>
                  <th className="py-4 px-5 text-center">Low Stock Limit</th>
                  <th className="py-4 px-5 text-center">Status</th>
                  <th className="py-4 px-5 text-right">Quick Stock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                      No products found in this stock view.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(p => {
                    const status = getStockStatus(p);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5 font-bold text-slate-900">
                          {p.name}
                        </td>
                        <td className="py-4 px-5 text-slate-500 text-xs font-medium">
                          {p.category}
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className="text-base font-black text-slate-900">
                            {p.quantity}
                          </span>{' '}
                          <span className="text-xs text-slate-400 font-medium">{p.unit}</span>
                        </td>
                        <td className="py-4 px-5 text-center text-slate-600 text-xs font-semibold">
                          {p.lowStockLimit} {p.unit}s
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                              status === 'in_stock'
                                ? 'bg-emerald-100 text-emerald-800'
                                : status === 'low_stock'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {status === 'in_stock' && '🟢 In Stock'}
                            {status === 'low_stock' && '🟡 Low Stock'}
                            {status === 'out_of_stock' && '🔴 Out of Stock'}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Add Stock */}
                            <button
                              onClick={() => openActionModal(p, 'add')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                              title="Add stock"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              Add
                            </button>

                            {/* Remove Stock */}
                            <button
                              onClick={() => openActionModal(p, 'remove')}
                              disabled={p.quantity <= 0}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:hover:bg-rose-50 disabled:hover:text-rose-700 shadow-xs"
                              title="Remove damaged or expired stock"
                            >
                              <MinusCircle className="w-3.5 h-3.5" />
                              Remove
                            </button>

                            {/* Correct Stock */}
                            <button
                              onClick={() => openActionModal(p, 'correct')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                              title="Correct quantity"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Correct
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* STOCK HISTORY LOGS */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">
              Complete Stock Movement History
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              Showing {stockLogs.length} events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                  <th className="py-4 px-5">Date & Time</th>
                  <th className="py-4 px-5">Product</th>
                  <th className="py-4 px-5">Type</th>
                  <th className="py-4 px-5 text-center">Change</th>
                  <th className="py-4 px-5 text-center">New Total</th>
                  <th className="py-4 px-5">Reason / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {stockLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                      No stock changes logged yet.
                    </td>
                  </tr>
                ) : (
                  stockLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5 text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(log.timestamp).toLocaleString([], {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        {log.productName}
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-black capitalize ${
                            log.changeType === 'sale'
                              ? 'bg-sky-100 text-sky-800'
                              : log.changeType === 'purchase'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.changeType === 'add'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.changeType === 'remove'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {log.changeType}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center font-black">
                        <span
                          className={
                            log.quantityChange > 0 ? 'text-emerald-700' : 'text-rose-700'
                          }
                        >
                          {log.quantityChange > 0
                            ? `+${log.quantityChange}`
                            : log.quantityChange}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center font-black text-slate-900">
                        {log.newQuantity}
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 max-w-xs truncate font-medium">
                        {log.reason || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STOCK ACTION MODAL */}
      {modalMode && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-200">
            <h3 className="font-black text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              {modalMode === 'add' && `Add Stock: ${selectedProduct.name}`}
              {modalMode === 'remove' && `Remove Stock: ${selectedProduct.name}`}
              {modalMode === 'correct' && `Correct Quantity: ${selectedProduct.name}`}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Current stock on register: <strong className="text-slate-900">{selectedProduct.quantity} {selectedProduct.unit}s</strong>
            </p>

            {errorMessage && (
              <div className="p-3 mb-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-bold">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {modalMode === 'correct'
                    ? `Exact New Quantity (${selectedProduct.unit}s)`
                    : `Quantity to ${modalMode === 'add' ? 'Add' : 'Remove'} (${selectedProduct.unit}s)`}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={amountInput}
                  onChange={e => setAmountInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-black focus:bg-white focus:outline-indigo-600 text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason / Note
                </label>
                <input
                  type="text"
                  value={reasonInput}
                  onChange={e => setReasonInput(e.target.value)}
                  placeholder="e.g. Shipment received, expired bottle, recount"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-xs focus:bg-white focus:outline-indigo-600 font-medium"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalMode(null);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-3 text-white font-bold text-xs rounded-2xl shadow-lg transition-all ${
                    modalMode === 'remove'
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
                  }`}
                >
                  Confirm {modalMode === 'add' ? 'Add Stock' : modalMode === 'remove' ? 'Remove' : 'Save Count'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
