import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  Customer,
  Supplier,
  Sale,
  Purchase,
  Expense,
  StockChangeLog,
  ActivityLog,
  ShopSettings,
  UserRole,
  StockStatus
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_SALES,
  INITIAL_PURCHASES,
  INITIAL_EXPENSES,
  INITIAL_STOCK_LOGS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_SETTINGS
} from '../data/demoData';

interface ShopContextType {
  // Data
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  sales: Sale[];
  purchases: Purchase[];
  expenses: Expense[];
  stockLogs: StockChangeLog[];
  activityLogs: ActivityLog[];
  settings: ShopSettings;
  userRole: UserRole;

  // Role control
  setUserRole: (role: UserRole) => void;

  // Product Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  editProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Stock Actions
  addStock: (productId: string, quantityToAdd: number, reason?: string) => void;
  removeStock: (productId: string, quantityToRemove: number, reason?: string) => boolean;
  correctStock: (productId: string, newQuantity: number, reason?: string) => void;
  getStockStatus: (product: Product) => StockStatus;

  // Sales Actions
  createSale: (saleData: Omit<Sale, 'id' | 'receiptNumber' | 'date'>) => Sale;
  
  // Purchases Actions
  createPurchase: (purchaseData: Omit<Purchase, 'id' | 'purchaseNumber' | 'date'>) => Purchase;

  // Udhaar / Customer Actions
  addCustomer: (customerData: Omit<Customer, 'id' | 'createdAt' | 'transactions' | 'totalUdhaar'> & { initialUdhaar?: number }) => Customer;
  editCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addUdhaarToCustomer: (customerId: string, amount: number, note?: string) => void;
  receiveUdhaarPayment: (customerId: string, amount: number, note?: string) => void;

  // Supplier Actions
  addSupplier: (supplierData: Omit<Supplier, 'id' | 'createdAt'>) => Supplier;
  editSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  paySupplier: (supplierId: string, amount: number, paymentMethod?: string, note?: string) => void;

  // Expense Actions
  addExpense: (expenseData: Omit<Expense, 'id'>) => Expense;
  deleteExpense: (id: string) => void;

  // Settings & Data management
  updateSettings: (newSettings: Partial<ShopSettings>) => void;
  resetToDemoData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;

  // Computed metrics
  metrics: {
    todaySales: number;
    todayCost: number;
    todayExpenses: number;
    todayProfit: number;
    totalStockUnits: number;
    totalProductsCount: number;
    lowStockCount: number;
    outOfStockCount: number;
    moneyToReceive: number; // total customer udhaar
    moneyToPay: number; // total supplier amount owed
    todaySalesCount: number;
    lowStockList: Product[];
    outOfStockList: Product[];
    todaySalesList: Sale[];
  };

