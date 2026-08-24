import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Customer } from '../types';
import {
  Users,
  Search,
  PlusCircle,
  Phone,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Share2,
  Trash2,
  Edit2
} from 'lucide-react';

interface UdhaarProps {
  initialSearch?: string;
}

export const Udhaar: React.FC<UdhaarProps> = ({ initialSearch = '' }) => {
  const {
    customers,
    addCustomer,
    editCustomer,
    deleteCustomer,
    addUdhaarToCustomer,
    receiveUdhaarPayment,
    formatMoney,
    settings
  } = useShop();

  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Modals state
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState<Customer | null>(null);
  const [activePaymentCustomer, setActivePaymentCustomer] = useState<Customer | null>(null);
  const [activeAddUdhaarCustomer, setActiveAddUdhaarCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form inputs
  const [custForm, setCustForm] = useState({ name: '', phone: '', address: '', initialUdhaar: '0' });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('Cash payment received');
  const [addUdhaarAmount, setAddUdhaarAmount] = useState('');
  const [addUdhaarNote, setAddUdhaarNote] = useState('Manual items taken on Udhaar');

  // Filtered list
  const filteredCustomers = useMemo(() => {
    return customers.filter(
      c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  const totalOutstandingUdhaar = useMemo(() => {
    return customers.reduce((acc, c) => acc + (c.totalUdhaar || 0), 0);
  }, [customers]);

  // Actions
  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custForm.name.trim()) return;

    if (editingCustomer) {
      editCustomer(editingCustomer.id, {
        name: custForm.name.trim(),
        phone: custForm.phone.trim(),
        address: custForm.address.trim()
      });
      setEditingCustomer(null);
    } else {
      addCustomer({
        name: custForm.name.trim(),
        phone: custForm.phone.trim(),
        address: custForm.address.trim(),
        initialUdhaar: Number(custForm.initialUdhaar) || 0
      });
      setIsAddCustomerOpen(false);
    }

    setCustForm({ name: '', phone: '', address: '', initialUdhaar: '0' });
  };

  const handleReceivePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentCustomer) return;
    const amount = Number(paymentAmount);
    if (amount > 0) {
      receiveUdhaarPayment(activePaymentCustomer.id, amount, paymentNote);
      setActivePaymentCustomer(null);
      setPaymentAmount('');
      setPaymentNote('Cash payment received');
    }
  };

  const handleAddUdhaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAddUdhaarCustomer) return;
    const amount = Number(addUdhaarAmount);
    if (amount > 0) {
      addUdhaarToCustomer(activeAddUdhaarCustomer.id, amount, addUdhaarNote);
      setActiveAddUdhaarCustomer(null);
      setAddUdhaarAmount('');
      setAddUdhaarNote('Manual items taken on Udhaar');
    }
  };

  // WhatsApp Reminder Link
  const sendWhatsAppReminder = (c: Customer) => {
    const phone = c.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${c.name} Sahib,\n\nThis is a polite reminder from *${settings.shopName}*.\nYour current Udhaar remaining balance is *${formatMoney(c.totalUdhaar)}*.\n\nKindly clear at your earliest convenience.\nShukriya!\nTel: ${settings.phone}`
    );
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Total Udhaar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 sm:p-7 rounded-3xl text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest">
            <Users className="w-4 h-4" />
            Customer Credit Register
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1 text-white">Udhaar Khata (Money to Receive)</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track who owes money, record cash payments, and send polite reminders.
          </p>
        </div>

        <div className="flex items-center gap-3 sm:text-right">
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Udhaar to Receive
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              {formatMoney(totalOutstandingUdhaar)}
            </div>
          </div>

          <button
            id="add-customer-udhaar-btn"
            onClick={() => {
              setEditingCustomer(null);
              setCustForm({ name: '', phone: '', address: '', initialUdhaar: '0' });
              setIsAddCustomerOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Search & List */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search customer name or phone number..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:bg-white focus:outline-indigo-600"
          />
        </div>
      </div>

      {/* Customers List Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                <th className="py-4 px-5">Customer Name</th>
                <th className="py-4 px-5">Phone & Address</th>
                <th className="py-4 px-5 text-right">Remaining Udhaar</th>
                <th className="py-4 px-5 text-center">Last Payment Date</th>
                <th className="py-4 px-5 text-right">Quick Udhaar Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(c => {
                  const hasUdhaar = c.totalUdhaar > 0;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name */}
                      <td className="py-4 px-5 font-bold text-slate-900">
                        {c.name}
                      </td>

                      {/* Phone & Address */}
                      <td className="py-4 px-5 text-xs text-slate-600">
                        {c.phone ? (
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {c.phone}
                          </div>
                        ) : (
                          <span className="text-slate-400">No phone</span>
                        )}
                        {c.address && (
                          <span className="text-slate-400 block text-[11px] mt-0.5 font-medium">
                            {c.address}
                          </span>
                        )}
                      </td>

                      {/* Remaining Udhaar */}
                      <td className="py-4 px-5 text-right">
                        <span
                          className={`text-base font-black ${
                            hasUdhaar ? 'text-amber-700' : 'text-emerald-700'
                          }`}
                        >
                          {formatMoney(c.totalUdhaar)}
                        </span>
                      </td>

                      {/* Last Payment Date */}
                      <td className="py-4 px-5 text-center text-xs text-slate-500">
                        {c.lastPaymentDate ? (
                          <span className="inline-flex items-center gap-1 text-slate-700 font-bold">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {c.lastPaymentDate}
                          </span>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Receive Payment Button */}
                          <button
                            onClick={() => {
                              setActivePaymentCustomer(c);
                              setPaymentAmount(c.totalUdhaar > 0 ? c.totalUdhaar.toString() : '');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                            title="Receive cash payment"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            Receive Payment
                          </button>

                          {/* Add Udhaar Button */}
                          <button
                            onClick={() => setActiveAddUdhaarCustomer(c)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                            title="Add Udhaar amount"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            Add Udhaar
                          </button>

                          {/* View History Ledger */}
                          <button
                            onClick={() => setSelectedCustomerForHistory(c)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                            title="View customer ledger"
                          >
                            History
                          </button>

                          {/* WhatsApp Reminder */}
                          {hasUdhaar && (
                            <button
                              onClick={() => sendWhatsAppReminder(c)}
                              className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                              title="Send WhatsApp payment reminder"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit Customer */}
                          <button
                            onClick={() => {
                              setEditingCustomer(c);
                              setCustForm({
                                name: c.name,
                                phone: c.phone,
                                address: c.address || '',
                                initialUdhaar: '0'
                              });
                            }}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                            title="Edit customer details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Customer */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete customer ${c.name}?`)) {
                                deleteCustomer(c.id);
                              }
                            }}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete customer"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* RECEIVE PAYMENT MODAL */}
      {activePaymentCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-slate-200">
            <h3 className="font-black text-slate-900 text-lg mb-1 flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
              Receive Udhaar Payment
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Customer: <strong className="text-slate-900">{activePaymentCustomer.name}</strong>
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl mb-4 text-xs flex justify-between items-center">
              <span className="text-amber-900 font-bold">Remaining Udhaar:</span>
              <span className="font-black text-amber-950 text-sm">
                {formatMoney(activePaymentCustomer.totalUdhaar)}
              </span>
            </div>

            <form onSubmit={handleReceivePaymentSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount Received (Rs.) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-black focus:bg-white focus:outline-emerald-600 text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Note (Optional)
                </label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={e => setPaymentNote(e.target.value)}
                  placeholder="e.g. Paid in cash after salary"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-xs focus:bg-white focus:outline-emerald-600 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePaymentCustomer(null)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-500/30 transition-all"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD UDHAAR MODAL */}
      {activeAddUdhaarCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-slate-200">
            <h3 className="font-black text-slate-900 text-lg mb-1 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-indigo-600" />
              Add Udhaar to Customer
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Customer: <strong className="text-slate-900">{activeAddUdhaarCustomer.name}</strong>
            </p>

            <form onSubmit={handleAddUdhaarSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Udhaar Amount (Rs.) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={addUdhaarAmount}
                  onChange={e => setAddUdhaarAmount(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-black focus:bg-white focus:outline-indigo-600 text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason / Item description
                </label>
                <input
                  type="text"
                  value={addUdhaarNote}
                  onChange={e => setAddUdhaarNote(e.target.value)}
                  placeholder="e.g. 5kg Sugar, 2L Oil"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-xs focus:bg-white focus:outline-indigo-600 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveAddUdhaarCustomer(null)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Save Udhaar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER HISTORY LEDGER MODAL */}
      {selectedCustomerForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-black text-slate-900 text-lg">
                  {selectedCustomerForHistory.name} — Khata History
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Tel: {selectedCustomerForHistory.phone || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Remaining Balance</div>
                <div className="text-xl font-black text-amber-600">
                  {formatMoney(selectedCustomerForHistory.totalUdhaar)}
                </div>
              </div>
            </div>

            <div className="my-4 max-h-72 overflow-y-auto divide-y divide-slate-100 pr-1">
              {selectedCustomerForHistory.transactions.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-medium">
                  No transaction history recorded yet.
                </div>
              ) : (
                selectedCustomerForHistory.transactions.map((tx, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">
                        {tx.type === 'payment_received'
                          ? '💵 Cash Payment Received'
                          : tx.type === 'sale_credit'
                          ? '🛒 Sale on Credit'
                          : '📝 Manual Udhaar Entry'}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5 font-medium">{tx.note || '—'}</div>
                      <div className="text-slate-400 text-[10px]">{tx.date}</div>
                    </div>
                    <div className="text-right font-black text-sm">
                      <span
                        className={
                          tx.type === 'payment_received' ? 'text-emerald-600' : 'text-rose-600'
                        }
                      >
                        {tx.type === 'payment_received'
                          ? `-${formatMoney(tx.amount)}`
                          : `+${formatMoney(tx.amount)}`}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setSelectedCustomerForHistory(null)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
            >
              Close History
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT CUSTOMER MODAL */}
      {(isAddCustomerOpen || editingCustomer) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-slate-200">
            <h3 className="font-black text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter customer details for recording Udhaar
            </p>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={custForm.name}
                  onChange={e => setCustForm({ ...custForm, name: e.target.value })}
                  placeholder="e.g. Ahmed Khan, Chaudhry Tariq"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-indigo-600 font-medium"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={custForm.phone}
                  onChange={e => setCustForm({ ...custForm, phone: e.target.value })}
                  placeholder="0300-1234567"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-indigo-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Address / Note
                </label>
                <input
                  type="text"
                  value={custForm.address}
                  onChange={e => setCustForm({ ...custForm, address: e.target.value })}
                  placeholder="e.g. House 14, Main Street"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-indigo-600 font-medium"
                />
              </div>

              {!editingCustomer && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Opening Udhaar Balance (if any Rs.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={custForm.initialUdhaar}
                    onChange={e => setCustForm({ ...custForm, initialUdhaar: e.target.value })}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-indigo-600 font-black"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddCustomerOpen(false);
                    setEditingCustomer(null);
                  }}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition-all"
                >
                  {editingCustomer ? 'Save Changes' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
