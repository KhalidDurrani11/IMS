import {
  Product,
  Customer,
  Supplier,
  Sale,
  Purchase,
  Expense,
  StockChangeLog,
  ActivityLog,
  ShopSettings
} from '../types';

export const INITIAL_CATEGORIES = [
  'Drinks & Beverages',
  'Milk & Dairy',
  'Grocery & Staples',
  'Tea & Coffee',
  'Biscuits & Bakery',
  'Snacks & Confectionery',
  'Personal Care & Soap',
  'Cleaning & Household',
  'Spices & Condiments',
  'Cooking Oil & Ghee'
];

export const INITIAL_SETTINGS: ShopSettings = {
  shopName: 'Madina General Store',
  phone: '0300-1234567',
  address: 'Shop # 14, Main Bazaar, City Market',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  receiptFooter: 'Shukriya! Please visit again.',
  taxRate: 0,
  enableDiscounts: true,
  workerCanViewStock: true,
  workerCanViewCustomerPhone: true,
  categories: INITIAL_CATEGORIES
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Coke 1.5 Litre',
    category: 'Drinks & Beverages',
    buyingPrice: 180,
    sellingPrice: 220,
    quantity: 24,
    lowStockLimit: 10,
    unit: 'bottle',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-2',
    name: 'Pepsi 1.5 Litre',
    category: 'Drinks & Beverages',
    buyingPrice: 180,
    sellingPrice: 220,
    quantity: 18,
    lowStockLimit: 10,
    unit: 'bottle',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-3',
    name: 'Coke 500ml',
    category: 'Drinks & Beverages',
    buyingPrice: 85,
    sellingPrice: 100,
    quantity: 0, // Out of stock example
    lowStockLimit: 12,
    unit: 'bottle',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-4',
    name: 'Olper Milk 1 Litre Tetra Pak',
    category: 'Milk & Dairy',
    buyingPrice: 290,
    sellingPrice: 320,
    quantity: 5, // Low stock example
    lowStockLimit: 12,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-5',
    name: 'Tarang Tea Whitener 1L',
    category: 'Milk & Dairy',
    buyingPrice: 260,
    sellingPrice: 290,
    quantity: 14,
    lowStockLimit: 8,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-6',
    name: 'White Sugar (Cheeni)',
    category: 'Grocery & Staples',
    buyingPrice: 135,
    sellingPrice: 155,
    quantity: 8, // Low stock example
    lowStockLimit: 20,
    unit: 'kg',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-7',
    name: 'Tapal Danedar Tea 430g',
    category: 'Tea & Coffee',
    buyingPrice: 620,
    sellingPrice: 690,
    quantity: 16,
    lowStockLimit: 6,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-8',
    name: 'Lipton Yellow Label 380g',
    category: 'Tea & Coffee',
    buyingPrice: 580,
    sellingPrice: 650,
    quantity: 9,
    lowStockLimit: 5,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-9',
    name: 'Dalda Cooking Oil 1L Pouch',
    category: 'Cooking Oil & Ghee',
    buyingPrice: 480,
    sellingPrice: 530,
    quantity: 22,
    lowStockLimit: 8,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-10',
    name: 'Mezan Banaspati Ghee 1kg',
    category: 'Cooking Oil & Ghee',
    buyingPrice: 460,
    sellingPrice: 510,
    quantity: 19,
    lowStockLimit: 10,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-11',
    name: 'Guard Super Basmati Rice',
    category: 'Grocery & Staples',
    buyingPrice: 310,
    sellingPrice: 360,
    quantity: 45,
    lowStockLimit: 15,
    unit: 'kg',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-12',
    name: 'Chakki Atta (Flour)',
    category: 'Grocery & Staples',
    buyingPrice: 120,
    sellingPrice: 140,
    quantity: 80,
    lowStockLimit: 30,
    unit: 'kg',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-13',
    name: 'Peek Freans Sooper Biscuits Family Pack',
    category: 'Biscuits & Bakery',
    buyingPrice: 95,
    sellingPrice: 120,
    quantity: 32,
    lowStockLimit: 12,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-14',
    name: 'LU Prince Chocolate Biscuits Pack',
    category: 'Biscuits & Bakery',
    buyingPrice: 50,
    sellingPrice: 60,
    quantity: 4, // Low stock
    lowStockLimit: 15,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-15',
    name: 'Super Crisp Biscuits 12s Box',
    category: 'Biscuits & Bakery',
    buyingPrice: 320,
    sellingPrice: 380,
    quantity: 0, // Out of stock
    lowStockLimit: 5,
    unit: 'box',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-16',
    name: 'Lays Masala Chips Large',
    category: 'Snacks & Confectionery',
    buyingPrice: 85,
    sellingPrice: 100,
    quantity: 26,
    lowStockLimit: 10,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-17',
    name: 'Kurkure Red Chilli Jhatpat',
    category: 'Snacks & Confectionery',
    buyingPrice: 42,
    sellingPrice: 50,
    quantity: 35,
    lowStockLimit: 12,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-18',
    name: 'Safeguard Soap Pure White 115g',
    category: 'Personal Care & Soap',
    buyingPrice: 125,
    sellingPrice: 150,
    quantity: 28,
    lowStockLimit: 10,
    unit: 'pcs',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-19',
    name: 'Lifebuoy Total Soap 115g',
    category: 'Personal Care & Soap',
    buyingPrice: 110,
    sellingPrice: 130,
    quantity: 6, // Low stock
    lowStockLimit: 10,
    unit: 'pcs',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-20',
    name: 'Sunsilk Black Shine Shampoo 180ml',
    category: 'Personal Care & Soap',
    buyingPrice: 340,
    sellingPrice: 390,
    quantity: 11,
    lowStockLimit: 6,
    unit: 'bottle',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-21',
    name: 'Head & Shoulders Classic 180ml',
    category: 'Personal Care & Soap',
    buyingPrice: 420,
    sellingPrice: 480,
    quantity: 8,
    lowStockLimit: 5,
    unit: 'bottle',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-22',
    name: 'Colgate Maximum Cavity Protection 100g',
    category: 'Personal Care & Soap',
    buyingPrice: 175,
    sellingPrice: 210,
    quantity: 15,
    lowStockLimit: 6,
    unit: 'pcs',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-23',
    name: 'Sensodyne Rapid Action 70g',
    category: 'Personal Care & Soap',
    buyingPrice: 310,
    sellingPrice: 360,
    quantity: 7,
    lowStockLimit: 4,
    unit: 'pcs',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-24',
    name: 'Surf Excel Washing Powder 1kg',
    category: 'Cleaning & Household',
    buyingPrice: 450,
    sellingPrice: 500,
    quantity: 18,
    lowStockLimit: 8,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-25',
    name: 'Ariel Washing Powder 1kg',
    category: 'Cleaning & Household',
    buyingPrice: 460,
    sellingPrice: 510,
    quantity: 12,
    lowStockLimit: 8,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-26',
    name: 'Lemon Max Dishwash Bar Large',
    category: 'Cleaning & Household',
    buyingPrice: 55,
    sellingPrice: 70,
    quantity: 34,
    lowStockLimit: 15,
    unit: 'pcs',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-27',
    name: 'National Biryani Masala Double Pack',
    category: 'Spices & Condiments',
    buyingPrice: 120,
    sellingPrice: 145,
    quantity: 25,
    lowStockLimit: 10,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-28',
    name: 'Shan Chaat Masala 50g',
    category: 'Spices & Condiments',
    buyingPrice: 65,
    sellingPrice: 80,
    quantity: 20,
    lowStockLimit: 8,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-29',
    name: 'Nestle Fruita Vitals Apple 1L',
    category: 'Drinks & Beverages',
    buyingPrice: 280,
    sellingPrice: 320,
    quantity: 10,
    lowStockLimit: 5,
    unit: 'packet',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prod-30',
    name: 'Dawn Plain Bread Large',
    category: 'Biscuits & Bakery',
    buyingPrice: 140,
    sellingPrice: 160,
    quantity: 7, // Low stock
    lowStockLimit: 10,
    unit: 'pcs',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Ahmed Khan (Teacher)',
    phone: '0321-9876543',
    address: 'House # 12, Street 3, G-9/2',
    totalUdhaar: 3000,
    lastPaymentDate: '2026-08-18',
    transactions: [
      {
        id: 'tx-1',
        type: 'manual_udhaar',
        amount: 5000,
        date: '2026-08-10',
        note: 'Monthly ration grocery'
      },
      {
        id: 'tx-2',
        type: 'payment_received',
        amount: 2000,
        date: '2026-08-18',
        note: 'Paid in cash after salary'
      }
    ],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'cust-2',
    name: 'Muhammad Ali (Bhai)',
    phone: '0333-5551234',
    address: 'Near Bilal Masjid',
    totalUdhaar: 1500,
    lastPaymentDate: '2026-08-15',
    transactions: [
      {
        id: 'tx-3',
        type: 'manual_udhaar',
        amount: 2500,
        date: '2026-08-08',
        note: 'Cooking oil and tea'
      },
      {
        id: 'tx-4',
        type: 'payment_received',
        amount: 1000,
        date: '2026-08-15',
        note: 'Partial cash payment'
      }
    ],
    createdAt: '2026-08-02T10:00:00.000Z'
  },
  {
    id: 'cust-3',
    name: 'Usman Ghani',
    phone: '0345-7890123',
    address: 'Shop # 4 Opposite side',
    totalUdhaar: 800,
    lastPaymentDate: '2026-08-12',
    transactions: [
      {
        id: 'tx-5',
        type: 'manual_udhaar',
        amount: 800,
        date: '2026-08-12',
        note: 'Drinks & snacks for workshop'
      }
    ],
    createdAt: '2026-08-05T10:00:00.000Z'
  },
  {
    id: 'cust-4',
    name: 'Chaudhry Tariq',
    phone: '0300-8889991',
    address: 'Farm House Sector 7',
    totalUdhaar: 4200,
    lastPaymentDate: '2026-08-05',
    transactions: [
      {
        id: 'tx-6',
        type: 'manual_udhaar',
        amount: 6000,
        date: '2026-08-01',
        note: 'Big monthly grocery'
      },
      {
        id: 'tx-7',
        type: 'payment_received',
        amount: 1800,
        date: '2026-08-05',
        note: 'Cash payment'
      }
    ],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'cust-5',
    name: 'Raza Motors (Staff)',
    phone: '0312-3456789',
    address: 'Near Petrol Pump',
    totalUdhaar: 2500,
    lastPaymentDate: '2026-08-14',
    transactions: [
      {
        id: 'tx-8',
        type: 'manual_udhaar',
        amount: 2500,
        date: '2026-08-14',
        note: 'Tea, milk, sugar supply'
      }
    ],
    createdAt: '2026-08-06T10:00:00.000Z'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Al-Madina Wholesalers',
    phone: '0301-7654321',
    address: 'Grain Market, Wholesale Area',
    productsSupplied: 'Rice, Sugar, Flour, Cooking Oil & Ghee',
    amountOwed: 20000,
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'sup-2',
    name: 'Pepsi & Beverage Agency',
    phone: '0315-1122334',
    address: 'Industrial Area, Depo 4',
    productsSupplied: 'Pepsi, 7Up, Dew, Aquafina',
    amountOwed: 8500,
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'sup-3',
    name: 'Coca-Cola Distribution Hub',
    phone: '0322-9988776',
    address: 'Sector I-9 Distribution Centre',
    productsSupplied: 'Coke 1.5L, Coke 500ml, Sprite, Fanta',
    amountOwed: 0,
    createdAt: '2026-08-02T10:00:00.000Z'
  },
  {
    id: 'sup-4',
    name: 'Metro Daily Supply (Biscuits & Soaps)',
    phone: '0334-4455667',
    address: 'City Center Wholesale Block',
    productsSupplied: 'Sooper, Prince, Safeguard, Surf Excel',
    amountOwed: 0,
    createdAt: '2026-08-03T10:00:00.000Z'
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-1',
    receiptNumber: 'RCP-1001',
    date: '2026-08-21T09:15:00.000Z',
    items: [
      {
        productId: 'prod-1',
        productName: 'Coke 1.5 Litre',
        quantity: 2,
        buyingPrice: 180,
        sellingPrice: 220,
        total: 440,
        unit: 'bottle'
      },
      {
        productId: 'prod-13',
        productName: 'Peek Freans Sooper Biscuits Family Pack',
        quantity: 1,
        buyingPrice: 95,
        sellingPrice: 120,
        total: 120,
        unit: 'packet'
      }
    ],
    subtotal: 560,
    discount: 0,
    total: 560,
    totalCost: 455,
    profit: 105,
    paymentMethod: 'cash',
    amountPaid: 1000,
    change: 440,
    cashierRole: 'owner'
  },
  {
    id: 'sale-2',
    receiptNumber: 'RCP-1002',
    date: '2026-08-21T11:30:00.000Z',
    items: [
      {
        productId: 'prod-9',
        productName: 'Dalda Cooking Oil 1L Pouch',
        quantity: 3,
        buyingPrice: 480,
        sellingPrice: 530,
        total: 1590,
        unit: 'packet'
      },
      {
        productId: 'prod-7',
        productName: 'Tapal Danedar Tea 430g',
        quantity: 1,
        buyingPrice: 620,
        sellingPrice: 690,
        total: 690,
        unit: 'packet'
      },
      {
        productId: 'prod-6',
        productName: 'White Sugar (Cheeni)',
        quantity: 5,
        buyingPrice: 135,
        sellingPrice: 155,
        total: 775,
        unit: 'kg'
      }
    ],
    subtotal: 3055,
    discount: 55,
    total: 3000,
    totalCost: 2735,
    profit: 265,
    paymentMethod: 'cash',
    amountPaid: 3000,
    change: 0,
    cashierRole: 'owner'
  },
  {
    id: 'sale-3',
    receiptNumber: 'RCP-1003',
    date: '2026-08-21T13:45:00.000Z',
    items: [
      {
        productId: 'prod-11',
        productName: 'Guard Super Basmati Rice',
        quantity: 10,
        buyingPrice: 310,
        sellingPrice: 360,
        total: 3600,
        unit: 'kg'
      },
      {
        productId: 'prod-12',
        productName: 'Chakki Atta (Flour)',
        quantity: 20,
        buyingPrice: 120,
        sellingPrice: 140,
        total: 2800,
        unit: 'kg'
      }
    ],
    subtotal: 6400,
    discount: 0,
    total: 6400,
    totalCost: 5500,
    profit: 900,
    paymentMethod: 'cash',
    amountPaid: 6500,
    change: 100,
    customerId: 'cust-1',
    customerName: 'Ahmed Khan (Teacher)',
    cashierRole: 'owner'
  },
  {
    id: 'sale-4',
    receiptNumber: 'RCP-1004',
    date: '2026-08-21T15:20:00.000Z',
    items: [
      {
        productId: 'prod-24',
        productName: 'Surf Excel Washing Powder 1kg',
        quantity: 2,
        buyingPrice: 450,
        sellingPrice: 500,
        total: 1000,
        unit: 'packet'
      },
      {
        productId: 'prod-18',
        productName: 'Safeguard Soap Pure White 115g',
        quantity: 4,
        buyingPrice: 125,
        sellingPrice: 150,
        total: 600,
        unit: 'pcs'
      },
      {
        productId: 'prod-22',
        productName: 'Colgate Maximum Cavity Protection 100g',
        quantity: 2,
        buyingPrice: 175,
        sellingPrice: 210,
        total: 420,
        unit: 'pcs'
      }
    ],
    subtotal: 2020,
    discount: 20,
    total: 2000,
    totalCost: 1750,
    profit: 250,
    paymentMethod: 'easypaisa_jazzcash',
    amountPaid: 2000,
    change: 0,
    cashierRole: 'worker'
  },
  {
    id: 'sale-5',
    receiptNumber: 'RCP-1005',
    date: '2026-08-21T16:10:00.000Z',
    items: [
      {
        productId: 'prod-10',
        productName: 'Mezan Banaspati Ghee 1kg',
        quantity: 5,
        buyingPrice: 460,
        sellingPrice: 510,
        total: 2550,
        unit: 'packet'
      },
      {
        productId: 'prod-27',
        productName: 'National Biryani Masala Double Pack',
        quantity: 6,
        buyingPrice: 120,
        sellingPrice: 145,
        total: 870,
        unit: 'packet'
      },
      {
        productId: 'prod-4',
        productName: 'Olper Milk 1 Litre Tetra Pak',
        quantity: 6,
        buyingPrice: 290,
        sellingPrice: 320,
        total: 1920,
        unit: 'packet'
      }
    ],
    subtotal: 5340,
    discount: 40,
    total: 5300,
    totalCost: 4760,
    profit: 540,
    paymentMethod: 'cash',
    amountPaid: 5300,
    change: 0,
    cashierRole: 'owner'
  }
];

