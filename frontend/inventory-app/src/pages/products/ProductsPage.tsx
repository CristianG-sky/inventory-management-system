import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Product, ProductFilter, PagedResult } from '../../types';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/products/ProductCard';
import { ProductFilters } from '../../components/products/ProductFilters';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Pagination } from '../../components/common/Pagination';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<PagedResult<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<ProductFilter>>({
    page: 1,
    pageSize: 12,
    sortBy: 'name',
    sortDescending: false
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(filters);
      setProducts(data);
    } catch (err) {
      setError('Error al cargar productos');
      console.error('Products loading error:', err);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<ProductFilter>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      pageSize: filters.pageSize || 12,
      sortBy: 'name',
      sortDescending: false
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters({ ...filters, pageSize, page: 1 });
  };

  const handleEdit = (id: string) => {
    navigate(`/products/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    const product = products?.items.find(p => p.id === id);
    if (product) {
      setProductToDelete(product);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await productService.deleteProduct(productToDelete.id);
        toast.success('Producto eliminado exitosamente');
        setShowDeleteModal(false);
        setProductToDelete(null);
        loadProducts();
      } catch (err) {
        toast.error('Error al eliminar producto');
        console.error('Delete error:', err);
      }
    }
  };

  const handleViewHistory = (id: string) => {
    navigate(`/transactions?productId=${id}`);
  };

  if (loading) return <LoadingSpinner message="Cargando productos..." />;

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={loadProducts}>
          Reintentar
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-boxes me-2"></i>
          Productos
        </h1>
        <Link to="/products/create" className="btn btn-success">
          <i className="fas fa-plus me-2"></i>
          Agregar Producto
        </Link>
      </div>

      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {products && products.items.length > 0 ? (
        <>
          <Row>
            {products.items.map(product => (
              <Col key={product.id} md={4} lg={3} className="mb-4">
                <ProductCard
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewHistory={handleViewHistory}
                />
              </Col>
            ))}
          </Row>

          <Pagination
            pagedData={products}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizes={[6, 12, 24, 48]}
          />
        </>
      ) : (
        <Alert variant="info">
          <Alert.Heading>No hay productos</Alert.Heading>
          <p>No se encontraron productos que coincidan con los filtros aplicados.</p>
          <Link to="/products/create" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            Agregar primer producto
          </Link>
        </Alert>
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productToDelete && (
            <p>
              ¿Estás seguro de que deseas eliminar el producto <strong>{productToDelete.name}</strong>?
              Esta acción no se puede deshacer.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <i className="fas fa-trash me-2"></i>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
