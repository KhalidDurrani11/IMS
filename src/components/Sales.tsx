import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, SaleItem, PaymentMethod, Sale } from '../types';
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Users,
  AlertCircle,
  CreditCard,
  Banknote,
  Smartphone,
  Tag,
  UserPlus
} from 'lucide-react';
import { ReceiptModal } from './ReceiptModal';

export const Sales: React.FC = () => {
  const {
    products,
    customers,
    addCustomer,
    createSale,
    formatMoney,
    getStockStatus,
    settings,
    userRole
  } = useShop();

  // Search & Category filter for products
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Cart State
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('walk-in');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaidInput, setAmountPaidInput] = useState<string>('');
  const [discountInput, setDiscountInput] = useState<string>('0');
  const [saleNotes, setSaleNotes] = useState<string>('');

  // Quick Add Customer modal inside Sales
  const [isQuickCustomerModalOpen, setIsQuickCustomerModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // Receipt Modal State
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [cartError, setCartError] = useState<string>('');

  // Filtered available products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, selectedCategory]);

  // Cart operations
  const addToCart = (product: Product) => {
    setCartError('');
    if (product.quantity <= 0) {
      setCartError(`${product.name} is currently out of stock!`);
      return;
    }

    const existingIndex = cartItems.findIndex(i => i.productId === product.id);
    if (existingIndex > -1) {
      const currentQty = cartItems[existingIndex].quantity;
      if (currentQty + 1 > product.quantity) {
        setCartError(`Only ${product.quantity} ${product.unit}s available in stock.`);
        return;
      }

      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].total =
        updated[existingIndex].quantity * updated[existingIndex].sellingPrice;
      setCartItems(updated);
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        buyingPrice: product.buyingPrice,
        sellingPrice: product.sellingPrice,
        total: product.sellingPrice,
        unit: product.unit
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const updateCartQty = (productId: string, newQty: number) => {
    setCartError('');
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQty <= 0) {
      setCartItems(cartItems.filter(i => i.productId !== productId));
      return;
    }

    if (newQty > product.quantity) {
      setCartError(`Only ${product.quantity} ${product.unit}s available in stock.`);
      return;
    }

    setCartItems(
      cartItems.map(item => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity: newQty,
            total: newQty * item.sellingPrice
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(i => i.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setAmountPaidInput('');
    setDiscountInput('0');
    setCartError('');
    setSelectedCustomerId('walk-in');
    setPaymentMethod('cash');
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.total, 0);
  }, [cartItems]);

  const discount = Math.min(subtotal, Math.max(0, Number(discountInput) || 0));
  const grandTotal = Math.max(0, subtotal - discount);

  const totalCost = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.buyingPrice * item.quantity, 0);
  }, [cartItems]);

  const profit = grandTotal - totalCost;

  const amountPaid =
    paymentMethod === 'udhaar'
      ? 0
      : amountPaidInput === ''
      ? grandTotal
      : Number(amountPaidInput) || 0;

  const change = Math.max(0, amountPaid - grandTotal);

  // Handle Quick Add Customer
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    const created = addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      address: ''
    });

    setSelectedCustomerId(created.id);
    setIsQuickCustomerModalOpen(false);
    setNewCustName('');
    setNewCustPhone('');
  };

  // Complete Sale
  const handleSaveSale = () => {
    if (cartItems.length === 0) {
      setCartError('Cart is empty. Select products first.');
      return;
    }

    if (paymentMethod === 'udhaar' && selectedCustomerId === 'walk-in') {
      setCartError('Please select or add a specific customer for Udhaar sales.');
      return;
    }

    const customerObj =
      selectedCustomerId !== 'walk-in'
        ? customers.find(c => c.id === selectedCustomerId)
        : null;

    const saleRecord = createSale({
      items: cartItems,
      subtotal,
      discount,
      total: grandTotal,
      totalCost,
      profit,
      paymentMethod,
      amountPaid: paymentMethod === 'udhaar' ? 0 : (amountPaidInput ? Number(amountPaidInput) : grandTotal),
      change: paymentMethod === 'udhaar' ? 0 : change,
      customerId: customerObj?.id,
      customerName: customerObj?.name,
      cashierRole: userRole,
      notes: saleNotes
    });

    setCompletedSale(saleRecord);
    clearCart();
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
            Sales Register (Bill Counter)
          </h2>
          <p className="text-xs text-slate-500">
            Click products to add to bill. Stock and Udhaar automatically update.
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
          >
            Clear Bill
          </button>
        )}
      </div>

      {/* Main Split Layout: Left Products Selector | Right Cart & Billing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Product Catalog Grid (Span 7) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Search and Category Filter */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="pos-search-product"
                type="text"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Type to search Coke, Milk, Sugar, Biscuits..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-emerald-600"
              />
            </div>

              {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Items
              </button>
              {settings.categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full p-8 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 text-sm font-medium">
                No products found for &ldquo;{productSearch}&rdquo;
              </div>
            ) : (
              filteredProducts.map(p => {
                const status = getStockStatus(p);
                const isOut = p.quantity <= 0;
                const inCart = cartItems.find(item => item.productId === p.id);

                return (
                  <div
                    key={p.id}
                    id={`pos-product-${p.id}`}
                    onClick={() => (!isOut ? addToCart(p) : null)}
                    className={`relative p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between select-none ${
                      isOut
                        ? 'bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed'
                        : inCart
                        ? 'bg-indigo-50/70 border-indigo-400 shadow-xs cursor-pointer hover:border-indigo-500'
                        : 'bg-white border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer'
                    }`}
                  >
                    {/* Top title & in-cart badge */}
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-tight">
                          {p.name}
                        </span>
                        {inCart && (
                          <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black rounded-full shrink-0 shadow-xs">
                            {inCart.quantity}x
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">{p.category}</div>
                    </div>

                    {/* Bottom Price & Stock pill */}
                    <div className="mt-3 flex items-end justify-between pt-2 border-t border-slate-100">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Price</div>
                        <div className="text-sm sm:text-base font-black text-slate-900">
                          {formatMoney(p.sellingPrice)}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          status === 'in_stock'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'low_stock'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isOut ? 'Out of Stock' : `${p.quantity} ${p.unit}`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Current Bill & Checkout Panel (Span 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-4">
          <div>
            {/* Bill Header & Customer Selector */}
            <div className="pb-3.5 border-b border-slate-200 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Current Bill ({cartItems.length} items)
                </span>
                <button
                  onClick={() => setIsQuickCustomerModalOpen(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  + New Customer
                </button>
              </div>

              {/* Customer Dropdown */}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  id="pos-customer-select"
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-xs font-bold focus:bg-white focus:outline-indigo-600"
                >
                  <option value="walk-in">👤 Walk-in Cash Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.totalUdhaar > 0 ? `(Udhaar: ${formatMoney(c.totalUdhaar)})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Message if any */}
            {cartError && (
              <div className="p-3 my-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{cartError}</span>
              </div>
            )}

            {/* Cart Items List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 my-2 pr-1">
              {cartItems.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <ShoppingCart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-600">No items on the bill yet</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click products from the left catalog to add
                  </p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div
                    key={item.productId}
                    className="py-2.5 flex items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {item.productName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {formatMoney(item.sellingPrice)} × {item.quantity} {item.unit}
                      </div>
                    </div>

                    {/* Qty +/- buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                        className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-black text-slate-900 text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                        className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="w-20 text-right font-black text-slate-900 text-xs sm:text-sm">
                      {formatMoney(item.total)}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Checkout Totals & Payment Section */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            {/* Payment Method Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  id="pay-cash-btn"
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-2 px-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  Cash
                </button>

                <button
                  type="button"
                  id="pay-udhaar-btn"
                  onClick={() => setPaymentMethod('udhaar')}
                  className={`py-2 px-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'udhaar'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Udhaar
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('easypaisa_jazzcash')}
                  className={`py-2 px-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'easypaisa_jazzcash'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Online
                </button>
              </div>
            </div>

            {/* Discount & Subtotal summary */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">{formatMoney(subtotal)}</span>
              </div>

              {/* Optional Discount Input */}
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <Tag className="w-3 h-3 text-slate-400" /> Discount (Rs.):
                </span>
                <input
                  type="number"
                  min="0"
                  value={discountInput}
                  onChange={e => setDiscountInput(e.target.value)}
                  className="w-24 text-right px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-rose-600 focus:bg-white focus:outline-indigo-600"
                />
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-base sm:text-lg font-black text-slate-900">
                <span>Grand Total:</span>
                <span className="text-emerald-700">{formatMoney(grandTotal)}</span>
              </div>

              {/* Cash Paid & Change Calculator (if cash payment) */}
              {paymentMethod === 'cash' && grandTotal > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700">Cash Received:</span>
                    <input
                      id="cash-paid-input"
                      type="number"
                      min="0"
                      value={amountPaidInput}
                      onChange={e => setAmountPaidInput(e.target.value)}
                      placeholder={grandTotal.toString()}
                      className="w-32 text-right px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-black text-slate-900 focus:bg-white focus:outline-emerald-600"
                    />
                  </div>

                  {/* Fast Tender Buttons */}
                  <div className="flex items-center justify-end gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setAmountPaidInput(grandTotal.toString())}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                    >
                      Exact
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmountPaidInput('500')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                    >
                      500
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmountPaidInput('1000')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                    >
                      1000
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmountPaidInput('5000')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                    >
                      5000
                    </button>
                  </div>

                  {/* Change Return Box */}
                  {change > 0 && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex justify-between items-center text-xs font-bold">
                      <span>Change to Return:</span>
                      <span className="text-base font-black text-emerald-700">
                        {formatMoney(change)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Udhaar Warning Notice */}
              {paymentMethod === 'udhaar' && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-2xl text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Recording as Udhaar
                  </div>
                  <p className="text-[11px] text-indigo-700">
                    {grandTotal > 0
                      ? `${formatMoney(grandTotal)} will be added to customer's Udhaar balance.`
                      : 'Please add items to bill.'}
                  </p>
                </div>
              )}
            </div>

            {/* BIG VIBRANT COMPLETE SALE BUTTON */}
            <button
              id="save-sale-btn"
              onClick={handleSaveSale}
              disabled={cartItems.length === 0}
              className="w-full py-4 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Complete Sale & Print Bill ({formatMoney(grandTotal)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ADD CUSTOMER MODAL */}
      {isQuickCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-slate-200">
            <h3 className="font-black text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Quick Add Customer
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add new customer name and phone for billing or Udhaar
            </p>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={e => setNewCustName(e.target.value)}
                  placeholder="e.g. Aslam Sahib, Rashid Bhai"
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
                  value={newCustPhone}
                  onChange={e => setNewCustPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-indigo-600 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickCustomerModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition-colors"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      <ReceiptModal
        sale={completedSale}
        onClose={() => setCompletedSale(null)}
      />
    </div>
  );
};
