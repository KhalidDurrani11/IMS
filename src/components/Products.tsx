import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  PlusCircle,
  Package,
  Layers
} from 'lucide-react';

interface ProductsProps {
  initialSearch?: string;
}

export const Products: React.FC<ProductsProps> = ({ initialSearch = '' }) => {
  const {
    products,
    addProduct,
    editProduct,
    deleteProduct,
    addStock,
    formatMoney,
    getStockStatus,
    settings,
    userRole
  } = useShop();

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [quickAddStockProduct, setQuickAddStockProduct] = useState<Product | null>(null);
  const [stockAmountToAdd, setStockAmountToAdd] = useState('10');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: settings.categories[0] || 'Grocery & Staples',
    buyingPrice: '',
    sellingPrice: '',
    quantity: '',
    lowStockLimit: '10',
    unit: 'pcs'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: settings.categories[0] || 'Grocery & Staples',
      buyingPrice: '',
      sellingPrice: '',
      quantity: '',
      lowStockLimit: '10',
      unit: 'pcs'
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      buyingPrice: p.buyingPrice.toString(),
      sellingPrice: p.sellingPrice.toString(),
      quantity: p.quantity.toString(),
      lowStockLimit: p.lowStockLimit.toString(),
      unit: p.unit
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const buying = Number(formData.buyingPrice) || 0;
    const selling = Number(formData.sellingPrice) || 0;
    const qty = Number(formData.quantity) || 0;
    const limit = Number(formData.lowStockLimit) || 5;

    if (editingProduct) {
      editProduct(editingProduct.id, {
        name: formData.name.trim(),
        category: formData.category,
        buyingPrice: buying,
        sellingPrice: selling,
        quantity: qty,
        lowStockLimit: limit,
        unit: formData.unit
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: formData.name.trim(),
        category: formData.category,
        buyingPrice: buying,
        sellingPrice: selling,
        quantity: qty,
        lowStockLimit: limit,
        unit: formData.unit
      });
      setIsAddModalOpen(false);
    }
    resetForm();
  };

  const handleQuickAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddStockProduct) return;
    const qty = parseInt(stockAmountToAdd, 10);
    if (qty > 0) {
      addStock(quickAddStockProduct.id, qty, 'Stock added from Products page');
      setQuickAddStockProduct(null);
      setStockAmountToAdd('10');
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      // Status
      const status = getStockStatus(p);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'in_stock' && status === 'in_stock') ||
        (statusFilter === 'low_stock' && status === 'low_stock') ||
        (statusFilter === 'out_of_stock' && status === 'out_of_stock');

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, statusFilter]);

  // Live profit calculation for add/edit form
  const formBuying = Number(formData.buyingPrice) || 0;
  const formSelling = Number(formData.sellingPrice) || 0;
  const formProfit = formSelling - formBuying;
  const formMargin = formSelling > 0 ? Math.round((formProfit / formSelling) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            Products & Inventory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Total {products.length} products in catalog
          </p>
        </div>

        <button
          id="add-product-main-btn"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="product-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search product name or category..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-emerald-600"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:bg-white focus:outline-emerald-600"
            >
              <option value="all">All Statuses</option>
              <option value="in_stock">🟢 In Stock</option>
              <option value="low_stock">🟡 Low Stock</option>
              <option value="out_of_stock">🔴 Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({products.length})
          </button>
          {settings.categories.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                {userRole === 'owner' && (
                  <>
                    <th className="py-3 px-4 text-right">Buying Price</th>
                    <th className="py-3 px-4 text-right">Profit / Item</th>
                  </>
                )}
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-center">Stock Quantity</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const status = getStockStatus(p);
                  const profit = p.sellingPrice - p.buyingPrice;
                  const margin = p.sellingPrice > 0 ? Math.round((profit / p.sellingPrice) * 100) : 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {p.name}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-slate-600 text-xs">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg">
                          {p.category}
                        </span>
                      </td>

                      {/* Buying Price (Owner only) */}
                      {userRole === 'owner' && (
                        <td className="py-3.5 px-4 text-right text-slate-600 font-medium">
                          {formatMoney(p.buyingPrice)}
                        </td>
                      )}

                      {/* Profit per Item (Owner only) */}
                      {userRole === 'owner' && (
                        <td className="py-3.5 px-4 text-right font-semibold text-emerald-700">
                          +{formatMoney(profit)}
                          <span className="text-[10px] text-slate-400 block font-normal">
                            ({margin}%)
                          </span>
                        </td>
                      )}

                      {/* Selling Price */}
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {formatMoney(p.sellingPrice)}
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-slate-900 text-base">
                          {p.quantity}
                        </span>{' '}
                        <span className="text-xs text-slate-500">{p.unit}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            status === 'in_stock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : status === 'low_stock'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {status === 'in_stock' && '🟢 In Stock'}
                          {status === 'low_stock' && `🟡 Low (${p.quantity})`}
                          {status === 'out_of_stock' && '🔴 Out of Stock'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Add Stock */}
                          <button
                            onClick={() => setQuickAddStockProduct(p)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Add Stock"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => setDeletingProduct(p)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
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

      {/* ADD / EDIT PRODUCT MODAL */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 my-8">
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter product details and price. Profit calculates automatically.
            </p>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Coke 1.5L, Olper Milk 1L, Cheeni"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-emerald-600 font-medium"
                />
              </div>

              {/* Category & Unit in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-emerald-600 font-medium"
                  >
                    {settings.categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit Type
                  </label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-emerald-600 font-medium"
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="packet">Packet</option>
                    <option value="bottle">Bottle</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="box">Box / Carton</option>
                    <option value="litre">Litre</option>
                  </select>
                </div>
              </div>

              {/* Buying Price & Selling Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Buying Price (Cost Rs.) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.buyingPrice}
                    onChange={e => setFormData({ ...formData, buyingPrice: e.target.value })}
                    placeholder="e.g. 180"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-emerald-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selling Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.sellingPrice}
                    onChange={e => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="e.g. 220"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-emerald-600 font-bold"
                  />
                </div>
              </div>

              {/* Auto Profit Banner */}
              {formSelling > 0 && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-semibold">
                    Calculated Profit per item:
                  </span>
                  <span className="font-bold text-emerald-900 text-sm">
                    {formatMoney(formProfit)} ({formMargin}% margin)
                  </span>
                </div>
              )}

              {/* Quantity & Low Stock Threshold */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Quantity in Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 25"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-emerald-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Low Stock Alert Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.lowStockLimit}
                    onChange={e => setFormData({ ...formData, lowStockLimit: e.target.value })}
                    placeholder="e.g. 10"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD STOCK POPUP */}
      {quickAddStockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-5 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Add Stock: {quickAddStockProduct.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Current Stock: {quickAddStockProduct.quantity} {quickAddStockProduct.unit}s
            </p>

            <form onSubmit={handleQuickAddStockSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantity to Add ({quickAddStockProduct.unit}s)
                </label>
                <input
                  type="number"
                  min="1"
                  value={stockAmountToAdd}
                  onChange={e => setStockAmountToAdd(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-emerald-600 text-base"
                  autoFocus
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickAddStockProduct(null)}
                  className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Confirm Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-5 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2">Delete Product?</h3>
            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to delete <strong>{deletingProduct.name}</strong>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(deletingProduct.id);
                  setDeletingProduct(null);
                }}
                className="flex-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
