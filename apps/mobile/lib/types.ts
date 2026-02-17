// API Response/Request Types
export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  tenantId?: string;
  avatar?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  tenantId?: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  category: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
}

// Inventory Types
export interface InventoryLevel {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  reorderLevel: number;
  tenantId: string;
}

export interface StockAdjustment {
  productId: string;
  warehouseId: string;
  quantity: number;
  reason: string;
}

// Warehouse Types
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  capacity: number;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// Shipment Types
export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface Shipment {
  id: string;
  trackingNumber: string;
  orderId: string;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalInventory: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  topProducts: Product[];
}

// Notification Types
export interface Notification {
  id: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}
