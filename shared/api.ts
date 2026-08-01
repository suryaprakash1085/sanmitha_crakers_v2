/**
 * Shared code between client and server
 * Useful to share types between client and server
 */

export interface DemoResponse {
  message: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
}

// Dashboard types
export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  revenueThisMonth: number;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderType: "laundry" | "dry-clean" | "mixed";
  status: "pending" | "processing" | "ready" | "delivered";
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  completionDate?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description?: string;
  category: "washing" | "ironing" | "dry-clean" | "other";
  price: number;
  enabled: boolean;
}

// Customer types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

// Staff types
export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "manager" | "staff" | "operator";
  permissions: string[];
  joinDate: string;
  active: boolean;
}

// Report types
export interface DailyReport {
  date: string;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  expenses?: number;
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
}

// Settings types
export interface ShopSettings {
  shopName: string;
  logo?: string;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  phone: string;
  email: string;
  address: string;
}
