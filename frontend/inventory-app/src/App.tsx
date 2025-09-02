import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importar estilos
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Importar componentes
import { Layout } from './components/common/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProductsPage } from './pages/products/ProductsPage';
import { CreateProductPage } from './pages/products/CreateProductPage';
import { EditProductPage } from './pages/products/EditProductPage';
import { TransactionsPage } from './pages/transactions/TransactionsPage';
import { CreateTransactionPage } from './pages/transactions/CreateTransactionPage';
import { EditTransactionPage } from './pages/transactions/EditTransactionPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Rutas de Productos */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/create" element={<CreateProductPage />} />
          <Route path="/products/edit/:id" element={<EditProductPage />} />
          
          {/* Rutas de Transacciones */}
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/create" element={<CreateTransactionPage />} />
          <Route path="/transactions/edit/:id" element={<EditTransactionPage />} />
          
          {/* Ruta 404 */}
          <Route path="*" element={
            <div className="text-center mt-5">
              <h2>404 - Página no encontrada</h2>
              <p>La página que buscas no existe.</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
