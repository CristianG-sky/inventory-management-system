import React from 'react';
import { Pagination as BootstrapPagination, Form, Row, Col } from 'react-bootstrap';
import { PagedResult } from '../../types';

interface PaginationProps {
  pagedData: PagedResult<any>;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizes?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  pagedData,
  onPageChange,
  onPageSizeChange,
  pageSizes = [5, 10, 20, 50]
}) => {
  const { currentPage, totalPages, totalItems, pageSize, hasPreviousPage, hasNextPage } = pagedData;

  const renderPaginationItems = (): React.ReactElement[] => {
    const items: React.ReactElement[] = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Primera página
    if (startPage > 1) {
      items.push(
        <BootstrapPagination.Item key={1} onClick={() => onPageChange(1)}>
          1
        </BootstrapPagination.Item>
      );
      if (startPage > 2) {
        items.push(<BootstrapPagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // Páginas visibles
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <BootstrapPagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </BootstrapPagination.Item>
      );
    }

    // Última página
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<BootstrapPagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <BootstrapPagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </BootstrapPagination.Item>
      );
    }

    return items;
  };

  if (totalPages <= 1) return null;

  return (
    <Row className="align-items-center mt-3">
      <Col md={6}>
        <div className="d-flex align-items-center">
          <span className="text-muted me-2">Mostrar:</span>
          {onPageSizeChange && (
            <Form.Select
              size="sm"
              style={{ width: 'auto' }}
              value={pageSize}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            >
              {pageSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </Form.Select>
          )}
          <span className="text-muted ms-2">
            de {totalItems} elementos
          </span>
        </div>
      </Col>
      <Col md={6}>
        <div className="d-flex justify-content-end">
          <BootstrapPagination className="mb-0">
            <BootstrapPagination.First 
              disabled={!hasPreviousPage} 
              onClick={() => onPageChange(1)} 
            />
            <BootstrapPagination.Prev 
              disabled={!hasPreviousPage} 
              onClick={() => onPageChange(currentPage - 1)} 
            />
            {renderPaginationItems()}
            <BootstrapPagination.Next 
              disabled={!hasNextPage} 
              onClick={() => onPageChange(currentPage + 1)} 
            />
            <BootstrapPagination.Last 
              disabled={!hasNextPage} 
              onClick={() => onPageChange(totalPages)} 
            />
          </BootstrapPagination>
        </div>
      </Col>
    </Row>
  );
};
