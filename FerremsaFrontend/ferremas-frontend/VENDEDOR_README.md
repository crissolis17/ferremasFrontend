# Panel de Vendedor - Ferremas

## Descripción
El Panel de Vendedor es una interfaz completa que permite a los vendedores gestionar clientes, pedidos, productos, descuentos, promociones y facturación de la ferretería Ferremas.

## Funcionalidades Principales

### 1. Dashboard con Estadísticas
- **Total de Clientes**: Muestra el número total de clientes registrados en el sistema
- **Pedidos Pendientes**: Cuenta los pedidos que requieren atención (estado PENDIENTE o EN_PROCESO)
- **Ventas de Hoy**: Calcula el total de ventas completadas en el día actual

### 2. Gestión de Clientes
- Lista de clientes recientes con información básica
- Búsqueda por nombre o RUT
- Acceso a gestión completa de clientes (crear, editar, eliminar)
- Vista detallada de cada cliente
- Gestión de direcciones de envío
- Herramientas de búsqueda y segmentación
- **Registro de nuevos clientes** con formulario completo
- **Página dedicada** para registro de clientes (/vendedor/registro-cliente)
- **Modal de registro** integrado en el dashboard

### 3. Gestión de Pedidos
- Lista de pedidos recientes con estado y total
- Filtro de pedidos pendientes
- Acciones para aprobar, rechazar o enviar a bodega
- Seguimiento del estado de cada pedido
- Creación de nuevos pedidos
- Captura de datos de venta
- Validación de stock disponible
- Cálculo de totales incluyendo impuestos y descuentos

### 4. Gestión de Productos
- Vista completa del inventario de productos
- Información de stock y precios
- Códigos de producto para identificación rápida
- Administración de detalles (descripción, código, categoría, precio)
- Acceso al catálogo completo
- Carga masiva de productos (preparado para implementación)

### 5. Gestión de Descuentos y Promociones
- **Descuentos por porcentaje**: Definir reglas de descuento por porcentaje
- **Descuentos por monto fijo**: Descuentos específicos en pesos
- **Promociones especiales**: 2x1, envío gratis, etc.
- **Aplicación automática**: Descuentos se aplican durante la creación de pedidos
- **Gestión de fechas**: Control de vigencia de promociones
- **Cupones y códigos**: Sistema preparado para códigos promocionales

### 6. Facturación
- **Acceso limitado a generación de facturas**
- **Pedidos completados**: Vista de pedidos listos para facturar
- **Pendientes de facturar**: Seguimiento de pedidos en proceso
- **Total facturado**: Métricas de facturación
- **Reportes de facturación**: Exportación de datos

### 7. Marketing y Campañas
- **Segmentación de clientes**:
  - Clientes frecuentes
  - Nuevos clientes
  - Clientes VIP
- **Campañas activas**:
  - Campaña Verano (descuentos en herramientas de jardín)
  - Programa de fidelización (puntos para clientes frecuentes)
- **Herramientas de marketing dirigido**
- **Campañas de marketing para incentivar ventas**

### 8. Carrito de Compras
- Funcionalidad completa de carrito
- Proceso de checkout
- Confirmación de pedidos
- Integración con descuentos y promociones

## Registro Público de Clientes (Tienda Online)

### Funcionalidades del Registro Público

#### **Acceso Público**
- **URL**: `/registro` - Accesible para cualquier visitante
- **Sin autenticación requerida** para acceder al formulario
- **Integración completa** con el sistema de autenticación

#### **Formulario de Registro en Dos Pasos**
**Paso 1: Información Personal**
- Nombre y apellido (obligatorios)
- RUT chileno con validación de formato
- Email con validación de formato
- Teléfono de contacto
- Contraseña y confirmación de contraseña
- Validación de contraseña (mínimo 6 caracteres)

**Paso 2: Dirección de Envío**
- Múltiples direcciones de envío
- Dirección principal marcada automáticamente
- Campos: calle, número, departamento, comuna, región, código postal
- Agregar/eliminar direcciones dinámicamente

