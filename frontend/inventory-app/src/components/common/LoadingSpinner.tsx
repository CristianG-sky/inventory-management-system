import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  size?: 'sm';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size, 
  variant = 'primary', 
  message = 'Cargando...' 
}) => {
  return (
    <div className="text-center p-4">
      <Spinner animation="border" variant={variant} size={size} />
      {message && <div className="mt-2">{message}</div>}
    </div>
  );
};
