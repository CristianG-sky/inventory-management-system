import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { Transaction } from '../../types';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewProduct: (id: string) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
  onViewProduct
}) => {
  const getTransactionVariant = (type: string) => {
    return type === 'Purchase' ? 'success' : 'primary';
  };

  const getTransactionIcon = (type: string) => {
    return type === 'Purchase' ? 'fas fa-truck' : 'fas fa-shopping-cart';
  };

  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Badge bg={getTransactionVariant(transaction.transactionType)} className="mb-2">
              <i className={`${getTransactionIcon(transaction.transactionType)} me-1`}></i>
              {transaction.transactionType === 'Purchase' ? 'Compra' : 'Venta'}
            </Badge>
            <Card.Title className="h6 mb-1">{transaction.productName}</Card.Title>
            <Card.Subtitle className="text-muted small">
              <i className="fas fa-tag me-1"></i>
              {transaction.productCategory}
            </Card.Subtitle>
          </div>
          <div className="text-end">
            <div className="h5 text-success mb-0">
              ${transaction.totalPrice.toFixed(2)}
            </div>
            <small className="text-muted">
              {transaction.quantity} x ${transaction.unitPrice.toFixed(2)}
            </small>
          </div>
        </div>
        
        {transaction.details && (
          <Card.Text className="text-muted small mb-2">
            <i className="fas fa-info-circle me-1"></i>
            {transaction.details}
          </Card.Text>
        )}
        
        <Row className="mb-3 text-center">
          <Col sm={4}>
            <small className="text-muted d-block">Cantidad</small>
            <strong>{transaction.quantity}</strong>
          </Col>
          <Col sm={4}>
            <small className="text-muted d-block">Precio Unit.</small>
            <strong>${transaction.unitPrice.toFixed(2)}</strong>
          </Col>
          <Col sm={4}>
            <small className="text-muted d-block">Stock Actual</small>
            <strong>{transaction.currentStock}</strong>
          </Col>
        </Row>
        
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            <i className="fas fa-calendar me-1"></i>
            {new Date(transaction.transactionDate).toLocaleDateString()} {' '}
            {new Date(transaction.transactionDate).toLocaleTimeString()}
          </small>
          
          <div className="btn-group btn-group-sm">
            <Button 
              variant="outline-info"
              size="sm" 
              onClick={() => onViewProduct(transaction.productId)}
              title="Ver producto"
            >
              <i className="fas fa-eye"></i>
            </Button>
            <Button 
              variant="outline-primary"
              size="sm"
              onClick={() => onEdit(transaction.id)}
              title="Editar transacción"
            >
              <i className="fas fa-edit"></i>
            </Button>
            <Button 
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(transaction.id)}
              title="Eliminar transacción"
            >
              <i className="fas fa-trash"></i>
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
