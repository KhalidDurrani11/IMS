import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ExpenseCategory } from '../types';
import {
  Receipt,
  PlusCircle,
  Clock,
  Trash2,
  Zap,
  Home,
  Truck,
  Users,
  Coffee,
  Wrench,
  Package
} from 'lucide-react';

export const Expenses: React.FC = () => {
  const { expenses, addExpense, deleteExpense, formatMoney } = useShop();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Electricity');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const categoriesList: { name: ExpenseCategory; icon: typeof Zap }[] = [
    { name: 'Electricity', icon: Zap },
    { name: 'Rent', icon: Home },
    { name: 'Transport', icon: Truck },
    { name: 'Staff Salary', icon: Users },
    { name: 'Tea & Food', icon: Coffee },
    { name: 'Repair & Maintenance', icon: Wrench },
    { name: 'Packaging', icon: Package },
    { name: 'Other', icon: Receipt }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (!title.trim() || isNaN(val) || val <= 0) return;

    addExpense({
      title: title.trim(),
      category,
      amount: val,
      date,
      note: note.trim()
    });

    setIsAddModalOpen(false);
    setTitle('');
    setAmount('');
    setNote('');
  };

  // Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const thisMonthStr = todayStr.substring(0, 7);

  const todayExpensesTotal = useMemo(() => {
    return expenses
      .filter(e => e.date === todayStr)
      .reduce((acc, e) => acc + e.amount, 0);
  }, [expenses, todayStr]);

  const monthExpensesTotal = useMemo(() => {
    return expenses
      .filter(e => e.date.startsWith(thisMonthStr))
      .reduce((acc, e) => acc + e.amount, 0);
  }, [expenses, thisMonthStr]);

  const totalAllExpenses = useMemo(() => {
    return expenses.reduce((acc, e) => acc + e.amount, 0);
  }, [expenses]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    if (selectedCategory === 'all') return expenses;
    return expenses.filter(e => e.category === selectedCategory);
  }, [expenses, selectedCategory]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 sm:p-7 rounded-3xl text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-widest">
            <Receipt className="w-4 h-4" />
            Financial Records
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1 text-white">Shop Expenses & Overhead</h2>
          <p className="text-xs text-slate-400 mt-1">
            Record bills, tea, transport, rent, and staff salary. Deducted from real net profit.
          </p>
        </div>

        <button
          id="record-expense-main-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Today&apos;s Expenses
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600">
            {formatMoney(todayExpensesTotal)}
          </div>
          <p className="text-xs font-semibold text-rose-700/80 mt-1">Deducted from today&apos;s profit</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            This Month&apos;s Expenses
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatMoney(monthExpensesTotal)}
          </div>
          <p className="text-xs font-medium text-slate-400 mt-1">For {new Date().toLocaleString('default', { month: 'long' })}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Total All-Time Expenses
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatMoney(totalAllExpenses)}
          </div>
          <p className="text-xs font-medium text-slate-400 mt-1">Across {expenses.length} records</p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Categories ({expenses.length})
        </button>
        {categoriesList.map(cat => {
          const count = expenses.filter(e => e.category === cat.name).length;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                <th className="py-4 px-5">Expense Title</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5 text-right">Amount</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                    No expense records found. Click &ldquo;Record Expense&rdquo; above.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900">
                      {e.title}
                      {e.note && (
                        <span className="block text-xs font-normal text-slate-400 mt-0.5">
                          {e.note}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-xs">
                      <span className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-xl font-bold border border-rose-100/80">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {e.date}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right font-black text-rose-600 text-base">
                      {formatMoney(e.amount)}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete expense record "${e.title}"?`)) {
                            deleteExpense(e.id);
                          }
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD EXPENSE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-200">
            <h3 className="font-black text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-rose-600" />
              Record Shop Expense
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              Enter bill, rent, or staff expense to deduct from net shop profit
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expense Description *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Shop Electricity Bill, Rickshaw fare, Worker Tea"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-rose-600 font-medium"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-xs font-bold focus:bg-white focus:outline-rose-600"
                  >
                    {categoriesList.map(c => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount (Rs.) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 1200"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-black focus:bg-white focus:outline-rose-600 text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes / Bill number (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. Paid online, receipt # 440"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-xs focus:bg-white focus:outline-rose-600 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
