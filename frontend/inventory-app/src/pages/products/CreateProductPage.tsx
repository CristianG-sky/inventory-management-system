import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateProductDto } from '../../types';
import { productService } from '../../services/productService';
import { ProductForm } from '../../components/products/ProductForm';

export const CreateProductPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (productData: CreateProductDto) => {
    try {
      setLoading(true);
      await productService.createProduct(productData);
      toast.success('Producto creado exitosamente');
      navigate('/products');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear producto');
      console.error('Create product error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-link p-0 me-3" 
          onClick={() => navigate('/products')}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>
          <i className="fas fa-plus me-2"></i>
          Crear Nuevo Producto
        </h1>
      </div>

      <ProductForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};
