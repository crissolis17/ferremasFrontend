// src/types/api.ts
// Tipos que coinciden exactamente con tu backend de Ferremas

// ========================================
// TIPOS DE AUTENTICACIÓN
// ========================================

export interface LoginDTO {
email: string;
password: string;
}

export interface UsuarioCreateDTO {
nombre: string;
email: string;
password: string;
rol?: string;
telefono?: string;
}

export interface ResetPasswordDTO {
email: string;
token?: string;
newPassword?: string;
}

export interface UsuarioResponseDTO {
id: number;
nombre: string;
email: string;
rol: RolUsuario;
activo: boolean;
fechaRegistro?: Date;
}

export interface AuthResponse {
success: boolean;
message?: string;
token?: string;
usuario?: UsuarioResponseDTO;
}

// ========================================
// TIPOS DE PRODUCTOS
// ========================================

export interface ProductoResponseDTO {
id: number;
codigo: string;
nombre: string;
descripcion: string;
precio: number;
stock: number;
categoriaId: number;
categoriaNombre?: string;
marcaId: number;
marcaNombre?: string;
imagenUrl?: string;
especificaciones?: string;
fechaCreacion: Date;
fechaModificacion?: Date;
activo: boolean;
}

export interface ProductoCreateDTO {
codigo: string;
nombre: string;
descripcion: string;
precio: number;
stock: number;
categoriaId: number;
marcaId: number;
imagenUrl?: string;
especificaciones?: string;
}

// ========================================
// TIPOS DE PEDIDOS
// ========================================

export interface PedidoResponseDTO {
id: number;
usuarioId: number;
usuarioNombre?: string;
fechaPedido: Date;
total: number;
estado: string;
observaciones?: string;
direccionEntrega?: string;
fechaCreacion: Date;
fechaModificacion?: Date;
activo: boolean;
detalles: DetallePedidoResponseDTO[];
}

export interface DetallePedidoResponseDTO {
id: number;
productoId: number;
productoNombre?: string;
cantidad: number;
precioUnitario: number;
subtotal: number;
observaciones?: string;
}

// ========================================
// TIPOS GENERALES DE API
// ========================================

export interface ApiResponse<T> {
success: boolean;
data: T;
message?: string;
errors?: string[];
timestamp?: Date;
}

export interface PaginatedResponse<T> {
success: boolean;
data: T[];
pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
};
message?: string;
}

// ========================================
// TIPOS DE ERROR
// ========================================

export interface ApiError {
message: string;
status?: number;
details?: any;
}

// ========================================
// TIPOS DE COMPARACIÓN
// ========================================

export interface ComparacionRequest {
producto: string;
marca?: string;
precioFerremas: number;
}

export interface ComparacionResultado {
tienda: string;
nombreProducto: string;
precio: number;
enlace: string;
imagen?: string;
vendedor?: string;
reputacionVendedor?: number;
diferenciaPrecio: number;
porcentajeDiferencia: number;
}

// ========================================
// TIPOS DE USUARIOS
// ========================================

export enum RolUsuario {
  ADMIN = 'ADMIN',
  VENDEDOR = 'VENDEDOR',
  BODEGUERO = 'BODEGUERO',
  SUPERVISOR = 'SUPERVISOR'
}

// ========================================
// TIPOS DE PRODUCTOS
// ========================================

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  ubicacion: string;
  proveedor: string;
  estado: EstadoProducto;
}

export enum EstadoProducto {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  AGOTADO = 'AGOTADO'
}

// ========================================
// TIPOS DE VENTAS
// ========================================

export interface Venta {
  id: number;
  fecha: string;
  vendedorId: number;
  clienteId: number;
  total: number;
  estado: EstadoVenta;
  items: VentaItem[];
}

export interface VentaItem {
  id: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export enum EstadoVenta {
  PENDIENTE = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA'
}

// ========================================
// TIPOS DE PEDIDOS
// ========================================

export interface Pedido {
  id: number;
  fecha: string;
  bodegueroId: number;
  proveedorId: number;
  total: number;
  estado: EstadoPedido;
  items: PedidoItem[];
}

export interface PedidoItem {
  id: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  RECIBIDO = 'RECIBIDO',
  CANCELADO = 'CANCELADO'
}

// ========================================
// TIPOS DE REPORTES
// ========================================

export interface ReporteVentas {
  periodo: string;
  totalVentas: number;
  cantidadVentas: number;
  productosVendidos: ProductoVendido[];
}

export interface ProductoVendido {
  productoId: number;
  nombre: string;
  cantidad: number;
  total: number;
}

export interface ReporteInventario {
  totalProductos: number;
  valorTotal: number;
  productosAgotados: number;
  productosBajoStock: Producto[];
}

export interface FacturaResponseDTO {
  id: number;
  pedidoId: number;
  fechaEmision: string;
  montoTotal: number;
  anulada: boolean;
}