export const INITIAL_PURCHASES: Purchase[] = [
  {
    id: 'pur-1',
    purchaseNumber: 'PUR-501',
    date: '2026-08-20T11:00:00.000Z',
    supplierId: 'sup-1',
    supplierName: 'Al-Madina Wholesalers',
    items: [
      {
        productId: 'prod-11',
        productName: 'Guard Super Basmati Rice',
        quantity: 50,
        buyingPrice: 310,
        total: 15500,
        unit: 'kg'
      },
      {
        productId: 'prod-6',
        productName: 'White Sugar (Cheeni)',
        quantity: 50,
        buyingPrice: 135,
        total: 6750,
        unit: 'kg'
      }
    ],
    total: 22250,
    paymentStatus: 'added_to_money_to_pay',
    amountPaid: 2250,
    notes: 'Paid Rs. 2,250 cash, remaining Rs. 20,000 added to credit'
  },
  {
    id: 'pur-2',
    purchaseNumber: 'PUR-502',
    date: '2026-08-21T08:30:00.000Z',
    supplierId: 'sup-2',
    supplierName: 'Pepsi & Beverage Agency',
    items: [
      {
        productId: 'prod-2',
        productName: 'Pepsi 1.5 Litre',
        quantity: 24,
        buyingPrice: 180,
        total: 4320,
        unit: 'bottle'
      }
    ],
    total: 4320,
    paymentStatus: 'paid_cash',
    amountPaid: 4320,
    notes: 'Paid full cash upon van delivery'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'Shop Electricity Bill (August)',
    category: 'Electricity',
    amount: 1200, // proportional daily or entry
    date: '2026-08-21',
    note: 'Electricity paid via online app'
  },
  {
    id: 'exp-2',
    title: 'Worker Tea & Samosa',
    category: 'Tea & Food',
    amount: 350,
    date: '2026-08-21',
    note: 'Afternoon tea for staff and visitors'
  },
  {
    id: 'exp-3',
    title: 'Van Transport Fare for Sugar bags',
    category: 'Transport',
    amount: 450,
    date: '2026-08-21',
    note: 'Rickshaw fare from wholesale mandi'
  }
];

