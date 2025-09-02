import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { CreateTransactionDto, UpdateTransactionDto, Transaction, Product } from '../../types';
import { productService } from '../../services/productService';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (transaction: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onCancel,
  loading = false,
  mode
}) => {
  const [formData, setFormData] = useState<CreateTransactionDto | UpdateTransactionDto>({
    productId: transaction?.productId || '',
    transactionDate: transaction?.transactionDate 
      ? new Date(transaction.transactionDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    transactionType: transaction?.transactionType || 'Purchase',
    quantity: transaction?.quantity || 1,
    unitPrice: transaction?.unitPrice || 0,
    details: transaction?.details || '',
  });
  
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [stockWarning, setStockWarning] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (formData.productId) {
      const product = products.find(p => p.id === formData.productId);
      setSelectedProduct(product || null);
      
      if (product && formData.transactionType === 'Sale') {
        checkStock(product, formData.quantity);
      } else {
        setStockWarning(null);
      }
    }
  }, [formData.productId, formData.quantity, formData.transactionType, products]);

  useEffect(() => {
    // Calcular precio total automáticamente
    const totalPrice = formData.quantity * formData.unitPrice;
    // No necesitamos almacenar totalPrice en formData ya que se calcula en el backend
  }, [formData.quantity, formData.unitPrice]);

  const loadProducts = async () => {
    try {
      const productsData = await productService.getProducts({ pageSize: 1000 });
      setProducts(productsData.items.filter(p => p.isActive));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const checkStock = (product: Product, quantity: number) => {
    if (quantity > product.stock) {
      setStockWarning(`Stock insuficiente. Disponible: ${product.stock} unidades`);
    } else if (quantity === product.stock) {
      setStockWarning(`Advertencia: Esta venta agotará el stock del producto`);
    } else {
      setStockWarning(null);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      handleInputChange('productId', productId);
      // Si es una compra, sugerir precio basado en el precio de venta del producto
      if (formData.transactionType === 'Purchase') {
        handleInputChange('unitPrice', product.price * 0.8); // 20% menos que precio de venta
      } else {
        handleInputChange('unitPrice', product.price);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) {
      newErrors.productId = 'Debe seleccionar un producto';
    }

    if (!formData.transactionType) {
      newErrors.transactionType = 'Debe seleccionar un tipo de transacción';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    }

    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = 'El precio unitario debe ser mayor a 0';
    }

    // Validar stock para ventas
    if (formData.transactionType === 'Sale' && selectedProduct) {
      if (formData.quantity > selectedProduct.stock) {
        newErrors.quantity = 'No hay suficiente stock disponible';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Preparar datos para envío
      const submitData = {
        ...formData,
        transactionDate: formData.transactionDate ? new Date(formData.transactionDate).toISOString() : undefined
      };
      await onSubmit(submitData);
    }
  };

  const getTotalPrice = () => {
    return formData.quantity * formData.unitPrice;
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">
          <i className={`fas fa-${mode === 'create' ? 'plus' : 'edit'} me-2`}></i>
          {mode === 'create' ? 'Nueva Transacción' : 'Editar Transacción'}
        </h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Producto *</Form.Label>
                <Form.Select
                  value={formData.productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  isInvalid={!!errors.productId}
                  disabled={loadingProducts || mode === 'edit'}
                >
                  <option value="">Selecciona un producto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - Stock: {product.stock} - ${product.price.toFixed(2)}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.productId}
                </Form.Control.Feedback>
                {selectedProduct && (
                  <Form.Text className="text-muted">
                    <strong>{selectedProduct.name}</strong> - 
                    Categoría: {selectedProduct.category} - 
                    Stock actual: <span className={selectedProduct.stock < 5 ? 'text-warning' : 'text-success'}>
                      {selectedProduct.stock}
                    </span>
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Transacción *</Form.Label>
                <Form.Select
                  value={formData.transactionType}
                  onChange={(e) => handleInputChange('transactionType', e.target.value)}
                  isInvalid={!!errors.transactionType}
                >
                  <option value="Purchase">Compra</option>
                  <option value="Sale">Venta</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.transactionType}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha *</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.transactionDate}
                  onChange={(e) => handleInputChange('transactionDate', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Cantidad *</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                  isInvalid={!!errors.quantity}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.quantity}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Precio Unitario *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                  isInvalid={!!errors.unitPrice}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.unitPrice}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Precio Total</Form.Label>
                <Form.Control
                  type="text"
                  value={`$${getTotalPrice().toFixed(2)}`}
                  readOnly
                  className="bg-light"
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Stock Resultante</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProduct ? 
                    (formData.transactionType === 'Purchase' ? 
                      selectedProduct.stock + formData.quantity : 
                      selectedProduct.stock - formData.quantity
                    ) : 'N/A'
                  }
                  readOnly
                  className="bg-light"
                />
              </Form.Group>
            </Col>
          </Row>

          {stockWarning && (
            <Alert variant={stockWarning.includes('insuficiente') ? 'danger' : 'warning'}>
              <i className="fas fa-exclamation-triangle me-2"></i>
              {stockWarning}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Detalles</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.details}
              onChange={(e) => handleInputChange('details', e.target.value)}
              placeholder="Detalles adicionales de la transacción (opcional)"
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="success" disabled={loading || !!stockWarning?.includes('insuficiente')}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {mode === 'create' ? 'Creando...' : 'Guardando...'}
                </>
              ) : (
                <>
                  <i className={`fas fa-${mode === 'create' ? 'plus' : 'save'} me-2`}></i>
                  {mode === 'create' ? 'Crear Transacción' : 'Guardar Cambios'}
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