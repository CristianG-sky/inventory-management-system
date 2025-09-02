import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import { TransactionFilter, Product } from '../../types';
import { productService } from '../../services/productService';

interface TransactionFiltersProps {
  filters: Partial<TransactionFilter>;
  onFilterChange: (filters: Partial<TransactionFilter>) => void;
  onClearFilters: () => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [localFilters, setLocalFilters] = useState<Partial<TransactionFilter>>(filters);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productsData = await productService.getProducts({ pageSize: 1000 });
      setProducts(productsData.items);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleFilterChange = (key: keyof TransactionFilter, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    onClearFilters();
  };

  // Obtener fecha de hace 30 días para valores por defecto
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return (
    <Card className="mb-4">
      <Card.Header>
        <h6 className="mb-0">
          <i className="fas fa-filter me-2"></i>
          Filtros de Transacciones
        </h6>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Producto</Form.Label>
              <Form.Select
                value={localFilters.productId || ''}
                onChange={(e) => handleFilterChange('productId', e.target.value)}
                disabled={loadingProducts}
              >
                <option value="">Todos los productos</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={localFilters.transactionType || ''}
                onChange={(e) => handleFilterChange('transactionType', e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Purchase">Compras</option>
                <option value="Sale">Ventas</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control
                type="date"
                value={localFilters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha Fin</Form.Label>
              <Form.Control
                type="date"
                value={localFilters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </Form.Group>
          </Col>
          
          <Col md={1}>
            <Form.Group className="mb-3">
              <Form.Label>&nbsp;</Form.Label>
              <Button 
                variant="outline-info" 
                className="d-block"
                size="sm"
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  handleFilterChange('startDate', thirtyDaysAgo.toISOString().split('T')[0]);
                  handleFilterChange('endDate', today);
                }}
              >
                30 días
              </Button>
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Monto Mín.</Form.Label>
              <Form.Control
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={localFilters.minAmount || ''}
                onChange={(e) => handleFilterChange('minAmount', parseFloat(e.target.value) || undefined)}
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Monto Máx.</Form.Label>
              <Form.Control
                type="number"
                placeholder="9999.99"
                min="0"
                step="0.01"
                value={localFilters.maxAmount || ''}
                onChange={(e) => handleFilterChange('maxAmount', parseFloat(e.target.value) || undefined)}
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Ordenar por</Form.Label>
              <Form.Select
                value={localFilters.sortBy || 'transactionDate'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="transactionDate">Fecha</option>
                <option value="transactionType">Tipo</option>
                <option value="totalPrice">Monto</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Orden</Form.Label>
              <Form.Select
                value={localFilters.sortDescending?.toString() || 'true'}
                onChange={(e) => handleFilterChange('sortDescending', e.target.value === 'true')}
              >
                <option value="true">Más recientes</option>
                <option value="false">Más antiguos</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={4} className="d-flex align-items-end">
            <div className="btn-group">
              <Button variant="primary" onClick={handleApplyFilters}>
                <i className="fas fa-search me-1"></i>
                Aplicar Filtros
              </Button>
              <Button variant="outline-secondary" onClick={handleClearFilters}>
                <i className="fas fa-times me-1"></i>
                Limpiar
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};