export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  stockStatus: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  price: number;
  stock: number;
}

export interface UpdateProductDto {
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  price: number;
  stock: number;
  isActive?: boolean;
}

export interface Transaction {
  id: string;
  productId: string;
  transactionDate: string;
  transactionType: 'Purchase' | 'Sale';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  details?: string;
  createdAt: string;
  productName: string;
  productCategory: string;
  currentStock: number;
}

export interface CreateTransactionDto {
  productId: string;
  transactionDate?: string;
  transactionType: 'Purchase' | 'Sale';
  quantity: number;
  unitPrice: number;
  details?: string;
}

export interface UpdateTransactionDto {
  productId?: string;
  transactionDate?: string;
  transactionType: 'Purchase' | 'Sale';
  quantity: number;
  unitPrice: number;
  details?: string;
}

export interface ProductFilter {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
}

export interface TransactionFilter {
  productId?: string;
  productName?: string;
  transactionType?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
