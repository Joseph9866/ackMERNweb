// API configuration and utilities for MERN stack backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API client with error handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// API response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  errors?: any[];
}

// Room API
export interface Room {
  _id: string;
  name: string;
  description: string;
  capacity: number;
  amenities: string[];
  image_url: string;
  pricing: {
    bed_only: number;
    bb: number;
    half_board: number;
    full_board: number;
  };
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export const roomsApi = {
  getAll: (params?: { check_in?: string; check_out?: string }) => {
    const queryString = params 
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    return apiClient.get<ApiResponse<Room[]>>(`/rooms${queryString}`);
  },

  getById: (id: string) =>
    apiClient.get<ApiResponse<Room>>(`/rooms/${id}`),

  checkAvailability: (id: string, data: { check_in_date: string; check_out_date: string }) =>
    apiClient.post<ApiResponse<{ available: boolean }>>(`/rooms/${id}/check-availability`, data),
};

// Booking API
export interface Booking {
  _id: string;
  room: Room | string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  meal_plan: 'bed_only' | 'bb' | 'half_board' | 'full_board';
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
  deposit_amount: number;
  deposit_paid: boolean;
  balance_amount: number;
  payment_status: 'pending_deposit' | 'deposit_paid' | 'fully_paid';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  meal_plan: 'bed_only' | 'bb' | 'half_board' | 'full_board';
  special_requests?: string;
}

export const bookingsApi = {
  create: (data: CreateBookingData) =>
    apiClient.post<ApiResponse<Booking>>('/bookings', data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`),

  updateStatus: (id: string, status: string) =>
    apiClient.put<ApiResponse<Booking>>(`/bookings/${id}/status`, { status }),
};

// Contact API
export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const contactsApi = {
  create: (data: CreateContactData) =>
    apiClient.post<ApiResponse<Contact>>('/contacts', data),

  getAll: (params?: { status?: string; page?: number; limit?: number }) => {
    const queryString = params 
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    return apiClient.get<ApiResponse<Contact[]>>(`/contacts${queryString}`);
  },
};

// Payment API
export interface Payment {
  _id: string;
  booking: string;
  amount: number;
  payment_type: 'deposit' | 'balance' | 'full';
  payment_method: 'mpesa' | 'cash' | 'cheque' | 'bank_transfer';
  payment_reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paid_at?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentData {
  booking_id: string;
  amount: number;
  payment_type: 'deposit' | 'balance' | 'full';
  payment_method: 'mpesa' | 'cash' | 'cheque' | 'bank_transfer';
  payment_reference?: string;
}

export const paymentsApi = {
  create: (data: CreatePaymentData) =>
    apiClient.post<ApiResponse<Payment>>('/payments', data),

  getByBookingId: (bookingId: string) =>
    apiClient.get<ApiResponse<Payment[]>>(`/payments/booking/${bookingId}`),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Payment>>(`/payments/${id}`),

  updateStatus: (id: string, status: string) =>
    apiClient.put<ApiResponse<Payment>>(`/payments/${id}/status`, { status }),
};

// Admin API
export interface AdminLoginData {
  username: string;
  password: string;
}

export interface AdminUser {
  username: string;
  role: string;
}

export interface DashboardStats {
  statistics: {
    bookings: {
      total: number;
      monthly: number;
      yearly: number;
      pending: number;
      confirmed: number;
    };
    rooms: {
      total: number;
      available: number;
      occupied: number;
    };
    contacts: {
      total: number;
      unread: number;
    };
    revenue: {
      total: number;
      monthly: number;
    };
  };
  recentBookings: Booking[];
}

export const adminApi = {
  login: (data: AdminLoginData) =>
    apiClient.post<ApiResponse<{ token: string; user: AdminUser }>>('/admin/login', data),

  getDashboard: () =>
    apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard'),

  getBookings: (params?: { 
    status?: string; 
    page?: number; 
    limit?: number; 
    search?: string; 
  }) => {
    const queryString = params 
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    return apiClient.get<ApiResponse<Booking[]>>(`/admin/bookings${queryString}`);
  },
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return `KSh ${amount.toLocaleString()}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateNights = (checkIn: string, checkOut: string): number => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
};