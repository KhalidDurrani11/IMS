import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Settings as SettingsIcon,
  Store,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  Save,
  Tag,
  Plus,
  Trash2,
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Shield
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings, userRole, setUserRole, resetToDemoData } = useShop();

  const [form, setForm] = useState({
    shopName: settings.shopName,
    phone: settings.phone,
    address: settings.address,
    receiptFooter: settings.receiptFooter,
    currencySymbol: settings.currencySymbol
  });

  const [newCategory, setNewCategory] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    if (settings.categories.includes(newCategory.trim())) {
      setNewCategory('');
      return;
    }
    updateSettings({
      categories: [...settings.categories, newCategory.trim()]
    });
    setNewCategory('');
  };

  const handleRemoveCategory = (cat: string) => {
    if (settings.categories.length <= 1) return;
    updateSettings({
      categories: settings.categories.filter(c => c !== cat)
    });
  };

  // Data Backup JSON Download
  const handleExportBackup = () => {
    const data = {
      products: localStorage.getItem('simple_shop_products'),
      sales: localStorage.getItem('simple_shop_sales'),
      customers: localStorage.getItem('simple_shop_customers'),
      suppliers: localStorage.getItem('simple_shop_suppliers'),
      expenses: localStorage.getItem('simple_shop_expenses'),
      purchases: localStorage.getItem('simple_shop_purchases'),
      stockLogs: localStorage.getItem('simple_shop_stock_logs'),
      activityLogs: localStorage.getItem('simple_shop_activity_logs'),
      settings: localStorage.getItem('simple_shop_settings'),
      exportedAt: new Date().toISOString()
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${settings.shopName.replace(/\s+/g, '_')}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Data Restore
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = event => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.products) localStorage.setItem('simple_shop_products', parsed.products);
          if (parsed.sales) localStorage.setItem('simple_shop_sales', parsed.sales);
          if (parsed.customers) localStorage.setItem('simple_shop_customers', parsed.customers);
          if (parsed.suppliers) localStorage.setItem('simple_shop_suppliers', parsed.suppliers);
          if (parsed.expenses) localStorage.setItem('simple_shop_expenses', parsed.expenses);
          if (parsed.purchases) localStorage.setItem('simple_shop_purchases', parsed.purchases);
          if (parsed.stockLogs) localStorage.setItem('simple_shop_stock_logs', parsed.stockLogs);
          if (parsed.activityLogs) localStorage.setItem('simple_shop_activity_logs', parsed.activityLogs);
          if (parsed.settings) localStorage.setItem('simple_shop_settings', parsed.settings);

          window.location.reload();
        } catch {
          alert('Invalid backup file format');
        }
      };
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 sm:p-7 rounded-3xl text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest">
            <SettingsIcon className="w-4 h-4" />
            System Preferences
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1 text-white">Shop Settings & Backup</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure shop profile, bill printer message, categories, and system backups.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Settings Saved!
          </div>
        )}
      </div>

      {/* Role Switcher Box */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-sm">Active User Role</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Worker mode hides sensitive wholesale buying costs and net profit numbers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setUserRole('owner')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'owner'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👑 Shop Owner
          </button>
          <button
            type="button"
            onClick={() => setUserRole('worker')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'worker'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧑‍💼 Cashier / Worker
          </button>
        </div>
      </div>

      {/* Shop Information Form */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Store className="w-4 h-4 text-indigo-600" />
          Shop Profile & Receipt Details
        </h3>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                Shop Name *
              </label>
              <input
                type="text"
                required
                value={form.shopName}
                onChange={e => setForm({ ...form, shopName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white focus:outline-indigo-600 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Contact Phone Number
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-indigo-600 font-medium transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Shop Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-indigo-600 font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Currency Label
              </label>
              <input
                type="text"
                value={form.currencySymbol}
                onChange={e => setForm({ ...form, currencySymbol: e.target.value })}
                placeholder="Rs."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-bold focus:bg-white focus:outline-indigo-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Receipt Footer Message (Printed at bottom of bill)
            </label>
            <input
              type="text"
              value={form.receiptFooter}
              onChange={e => setForm({ ...form, receiptFooter: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-indigo-600 font-medium transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Shop Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Product Categories Manager */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-black text-slate-900 mb-1.5 flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-600" />
          Product Categories
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-5">
          Manage categories used to organize stock and filter quick items on the bill register.
        </p>

        {/* Existing category pills */}
        <div className="flex flex-wrap gap-2.5 mb-5">
          {settings.categories.map(cat => (
            <div
              key={cat}
              className="px-3.5 py-2 bg-slate-100/90 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 flex items-center gap-2 shadow-2xs"
            >
              <span>{cat}</span>
              <button
                type="button"
                onClick={() => handleRemoveCategory(cat)}
                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Remove category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new category form */}
        <form onSubmit={handleAddCategory} className="flex gap-2 max-w-sm">
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="Add new category..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-emerald-600 transition-all"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>
      </div>

      {/* Data Backup, Restore & Reset */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-600" />
          Data Backup & Reset
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          All shop data is stored safely in your browser. You can export a backup file anytime to transfer to another phone/laptop or restore previous records.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          {/* Download Backup */}
          <button
            onClick={handleExportBackup}
            className="p-5 border border-slate-200 hover:border-indigo-300 bg-slate-50/80 hover:bg-indigo-50/40 rounded-3xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
          >
            <Download className="w-5 h-5 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-slate-900 text-xs">Export Backup File</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Download complete shop JSON</div>
            </div>
          </button>

          {/* Upload Backup */}
          <label className="p-5 border border-slate-200 hover:border-emerald-300 bg-slate-50/80 hover:bg-emerald-50/40 rounded-3xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs">
            <Upload className="w-5 h-5 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-slate-900 text-xs">Restore from Backup</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Upload saved backup file</div>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (window.confirm('Reset everything to standard demo Pakistani shop data? All custom transactions will be refreshed.')) {
                resetToDemoData();
              }
            }}
            className="p-5 border border-rose-200/80 hover:border-rose-300 bg-rose-50/40 hover:bg-rose-50 rounded-3xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-5 h-5 text-rose-600 mb-3 group-hover:rotate-180 transition-transform duration-500" />
            <div>
              <div className="font-bold text-rose-900 text-xs">Reset Sample Data</div>
              <div className="text-[11px] text-rose-600 font-medium mt-0.5">Reload demo register items</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
