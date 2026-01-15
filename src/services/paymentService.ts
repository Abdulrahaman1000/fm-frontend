// ============================================
// Payment & Receipt Management Service - FIXED
// ============================================

// import type { ApiResponse, CreatePaymentData, Payment, PaymentFilters } from '../types';
import type { ApiResponse, CreatePaymentData, Payment, PaymentFilters } from '../types';
import api, { handleApiError } from './api';

// Helper function to normalize MongoDB response
const normalizePayment = (payment: any): Payment => {
  return {
    ...payment,
    id: payment._id || payment.id,
    invoice_id: payment.invoice_id?._id 
      ? {
          ...payment.invoice_id,
          id: payment.invoice_id._id,
          client_id: payment.invoice_id.client_id?._id
            ? { ...payment.invoice_id.client_id, id: payment.invoice_id.client_id._id }
            : payment.invoice_id.client_id,
        }
      : payment.invoice_id,
  };
};

/**
 * Get all payments with optional filters
 */
export const getPayments = async (filters?: PaymentFilters): Promise<Payment[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.invoice_id) {
      params.append('invoice_id', filters.invoice_id);
    }
    
    const response = await api.get<ApiResponse<Payment[]>>('/payments', { params });
    const payments = response.data.data || [];
    return payments.map(normalizePayment);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get single payment by ID
 */
export const getPaymentById = async (id: string): Promise<Payment> => {
  try {
    const response = await api.get<ApiResponse<Payment>>(`/payments/${id}`);
    return normalizePayment(response.data.data!);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Create new payment (record payment - full or partial)
 */
export const createPayment = async (data: CreatePaymentData): Promise<Payment> => {
  try {
    const response = await api.post<ApiResponse<Payment>>('/payments', data);
    return normalizePayment(response.data.data!);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Download receipt PDF
 */
export const downloadReceiptPDF = async (paymentId: string): Promise<Blob> => {
  try {
    const response = await api.get(`/receipts/${paymentId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

const paymentService = {
  getPayments,
  getPaymentById,
  createPayment,
  downloadReceiptPDF,
};

export default paymentService;