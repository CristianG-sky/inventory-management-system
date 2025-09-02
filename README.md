EVALUACIÓN TÉCNICA DE CONOCIMIENTOS FULLSTACK .NET Y REACT O ANGULAR
Objetivo y Alcance de la Solución
El objetivo de esta evaluación es desarrollar una aplicación web utilizando una arquitectura de microservicios, con un backend en .NET Core y un frontend en Angular o React. La aplicación permitirá gestionar productos y transacciones de inventario, almacenando los datos en una base de datos SQL. Los usuarios podrán realizar operaciones de alta, edición, eliminación y consulta de productos agregando o quitando filtros de consulta dinámicamente, así como registrar y monitorear movimientos de inventario de forma dinámica.
Instrucciones iniciales
1. NOsepermiteelusodegeneradoresdecódigoniIAgenerativa.
2. Utilizarunacorrectaestandarizacióndenombresydistribucióndeclasesenel
desarrollo de la prueba.
3. Desarrollarmétodosqueseancoherentesyeficientes.
4. Organizarydistribuirlasfuncionalidadesdemaneralógicayclara.
Herramientas y tecnologías utilizadas
1. ElfrontenddeberáserrealizadoenunproyectoReactoAngular.
2. Elbackenddebeserimplementadoutilizando.NETCoreconunaarquitectura
de microservicios.
3. Serequierequelosmicroserviciossecomuniquendemanerasíncrona
mediante APIs REST o gRPC
4. BasededatosSQL
Desarrollo de la solución:
Una empresa desea implementar una aplicación para la gestión de inventarios. Requerimientos Funcionales:
1. GestióndeProductos:
a. Crear,editar,listaryeliminarproductos.
b. Cadaproductodebetener:ID,nombre,descripción,categoría,imagen,
precio y stock.
2. RegistrodeTransacciones:
a. Registrarcomprasyventasdestock.
b. Losdatosquesedebenalmacenarenunatransacciónson:Identificador
único, fecha, tipo de transacción (compra o venta), identificador de producto, cantidad, precio unitario, precio total y detalle.

3. BúsquedayFiltrado:
a. Mostrarunhistorialdetransaccionesparacadaproductoconnombrey stock del producto, filtrando por fechas o tipo de transacción.
Requerimientos Técnicos:
1. Front-End(Angular):
a. Crearunaaplicaciónconvistasparalagestióndeproductosy transacciones.
b. Configurarrutasbásicasparanavegaciónentrelasvistas.
c. Mostrarmensajesdeéxitooerrorenlasoperacionesrealizadas.
d. Mostrarellistadodeproductosotransaccionesenunatabladinámica
con botones de acción.
e. Incluirpantallaparabúsquedaconfiltrosavanzados.
f. Incluir validaciones si hay campos vacíos o con formato incorrecto en los
formularios de creación y edición.
g. Incluir validaciones complejas (e.g., no permitir vender más stock del
disponible).
2. Back-End (.NET):
a. Implementardosmicroservicios:
i. Gestión de Productos.
ii. Gestión de Transacciones
b. CadamicroserviciodebeexponerAPIsRESTfulycomunicarseentresísi
es necesario.
c. ValidacióndeStock:Siesunaventa,sedebeverificarqueelstock
disponible sea suficiente para realizar la transacción.
d. AjustedeStock:Elstockdeproductosdebeactualizarsedespuésde
cada transacción.
3. BasedeDatos(SQL):
a. Diseñarunesquemaparaalmacenarproductosytransacciones. b. Usar un script SQL para la creación inicial de las tablas.
Criterios de aceptación
• Deben existir pantallas con listado dinámico de productos y transacciones con paginación.
• Deben existir pantallas para insertar y modificar tantos productos como transacciones.
• Deben existir APIs para listar, crear, modificar y eliminar tanto productos como transacciones.

• Incluir mensajes de éxito o error en las operaciones realizadas tanto productos como transacciones.
• Usar tablas dinámicas y con paginación tanto productos como transacciones.
• Poder realizar filtros dinámicos en productos y transacciones.
Entregables:
1. CrearunrepositoriopúblicoenGitHuboGitLabyrealizarelpushdelproyecto, asegurando que todos los artefactos y librerías necesarias estén presentes.
2. Generar Script SQL para la creación de la base de datos y ubicarlo en la raíz del
proyecto.
3. Elproyectodebeserpublicadoenunsolorepositorioyunasolarama.
4. CrearunarchivoREADME.mdconlassiguientessecciones:
• Requisitos: Indicar los requisitos necesarios para poder ejecutar el proyecto en un entorno local.
• Ejecución del backend: Indicar las instrucciones y pasos necesarios para ejecutar el backend en un entorno local.
• Ejecución del frontend: Indicar las instrucciones y pasos necesarios para ejecutar el frontend en un entorno local.
• Evidencias: Incluir capturas de pantalla que demuestren la funcionalidad del sistema:
• Listado dinámico de productos y transacciones con paginación. • Pantalla para la creación de productos.
• Pantalla para la edición de productos.
• Pantalla para la creación de transacciones.
• Pantalla para la edición de transacciones.
• Pantalla de filtros dinámicos.
• Pantalla para la consulta de información de un formulario (extra).
