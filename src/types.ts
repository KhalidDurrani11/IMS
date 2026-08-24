export type Currency = 'PKR' | 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'SAR';

export type UserRole = 'owner' | 'worker';

export type ViewType =
  | 'dashboard'
  | 'sales'
  | 'products'
  | 'stock'
  | 'purchases'
  | 'suppliers'
  | 'udhaar'
  | 'expenses'
  | 'reports'
  | 'settings';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type PaymentMethod = 'cash' | 'udhaar' | 'card' | 'easypaisa_jazzcash' | 'bank' | 'other';

export type ExpenseCategory =
  | 'Electricity'
  | 'Rent'
  | 'Transport'
  | 'Staff Salary'
  | 'Tea & Food'
  | 'Repair & Maintenance'
  | 'Packaging'
  | 'Other';

export interface Product {
  id: string;
  name: string;
  category: string;
  buyingPrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockLimit: number;
  unit: string; // 'pcs', 'kg', 'packet', 'bottle', 'box', 'litre'
  barcode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockChangeLog {
  id: string;
  productId: string;
  productName: string;
  changeType: 'sale' | 'purchase' | 'add' | 'remove' | 'correction';
  quantityChange: number; // e.g. +20 or -5
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  timestamp: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  total: number;
  unit: string;
}

export interface Sale {
  id: string;
  receiptNumber: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  totalCost: number; // sum of item buyingPrice * qty
  profit: number; // total - totalCost - discount
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  customerId?: string;
  customerName?: string;
  cashierRole: UserRole;
  notes?: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  buyingPrice: number;
  total: number;
  unit: string;
}

export interface Purchase {
  id: string;
  purchaseNumber: string;
  date: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  total: number;
  paymentStatus: 'paid_cash' | 'paid_bank' | 'added_to_money_to_pay';
  amountPaid: number;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address?: string;
  productsSupplied: string;
  amountOwed: number; // Money to pay to this supplier
  createdAt: string;
}

export interface SupplierPayment {
  id: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  date: string;
  paymentMethod: 'cash' | 'bank' | 'easypaisa_jazzcash';
  note?: string;
}

export interface UdhaarTransaction {
  id: string;
  type: 'sale_credit' | 'manual_udhaar' | 'payment_received';
  amount: number;
  date: string;
  saleId?: string;
  note?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  totalUdhaar: number; // current remaining amount owed by customer
  lastPaymentDate?: string;
  transactions: UdhaarTransaction[];
  createdAt: string;
}

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  note?: string;
}

export interface ActivityLog {
  id: string;
  type: 'sale' | 'purchase' | 'stock_change' | 'udhaar_payment' | 'udhaar_added' | 'product_added' | 'expense_added';
  description: string;
  amount?: number;
  timestamp: string;
}

export interface ShopSettings {
  shopName: string;
  phone: string;
  address: string;
  currency: string;
  currencySymbol: string;
  receiptFooter: string;
  taxRate: number; // 0 for small shops by default
  enableDiscounts: boolean;
  workerCanViewStock: boolean;
  workerCanViewCustomerPhone: boolean;
  categories: string[];
}
