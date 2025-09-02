# EVALUACIÓN TÉCNICA DE CONOCIMIENTOS FULLSTACK .NET Y REACT O ANGULAR

## Objetivo y Alcance de la Solución

El objetivo de esta evaluación es desarrollar una aplicación web utilizando una arquitectura de microservicios, con un backend en .NET Core y un frontend en Angular o React. La aplicación permitirá gestionar productos y transacciones de inventario, almacenando los datos en una base de datos SQL. Los usuarios podrán realizar operaciones de alta, edición, eliminación y consulta de productos agregando o quitando filtros de consulta dinámicamente, así como registrar y monitorear movimientos de inventario de forma dinámica.

## Instrucciones Iniciales

1. **NO se permite el uso de generadores de código ni IA generativa.**
2. Utilizar una correcta estandarización de nombres y distribución de clases en el desarrollo de la prueba.
3. Desarrollar métodos que sean coherentes y eficientes.
4. Organizar y distribuir las funcionalidades de manera lógica y clara.

## Herramientas y Tecnologías Utilizadas

1. El frontend deberá ser realizado en un proyecto React o Angular.
2. El backend debe ser implementado utilizando .NET Core con una arquitectura de microservicios.
3. Se requiere que los microservicios se comuniquen de manera síncrona mediante APIs REST o gRPC.
4. Base de datos SQL.

## Desarrollo de la Solución

Una empresa desea implementar una aplicación para la gestión de inventarios.

### Requerimientos Funcionales

#### 1. Gestión de Productos
- **a.** Crear, editar, listar y eliminar productos.
- **b.** Cada producto debe tener: ID, nombre, descripción, categoría, imagen, precio y stock.

#### 2. Registro de Transacciones
- **a.** Registrar compras y ventas de stock.
- **b.** Los datos que se deben almacenar en una transacción son:
  - Identificador único
  - Fecha
  - Tipo de transacción (compra o venta)
  - Identificador de producto
  - Cantidad
  - Precio unitario
  - Precio total
  - Detalle

#### 3. Búsqueda y Filtrado
- **a.** Mostrar un historial de transacciones para cada producto con nombre y stock del producto, filtrando por fechas o tipo de transacción.

### Requerimientos Técnicos

#### 1. Front-End (Angular/React)
- **a.** Crear una aplicación con vistas para la gestión de productos y transacciones.
- **b.** Configurar rutas básicas para navegación entre las vistas.
- **c.** Mostrar mensajes de éxito o error en las operaciones realizadas.
- **d.** Mostrar el listado de productos o transacciones en una tabla dinámica con botones de acción.
- **e.** Incluir pantalla para búsqueda con filtros avanzados.
- **f.** Incluir validaciones si hay campos vacíos o con formato incorrecto en los formularios de creación y edición.
- **g.** Incluir validaciones complejas (e.g., no permitir vender más stock del disponible).

#### 2. Back-End (.NET)
- **a.** Implementar dos microservicios:
  - i. Gestión de Productos
  - ii. Gestión de Transacciones
- **b.** Cada microservicio debe exponer APIs RESTful y comunicarse entre sí si es necesario.
- **c.** **Validación de Stock:** Si es una venta, se debe verificar que el stock disponible sea suficiente para realizar la transacción.
- **d.** **Ajuste de Stock:** El stock de productos debe actualizarse después de cada transacción.

#### 3. Base de Datos (SQL)
- **a.** Diseñar un esquema para almacenar productos y transacciones.
- **b.** Usar un script SQL para la creación inicial de las tablas.

## Criterios de Aceptación

- Deben existir pantallas con listado dinámico de productos y transacciones con paginación.
- Deben existir pantallas para insertar y modificar tanto productos como transacciones.
- Deben existir APIs para listar, crear, modificar y eliminar tanto productos como transacciones.
- Incluir mensajes de éxito o error en las operaciones realizadas tanto productos como transacciones.
- Usar tablas dinámicas y con paginación tanto productos como transacciones.
- Poder realizar filtros dinámicos en productos y transacciones.

## Entregables

1. **Repositorio:** Crear un repositorio público en GitHub o GitLab y realizar el push del proyecto, asegurando que todos los artefactos y librerías necesarias estén presentes.

2. **Script SQL:** Generar Script SQL para la creación de la base de datos y ubicarlo en la raíz del proyecto.

3. **Estructura del proyecto:** El proyecto debe ser publicado en un solo repositorio y una sola rama.

4. **Archivo README.md** con las siguientes secciones:
   - **Requisitos:** Indicar los requisitos necesarios para poder ejecutar el proyecto en un entorno local.
   - **Ejecución del backend:** Indicar las instrucciones y pasos necesarios para ejecutar el backend en un entorno local.
   - **Ejecución del frontend:** Indicar las instrucciones y pasos necesarios para ejecutar el frontend en un entorno local.
   - **Evidencias:** Incluir capturas de pantalla que demuestren la funcionalidad del sistema:
     - Listado dinámico de productos y transacciones con paginación
     - Pantalla para la creación de productos
     - Pantalla para la edición de productos
     - Pantalla para la creación de transacciones
     - Pantalla para la edición de transacciones
     - Pantalla de filtros dinámicos
     - Pantalla para la consulta de información de un formulario (extra)