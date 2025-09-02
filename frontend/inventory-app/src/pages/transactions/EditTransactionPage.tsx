import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Transaction, UpdateTransactionDto } from '../../types';
import { transactionService } from '../../services/transactionService';
import { TransactionForm } from '../../components/transactions/TransactionForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const EditTransactionPage: React.FC = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadTransaction(id);
    } else {
      setError('ID de transacción no válido');
      setLoading(false);
    }
  }, [id]);

  const loadTransaction = async (transactionId: string) => {
    try {
      setLoading(true);
      setError(null);
      const transactionData = await transactionService.getTransactionById(transactionId);
      setTransaction(transactionData);
    } catch (error: any) {
      setError(error.message || 'Error al cargar transacción');
      console.error('Load transaction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (transactionData: any) => {
  if (!id) return;
  
  try {
    setSaving(true);
    // Convertir a UpdateTransactionDto
    const updateData: UpdateTransactionDto = {
      transactionDate: transactionData.transactionDate,
      transactionType: transactionData.transactionType,
      quantity: transactionData.quantity,
      unitPrice: transactionData.unitPrice,
      details: transactionData.details
    };
    await transactionService.updateTransaction(id, updateData);
    toast.success('Transacción actualizada exitosamente');
    navigate('/transactions');
  } catch (error: any) {
    const errorMessage = error.message || 'Error al actualizar transacción';
    toast.error(errorMessage);
    console.error('Update transaction error:', error);
  } finally {
    setSaving(false);
  }
};


  const handleCancel = () => {
    navigate('/transactions');
  };

  if (loading) {
    return <LoadingSpinner message="Cargando transacción..." />;
  }

  if (error) {
    return (
      <div>
        <div className="d-flex align-items-center mb-4">
          <button 
            className="btn btn-link p-0 me-3" 
            onClick={() => navigate('/transactions')}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>Editar Transacción</h1>
        </div>
        
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={() => id && loadTransaction(id)}>
            Reintentar
          </button>
        </Alert>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div>
        <div className="d-flex align-items-center mb-4">
          <button 
            className="btn btn-link p-0 me-3" 
            onClick={() => navigate('/transactions')}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>Editar Transacción</h1>
        </div>
        
        <Alert variant="warning">
          <Alert.Heading>Transacción no encontrada</Alert.Heading>
          <p>La transacción que intentas editar no existe o ha sido eliminada.</p>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-link p-0 me-3" 
          onClick={() => navigate('/transactions')}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>
          <i className="fas fa-edit me-2"></i>
          Editar Transacción: {transaction.productName}
        </h1>
      </div>

      <Alert variant="info">
        <i className="fas fa-info-circle me-2"></i>
        <strong>Nota:</strong> Al editar una transacción, se revertirán los cambios de stock originales 
        y se aplicarán los nuevos valores.
      </Alert>

      <TransactionForm
        mode="edit"
        transaction={transaction}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={saving}
      />
    </div>
  );
};