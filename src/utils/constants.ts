// ============================================
// Application Constants
// ============================================

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Radio Station Invoicing System';
export const STATION_NAME = import.meta.env.VITE_STATION_NAME || 'Emirate FM 98.5 FM';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'theme_preference',
} as const;

// Invoice status options
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} as const;

// Invoice type options
export const INVOICE_TYPES = {
  PROFORMA: 'proforma',
  ADVANCE_BILL: 'advance_bill',
} as const;

// Payment method options
export const PAYMENT_METHODS = {
  CASH: 'Cash',
  BANK_TRANSFER: 'Bank Transfer',
  POS: 'POS',
  CHEQUE: 'Cheque',
} as const;

// Status colors for badges
export const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  partial: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CLIENTS: '/clients',
  RATES: '/rates',
  INVOICES: '/invoices',
  INVOICE_NEW: '/invoices/new',
  INVOICE_DETAIL: (id: string) => `/invoices/${id}`,
  PAYMENTS: '/payments',
  SETTINGS: '/settings',
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'dd/MM/yyyy HH:mm',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;