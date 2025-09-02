import { apiClient } from './api';
import { 
  Transaction, 
  CreateTransactionDto, 
  UpdateTransactionDto, 
  TransactionFilter, 
  PagedResult, 
  ApiResponse 
} from '../types';

export class TransactionService {
  
  async getTransactions(filter: Partial<TransactionFilter> = {}): Promise<PagedResult<Transaction>> {
    try {
      const params = new URLSearchParams();
      
      if (filter.productId) params.append('productId', filter.productId);
      if (filter.productName) params.append('productName', filter.productName);
      if (filter.transactionType) params.append('transactionType', filter.transactionType);
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);
      if (filter.minAmount !== undefined) params.append('minAmount', filter.minAmount.toString());
      if (filter.maxAmount !== undefined) params.append('maxAmount', filter.maxAmount.toString());
      if (filter.page) params.append('page', filter.page.toString());
      if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
      if (filter.sortBy) params.append('sortBy', filter.sortBy);
      if (filter.sortDescending !== undefined) params.append('sortDescending', filter.sortDescending.toString());

      const response = await apiClient.getTransactions<ApiResponse<PagedResult<Transaction>>>({
        params: params
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async getTransactionById(id: string): Promise<Transaction> {
    try {
      const response = await apiClient.getTransactionById<ApiResponse<Transaction>>(id);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Transaction not found');
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  async createTransaction(transaction: CreateTransactionDto): Promise<Transaction> {
    try {
      const response = await apiClient.createTransaction<ApiResponse<Transaction>>(transaction);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create transaction');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async updateTransaction(id: string, transaction: UpdateTransactionDto): Promise<Transaction> {
    try {
      const response = await apiClient.updateTransaction<ApiResponse<Transaction>>(id, transaction);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    try {
      const response = await apiClient.deleteTransaction<ApiResponse<boolean>>(id);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  async getProductHistory(productId: string): Promise<Transaction[]> {
    try {
      const response = await apiClient.getProductHistory<ApiResponse<Transaction[]>>(productId);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch product history');
      }
    } catch (error) {
      console.error('Error fetching product history:', error);
      throw error;
    }
  }

  // Método auxiliar para obtener estadísticas
  async getTransactionStats(): Promise<{
    totalSales: number;
    totalPurchases: number;
    salesAmount: number;
    purchasesAmount: number;
  }> {
    try {
      const transactions = await this.getTransactions({ pageSize: 1000 });
      
      const sales = transactions.items.filter(t => t.transactionType === 'Sale');
      const purchases = transactions.items.filter(t => t.transactionType === 'Purchase');
      
      return {
        totalSales: sales.length,
        totalPurchases: purchases.length,
        salesAmount: sales.reduce((sum, t) => sum + t.totalPrice, 0),
        purchasesAmount: purchases.reduce((sum, t) => sum + t.totalPrice, 0)
      };
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      return { totalSales: 0, totalPurchases: 0, salesAmount: 0, purchasesAmount: 0 };
    }
  }
}

export const transactionService = new TransactionService();