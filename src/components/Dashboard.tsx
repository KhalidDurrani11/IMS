import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Sale, Product, ViewType } from '../types';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Users,
  Truck,
  PlusCircle,
  Clock,
  ArrowRight,
  Eye,
  Plus,
  Lock,
  Receipt
} from 'lucide-react';
import { ReceiptModal } from './ReceiptModal';

interface DashboardProps {
  onNavigate: (view: ViewType, extraData?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { metrics, activityLogs, customers, userRole, formatMoney, addStock } = useShop();
  const [selectedReceiptSale, setSelectedReceiptSale] = useState<Sale | null>(null);

  // Quick Add Stock popup state
  const [quickStockProduct, setQuickStockProduct] = useState<Product | null>(null);
  const [quickStockQty, setQuickStockQty] = useState('10');
  const [quickStockReason, setQuickStockReason] = useState('Quick restock from dashboard');

  const handleQuickAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickStockProduct) return;
    const qty = parseInt(quickStockQty, 10);
    if (qty > 0) {
      addStock(quickStockProduct.id, qty, quickStockReason);
      setQuickStockProduct(null);
      setQuickStockQty('10');
    }
  };

  // Outstanding customers with positive balance
  const topUdhaarCustomers = customers
    .filter(c => c.totalUdhaar > 0)
    .sort((a, b) => b.totalUdhaar - a.totalUdhaar)
    .slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      {/* 6 VIBRANT THEME METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        {/* 1. Today's Sales */}
        <div
          onClick={() => onNavigate('sales')}
          className="bg-emerald-50 border-b-4 border-emerald-500 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Today&apos;s Sales
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">
            {formatMoney(metrics.todaySales)}
          </h2>
          <p className="text-emerald-600 text-xs mt-2 font-semibold">
            {metrics.todaySalesCount} bills completed
          </p>
        </div>

        {/* 2. Today's Profit */}
        <div
          onClick={() => (userRole === 'owner' ? onNavigate('reports') : null)}
          className={`bg-sky-50 border-b-4 border-sky-500 p-5 rounded-2xl shadow-xs transition-all ${
            userRole === 'owner' ? 'hover:shadow-md cursor-pointer' : ''
          }`}
        >
          <p className="text-sky-800 text-xs font-bold uppercase tracking-wider">
            Today&apos;s Profit
          </p>
          {userRole === 'owner' ? (
            <>
              <h2
                className={`text-2xl sm:text-3xl font-black mt-1 ${
                  metrics.todayProfit >= 0 ? 'text-sky-900' : 'text-rose-600'
                }`}
              >
                {formatMoney(metrics.todayProfit)}
              </h2>
              <p className="text-sky-600 text-xs mt-2 font-semibold">
                After all expenses
              </p>
            </>
          ) : (
            <div className="mt-2">
              <div className="flex items-center gap-1 text-slate-500 font-bold text-xs">
                <Lock className="w-3.5 h-3.5" /> Hidden (Worker)
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Switch to Owner</p>
            </div>
          )}
        </div>

        {/* 3. Low Stock Items */}
        <div
          onClick={() => onNavigate('stock')}
          className="bg-amber-50 border-b-4 border-amber-500 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-amber-800 text-xs font-bold uppercase tracking-wider">
            Low Stock Items
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-900 mt-1">
            {metrics.lowStockCount}
          </h2>
          <p className="text-amber-600 text-xs mt-2 font-semibold underline group-hover:text-amber-700">
            {metrics.outOfStockCount > 0 ? `${metrics.outOfStockCount} out of stock` : 'Click to view items'}
          </p>
        </div>

        {/* 4. Udhaar (To Receive) */}
        <div
          onClick={() => onNavigate('udhaar')}
          className="bg-rose-50 border-b-4 border-rose-500 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-rose-800 text-xs font-bold uppercase tracking-wider">
            Udhaar (To Receive)
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-rose-900 mt-1">
            {formatMoney(metrics.moneyToReceive)}
          </h2>
          <p className="text-rose-600 text-xs mt-2 font-semibold underline group-hover:text-rose-700">
            {customers.filter(c => c.totalUdhaar > 0).length} customers owe
          </p>
        </div>

        {/* 5. Total Products In Stock */}
        <div
          onClick={() => onNavigate('products')}
          className="bg-indigo-50 border-b-4 border-indigo-500 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-indigo-800 text-xs font-bold uppercase tracking-wider">
            Total Inventory
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-indigo-900 mt-1">
            {metrics.totalStockUnits.toLocaleString()}
          </h2>
          <p className="text-indigo-600 text-xs mt-2 font-semibold">
            Across {metrics.totalProductsCount} products
          </p>
        </div>

        {/* 6. Money to Pay (Suppliers) */}
        <div
          onClick={() => onNavigate('suppliers')}
          className="bg-purple-50 border-b-4 border-purple-500 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-purple-800 text-xs font-bold uppercase tracking-wider">
            Suppliers Pay
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-purple-900 mt-1">
            {formatMoney(metrics.moneyToPay)}
          </h2>
          <p className="text-purple-600 text-xs mt-2 font-semibold">
            Pending supplier dues
          </p>
        </div>
      </div>

      {/* 12-COLUMN VIBRANT PALETTE MAIN LAYOUT */}
      <div className="grid grid-cols-12 gap-6 sm:gap-8">
        {/* Left 8 Cols: Recent Activity & Today's Sales */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Recent Activity Table Container */}
          <div className="flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                <span>📋 Recent Shop Activity</span>
              </h3>
              <button
                onClick={() => onNavigate('reports')}
                className="text-indigo-600 hover:text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
              >
                View All History →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Activity</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {activityLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
                        No recent activity recorded yet.
                      </td>
                    </tr>
                  ) : (
                    activityLogs.slice(0, 6).map(log => {
                      const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      // Determine vibrant tag badge
                      let badgeClass = 'bg-slate-100 text-slate-700';
                      let label = 'Activity';
                      let isExpenseOrLoss = false;

                      if (log.type === 'sale') {
                        badgeClass = 'bg-emerald-50 text-emerald-800 border border-emerald-200';
                        label = 'Sale Added';
                      } else if (log.type === 'purchase' || log.type === 'stock_change') {
                        badgeClass = 'bg-amber-50 text-amber-800 border border-amber-200';
                        label = 'Stock Activity';
                      } else if (log.type === 'udhaar_payment') {
                        badgeClass = 'bg-sky-50 text-sky-800 border border-sky-200';
                        label = 'Udhaar Paid';
                      } else if (log.type === 'udhaar_added') {
                        badgeClass = 'bg-indigo-50 text-indigo-800 border border-indigo-200';
                        label = 'Udhaar Added';
                      } else if (log.type === 'expense_added') {
                        badgeClass = 'bg-rose-50 text-rose-800 border border-rose-200';
                        label = 'Expense';
                        isExpenseOrLoss = true;
                      } else if (log.type === 'product_added') {
                        badgeClass = 'bg-purple-50 text-purple-800 border border-purple-200';
                        label = 'New Item';
                      }

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 text-slate-400 text-xs font-medium whitespace-nowrap">
                            {timeStr}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
                              {label}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-800 text-xs sm:text-sm">
                            {log.description}
                          </td>
                          <td className="px-6 py-4 font-bold text-right text-xs sm:text-sm whitespace-nowrap">
                            {log.amount !== undefined ? (
                              <span className={isExpenseOrLoss ? 'text-rose-500' : 'text-emerald-700'}>
                                {isExpenseOrLoss ? '- ' : ''}{formatMoney(log.amount)}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Today's Sales Quick Access Panel */}
          <div className="flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                  <span>💰 Today&apos;s Completed Sales</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Live register logs</p>
              </div>
              <button
                onClick={() => onNavigate('sales')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-full shadow-md shadow-emerald-500/20 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Bill</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {metrics.todaySalesList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No sales recorded yet today. Click &ldquo;New Sale&rdquo; to start billing.
                </div>
              ) : (
                metrics.todaySalesList.map(sale => (
                  <div
                    key={sale.id}
                    className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                        #{sale.receiptNumber.replace('RCP-', '')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {sale.customerName || 'Walk-in Customer'}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(sale.date).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span>•</span>
                          <span>{sale.items.length} items</span>
                          <span>•</span>
                          <span className="capitalize text-indigo-600 font-semibold">
                            {sale.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm sm:text-base font-black text-slate-900">
                          {formatMoney(sale.total)}
                        </div>
                        {userRole === 'owner' && (
                          <div className="text-[11px] text-emerald-600 font-bold">
                            +{formatMoney(sale.profit)}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedReceiptSale(sale)}
                        className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                        title="View & Print Bill"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Low Stock Alert & Outstanding Udhaar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Low Stock Alert Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Low Stock Alert</span>
              </span>
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-md tracking-wide font-black uppercase">
                Action Required
              </span>
            </h3>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-72 pr-1">
              {metrics.lowStockList.length === 0 && metrics.outOfStockList.length === 0 ? (
                <div className="p-6 text-center text-emerald-600 text-sm font-semibold bg-emerald-50 rounded-2xl border border-emerald-100">
                  🎉 All products are well stocked!
                </div>
              ) : (
                [...metrics.outOfStockList, ...metrics.lowStockList].slice(0, 5).map(prod => {
                  const isOut = prod.quantity <= 0;
                  return (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{prod.name}</p>
                        <p className={`text-xs font-bold ${isOut ? 'text-red-600' : 'text-amber-700'}`}>
                          {isOut ? 'Out of stock' : `Only ${prod.quantity} ${prod.unit} left`}
                        </p>
                      </div>
                      <button
                        onClick={() => setQuickStockProduct(prod)}
                        className="bg-white border border-slate-200 text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-xl hover:bg-slate-100 shadow-xs transition-colors"
                      >
                        Order More
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => onNavigate('stock')}
              className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Manage Full Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vibrant Dark Theme Outstanding Udhaar Box */}
          <div className="bg-indigo-900 rounded-3xl p-6 shadow-xl text-white flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>🤝 Outstanding Udhaar</span>
              </h3>

              <div className="space-y-4">
                {topUdhaarCustomers.length === 0 ? (
                  <p className="text-indigo-200 text-xs py-4 text-center">
                    No active outstanding Udhaar right now.
                  </p>
                ) : (
                  topUdhaarCustomers.map((cust, idx) => (
                    <div
                      key={cust.id}
                      className={`flex justify-between items-center ${
                        idx < topUdhaarCustomers.length - 1 ? 'border-b border-indigo-800/80 pb-3' : ''
                      }`}
                    >
                      <div>
                        <p className="font-bold text-white text-sm">{cust.name}</p>
                        <p className="text-[11px] text-indigo-300">
                          {cust.phone || 'Customer'} • Last updated
                        </p>
                      </div>
                      <p className="font-black text-rose-400 text-base">
                        {formatMoney(cust.totalUdhaar)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => onNavigate('udhaar')}
              className="w-full mt-6 bg-indigo-700 hover:bg-indigo-600 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              View All Udhaar List
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ADD STOCK MODAL */}
      {quickStockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-slate-200">
            <h3 className="font-black text-slate-900 text-lg mb-1">
              Add Stock: {quickStockProduct.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Current stock: {quickStockProduct.quantity} {quickStockProduct.unit}s
            </p>

            <form onSubmit={handleQuickAddStock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity to Add ({quickStockProduct.unit}s)
                </label>
                <input
                  type="number"
                  min="1"
                  value={quickStockQty}
                  onChange={e => setQuickStockQty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-black focus:bg-white focus:outline-indigo-600 text-lg"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason / Note (Optional)
                </label>
                <input
                  type="text"
                  value={quickStockReason}
                  onChange={e => setQuickStockReason(e.target.value)}
                  placeholder="e.g. Received new carton, restocked shelf"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-xs focus:bg-white focus:outline-indigo-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickStockProduct(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 transition-colors"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      <ReceiptModal
        sale={selectedReceiptSale}
        onClose={() => setSelectedReceiptSale(null)}
      />
    </div>
  );
};
