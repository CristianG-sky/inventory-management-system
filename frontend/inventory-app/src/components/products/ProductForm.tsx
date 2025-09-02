import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { CreateProductDto, UpdateProductDto, Product } from '../../types';
import { productService } from '../../services/productService';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  loading = false,
  mode
}) => {
  const [formData, setFormData] = useState<CreateProductDto | UpdateProductDto>({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    imageUrl: product?.imageUrl || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    ...(mode === 'edit' && { isActive: product?.isActive || true })
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es requerida';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    if (formData.imageUrl && formData.imageUrl.trim() && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Debe ser una URL válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return true; // URL vacía es válida
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Limpiar campos vacíos antes de enviar
      const cleanedData = {
        ...formData,
        imageUrl: formData.imageUrl?.trim() || undefined,
        description: formData.description?.trim() || undefined
      };
      await onSubmit(cleanedData);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">
          <i className={`fas fa-${mode === 'create' ? 'plus' : 'edit'} me-2`}></i>
          {mode === 'create' ? 'Crear Nuevo Producto' : 'Editar Producto'}
        </h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  isInvalid={!!errors.name}
                  placeholder="Ingresa el nombre del producto"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría *</Form.Label>
                <Form.Control
                  as="select"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  isInvalid={!!errors.category}
                  disabled={loadingCategories}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Control>
                <Form.Text className="text-muted">
                  También puedes escribir una nueva categoría
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Input alternativo para nueva categoría */}
              <Form.Group className="mb-3">
                <Form.Label>O ingresa nueva categoría</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Nueva categoría"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción del producto (opcional)"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>URL de Imagen</Form.Label>
            <Form.Control
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              isInvalid={!!errors.imageUrl}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <Form.Control.Feedback type="invalid">
              {errors.imageUrl}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Precio *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  isInvalid={!!errors.price}
                  placeholder="0.00"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stock *</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                  isInvalid={!!errors.stock}
                  placeholder="0"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.stock}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {mode === 'edit' && (
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="isActive"
                label="Producto activo"
                checked={('isActive' in formData) ? formData.isActive : true}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
              />
            </Form.Group>
          )}

          <div className="d-flex gap-2">
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {mode === 'create' ? 'Creando...' : 'Guardando...'}
                </>
              ) : (
                <>
                  <i className={`fas fa-${mode === 'create' ? 'plus' : 'save'} me-2`}></i>
                  {mode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
                </>
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
              <i className="fas fa-times me-2"></i>
              Cancelar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};