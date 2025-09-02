import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../utils/constants';

class ApiClient {
  private productClient: AxiosInstance;
  private transactionClient: AxiosInstance;

  constructor() {
    // Cliente para ProductService
    this.productClient = axios.create({
      baseURL: API_BASE_URL.PRODUCTS,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Cliente para TransactionService
    this.transactionClient = axios.create({
      baseURL: API_BASE_URL.TRANSACTIONS,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Configurar interceptors para manejo de errores
    this.setupInterceptors(this.productClient);
    this.setupInterceptors(this.transactionClient);
  }

  private setupInterceptors(client: AxiosInstance) {
    // Request interceptor
    client.interceptors.request.use(
      (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Métodos para ProductService
  public async getProducts<T = any>(config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.productClient.get('/products', config);
  }

  public async getProductById<T = any>(id: string): Promise<AxiosResponse<T>> {
    return this.productClient.get(`/products/${id}`);
  }

  public async createProduct<T = any>(data: any): Promise<AxiosResponse<T>> {
    return this.productClient.post('/products', data);
  }

  public async updateProduct<T = any>(id: string, data: any): Promise<AxiosResponse<T>> {
    return this.productClient.put(`/products/${id}`, data);
  }

  public async deleteProduct<T = any>(id: string): Promise<AxiosResponse<T>> {
    return this.productClient.delete(`/products/${id}`);
  }

  // Métodos para TransactionService
  public async getTransactions<T = any>(config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.transactionClient.get('/transactions', config);
  }

  public async getTransactionById<T = any>(id: string): Promise<AxiosResponse<T>> {
    return this.transactionClient.get(`/transactions/${id}`);
  }

  public async createTransaction<T = any>(data: any): Promise<AxiosResponse<T>> {
    return this.transactionClient.post('/transactions', data);
  }

  public async updateTransaction<T = any>(id: string, data: any): Promise<AxiosResponse<T>> {
    return this.transactionClient.put(`/transactions/${id}`, data);
  }

  public async deleteTransaction<T = any>(id: string): Promise<AxiosResponse<T>> {
    return this.transactionClient.delete(`/transactions/${id}`);
  }

  public async getProductHistory<T = any>(productId: string): Promise<AxiosResponse<T>> {
    return this.transactionClient.get(`/transactions/product/${productId}/history`);
  }
}

export const apiClient = new ApiClient();