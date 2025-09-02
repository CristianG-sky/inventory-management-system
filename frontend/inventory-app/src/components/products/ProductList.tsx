import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewHistory: (id: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
  onViewHistory
}) => {
  return (
    <Row>
      {products.map(product => (
        <Col key={product.id} md={4} lg={3} className="mb-4">
          <ProductCard
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewHistory={onViewHistory}
          />
        </Col>
      ))}
    </Row>
  );
};