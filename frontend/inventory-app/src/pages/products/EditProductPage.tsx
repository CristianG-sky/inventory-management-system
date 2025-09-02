import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Product, UpdateProductDto } from '../../types';
import { productService } from '../../services/productService';
import { ProductForm } from '../../components/products/ProductForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const EditProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadProduct(id);
    } else {
      setError('ID de producto no válido');
      setLoading(false);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const productData = await productService.getProductById(productId);
      setProduct(productData);
    } catch (error: any) {
      setError(error.message || 'Error al cargar producto');
      console.error('Load product error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (productData: UpdateProductDto) => {
    if (!id) return;
    
    try {
      setSaving(true);
      await productService.updateProduct(id, productData);
      toast.success('Producto actualizado exitosamente');
      navigate('/products');
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar producto');
      console.error('Update product error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (loading) {
    return <LoadingSpinner message="Cargando producto..." />;
  }

  if (error) {
    return (
      <div>
        <div className="d-flex align-items-center mb-4">
          <button 
            className="btn btn-link p-0 me-3" 
            onClick={() => navigate('/products')}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>Editar Producto</h1>
        </div>
        
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={() => id && loadProduct(id)}>
            Reintentar
          </button>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <div className="d-flex align-items-center mb-4">
          <button 
            className="btn btn-link p-0 me-3" 
            onClick={() => navigate('/products')}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>Editar Producto</h1>
        </div>
        
        <Alert variant="warning">
          <Alert.Heading>Producto no encontrado</Alert.Heading>
          <p>El producto que intentas editar no existe o ha sido eliminado.</p>
        </Alert>
      </div>
    );
  }

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
          <i className="fas fa-edit me-2"></i>
          Editar Producto: {product.name}
        </h1>
      </div>

      <ProductForm
        mode="edit"
        product={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={saving}
      />
    </div>
  );
};