import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import {
  FileText,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Users,
  Download,
  Printer,
  ShoppingBag,
  Lock
} from 'lucide-react';

export const Reports: React.FC = () => {
  const {
    sales,
    products,
    customers,
    expenses,
    formatMoney,
    userRole,
    settings
  } = useShop();

  const [reportType, setReportType] = useState<
    'daily' | 'monthly' | 'top_items' | 'low_stock' | 'udhaar'
  >('daily');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().substring(0, 7)
  );

  // Daily Report calculations
  const dailyReport = useMemo(() => {
    const daySales = sales.filter(s => s.date.startsWith(selectedDate));
    const dayExpenses = expenses.filter(e => e.date === selectedDate);

    const totalSalesAmount = daySales.reduce((acc, s) => acc + s.total, 0);
    const totalGrossProfit = daySales.reduce((acc, s) => acc + s.profit, 0);
    const totalExpensesAmount = dayExpenses.reduce((acc, e) => acc + e.amount, 0);
    const netProfit = totalGrossProfit - totalExpensesAmount;

    return {
      salesCount: daySales.length,
      totalSalesAmount,
      totalGrossProfit,
      totalExpensesAmount,
      netProfit,
      salesList: daySales,
      expensesList: dayExpenses
    };
  }, [sales, expenses, selectedDate]);

  // Monthly Report calculations
  const monthlyReport = useMemo(() => {
    const monthSales = sales.filter(s => s.date.startsWith(selectedMonth));
    const monthExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));

    const totalSalesAmount = monthSales.reduce((acc, s) => acc + s.total, 0);
    const totalGrossProfit = monthSales.reduce((acc, s) => acc + s.profit, 0);
    const totalExpensesAmount = monthExpenses.reduce((acc, e) => acc + e.amount, 0);
    const netProfit = totalGrossProfit - totalExpensesAmount;

    return {
      salesCount: monthSales.length,
      totalSalesAmount,
      totalGrossProfit,
      totalExpensesAmount,
      netProfit,
      salesList: monthSales
    };
  }, [sales, expenses, selectedMonth]);

  // Top Selling Items (Aggregate across all sales)
  const topSellingItems = useMemo(() => {
    const map: { [prodId: string]: { name: string; quantitySold: number; totalRevenue: number; profit: number } } = {};

    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!map[item.productId]) {
          map[item.productId] = {
            name: item.productName,
            quantitySold: 0,
            totalRevenue: 0,
            profit: 0
          };
        }
        map[item.productId].quantitySold += item.quantity;
        map[item.productId].totalRevenue += item.total;
        map[item.productId].profit += (item.sellingPrice - item.buyingPrice) * item.quantity;
      });
    });

    return Object.values(map).sort((a, b) => b.quantitySold - a.quantitySold);
  }, [sales]);

  // Low Stock Items
  const lowStockItems = useMemo(() => {
    return products.filter(p => p.quantity <= p.lowStockLimit);
  }, [products]);

  // Outstanding Udhaar Customers
  const udhaarCustomers = useMemo(() => {
    return customers.filter(c => c.totalUdhaar > 0).sort((a, b) => b.totalUdhaar - a.totalUdhaar);
  }, [customers]);

  const totalOutstandingUdhaar = useMemo(() => {
    return udhaarCustomers.reduce((acc, c) => acc + c.totalUdhaar, 0);
  }, [udhaarCustomers]);

  // CSV Export utility
  const exportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'daily') {
      csvContent += `Daily Sales Report - ${selectedDate}\n`;
      csvContent += `Shop: ${settings.shopName}\n\n`;
      csvContent += `Bill Number,Time,Customer,Items Count,Total Amount,Payment Mode\n`;
      dailyReport.salesList.forEach(s => {
        csvContent += `"${s.receiptNumber}","${new Date(s.date).toLocaleTimeString()}","${s.customerName || 'Walk-in'}","${s.items.length}","${s.total}","${s.paymentMethod}"\n`;
      });
    } else if (reportType === 'top_items') {
      csvContent += `Top Selling Products Report\n`;
      csvContent += `Product Name,Total Units Sold,Total Revenue (Rs.),Total Profit (Rs.)\n`;
      topSellingItems.forEach(item => {
        csvContent += `"${item.name}","${item.quantitySold}","${item.totalRevenue}","${item.profit}"\n`;
      });
    } else if (reportType === 'udhaar') {
      csvContent += `Customer Udhaar Balance Report\n`;
      csvContent += `Customer Name,Phone,Address,Outstanding Udhaar (Rs.),Last Payment\n`;
      udhaarCustomers.forEach(c => {
        csvContent += `"${c.name}","${c.phone}","${c.address || ''}","${c.totalUdhaar}","${c.lastPaymentDate || 'None'}"\n`;
      });
    } else if (reportType === 'low_stock') {
      csvContent += `Low Stock Alert Report\n`;
      csvContent += `Product Name,Current Stock,Low Stock Limit,Unit\n`;
      lowStockItems.forEach(p => {
        csvContent += `"${p.name}","${p.quantity}","${p.lowStockLimit}","${p.unit}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${settings.shopName.replace(/\s+/g, '_')}_${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 sm:p-7 rounded-3xl text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
            <FileText className="w-4 h-4" />
            Executive Intelligence
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1 text-white">Shop Reports & Analytics</h2>
          <p className="text-xs text-slate-400 mt-1">
            Simple business summaries: Daily sales, monthly revenue, profit, and Udhaar lists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-4 py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-bold no-scrollbar">
        <button
          onClick={() => setReportType('daily')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            reportType === 'daily'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Daily Report
        </button>

        <button
          onClick={() => setReportType('monthly')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            reportType === 'monthly'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Monthly Summary
        </button>

        <button
          onClick={() => setReportType('top_items')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            reportType === 'top_items'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Top Selling Items
        </button>

        <button
          onClick={() => setReportType('low_stock')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            reportType === 'low_stock'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Low Stock Alert ({lowStockItems.length})
        </button>

        <button
          onClick={() => setReportType('udhaar')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            reportType === 'udhaar'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Customer Udhaar List ({udhaarCustomers.length})
        </button>
      </div>

      {/* Worker role notice if profit is hidden */}
      {userRole === 'worker' && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-2xl flex items-center gap-2.5 font-bold shadow-xs">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>You are in Worker Mode. Detailed shop profit numbers and wholesale margins are hidden. Switch to Owner mode in the top bar to view full financial reports.</span>
        </div>
      )}

      {/* REPORT CONTENT: 1. DAILY REPORT */}
      {reportType === 'daily' && (
        <div className="space-y-5">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Select Date for Report:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-xs font-bold focus:bg-white focus:outline-emerald-600"
            />
          </div>

          {/* Key Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Sales</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {formatMoney(dailyReport.totalSalesAmount)}
              </div>
              <div className="text-xs font-medium text-slate-400 mt-1">{dailyReport.salesCount} transactions</div>
            </div>

            {userRole === 'owner' ? (
              <>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Gross Margin</div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">
                    {formatMoney(dailyReport.totalGrossProfit)}
                  </div>
                  <div className="text-xs font-medium text-slate-400 mt-1">Sales minus buying cost</div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Expenses Deducted</div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
                    {formatMoney(dailyReport.totalExpensesAmount)}
                  </div>
                  <div className="text-xs font-medium text-slate-400 mt-1">{dailyReport.expensesList.length} expense items</div>
                </div>

                <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200/80 shadow-sm">
                  <div className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider">Net Clean Profit</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
                    {formatMoney(dailyReport.netProfit)}
                  </div>
                  <div className="text-xs font-bold text-emerald-800/80 mt-1">Final profit for this date</div>
                </div>
              </>
            ) : null}
          </div>

          {/* Detailed Sales on this Day */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm">Bills Issued on {selectedDate}</h3>
              <span className="text-xs font-bold text-slate-400">{dailyReport.salesList.length} total bills</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-widest font-bold text-[10px]">
                    <th className="py-3.5 px-5">Invoice #</th>
                    <th className="py-3.5 px-5">Time</th>
                    <th className="py-3.5 px-5">Customer</th>
                    <th className="py-3.5 px-5">Items Count</th>
                    <th className="py-3.5 px-5">Payment</th>
                    <th className="py-3.5 px-5 text-right">Bill Total</th>
                    {userRole === 'owner' && <th className="py-3.5 px-5 text-right">Profit</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {dailyReport.salesList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                        No sales recorded on {selectedDate}.
                      </td>
                    </tr>
                  ) : (
                    dailyReport.salesList.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-slate-900">{s.receiptNumber}</td>
                        <td className="py-3.5 px-5 text-xs text-slate-500 font-medium">
                          {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-slate-800">
                          {s.customerName || 'Walk-in'}
                        </td>
                        <td className="py-3.5 px-5 text-xs text-slate-500 font-medium">{s.items.length} items</td>
                        <td className="py-3.5 px-5">
                          <span className="capitalize px-2.5 py-1 bg-slate-100 rounded-xl text-slate-700 font-bold text-xs">
                            {s.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right font-black text-slate-900">
                          {formatMoney(s.total)}
                        </td>
                        {userRole === 'owner' && (
                          <td className="py-3.5 px-5 text-right font-black text-emerald-600">
                            {formatMoney(s.profit)}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 2. MONTHLY REPORT */}
      {reportType === 'monthly' && (
        <div className="space-y-5">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Select Month:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-xs font-bold focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Month Sales</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {formatMoney(monthlyReport.totalSalesAmount)}
              </div>
              <div className="text-xs font-medium text-slate-400 mt-1">{monthlyReport.salesCount} total sales</div>
            </div>

            {userRole === 'owner' && (
              <>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Month Gross Profit</div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">
                    {formatMoney(monthlyReport.totalGrossProfit)}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Month Expenses</div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
                    {formatMoney(monthlyReport.totalExpensesAmount)}
                  </div>
                </div>

                <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200/80 shadow-sm">
                  <div className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider">Month Net Clean Profit</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
                    {formatMoney(monthlyReport.netProfit)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 3. TOP SELLING ITEMS */}
      {reportType === 'top_items' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-sm">Most Popular Products by Volume</h3>
            <span className="text-xs font-bold text-slate-400">{topSellingItems.length} products with sales</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-widest font-bold text-[10px]">
                  <th className="py-3.5 px-5">Rank</th>
                  <th className="py-3.5 px-5">Product Name</th>
                  <th className="py-3.5 px-5 text-center">Units Sold</th>
                  <th className="py-3.5 px-5 text-right">Total Revenue</th>
                  {userRole === 'owner' && <th className="py-3.5 px-5 text-right">Total Profit Generated</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {topSellingItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-black text-slate-400">#{idx + 1}</td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3.5 px-5 text-center font-black text-emerald-600">
                      {item.quantitySold}
                    </td>
                    <td className="py-3.5 px-5 text-right font-black text-slate-900">
                      {formatMoney(item.totalRevenue)}
                    </td>
                    {userRole === 'owner' && (
                      <td className="py-3.5 px-5 text-right font-black text-emerald-600">
                        {formatMoney(item.profit)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 4. LOW STOCK ALERT REPORT */}
      {reportType === 'low_stock' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-sm">Products Running Out (Need Reorder)</h3>
            <span className="text-xs font-bold text-amber-700">{lowStockItems.length} items low</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-widest font-bold text-[10px]">
                  <th className="py-3.5 px-5">Product Name</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5 text-center">Current Quantity</th>
                  <th className="py-3.5 px-5 text-center">Low Stock Limit</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {lowStockItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-emerald-600 font-bold">
                      🎉 All products have healthy stock levels!
                    </td>
                  </tr>
                ) : (
                  lowStockItems.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3.5 px-5 text-xs text-slate-600 font-medium">{p.category}</td>
                      <td className="py-3.5 px-5 text-center font-black text-rose-600">
                        {p.quantity} {p.unit}s
                      </td>
                      <td className="py-3.5 px-5 text-center text-xs text-slate-500 font-medium">
                        {p.lowStockLimit} {p.unit}s
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-xl font-bold text-xs border border-amber-200">
                          {p.quantity === 0 ? '🔴 Out of Stock' : '🟡 Low Stock'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 5. CUSTOMER UDHAAR LIST */}
      {reportType === 'udhaar' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-sm">Customer Udhaar Register</h3>
              <p className="text-xs text-slate-500 font-medium">Total Money to Receive: <strong className="text-amber-700">{formatMoney(totalOutstandingUdhaar)}</strong></p>
            </div>
            <span className="text-xs font-bold text-indigo-700">{udhaarCustomers.length} customers owe money</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-widest font-bold text-[10px]">
                  <th className="py-3.5 px-5">Customer Name</th>
                  <th className="py-3.5 px-5">Phone Number</th>
                  <th className="py-3.5 px-5">Address</th>
                  <th className="py-3.5 px-5 text-center">Last Payment</th>
                  <th className="py-3.5 px-5 text-right">Udhaar Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {udhaarCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-emerald-600 font-bold">
                      🎉 No outstanding customer Udhaar balance!
                    </td>
                  </tr>
                ) : (
                  udhaarCustomers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3.5 px-5 text-xs text-slate-600 font-medium">{c.phone || '—'}</td>
                      <td className="py-3.5 px-5 text-xs text-slate-500 font-medium">{c.address || '—'}</td>
                      <td className="py-3.5 px-5 text-center text-xs text-slate-500 font-medium">{c.lastPaymentDate || 'None'}</td>
                      <td className="py-3.5 px-5 text-right font-black text-amber-700 text-base">
                        {formatMoney(c.totalUdhaar)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