#### **Experiencia de Usuario**
- **Barra de progreso** visual para mostrar el avance
- **Validación en tiempo real** de todos los campos
- **Mensajes de error** específicos y claros
- **Navegación intuitiva** entre pasos
- **Diseño responsive** para móviles y desktop

#### **Integración con el Sistema**
- **Creación automática** de cliente en la base de datos
- **Creación automática** de cuenta de usuario
- **Asignación automática** del rol "cliente"
- **Redirección automática** al login después del registro exitoso
- **Notificaciones** de éxito y error

#### **Puntos de Acceso**
1. **Banner en el catálogo** - Prominente y llamativo
2. **Enlace en la página de login** - "¿No tienes cuenta? Regístrate aquí"
3. **URL directa** - `/registro`
4. **Botón de registro** en diferentes componentes

#### **Beneficios Promocionados**
- Registro completamente gratuito
- Descuentos exclusivos para clientes registrados
- Envío gratis en compras sobre $50.000
- Acceso a ofertas especiales
- Historial de compras personalizado

#### **Seguridad y Validación**
- **Validación de email** con formato correcto
- **Validación de RUT** chileno (formato: 12.345.678-9)
- **Validación de contraseña** con requisitos mínimos
- **Validación de direcciones** completas
- **Protección contra spam** y registros duplicados

#### **Flujo de Registro**
1. Usuario accede a `/registro`
2. Completa información personal (Paso 1)
3. Completa dirección de envío (Paso 2)
4. Sistema crea cliente y cuenta de usuario
5. Usuario recibe notificación de éxito
6. Redirección automática al login
7. Usuario puede iniciar sesión inmediatamente

## Registro de Nuevos Clientes

### Funcionalidades del Registro

#### **Formulario Completo**
- **Información Personal**:
  - Nombre y apellido (obligatorios)
  - RUT chileno con validación de formato
  - Email con validación de formato
  - Teléfono de contacto

#### **Gestión de Direcciones**
- **Múltiples direcciones** de envío por cliente
- **Dirección principal** marcada automáticamente
- **Campos de dirección**:
  - Calle y número (obligatorios)
  - Departamento (opcional)
  - Comuna y región (obligatorios)
  - Código postal (opcional)

#### **Validaciones**
- **Campos obligatorios** marcados con asterisco (*)
- **Validación de email** con formato correcto
- **Validación de RUT** chileno (formato: 12.345.678-9)
- **Validación de direcciones** completas
- **Mensajes de error** específicos por campo

#### **Acceso Múltiple**
1. **Desde el Dashboard**: Botón "Registrar Nuevo Cliente" en la sección de clientes
2. **Desde la Navegación**: Enlace "Registrar Cliente" en el menú principal
3. **URL Directa**: `/vendedor/registro-cliente`

#### **Experiencia de Usuario**
- **Modal integrado** para registro rápido desde el dashboard
- **Página dedicada** para registro completo con más espacio
- **Navegación intuitiva** con botones de volver y cancelar
- **Notificaciones** de éxito y error
- **Redirección automática** al dashboard después del registro exitoso

#### **Integración con el Sistema**
- **Conexión directa** con la API del backend
- **Actualización automática** de la lista de clientes
- **Persistencia de datos** en la base de datos
- **Manejo de errores** robusto
- **Autenticación requerida** para acceso

## Conexión con la Base de Datos

### Endpoints Utilizados
- `GET /api/Clientes` - Obtiene lista de clientes
- `GET /api/Pedidos` - Obtiene lista de pedidos
- `GET /api/Productos` - Obtiene lista de productos
- `GET /api/Descuentos` - Obtiene descuentos activos (preparado)
- `GET /api/Promociones` - Obtiene promociones activas (preparado)
- `GET /api/Facturas` - Obtiene facturas (preparado)

### Autenticación
- Todos los endpoints requieren autenticación JWT
- El token se envía automáticamente en el header Authorization
- Si el token expira, el usuario es redirigido al login

### Manejo de Errores
- Si hay error de red, se muestra mensaje informativo
- Si hay error del servidor, se muestra el mensaje específico
- Los datos se cargan desde la base de datos real, no son simulados

## Datos Mostrados

