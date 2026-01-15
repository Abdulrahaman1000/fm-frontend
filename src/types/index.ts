// ============================================
// Export all types
// ============================================

export * from './auth.types';
export * from './station.types';
export * from './client.types';
export * from './rate.types';
export * from './invoice.types';
export * from './payment.types';
export * from './dashboard.types';

// Common API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  count: number;
  total?: number;
  page?: number;
  pages?: number;
}