import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { transactionService } from '../services/transactionService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalTransactions: number;
  totalSales: number;
  totalPurchases: number;
  salesAmount: number;
  purchasesAmount: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener productos
      const products = await productService.getProducts({ pageSize: 1000 });
      
      // Obtener estadísticas de transacciones
      const transactionStats = await transactionService.getTransactionStats();

      // Calcular estadísticas de productos
      const activeProducts = products.items.filter(p => p.isActive).length;
      const lowStockProducts = products.items.filter(p => p.stockStatus === 'Low Stock').length;
      const outOfStockProducts = products.items.filter(p => p.stockStatus === 'Out of Stock').length;

      setStats({
        totalProducts: products.totalItems,
        activeProducts,
        lowStockProducts,
        outOfStockProducts,
        totalTransactions: transactionStats.totalSales + transactionStats.totalPurchases,
        totalSales: transactionStats.totalSales,
        totalPurchases: transactionStats.totalPurchases,
        salesAmount: transactionStats.salesAmount,
        purchasesAmount: transactionStats.purchasesAmount
      });

    } catch (err) {
      setError('Error al cargar datos del dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Cargando dashboard..." />;

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-tachometer-alt me-2"></i>
          Dashboard
        </h1>
      </div>

      {/* Estadísticas de Productos */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center bg-primary text-white">
            <Card.Body>
              <i className="fas fa-boxes fa-2x mb-2"></i>
              <h3>{stats.totalProducts}</h3>
              <p className="mb-0">Total Productos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-success text-white">
            <Card.Body>
              <i className="fas fa-check-circle fa-2x mb-2"></i>
              <h3>{stats.activeProducts}</h3>
              <p className="mb-0">Productos Activos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-warning text-white">
            <Card.Body>
              <i className="fas fa-exclamation-triangle fa-2x mb-2"></i>
              <h3>{stats.lowStockProducts}</h3>
              <p className="mb-0">Stock Bajo</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-danger text-white">
            <Card.Body>
              <i className="fas fa-times-circle fa-2x mb-2"></i>
              <h3>{stats.outOfStockProducts}</h3>
              <p className="mb-0">Sin Stock</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Estadísticas de Transacciones */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center bg-info text-white">
            <Card.Body>
              <i className="fas fa-exchange-alt fa-2x mb-2"></i>
              <h3>{stats.totalTransactions}</h3>
              <p className="mb-0">Total Transacciones</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-secondary text-white">
            <Card.Body>
              <i className="fas fa-shopping-cart fa-2x mb-2"></i>
              <h3>{stats.totalSales}</h3>
              <p className="mb-0">Ventas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-dark text-white">
            <Card.Body>
              <i className="fas fa-truck fa-2x mb-2"></i>
              <h3>{stats.totalPurchases}</h3>
              <p className="mb-0">Compras</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center" style={{backgroundColor: '#6f42c1', color: 'white'}}>
            <Card.Body>
              <i className="fas fa-dollar-sign fa-2x mb-2"></i>
              <h3>${(stats.salesAmount - stats.purchasesAmount).toFixed(2)}</h3>
              <p className="mb-0">Ganancia Neta</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Enlaces rápidos */}
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-box me-2"></i>
                Gestión de Productos
              </h5>
            </Card.Header>
            <Card.Body>
              <p>Administra tu inventario de productos</p>
              <div className="d-grid gap-2">
                <Link to="/products" className="btn btn-primary">
                  <i className="fas fa-list me-2"></i>
                  Ver Productos
                </Link>
                <Link to="/products/create" className="btn btn-success">
                  <i className="fas fa-plus me-2"></i>
                  Agregar Producto
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-exchange-alt me-2"></i>
                Gestión de Transacciones
              </h5>
            </Card.Header>
            <Card.Body>
              <p>Registra compras y ventas</p>
              <div className="d-grid gap-2">
                <Link to="/transactions" className="btn btn-primary">
                  <i className="fas fa-list me-2"></i>
                  Ver Transacciones
                </Link>
                <Link to="/transactions/create" className="btn btn-success">
                  <i className="fas fa-plus me-2"></i>
                  Nueva Transacción
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};