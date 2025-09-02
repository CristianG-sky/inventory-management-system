import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewHistory: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onViewHistory
}) => {
  const getStockVariant = (status: string) => {
    switch (status) {
      case 'In Stock': return 'success';
      case 'Low Stock': return 'warning';
      case 'Out of Stock': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="h5 mb-1">{product.name}</Card.Title>
          <Badge bg={getStockVariant(product.stockStatus)}>
            {product.stockStatus}
          </Badge>
        </div>
        
        <Card.Subtitle className="mb-2 text-muted">
          <i className="fas fa-tag me-1"></i>
          {product.category}
        </Card.Subtitle>
        
        {product.description && (
          <Card.Text className="text-muted small">
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description
            }
          </Card.Text>
        )}
        
        <Row className="mb-3">
          <Col sm={6}>
            <strong className="text-success">
              <i className="fas fa-dollar-sign me-1"></i>
              ${product.price.toFixed(2)}
            </strong>
          </Col>
          <Col sm={6} className="text-end">
            <span className="badge bg-light text-dark">
              <i className="fas fa-boxes me-1"></i>
              Stock: {product.stock}
            </span>
          </Col>
        </Row>
        
        {product.imageUrl && (
          <div className="text-center mb-3">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="img-fluid rounded"
              style={{ maxHeight: '150px', objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="d-grid gap-2">
          <div className="btn-group">
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => onEdit(product.id)}
            >
              <i className="fas fa-edit me-1"></i>
              Editar
            </Button>
            <Button 
              variant="info" 
              size="sm"
              onClick={() => onViewHistory(product.id)}
            >
              <i className="fas fa-history me-1"></i>
              Historial
            </Button>
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => onDelete(product.id)}
            >
              <i className="fas fa-trash me-1"></i>
              Eliminar
            </Button>
          </div>
        </div>
      </Card.Body>
      
      <Card.Footer className="text-muted small">
        <i className="fas fa-calendar me-1"></i>
        Creado: {new Date(product.createdAt).toLocaleDateString()}
      </Card.Footer>
    </Card>
  );
};
