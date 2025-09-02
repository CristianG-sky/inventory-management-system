import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateTransactionDto } from '../../types';
import { transactionService } from '../../services/transactionService';
import { TransactionForm } from '../../components/transactions/TransactionForm';

export const CreateTransactionPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener productId si viene de la página de productos
  const urlParams = new URLSearchParams(location.search);
  const preselectedProductId = urlParams.get('productId');

  const handleSubmit = async (transactionData: any) => {
    try {
      setLoading(true);
      // Convertir a CreateTransactionDto
      const createData: CreateTransactionDto = {
        productId: transactionData.productId,
        transactionDate: transactionData.transactionDate,
        transactionType: transactionData.transactionType,
        quantity: transactionData.quantity,
        unitPrice: transactionData.unitPrice,
        details: transactionData.details
      };
      await transactionService.createTransaction(createData);
      toast.success('Transacción creada exitosamente');
      navigate('/transactions');
    } catch (error: any) {
      const errorMessage = error.message || 'Error al crear transacción';
      toast.error(errorMessage);
      console.error('Create transaction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  // Si hay un producto preseleccionado, modificar el formulario inicial
  const initialTransaction = preselectedProductId ? {
    productId: preselectedProductId,
    transactionType: 'Sale' as const,
    quantity: 1,
    unitPrice: 0,
    details: '',
    transactionDate: new Date().toISOString().split('T')[0]
  } : undefined;

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
          <i className="fas fa-plus me-2"></i>
          Nueva Transacción
        </h1>
      </div>

      <TransactionForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};
