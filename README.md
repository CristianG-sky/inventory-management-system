# Sistema de Gestión de Inventarios

Sistema completo de gestión de inventarios desarrollado con arquitectura de microservicios, utilizando .NET Core para el backend y React con TypeScript para el frontend.

## 📋 Características Principales

- **Gestión de Productos**: CRUD completo con filtros avanzados y paginación
- **Gestión de Transacciones**: Registro de compras y ventas con actualización automática de stock
- **Dashboard Interactivo**: Estadísticas en tiempo real del inventario y transacciones
- **Validaciones de Stock**: Control automático de stock disponible para ventas
- **Filtros Dinámicos**: Búsqueda y filtrado avanzado en productos y transacciones
- **Interfaz Responsiva**: Diseño moderno con Bootstrap y Font Awesome

## 🏗️ Arquitectura

### Backend (Microservicios .NET Core)
- **ProductService**: Gestión de productos y stock
- **TransactionService**: Gestión de transacciones y comunicación con ProductService
- **Base de Datos**: PostgreSQL con Entity Framework Core

### Frontend (React + TypeScript)
- **Dashboard**: Estadísticas y navegación principal
- **Gestión de Productos**: Listado, creación, edición y eliminación
- **Gestión de Transacciones**: Registro de compras/ventas con validaciones
- **Componentes Reutilizables**: Layout, filtros, paginación, formularios

## 🛠️ Tecnologías Utilizadas

### Backend
- .NET Core 9
- Entity Framework Core
- PostgreSQL
- AutoMapper
- Swagger/OpenAPI
- CORS para integración con frontend

### Frontend
- React 18 con TypeScript
- React Router DOM
- Bootstrap 5
- Axios para peticiones HTTP
- React Toastify para notificaciones
- Font Awesome para iconos

## 📦 Requisitos

### Software necesario:
- **.NET 8 SDK** o superior
- **Node.js 18** o superior
- **PostgreSQL 15** o superior
- **npm** o **yarn**

### Herramientas recomendadas:
- **Visual Studio Code**
- **Docker Desktop** (opcional)
- **Postman** para testing de APIs

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd InventoryApp
```

### 2. Configurar la Base de Datos
```bash
# Opción A: PostgreSQL local
createdb InventoryManagement

# Ejecutar el script de inicialización
psql -U postgres -d InventoryManagement -f database/init-database.sql

# Opción B: PostgreSQL con Docker
docker run --name postgres-inventory \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=InventoryManagement \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Configurar el Backend

#### ProductService
```bash
cd backend/ProductService/ProductService.Api

# Restaurar dependencias
dotnet restore

# Compilar proyecto
dotnet build

# Ejecutar servicio
dotnet run
```
El servicio estará disponible en: `https://localhost:7001`

#### TransactionService
```bash
cd backend/TransactionService/TransactionService.Api

# Restaurar dependencias
dotnet restore

# Compilar proyecto
dotnet build

# Ejecutar servicio
dotnet run
```
El servicio estará disponible en: `https://localhost:7002`

### 4. Configurar el Frontend
```bash
cd frontend/inventory-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```
La aplicación estará disponible en: `http://localhost:3000`

## 🎯 Uso del Sistema

### Dashboard
- Visualiza estadísticas generales del inventario
- Muestra totales de productos, transacciones y ganancias
- Acceso rápido a las funcionalidades principales

### Gestión de Productos
- **Listar productos**: Vista con filtros por nombre, categoría, precio y estado
- **Crear producto**: Formulario con validaciones completas
- **Editar producto**: Modificar información y estado del producto
- **Eliminar producto**: Eliminación lógica con confirmación
- **Historial**: Ver todas las transacciones de un producto

### Gestión de Transacciones
- **Listar transacciones**: Vista filtrable por producto, tipo, fechas y montos
- **Crear transacción**: 
  - **Compras**: Incrementan el stock del producto
  - **Ventas**: Decrementan el stock con validación de disponibilidad
- **Editar transacción**: Modifica la transacción y ajusta el stock automáticamente
- **Eliminar transacción**: Revierte los cambios en el stock

