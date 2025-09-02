import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import { ProductFilter } from '../../types';
import { productService } from '../../services/productService';

interface ProductFiltersProps {
  filters: Partial<ProductFilter>;
  onFilterChange: (filters: Partial<ProductFilter>) => void;
  onClearFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [localFilters, setLocalFilters] = useState<Partial<ProductFilter>>(filters);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleFilterChange = (key: keyof ProductFilter, value: any) => {
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

  return (
    <Card className="mb-4">
      <Card.Header>
        <h6 className="mb-0">
          <i className="fas fa-filter me-2"></i>
          Filtros
        </h6>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre..."
                value={localFilters.name || ''}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={localFilters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Precio Mín.</Form.Label>
              <Form.Control
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={localFilters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', parseFloat(e.target.value) || undefined)}
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Precio Máx.</Form.Label>
              <Form.Control
                type="number"
                placeholder="999.99"
                min="0"
                step="0.01"
                value={localFilters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value) || undefined)}
              />
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={localFilters.isActive?.toString() || ''}
                onChange={(e) => handleFilterChange('isActive', e.target.value ? e.target.value === 'true' : undefined)}
              >
                <option value="">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Ordenar por</Form.Label>
              <Form.Select
                value={localFilters.sortBy || 'name'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="name">Nombre</option>
                <option value="price">Precio</option>
                <option value="stock">Stock</option>
                <option value="category">Categoría</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Orden</Form.Label>
              <Form.Select
                value={localFilters.sortDescending?.toString() || 'false'}
                onChange={(e) => handleFilterChange('sortDescending', e.target.value === 'true')}
              >
                <option value="false">Ascendente</option>
                <option value="true">Descendente</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={7} className="d-flex align-items-end">
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