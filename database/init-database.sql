-- =============================================
-- Sistema de Gestión de Inventarios
-- =============================================

-- Crear la base de datos
CREATE DATABASE InventoryManagement;

-- Usar la base de datos
\c InventoryManagement;

-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Tabla: Products
-- Descripción: Almacena información de productos
-- =============================================
CREATE TABLE Products (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Category VARCHAR(100) NOT NULL,
    ImageUrl VARCHAR(500),
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    Stock INTEGER NOT NULL DEFAULT 0 CHECK (Stock >= 0),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE
);

-- =============================================
-- Tabla: Transactions
-- Descripción: Almacena transacciones de inventario
-- =============================================
CREATE TABLE Transactions (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ProductId UUID NOT NULL,
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TransactionType VARCHAR(20) NOT NULL CHECK (TransactionType IN ('Purchase', 'Sale')),
    Quantity INTEGER NOT NULL CHECK (Quantity > 0),
    UnitPrice DECIMAL(10,2) NOT NULL CHECK (UnitPrice >= 0),
    TotalPrice DECIMAL(10,2) NOT NULL CHECK (TotalPrice >= 0),
    Details TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint para asegurar que TotalPrice = Quantity * UnitPrice
    CONSTRAINT chk_total_price CHECK (TotalPrice = Quantity * UnitPrice),
    
    -- Foreign Key
    CONSTRAINT fk_transaction_product 
        FOREIGN KEY (ProductId) REFERENCES Products(Id) 
        ON DELETE CASCADE
);

-- =============================================
-- Índices para optimizar consultas
-- =============================================

-- Índices en Products
CREATE INDEX idx_products_name ON Products(Name);
CREATE INDEX idx_products_category ON Products(Category);
CREATE INDEX idx_products_active ON Products(IsActive);

-- Índices en Transactions
CREATE INDEX idx_transactions_product_id ON Transactions(ProductId);
CREATE INDEX idx_transactions_date ON Transactions(TransactionDate);
CREATE INDEX idx_transactions_type ON Transactions(TransactionType);
CREATE INDEX idx_transactions_product_date ON Transactions(ProductId, TransactionDate);

-- =============================================
-- Función para actualizar UpdatedAt automáticamente
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.UpdatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para Products
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON Products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Datos de prueba
-- =============================================

-- Insertar categorías de productos de ejemplo
INSERT INTO Products (Name, Description, Category, ImageUrl, Price, Stock) VALUES
('Laptop Dell XPS 13', 'Laptop ultrabook con procesador Intel i7', 'Electronics', 'https://example.com/laptop.jpg', 1299.99, 15),
('iPhone 14 Pro', 'Smartphone Apple con cámara profesional', 'Electronics', 'https://example.com/iphone.jpg', 999.99, 25),
('Mesa de Oficina', 'Mesa ergonómica para oficina en casa', 'Furniture', 'https://example.com/desk.jpg', 299.99, 8),
('Silla Ejecutiva', 'Silla ergonómica con soporte lumbar', 'Furniture', 'https://example.com/chair.jpg', 199.99, 12),
('Cafetera Espresso', 'Máquina de café espresso automática', 'Appliances', 'https://example.com/coffee.jpg', 299.99, 6),
('Monitor 4K 27"', 'Monitor profesional para diseño gráfico', 'Electronics', 'https://example.com/monitor.jpg', 449.99, 10),
('Teclado Mecánico', 'Teclado gaming con switches Cherry MX', 'Electronics', 'https://example.com/keyboard.jpg', 129.99, 20),
('Mouse Inalámbrico', 'Mouse ergonómico con sensor óptico', 'Electronics', 'https://example.com/mouse.jpg', 59.99, 30);

-- Insertar algunas transacciones de ejemplo
INSERT INTO Transactions (ProductId, TransactionType, Quantity, UnitPrice, TotalPrice, Details)
SELECT 
    p.Id,
    'Purchase',
    10,
    p.Price * 0.8, -- Precio de compra (20% menos que precio de venta)
    (p.Price * 0.8) * 10,
    'Compra inicial de inventario'
FROM Products p
WHERE p.Name IN ('Laptop Dell XPS 13', 'iPhone 14 Pro', 'Mesa de Oficina');

INSERT INTO Transactions (ProductId, TransactionType, Quantity, UnitPrice, TotalPrice, Details)
SELECT 
    p.Id,
    'Sale',
    2,
    p.Price,
    p.Price * 2,
    'Venta a cliente corporativo'
FROM Products p
WHERE p.Name = 'Laptop Dell XPS 13';

INSERT INTO Transactions (ProductId, TransactionType, Quantity, UnitPrice, TotalPrice, Details)
SELECT 
    p.Id,
    'Sale',
    1,
    p.Price,
    p.Price,
    'Venta online'
FROM Products p
WHERE p.Name = 'iPhone 14 Pro';

-- =============================================
-- Vistas útiles para reportes
-- =============================================

-- Vista: Resumen de productos con stock
CREATE VIEW ProductsWithStock AS
SELECT 
    p.Id,
    p.Name,
    p.Description,
    p.Category,
    p.Price,
    p.Stock,
    CASE 
        WHEN p.Stock = 0 THEN 'Out of Stock'
        WHEN p.Stock < 5 THEN 'Low Stock'
        ELSE 'In Stock'
    END as StockStatus
FROM Products p
WHERE p.IsActive = true;

-- Vista: Transacciones con información del producto
CREATE VIEW TransactionDetails AS
SELECT 
    t.Id,
    t.TransactionDate,
    t.TransactionType,
    t.Quantity,
    t.UnitPrice,
    t.TotalPrice,
    t.Details,
    p.Name as ProductName,
    p.Category as ProductCategory
FROM Transactions t
INNER JOIN Products p ON t.ProductId = p.Id;

-- =============================================
-- Procedimientos almacenados útiles
-- =============================================

-- Función para obtener el historial de un producto
CREATE OR REPLACE FUNCTION GetProductHistory(product_id UUID)
RETURNS TABLE(
    transaction_id UUID,
    transaction_date TIMESTAMP,
    transaction_type VARCHAR,
    quantity INTEGER,
    unit_price DECIMAL,
    total_price DECIMAL,
    details TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.Id,
        t.TransactionDate,
        t.TransactionType,
        t.Quantity,
        t.UnitPrice,
        t.TotalPrice,
        t.Details
    FROM Transactions t
    WHERE t.ProductId = product_id
    ORDER BY t.TransactionDate DESC;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Mensaje de finalización
-- =============================================
SELECT 'Base de datos creada exitosamente' as Status;