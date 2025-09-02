import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Transaction, TransactionFilter, PagedResult } from '../../types';
import { transactionService } from '../../services/transactionService';
import { TransactionCard } from '../../components/transactions/TransactionCard';
import { TransactionFilters } from '../../components/transactions/TransactionFilters';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Pagination } from '../../components/common/Pagination';

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<PagedResult<Transaction> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<TransactionFilter>>({
    page: 1,
    pageSize: 10,
    sortBy: 'transactionDate',
    sortDescending: true
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Obtener filtros de la URL (útil cuando se viene del historial de productos)
    const urlParams = new URLSearchParams(location.search);
    const productId = urlParams.get('productId');
    
    if (productId) {
      setFilters(prev => ({ ...prev, productId }));
    }
  }, [location.search]);

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getTransactions(filters);
      setTransactions(data);
    } catch (err) {
      setError('Error al cargar transacciones');
      console.error('Transactions loading error:', err);
      toast.error('Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<TransactionFilter>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      pageSize: filters.pageSize || 10,
      sortBy: 'transactionDate',
      sortDescending: true
    });
    // Limpiar parámetros de URL también
    navigate('/transactions', { replace: true });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters({ ...filters, pageSize, page: 1 });
  };

  const handleEdit = (id: string) => {
    navigate(`/transactions/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    const transaction = transactions?.items.find(t => t.id === id);
    if (transaction) {
      setTransactionToDelete(transaction);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await transactionService.deleteTransaction(transactionToDelete.id);
        toast.success('Transacción eliminada exitosamente');
        setShowDeleteModal(false);
        setTransactionToDelete(null);
        loadTransactions();
      } catch (err) {
        toast.error('Error al eliminar transacción');
        console.error('Delete error:', err);
      }
    }
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/products/edit/${productId}`);
  };

  if (loading) return <LoadingSpinner message="Cargando transacciones..." />;

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={loadTransactions}>
          Reintentar
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-exchange-alt me-2"></i>
          Transacciones
        </h1>
        <Link to="/transactions/create" className="btn btn-success">
          <i className="fas fa-plus me-2"></i>
          Nueva Transacción
        </Link>
      </div>

      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {transactions && transactions.items.length > 0 ? (
        <>
          <Row>
            {transactions.items.map(transaction => (
              <Col key={transaction.id} md={6} lg={4} className="mb-3">
                <TransactionCard
                  transaction={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewProduct={handleViewProduct}
                />
              </Col>
            ))}
          </Row>

          <Pagination
            pagedData={transactions}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      ) : (
        <Alert variant="info">
          <Alert.Heading>No hay transacciones</Alert.Heading>
          <p>No se encontraron transacciones que coincidan con los filtros aplicados.</p>
          <Link to="/transactions/create" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            Crear primera transacción
          </Link>
        </Alert>
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {transactionToDelete && (
            <div>
              <p>¿Estás seguro de que deseas eliminar esta transacción?</p>
              <div className="bg-light p-3 rounded">
                <strong>{transactionToDelete.productName}</strong><br />
                <small className="text-muted">
                  {transactionToDelete.transactionType === 'Purchase' ? 'Compra' : 'Venta'} - 
                  {transactionToDelete.quantity} unidades - 
                  ${transactionToDelete.totalPrice.toFixed(2)}
                </small>
              </div>
              <Alert variant="warning" className="mt-3 mb-0">
                <small>
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  Esta acción revertirá los cambios en el stock del producto.
                </small>
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <i className="fas fa-trash me-2"></i>
            Eliminar Transacción
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};