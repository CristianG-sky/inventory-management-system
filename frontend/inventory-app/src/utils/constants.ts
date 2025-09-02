export const API_BASE_URL = {
  PRODUCTS: 'https://localhost:7001/api',
  TRANSACTIONS: 'https://localhost:7002/api'
};

export const ROUTES = {
  DASHBOARD: '/',
  PRODUCTS: '/products',
  CREATE_PRODUCT: '/products/create',
  EDIT_PRODUCT: '/products/edit',
  TRANSACTIONS: '/transactions',
  CREATE_TRANSACTION: '/transactions/create',
  EDIT_TRANSACTION: '/transactions/edit'
};

export const TRANSACTION_TYPES = {
  PURCHASE: 'Purchase',
  SALE: 'Sale'
} as const;

export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock'
} as const;

export const PAGE_SIZES = [5, 10, 20, 50];
export const DEFAULT_PAGE_SIZE = 10;
