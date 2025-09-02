import { apiClient } from './api';
import { 
  Product, 
  CreateProductDto, 
  UpdateProductDto, 
  ProductFilter, 
  PagedResult, 
  ApiResponse 
} from '../types';

export class ProductService {
  
  async getProducts(filter: Partial<ProductFilter> = {}): Promise<PagedResult<Product>> {
    try {
      const params = new URLSearchParams();
      
      if (filter.name) params.append('name', filter.name);
      if (filter.category) params.append('category', filter.category);
      if (filter.minPrice !== undefined) params.append('minPrice', filter.minPrice.toString());
      if (filter.maxPrice !== undefined) params.append('maxPrice', filter.maxPrice.toString());
      if (filter.isActive !== undefined) params.append('isActive', filter.isActive.toString());
      if (filter.page) params.append('page', filter.page.toString());
      if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
      if (filter.sortBy) params.append('sortBy', filter.sortBy);
      if (filter.sortDescending !== undefined) params.append('sortDescending', filter.sortDescending.toString());

      const response = await apiClient.getProducts<ApiResponse<PagedResult<Product>>>({
        params: params
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiClient.getProductById<ApiResponse<Product>>(id);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async createProduct(product: CreateProductDto): Promise<Product> {
    try {
      const response = await apiClient.createProduct<ApiResponse<Product>>(product);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, product: UpdateProductDto): Promise<Product> {
    try {
      const response = await apiClient.updateProduct<ApiResponse<Product>>(id, product);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await apiClient.deleteProduct<ApiResponse<boolean>>(id);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      // Obtener todas las categorías únicas de los productos
      const products = await this.getProducts({ pageSize: 1000 });
      const categoriesSet = new Set(products.items.map(p => p.category));
      const categories = Array.from(categoriesSet);
      return categories.sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
}

export const productService = new ProductService();