  // Helper
  formatMoney: (amount: number) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'simple_shop_';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization with localStorage fallback
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'purchases');
    return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [stockLogs, setStockLogs] = useState<StockChangeLog[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'stockLogs');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_LOGS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'activityLogs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [settings, setSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'userRole');
    return (saved as UserRole) || 'owner';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'stockLogs', JSON.stringify(stockLogs));
  }, [stockLogs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'activityLogs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'userRole', userRole);
  }, [userRole]);

  // Stock status helper
  const getStockStatus = (product: Product): StockStatus => {
    if (product.quantity <= 0) return 'out_of_stock';
    if (product.quantity <= product.lowStockLimit) return 'low_stock';
    return 'in_stock';
  };

  // Helper for money formatting
  const formatMoney = (amount: number): string => {
    const symbol = settings.currencySymbol || 'Rs.';
    return `${symbol} ${Math.round(amount).toLocaleString('en-US')}`;
  };

  // Helper to add activity log
  const logActivity = (type: ActivityLog['type'], description: string, amount?: number) => {
    const newLog: ActivityLog = {
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      type,
      description,
      amount,
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50
  };

  // PRODUCT ACTIONS
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      createdAt: now,
      updatedAt: now
    };

    setProducts(prev => [newProduct, ...prev]);

    // If initial quantity > 0, log stock addition
    if (newProduct.quantity > 0) {
      const stockLog: StockChangeLog = {
        id: 'log-' + Date.now(),
        productId: newProduct.id,
        productName: newProduct.name,
        changeType: 'add',
        quantityChange: newProduct.quantity,
        previousQuantity: 0,
        newQuantity: newProduct.quantity,
        reason: 'Initial product stock',
        timestamp: now
      };
      setStockLogs(prev => [stockLog, ...prev]);
    }

    logActivity('product_added', `New product added: ${newProduct.name} (Stock: ${newProduct.quantity})`);
    return newProduct;
  };

  const editProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setProducts(prev => prev.filter(p => p.id !== id));
      logActivity('stock_change', `Product removed: ${product.name}`);
    }
  };

  // STOCK ACTIONS
  const addStock = (productId: string, quantityToAdd: number, reason = 'Stock added manually') => {
    if (quantityToAdd <= 0) return;
    const now = new Date().toISOString();
    let updatedProduct: Product | undefined;

    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newQty = p.quantity + quantityToAdd;
          updatedProduct = { ...p, quantity: newQty, updatedAt: now };
          return updatedProduct;
        }
        return p;
      })
    );

    if (updatedProduct) {
      const prevQty = updatedProduct.quantity - quantityToAdd;
      const stockLog: StockChangeLog = {
        id: 'log-' + Date.now(),
        productId,
        productName: updatedProduct.name,
        changeType: 'add',
        quantityChange: quantityToAdd,
        previousQuantity: prevQty,
        newQuantity: updatedProduct.quantity,
        reason,
        timestamp: now
      };
      setStockLogs(prev => [stockLog, ...prev]);
      logActivity('stock_change', `${updatedProduct.name} stock increased by ${quantityToAdd} ${updatedProduct.unit}s`);
    }
  };

  const removeStock = (productId: string, quantityToRemove: number, reason = 'Stock removed'): boolean => {
    if (quantityToRemove <= 0) return false;
    const now = new Date().toISOString();
    const product = products.find(p => p.id === productId);
    if (!product || product.quantity < quantityToRemove) {
      return false;
    }

    const prevQty = product.quantity;
    const newQty = prevQty - quantityToRemove;

    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, quantity: newQty, updatedAt: now } : p))
    );

    const stockLog: StockChangeLog = {
      id: 'log-' + Date.now(),
      productId,
      productName: product.name,
      changeType: 'remove',
      quantityChange: -quantityToRemove,
      previousQuantity: prevQty,
      newQuantity: newQty,
      reason,
      timestamp: now
    };
    setStockLogs(prev => [stockLog, ...prev]);
    logActivity('stock_change', `${product.name} stock reduced by ${quantityToRemove} ${product.unit}s (${reason})`);
    return true;
  };

  const correctStock = (productId: string, newQuantity: number, reason = 'Physical stock count correction') => {
    if (newQuantity < 0) return;
    const now = new Date().toISOString();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const prevQty = product.quantity;
    const diff = newQuantity - prevQty;

    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, quantity: newQuantity, updatedAt: now } : p))
    );

    const stockLog: StockChangeLog = {
      id: 'log-' + Date.now(),
      productId,
      productName: product.name,
      changeType: 'correction',
      quantityChange: diff,
      previousQuantity: prevQty,
      newQuantity,
      reason,
      timestamp: now
    };
    setStockLogs(prev => [stockLog, ...prev]);
    logActivity('stock_change', `${product.name} quantity corrected to ${newQuantity} (${reason})`);
  };

  // SALES ACTIONS (POS)
  const createSale = (saleData: Omit<Sale, 'id' | 'receiptNumber' | 'date'>): Sale => {
    const now = new Date().toISOString();
    const receiptNumber = 'RCP-' + (1000 + sales.length + 1);

    const newSale: Sale = {
      ...saleData,
      id: 'sale-' + Date.now(),
      receiptNumber,
      date: now
    };

    // 1. Deduct stock for all items sold
    const updatedProductsMap = new Map<string, number>();
    newSale.items.forEach(item => {
      updatedProductsMap.set(item.productId, item.quantity);
    });

    setProducts(prev =>
      prev.map(p => {
        if (updatedProductsMap.has(p.id)) {
          const qtyToDeduct = updatedProductsMap.get(p.id)!;
          return {
            ...p,
            quantity: Math.max(0, p.quantity - qtyToDeduct),
            updatedAt: now
          };
        }
        return p;
      })
    );

    // 2. Record Stock Change logs for each item
    const newStockLogs: StockChangeLog[] = newSale.items.map(item => {
      const prod = products.find(p => p.id === item.productId);
      const prevQty = prod ? prod.quantity : 0;
      return {
        id: 'log-' + Date.now() + '-' + item.productId,
        productId: item.productId,
        productName: item.productName,
        changeType: 'sale',
        quantityChange: -item.quantity,
        previousQuantity: prevQty,
        newQuantity: Math.max(0, prevQty - item.quantity),
        reason: `Sold on receipt ${receiptNumber}`,
        timestamp: now
      };
    });

    setStockLogs(prev => [...newStockLogs, ...prev]);

    // 3. If sale was on Udhaar (Credit) and customer is selected
    if (newSale.paymentMethod === 'udhaar' && newSale.customerId) {
      const udhaarAmount = newSale.total;
      setCustomers(prev =>
        prev.map(c => {
          if (c.id === newSale.customerId) {
            const newTotal = c.totalUdhaar + udhaarAmount;
            return {
              ...c,
              totalUdhaar: newTotal,
              transactions: [
                {
                  id: 'tx-' + Date.now(),
                  type: 'sale_credit',
                  amount: udhaarAmount,
                  date: now.split('T')[0],
                  saleId: newSale.id,
                  note: `Sale on credit (Receipt ${receiptNumber})`
                },
                ...c.transactions
              ]
            };
          }
          return c;
        })
      );
      logActivity(
        'udhaar_added',
        `Sale ${receiptNumber} added to Udhaar for ${newSale.customerName || 'Customer'} (${formatMoney(udhaarAmount)})`,
        udhaarAmount
      );
    }

    // 4. Save sale record
    setSales(prev => [newSale, ...prev]);

    // 5. Activity log
    logActivity(
      'sale',
      `Sale ${receiptNumber} completed (${formatMoney(newSale.total)})`,
      newSale.total
    );

    return newSale;
  };

  // PURCHASES ACTIONS
  const createPurchase = (purchaseData: Omit<Purchase, 'id' | 'purchaseNumber' | 'date'>): Purchase => {
    const now = new Date().toISOString();
    const purchaseNumber = 'PUR-' + (500 + purchases.length + 1);

    const newPurchase: Purchase = {
      ...purchaseData,
      id: 'pur-' + Date.now(),
      purchaseNumber,
      date: now
    };

    // 1. Increase stock for each purchased item
    const purchasedMap = new Map<string, { qty: number; buyingPrice: number }>();
    newPurchase.items.forEach(item => {
      purchasedMap.set(item.productId, { qty: item.quantity, buyingPrice: item.buyingPrice });
    });

    setProducts(prev =>
      prev.map(p => {
        if (purchasedMap.has(p.id)) {
          const { qty, buyingPrice } = purchasedMap.get(p.id)!;
          return {
            ...p,
            quantity: p.quantity + qty,
            buyingPrice: buyingPrice > 0 ? buyingPrice : p.buyingPrice, // update latest buying price
            updatedAt: now
          };
        }
        return p;
      })
    );

    // 2. Stock logs
    const newLogs: StockChangeLog[] = newPurchase.items.map(item => {
      const prod = products.find(p => p.id === item.productId);
      const prevQty = prod ? prod.quantity : 0;
      return {
        id: 'log-' + Date.now() + '-' + item.productId,
        productId: item.productId,
        productName: item.productName,
        changeType: 'purchase',
        quantityChange: item.quantity,
        previousQuantity: prevQty,
        newQuantity: prevQty + item.quantity,
        reason: `Purchased on order ${purchaseNumber} from ${newPurchase.supplierName}`,
        timestamp: now
      };
    });

    setStockLogs(prev => [...newLogs, ...prev]);

    // 3. If paymentStatus was 'added_to_money_to_pay', increase supplier balance owed
    const unpaidAmount = newPurchase.total - (newPurchase.amountPaid || 0);
    if (unpaidAmount > 0 && newPurchase.supplierId) {
      setSuppliers(prev =>
        prev.map(s => {
          if (s.id === newPurchase.supplierId) {
            return {
              ...s,
              amountOwed: s.amountOwed + unpaidAmount
            };
          }
          return s;
        })
      );
    }

    setPurchases(prev => [newPurchase, ...prev]);

    logActivity(
      'purchase',
      `Stock purchased on ${purchaseNumber} from ${newPurchase.supplierName} (${formatMoney(newPurchase.total)})`,
      newPurchase.total
    );

    return newPurchase;
  };

  // UDHAAR / CUSTOMER ACTIONS
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'transactions' | 'totalUdhaar'> & { initialUdhaar?: number }): Customer => {
    const now = new Date().toISOString();
    const initialUdhaar = Number(customerData.initialUdhaar) || 0;

    const newCustomer: Customer = {
      id: 'cust-' + Date.now(),
      name: customerData.name,
      phone: customerData.phone,
      address: customerData.address || '',
      totalUdhaar: initialUdhaar,
      lastPaymentDate: undefined,
      transactions: initialUdhaar > 0 ? [
        {
          id: 'tx-' + Date.now(),
          type: 'manual_udhaar',
          amount: initialUdhaar,
          date: now.split('T')[0],
          note: 'Opening Udhaar balance'
        }
      ] : [],
      createdAt: now
    };

    setCustomers(prev => [newCustomer, ...prev]);
    logActivity('udhaar_added', `New customer added: ${newCustomer.name} (Opening Udhaar: ${formatMoney(initialUdhaar)})`);
    return newCustomer;
  };

  const editCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCustomer = (id: string) => {
    const cust = customers.find(c => c.id === id);
    if (cust) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      logActivity('udhaar_added', `Customer removed: ${cust.name}`);
    }
  };

  const addUdhaarToCustomer = (customerId: string, amount: number, note = 'Manual Udhaar recorded') => {
    if (amount <= 0) return;
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    let custName = '';
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          custName = c.name;
          return {
            ...c,
            totalUdhaar: c.totalUdhaar + amount,
            transactions: [
              {
                id: 'tx-' + Date.now(),
                type: 'manual_udhaar',
                amount,
                date: today,
                note
              },
              ...c.transactions
            ]
          };
        }
        return c;
      })
    );

    logActivity('udhaar_added', `Udhaar of ${formatMoney(amount)} added for ${custName} (${note})`, amount);
  };

  const receiveUdhaarPayment = (customerId: string, amount: number, note = 'Cash payment received') => {
    if (amount <= 0) return;
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    let custName = '';
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          custName = c.name;
          const newUdhaar = Math.max(0, c.totalUdhaar - amount);
          return {
            ...c,
            totalUdhaar: newUdhaar,
            lastPaymentDate: today,
            transactions: [
              {
                id: 'tx-' + Date.now(),
                type: 'payment_received',
                amount,
                date: today,
                note
              },
              ...c.transactions
            ]
          };
        }
        return c;
      })
    );

    logActivity('udhaar_payment', `Received Udhaar payment of ${formatMoney(amount)} from ${custName}`, amount);
  };

  // SUPPLIER ACTIONS
  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'createdAt'>): Supplier => {
    const now = new Date().toISOString();
    const newSupplier: Supplier = {
      ...supplierData,
      id: 'sup-' + Date.now(),
      createdAt: now
    };

    setSuppliers(prev => [newSupplier, ...prev]);
    logActivity('purchase', `New supplier added: ${newSupplier.name}`);
    return newSupplier;
  };

  const editSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const paySupplier = (supplierId: string, amount: number, paymentMethod = 'Cash', note = 'Payment made to supplier') => {
    if (amount <= 0) return;
    let supplierName = '';

    setSuppliers(prev =>
      prev.map(s => {
        if (s.id === supplierId) {
          supplierName = s.name;
          return {
            ...s,
            amountOwed: Math.max(0, s.amountOwed - amount)
          };
        }
        return s;
      })
    );

    logActivity('purchase', `Paid ${formatMoney(amount)} to supplier ${supplierName} via ${paymentMethod} (${note})`, amount);
  };

  // EXPENSE ACTIONS
  const addExpense = (expenseData: Omit<Expense, 'id'>): Expense => {
    const newExpense: Expense = {
      ...expenseData,
      id: 'exp-' + Date.now()
    };

    setExpenses(prev => [newExpense, ...prev]);
    logActivity('expense_added', `Shop expense added: ${newExpense.category} - ${newExpense.title} (${formatMoney(newExpense.amount)})`, newExpense.amount);
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // SETTINGS & BACKUP
  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setSuppliers(INITIAL_SUPPLIERS);
    setSales(INITIAL_SALES);
    setPurchases(INITIAL_PURCHASES);
    setExpenses(INITIAL_EXPENSES);
    setStockLogs(INITIAL_STOCK_LOGS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setSettings(INITIAL_SETTINGS);
    setUserRole('owner');
    logActivity('stock_change', 'Shop register reset to realistic demo data');
  };

  const exportDataJSON = (): string => {
    const data = {
      products,
      customers,
      suppliers,
      sales,
      purchases,
      expenses,
      stockLogs,
      activityLogs,
      settings,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.products && Array.isArray(parsed.products)) setProducts(parsed.products);
      if (parsed.customers && Array.isArray(parsed.customers)) setCustomers(parsed.customers);
      if (parsed.suppliers && Array.isArray(parsed.suppliers)) setSuppliers(parsed.suppliers);
      if (parsed.sales && Array.isArray(parsed.sales)) setSales(parsed.sales);
      if (parsed.purchases && Array.isArray(parsed.purchases)) setPurchases(parsed.purchases);
      if (parsed.expenses && Array.isArray(parsed.expenses)) setExpenses(parsed.expenses);
      if (parsed.stockLogs && Array.isArray(parsed.stockLogs)) setStockLogs(parsed.stockLogs);
      if (parsed.settings) setSettings(parsed.settings);
      logActivity('stock_change', 'Data successfully imported from backup file');
      return true;
    } catch {
      return false;
    }
  };

  // COMPUTED DASHBOARD METRICS
  const metrics = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Filter today's sales
    const todaySalesList = sales.filter(s => s.date.startsWith(todayStr));
    const todaySales = todaySalesList.reduce((acc, s) => acc + s.total, 0);
    const todayCost = todaySalesList.reduce((acc, s) => acc + s.totalCost, 0);

    // Filter today's expenses
    const todayExpensesList = expenses.filter(e => e.date.startsWith(todayStr));
    const todayExpenses = todayExpensesList.reduce((acc, e) => acc + e.amount, 0);

    // Today's Real Profit: Today's Sales - Today's Product Cost - Today's Expenses
    const todayProfit = todaySales - todayCost - todayExpenses;

    // Stock stats
    const totalStockUnits = products.reduce((acc, p) => acc + p.quantity, 0);
    const totalProductsCount = products.length;

    const lowStockList = products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockLimit);
    const outOfStockList = products.filter(p => p.quantity <= 0);

    // Udhaar / Money to Receive
    const moneyToReceive = customers.reduce((acc, c) => acc + (c.totalUdhaar || 0), 0);

    // Money to Pay
    const moneyToPay = suppliers.reduce((acc, s) => acc + (s.amountOwed || 0), 0);

    return {
      todaySales,
      todayCost,
      todayExpenses,
      todayProfit,
      totalStockUnits,
      totalProductsCount,
      lowStockCount: lowStockList.length,
      outOfStockCount: outOfStockList.length,
      moneyToReceive,
      moneyToPay,
      todaySalesCount: todaySalesList.length,
      lowStockList,
      outOfStockList,
      todaySalesList
    };
  }, [sales, expenses, products, customers, suppliers]);

  const value: ShopContextType = {
    products,
    customers,
    suppliers,
    sales,
    purchases,
    expenses,
    stockLogs,
    activityLogs,
    settings,
    userRole,
    setUserRole,
    addProduct,
    editProduct,
    deleteProduct,
    addStock,
    removeStock,
    correctStock,
    getStockStatus,
    createSale,
    createPurchase,
    addCustomer,
    editCustomer,
    deleteCustomer,
    addUdhaarToCustomer,
    receiveUdhaarPayment,
    addSupplier,
    editSupplier,
    deleteSupplier,
    paySupplier,
    addExpense,
    deleteExpense,
    updateSettings,
    resetToDemoData,
    exportDataJSON,
    importDataJSON,
    metrics,
    formatMoney
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
