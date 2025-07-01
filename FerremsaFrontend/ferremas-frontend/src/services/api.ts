// src/services/api.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, API_HEADERS, API_CONFIG, STORAGE_KEYS } from '../constants/api';
import type { ApiError } from '../types/api';
import { authService } from './auth';
import type { Producto, Venta, Pedido } from '../types/api';

// Clase principal para manejar todas las comunicaciones con tu backend de Ferremas
class ApiService {
  private client: AxiosInstance;

  constructor() {
    // Crear instancia de Axios configurada específicamente para tu API
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_HEADERS,
    });

    // Log de inicialización para debugging
    console.log('🚀 ApiService inicializado con URL:', API_BASE_URL);

    // Configurar interceptores para manejo automático de tokens y errores
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Interceptor de REQUEST: Agrega automáticamente el token JWT a cada petición
    this.client.interceptors.request.use(
      (config) => {
        const token = authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log para desarrollo (útil para debugging)
        if (import.meta.env.DEV) {
          console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data
          });
        }
        
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor de RESPONSE: Maneja automáticamente errores y respuestas
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log para desarrollo
        if (import.meta.env.DEV) {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data
          });
        }
        
        return response;
      },
      async (error) => {
        // Manejo centralizado de errores
        if (error.response?.status === 401) {
          // Token inválido o expirado - limpiar sesión y redirigir al login
          console.log('🔒 Token expirado o inválido, limpiando sesión');
          authService.logout();
          
          // Solo redirigir al login si no estamos ya en la página de login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/';
          }
        }

        console.error('❌ API Error:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: error.config?.url,
          details: error.response?.data
        });

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): ApiError {
    // Función para normalizar errores y hacerlos más fáciles de manejar en los componentes
    if (error.response) {
      // Error del servidor con respuesta
      return {
        message: error.response.data?.message || 'Error del servidor',
        status: error.response.status,
        details: error.response.data
      };
    } else if (error.request) {
      // Error de red (sin respuesta del servidor)
      return {
        message: 'Error de conexión. Verifica tu conexión a internet y que el servidor esté ejecutándose.',
        status: 0
      };
    } else {
      // Otro tipo de error
      return {
        message: error.message || 'Error desconocido',
        status: -1
      };
    }
  }

  // Métodos públicos para realizar peticiones HTTP
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Método para obtener la instancia de Axios si necesitas funcionalidades específicas
  getClient(): AxiosInstance {
    return this.client;
  }

  // Método para actualizar el token manualmente si es necesario
  setAuthToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Token de autenticación actualizado');
  }

  // Método para limpiar el token (logout)
  clearAuthToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    delete this.client.defaults.headers.common['Authorization'];
    console.log('🗑️ Datos de autenticación limpiados');
  }

  // Método para verificar el estado de la conexión con el backend
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      console.log('✅ Backend está funcionando correctamente');
      return true;
    } catch (error) {
      console.error('❌ Backend no está disponible:', error);
      return false;
    }
  }

  // Método para obtener información del servidor
  async getServerInfo(): Promise<any> {
    try {
      return await this.get('/');
    } catch (error) {
      console.error('❌ No se pudo obtener información del servidor:', error);
      throw error;
    }
  }
}

// Exportar una instancia única del servicio (patrón Singleton)
// Esto asegura que todos los componentes usen la misma configuración
export const apiService = new ApiService();

// También exportar la clase por si necesitas crear instancias específicas
export { ApiService };
export type { ApiError };

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Cliente axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Productos
  async getProductos() {
    const response = await apiClient.get<Producto[]>('/productos');
    return response.data;
  },

  async getProducto(id: number) {
    const response = await apiClient.get<Producto>(`/productos/${id}`);
    return response.data;
  },

  async createProducto(data: Partial<Producto>) {
    const response = await apiClient.post<Producto>('/productos', data);
    return response.data;
  },

  async updateProducto(id: number, data: Partial<Producto>) {
    const response = await apiClient.put<Producto>(`/productos/${id}`, data);
    return response.data;
  },

  async deleteProducto(id: number) {
    const response = await apiClient.delete(`/productos/${id}`);
    return response.data;
  },

  // Ventas
  async getVentas() {
    const response = await apiClient.get<Venta[]>('/ventas');
    return response.data;
  },

  async getVenta(id: number) {
    const response = await apiClient.get<Venta>(`/ventas/${id}`);
    return response.data;
  },

  async createVenta(data: Partial<Venta>) {
    const response = await apiClient.post<Venta>('/ventas', data);
    return response.data;
  },

  async updateVenta(id: number, data: Partial<Venta>) {
    const response = await apiClient.put<Venta>(`/ventas/${id}`, data);
    return response.data;
  },

  // Pedidos
  async getPedidos() {
    const response = await apiClient.get<Pedido[]>('/pedidos');
    return response.data;
  },

  async getPedido(id: number) {
    const response = await apiClient.get<Pedido>(`/pedidos/${id}`);
    return response.data;
  },

  async createPedido(data: Partial<Pedido>) {
    const response = await apiClient.post<Pedido>('/pedidos', data);
    return response.data;
  },

  async updatePedido(id: number, data: Partial<Pedido>) {
    const response = await apiClient.put<Pedido>(`/pedidos/${id}`, data);
    return response.data;
  },

  // Reportes
  async getReporteVentas(periodo: string) {
    const response = await apiClient.get(`/reportes/ventas?periodo=${periodo}`);
    return response.data;
  },

  async getReporteInventario() {
    const response = await apiClient.get('/reportes/inventario');
    return response.data;
  },
};