export const INITIAL_STOCK_LOGS: StockChangeLog[] = [
  {
    id: 'log-1',
    productId: 'prod-1',
    productName: 'Coke 1.5 Litre',
    changeType: 'purchase',
    quantityChange: 20,
    previousQuantity: 6,
    newQuantity: 26,
    reason: 'Stock purchased from supplier',
    timestamp: '2026-08-20T10:00:00.000Z'
  },
  {
    id: 'log-2',
    productId: 'prod-1',
    productName: 'Coke 1.5 Litre',
    changeType: 'sale',
    quantityChange: -2,
    previousQuantity: 26,
    newQuantity: 24,
    reason: 'Sold on receipt RCP-1001',
    timestamp: '2026-08-21T09:15:00.000Z'
  },
  {
    id: 'log-3',
    productId: 'prod-4',
    productName: 'Olper Milk 1 Litre Tetra Pak',
    changeType: 'sale',
    quantityChange: -6,
    previousQuantity: 11,
    newQuantity: 5,
    reason: 'Sold on receipt RCP-1005',
    timestamp: '2026-08-21T16:10:00.000Z'
  },
  {
    id: 'log-4',
    productId: 'prod-3',
    productName: 'Coke 500ml',
    changeType: 'sale',
    quantityChange: -12,
    previousQuantity: 12,
    newQuantity: 0,
    reason: 'Sold out morning rush',
    timestamp: '2026-08-21T12:00:00.000Z'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    type: 'sale',
    description: 'Sale RCP-1005 completed (Rs. 5,300)',
    amount: 5300,
    timestamp: '2026-08-21T16:10:00.000Z'
  },
  {
    id: 'act-2',
    type: 'sale',
    description: 'Sale RCP-1004 completed (Rs. 2,000)',
    amount: 2000,
    timestamp: '2026-08-21T15:20:00.000Z'
  },
  {
    id: 'act-3',
    type: 'udhaar_payment',
    description: 'Received Udhaar payment of Rs. 2,000 from Ahmed Khan',
    amount: 2000,
    timestamp: '2026-08-21T14:30:00.000Z'
  },
  {
    id: 'act-4',
    type: 'stock_change',
    description: 'Coke 1.5L stock increased by 20 bottles',
    timestamp: '2026-08-20T10:00:00.000Z'
  },
  {
    id: 'act-5',
    type: 'expense_added',
    description: 'Shop expense added: Tea & Food (Rs. 350)',
    amount: 350,
    timestamp: '2026-08-21T13:00:00.000Z'
  }
];