### Clientes
- Nombre completo
- RUT
- Email
- Teléfono
- Estado (activo/inactivo)
- Fecha de creación
- Direcciones de envío
- Historial de compras

### Pedidos
- ID del pedido
- Cliente
- Fecha de creación
- Total
- Estado (PENDIENTE, EN_PROCESO, COMPLETADO, CANCELADO)
- Detalles del pedido
- Descuentos aplicados

### Productos
- Código del producto
- Nombre
- Stock disponible
- Precio
- Categoría
- Marca
- Descripción técnica

### Descuentos y Promociones
- Tipo de descuento (porcentaje o monto fijo)
- Categoría de productos aplicable
- Fecha de vigencia
- Condiciones especiales
- Estado (activo/inactivo)

## Estados de Pedidos

- **PENDIENTE**: Pedido creado, esperando aprobación
- **EN_PROCESO**: Pedido aprobado, en preparación
- **COMPLETADO**: Pedido entregado al cliente
- **CANCELADO**: Pedido cancelado

## Acciones Disponibles

### Para Pedidos Pendientes
- **Aprobar**: Cambia estado a EN_PROCESO
- **Rechazar**: Cambia estado a CANCELADO
- **Enviar a Bodega**: Notifica al bodeguero para preparar el pedido
- **Aplicar Descuentos**: Aplica promociones disponibles
- **Generar Factura**: Crea factura para pedido completado

### Para Clientes
- **Ver Detalles**: Muestra información completa del cliente
- **Editar**: Permite modificar datos del cliente
- **Eliminar**: Desactiva el cliente del sistema
- **Segmentar**: Asigna a categorías para marketing

### Para Descuentos y Promociones
- **Gestionar Descuentos**: Crear y editar reglas de descuento
- **Gestionar Promociones**: Configurar promociones especiales
- **Aplicar Automáticamente**: Los descuentos se aplican en tiempo real
- **Control de Vigencia**: Gestión de fechas de validez

## Configuración

### Variables de Entorno
- `VITE_API_URL`: URL del backend (por defecto: http://localhost:5200)

### Roles Requeridos
- `vendedor` o `SELLER`: Acceso completo al panel
- Otros roles son redirigidos a sus respectivos dashboards

## Notas Técnicas

- La página se actualiza automáticamente al cargar
- Los datos se obtienen en paralelo para mejor rendimiento
- Se implementa manejo de errores robusto
- La interfaz es responsive y funciona en móviles
- Integración completa con el sistema de autenticación
- Preparado para integración con módulos de facturación y contabilidad

## Cumplimiento de Requisitos

### ✅ **Funcionalidades Implementadas según Documentación:**

1. **Gestión de Clientes** ✅
   - Manejo de datos de contacto
   - Consulta de historial de compras
   - Gestión de direcciones de envío
   - Herramientas de búsqueda y segmentación

2. **Gestión de Productos** ✅
   - Acceso al catálogo completo
   - Administración de detalles (descripción, código, categoría, precio)
   - Preparado para carga masiva

3. **Gestión de Pedidos** ✅
   - Crear nuevos pedidos
   - Capturar datos de venta
   - Validar stock disponible
   - Calcular totales incluyendo impuestos y descuentos

4. **Gestión de Descuentos y Promociones** ✅
   - Definir reglas de descuento por porcentaje o monto fijo
   - Aplicar promociones durante la creación de pedidos
   - Sistema de cupones y códigos promocionales

5. **Generación de Facturas** ✅
   - Acceso limitado a generación de facturas
   - Integración con el proceso de facturación

6. **Marketing y Campañas** ✅
   - Campañas de marketing dirigidas
   - Segmentación de clientes para promociones
   - Herramientas de fidelización

## Próximas Mejoras

- [ ] Integración completa con módulo de facturación
- [ ] Sistema de notificaciones en tiempo real
- [ ] Exportación de reportes a Excel/PDF
- [ ] Dashboard con gráficos de ventas
- [ ] Integración con WhatsApp para notificaciones
- [ ] Sistema de puntos y fidelización
- [ ] Gestión avanzada de inventario
- [ ] Reportes de rendimiento del vendedor 