## 🔧 Configuración

### Variables de Entorno

#### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=InventoryManagement;Username=postgres;Password=password123"
  },
  "Services": {
    "ProductService": {
      "BaseUrl": "https://localhost:7001"
    }
  },
  "Urls": "http://localhost:5001;https://localhost:7001"
}
```

#### Frontend (constants.ts)
```typescript
export const API_BASE_URL = {
  PRODUCTS: 'https://localhost:7001/api',
  TRANSACTIONS: 'https://localhost:7002/api'
};
```

## 🧪 Testing

### APIs (Backend)
```bash
# Probar ProductService
curl -X GET "https://localhost:7001/api/products" -k

# Probar TransactionService
curl -X GET "https://localhost:7002/api/transactions" -k
```

### Frontend
```bash
# Ejecutar tests
cd frontend/inventory-app
npm test
```

### Endpoints Principales

#### ProductService (Puerto 7001)
- `GET /api/products` - Listar productos con filtros
- `GET /api/products/{id}` - Obtener producto por ID
- `POST /api/products` - Crear producto
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto
- `POST /api/products/{id}/stock` - Actualizar stock
- `GET /api/products/{id}/stock-check` - Verificar disponibilidad

#### TransactionService (Puerto 7002)
- `GET /api/transactions` - Listar transacciones con filtros
- `GET /api/transactions/{id}` - Obtener transacción por ID
- `POST /api/transactions` - Crear transacción
- `PUT /api/transactions/{id}` - Actualizar transacción
- `DELETE /api/transactions/{id}` - Eliminar transacción
- `GET /api/transactions/product/{id}/history` - Historial del producto

## 📊 Base de Datos

### Estructura de Tablas

#### Products
- `id` (UUID, PK)
- `name` (VARCHAR, 255)
- `description` (TEXT)
- `category` (VARCHAR, 100)
- `imageurl` (VARCHAR, 500)
- `price` (DECIMAL, 10,2)
- `stock` (INTEGER)
- `createdat` (TIMESTAMP)
- `updatedat` (TIMESTAMP)
- `isactive` (BOOLEAN)

#### Transactions
- `id` (UUID, PK)
- `productid` (UUID, FK)
- `transactiondate` (TIMESTAMP)
- `transactiontype` (VARCHAR, 20)
- `quantity` (INTEGER)
- `unitprice` (DECIMAL, 10,2)
- `totalprice` (DECIMAL, 10,2)
- `details` (TEXT)
- `createdat` (TIMESTAMP)

## 🚨 Solución de Problemas

### Error: "Connection refused"
- Verificar que PostgreSQL esté ejecutándose
- Comprobar la cadena de conexión en appsettings.json

### Error: "CORS policy"
- Verificar configuración de CORS en el backend
- Asegurarse de que el frontend use las URLs correctas

### Error: "Invalid certificate"
- Ejecutar `dotnet dev-certs https --trust`
- O usar HTTP en lugar de HTTPS para desarrollo

### Error de compilación en React
- Verificar que todas las dependencias estén instaladas
- Ejecutar `npm install` nuevamente

## 📈 Características Técnicas

### Seguridad
- Validaciones tanto en frontend como backend
- Sanitización de datos de entrada
- Control de stock para prevenir sobreventa

### Performance
- Paginación en todas las listas
- Índices optimizados en base de datos
- Lazy loading de componentes

### Mantenibilidad
- Arquitectura de microservicios
- Separación de responsabilidades
- Código bien documentado y tipado

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para nueva funcionalidad (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado como proyecto de evaluación técnica para demostrar conocimientos en:
- Arquitectura de microservicios
- .NET Core Web APIs
- React con TypeScript
- Integración frontend-backend
- Gestión de base de datos relacionales

---

## 🖼️ Capturas de Pantalla

*Nota: Las capturas de pantalla se incluirán en la carpeta `docs/screenshots/`*

- Dashboard principal
- Lista de productos con filtros
- Formulario de creación de productos
- Lista de transacciones
- Formulario de transacciones
- Filtros dinámicos en acción