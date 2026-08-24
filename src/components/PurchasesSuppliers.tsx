import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Supplier, PurchaseItem } from '../types';
import {
  Truck,
  PlusCircle,
  Search,
  Phone,
  ArrowDownLeft,
  Clock,
  Trash2,
  Edit2,
  PackagePlus,
  Layers
} from 'lucide-react';

interface PurchasesSuppliersProps {
  initialTab?: 'suppliers' | 'purchases';
  initialSearch?: string;
}

export const PurchasesSuppliers: React.FC<PurchasesSuppliersProps> = ({
  initialTab = 'suppliers',
  initialSearch = ''
}) => {
  const {
    suppliers,
    purchases,
    products,
    addSupplier,
    editSupplier,
    deleteSupplier,
    paySupplier,
    createPurchase,
    formatMoney
  } = useShop();

  const [activeTab, setActiveTab] = useState<'suppliers' | 'purchases'>(initialTab);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Modals state
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
  const [activePaySupplier, setActivePaySupplier] = useState<Supplier | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Supplier Form state
  const [supForm, setSupForm] = useState({
    name: '',
    phone: '',
    address: '',
    productsSupplied: '',
    amountOwed: '0'
  });

  // Pay Supplier state
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Cash');
  const [payNote, setPayNote] = useState('Payment for wholesale inventory');

  // New Purchase form state
  const [purchaseSupplierId, setPurchaseSupplierId] = useState<string>(
    suppliers[0]?.id || ''
  );
  const [purchaseItems, setPurchaseItems] = useState<
    Array<{ productId: string; quantity: number; buyingPrice: number }>
  >([
    {
      productId: products[0]?.id || '',
      quantity: 10,
      buyingPrice: products[0]?.buyingPrice || 100
    }
  ]);
  const [purchasePaymentMode, setPurchasePaymentMode] = useState<
    'paid_cash' | 'added_to_money_to_pay'
  >('paid_cash');
  const [purchaseAmountPaidInput, setPurchaseAmountPaidInput] = useState('');
  const [purchaseNotes, setPurchaseNotes] = useState('');

  // Calculations for new purchase
  const purchaseTotal = useMemo(() => {
    return purchaseItems.reduce((acc, item) => {
      return acc + (item.quantity || 0) * (item.buyingPrice || 0);
    }, 0);
  }, [purchaseItems]);

  const totalMoneyToPay = useMemo(() => {
    return suppliers.reduce((acc, s) => acc + (s.amountOwed || 0), 0);
  }, [suppliers]);

  // Handlers
  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supForm.name.trim()) return;

    if (editingSupplier) {
      editSupplier(editingSupplier.id, {
        name: supForm.name.trim(),
        phone: supForm.phone.trim(),
        address: supForm.address.trim(),
        productsSupplied: supForm.productsSupplied.trim()
      });
      setEditingSupplier(null);
    } else {
      addSupplier({
        name: supForm.name.trim(),
        phone: supForm.phone.trim(),
        address: supForm.address.trim(),
        productsSupplied: supForm.productsSupplied.trim(),
        amountOwed: Number(supForm.amountOwed) || 0
      });
      setIsAddSupplierOpen(false);
    }

    setSupForm({
      name: '',
      phone: '',
      address: '',
      productsSupplied: '',
      amountOwed: '0'
    });
  };

  const handlePaySupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaySupplier) return;
    const amt = Number(payAmount);
    if (amt > 0) {
      paySupplier(activePaySupplier.id, amt, payMethod, payNote);
      setActivePaySupplier(null);
      setPayAmount('');
    }
  };

  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (purchaseItems.length === 0 || !purchaseSupplierId) return;

    const supplierObj = suppliers.find(s => s.id === purchaseSupplierId);
    if (!supplierObj) return;

    const formattedItems: PurchaseItem[] = purchaseItems.map(item => {
      const prod = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        productName: prod ? prod.name : 'Unknown Item',
        quantity: item.quantity,
        buyingPrice: item.buyingPrice,
        total: item.quantity * item.buyingPrice,
        unit: prod ? prod.unit : 'pcs'
      };
    });

    const amountPaid =
      purchasePaymentMode === 'paid_cash'
        ? purchaseTotal
        : Number(purchaseAmountPaidInput) || 0;

    createPurchase({
      supplierId: supplierObj.id,
      supplierName: supplierObj.name,
      items: formattedItems,
      total: purchaseTotal,
      paymentStatus: purchasePaymentMode,
      amountPaid,
      notes: purchaseNotes
    });

    setIsNewPurchaseOpen(false);
    setPurchaseItems([
      {
        productId: products[0]?.id || '',
        quantity: 10,
        buyingPrice: products[0]?.buyingPrice || 100
      }
    ]);
    setPurchaseNotes('');
    setPurchaseAmountPaidInput('');
  };

  // Filtered Suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(
      s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.productsSupplied.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suppliers, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Total Money to Pay */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-rose-950 p-5 sm:p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            Suppliers & Purchases
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1">Money to Pay (Supplier Khata)</h2>
          <p className="text-xs text-slate-300 mt-1">
            Record wholesale purchases, update stock, and track supplier balances.
          </p>
        </div>

        <div className="flex items-center gap-3 sm:text-right">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
            <div className="text-[11px] font-bold text-rose-200 uppercase">
              Total Money Owed to Suppliers
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-300">
              {formatMoney(totalMoneyToPay)}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              id="new-purchase-main-btn"
              onClick={() => setIsNewPurchaseOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Record Purchase</span>
            </button>
            <button
              id="add-supplier-main-btn"
              onClick={() => {
                setEditingSupplier(null);
                setSupForm({
                  name: '',
                  phone: '',
                  address: '',
                  productsSupplied: '',
                  amountOwed: '0'
                });
                setIsAddSupplierOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Supplier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'suppliers'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Suppliers & Money to Pay ({suppliers.length})
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'purchases'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Purchases History ({purchases.length})
          </button>
        </div>

        {activeTab === 'suppliers' && (
          <div className="relative max-w-xs w-full hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search supplier..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-slate-900"
            />
          </div>
        )}
      </div>

      {/* SUPPLIERS TAB */}
      {activeTab === 'suppliers' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Supplier Name</th>
                  <th className="py-3 px-4">Phone & Address</th>
                  <th className="py-3 px-4">Products Supplied</th>
                  <th className="py-3 px-4 text-right">Amount Owed (To Pay)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No suppliers found. Click &ldquo;Add Supplier&rdquo; to create.
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map(s => {
                    const hasDebt = s.amountOwed > 0;
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {s.name}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600">
                          {s.phone ? (
                            <div className="flex items-center gap-1 font-medium text-slate-700">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {s.phone}
                            </div>
                          ) : (
                            <span className="text-slate-400">No phone</span>
                          )}
                          {s.address && (
                            <span className="text-slate-400 block text-[11px] mt-0.5">
                              {s.address}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs">
                          {s.productsSupplied || '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`text-base font-extrabold ${
                              hasDebt ? 'text-rose-700' : 'text-slate-700'
                            }`}
                          >
                            {formatMoney(s.amountOwed)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Pay Supplier button */}
                            {hasDebt && (
                              <button
                                onClick={() => {
                                  setActivePaySupplier(s);
                                  setPayAmount(s.amountOwed.toString());
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-xl text-xs font-bold transition-colors"
                                title="Pay Supplier"
                              >
                                <ArrowDownLeft className="w-3.5 h-3.5" />
                                Pay Supplier
                              </button>
                            )}

                            {/* Edit */}
                            <button
                              onClick={() => {
                                setEditingSupplier(s);
                                setSupForm({
                                  name: s.name,
                                  phone: s.phone,
                                  address: s.address || '',
                                  productsSupplied: s.productsSupplied || '',
                                  amountOwed: '0'
                                });
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Supplier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete supplier ${s.name}?`)) {
                                  deleteSupplier(s.id);
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Supplier"
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
      ) : (
        /* PURCHASES HISTORY TAB */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Stock Purchase Orders</h3>
            <span className="text-xs text-slate-500">{purchases.length} recorded purchases</span>
          </div>

          <div className="divide-y divide-slate-100">
            {purchases.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No stock purchases recorded yet. Click &ldquo;Record Purchase&rdquo; above.
              </div>
            ) : (
              purchases.map(p => (
                <div key={p.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {p.purchaseNumber}
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {p.supplierName}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(p.date).toLocaleString([], {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                        <span>•</span>
                        <span className="capitalize">
                          {p.paymentStatus === 'paid_cash'
                            ? 'Paid in Full'
                            : 'Added to Money to Pay'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-slate-900">
                        {formatMoney(p.total)}
                      </div>
                      {p.notes && (
                        <div className="text-[11px] text-slate-400 italic max-w-xs truncate">
                          {p.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Purchased items pills */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {p.items.map((item, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                      >
                        {item.productName} × {item.quantity} {item.unit} (@ {item.buyingPrice})
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* RECORD PURCHASE MODAL */}
      {isNewPurchaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 my-6">
            <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
              <PackagePlus className="w-5 h-5 text-emerald-600" />
              Record Stock Purchase from Supplier
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Saving this will automatically increase product stock and update supplier balance.
            </p>

            <form onSubmit={handleSavePurchase} className="space-y-4">
              {/* Supplier Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Supplier *
                </label>
                <select
                  value={purchaseSupplierId}
                  onChange={e => setPurchaseSupplierId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-emerald-600"
                  required
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Owed: {formatMoney(s.amountOwed)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Items in Purchase */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Purchased Products & Quantities
                </label>

                {purchaseItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center"
                  >
                    {/* Product */}
                    <div className="col-span-6">
                      <select
                        value={item.productId}
                        onChange={e => {
                          const prodId = e.target.value;
                          const found = products.find(p => p.id === prodId);
                          const updated = [...purchaseItems];
                          updated[idx].productId = prodId;
                          if (found) updated[idx].buyingPrice = found.buyingPrice;
                          setPurchaseItems(updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={e => {
                          const updated = [...purchaseItems];
                          updated[idx].quantity = Number(e.target.value) || 0;
                          setPurchaseItems(updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center"
                      />
                    </div>

                    {/* Buying Rate */}
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="0"
                        placeholder="Rate"
                        value={item.buyingPrice}
                        onChange={e => {
                          const updated = [...purchaseItems];
                          updated[idx].buyingPrice = Number(e.target.value) || 0;
                          setPurchaseItems(updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-right"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setPurchaseItems([
                      ...purchaseItems,
                      {
                        productId: products[0]?.id || '',
                        quantity: 10,
                        buyingPrice: products[0]?.buyingPrice || 100
                      }
                    ])
                  }
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 mt-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> + Add Another Item
                </button>
              </div>

              {/* Total Purchase Amount Banner */}
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Total Purchase Cost:</span>
                <span className="text-lg font-black text-emerald-400">
                  {formatMoney(purchaseTotal)}
                </span>
              </div>

              {/* Payment Mode */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Payment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPurchasePaymentMode('paid_cash')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold text-center transition-all ${
                      purchasePaymentMode === 'paid_cash'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    💵 Paid Cash Full
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurchasePaymentMode('added_to_money_to_pay')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold text-center transition-all ${
                      purchasePaymentMode === 'added_to_money_to_pay'
                        ? 'bg-rose-700 text-white'
                        : 'bg-rose-50 text-rose-800'
                    }`}
                  >
                    📝 Add to Money to Pay (Credit)
                  </button>
                </div>
              </div>

              {/* If added to credit, optional partial paid input */}
              {purchasePaymentMode === 'added_to_money_to_pay' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cash Paid now (if partial):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={purchaseAmountPaidInput}
                    onChange={e => setPurchaseAmountPaidInput(e.target.value)}
                    placeholder="e.g. 2000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-emerald-600 font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={purchaseNotes}
                  onChange={e => setPurchaseNotes(e.target.value)}
                  placeholder="e.g. Van delivery, invoice # 882"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPurchaseOpen(false)}
                  className="flex-1 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Save Purchase & Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAY SUPPLIER MODAL */}
      {activePaySupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-1.5">
              <ArrowDownLeft className="w-4 h-4 text-rose-600" />
              Pay Supplier: {activePaySupplier.name}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Current balance owed: <strong>{formatMoney(activePaySupplier.amountOwed)}</strong>
            </p>

            <form onSubmit={handlePaySupplierSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Amount (Rs.) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-rose-600 text-base"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-rose-600"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="EasyPaisa / JazzCash">EasyPaisa / JazzCash</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={payNote}
                  onChange={e => setPayNote(e.target.value)}
                  placeholder="e.g. Paid to van driver"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-rose-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePaySupplier(null)}
                  className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT SUPPLIER MODAL */}
      {(isAddSupplierOpen || editingSupplier) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter supplier and wholesale vendor details
            </p>

            <form onSubmit={handleSupplierSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  required
                  value={supForm.name}
                  onChange={e => setSupForm({ ...supForm, name: e.target.value })}
                  placeholder="e.g. Al-Madina Wholesalers, Pepsi Agency"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-rose-600"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={supForm.phone}
                  onChange={e => setSupForm({ ...supForm, phone: e.target.value })}
                  placeholder="0300-1234567"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Products Supplied
                </label>
                <input
                  type="text"
                  value={supForm.productsSupplied}
                  onChange={e => setSupForm({ ...supForm, productsSupplied: e.target.value })}
                  placeholder="e.g. Rice, Sugar, Flour, Drinks"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Address / Market Location
                </label>
                <input
                  type="text"
                  value={supForm.address}
                  onChange={e => setSupForm({ ...supForm, address: e.target.value })}
                  placeholder="e.g. Grain Market, Depo 4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-rose-600"
                />
              </div>

              {!editingSupplier && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Opening Money Owed (Rs.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={supForm.amountOwed}
                    onChange={e => setSupForm({ ...supForm, amountOwed: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-bold focus:bg-white focus:outline-rose-600"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddSupplierOpen(false);
                    setEditingSupplier(null);
                  }}
                  className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  {editingSupplier ? 'Save Changes' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
