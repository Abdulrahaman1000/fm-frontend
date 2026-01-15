// ============================================
// Invoice/Proforma Management Service - FIXED
// ============================================

import type { ApiResponse, CreateInvoiceData, Invoice, InvoiceFilters, UpdateInvoiceData } from '../types';
import api, { handleApiError } from './api';
// import { 
//   Invoice, 
//   CreateInvoiceData, 
//   UpdateInvoiceData, 
//   InvoiceFilters,
//   ApiResponse 
// } from '@/types';

// Helper function to normalize MongoDB response
const normalizeInvoice = (invoice: any): Invoice => {
  return {
    ...invoice,
    id: invoice._id || invoice.id,
    client_id: invoice.client_id?._id 
      ? { ...invoice.client_id, id: invoice.client_id._id }
      : invoice.client_id,
  };
};

/**
 * Get all invoices with optional filters
 */
export const getInvoices = async (filters?: InvoiceFilters): Promise<Invoice[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.client_id) {
      params.append('client_id', filters.client_id);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }
    
    const response = await api.get<ApiResponse<Invoice[]>>('/invoices', { params });
    const invoices = response.data.data || [];
    return invoices.map(normalizeInvoice);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get single invoice by ID
 */
export const getInvoiceById = async (id: string): Promise<Invoice> => {
  try {
    const response = await api.get<ApiResponse<Invoice>>(`/invoices/${id}`);
    return normalizeInvoice(response.data.data!);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Create new invoice
 */
export const createInvoice = async (data: CreateInvoiceData): Promise<Invoice> => {
  try {
    const response = await api.post<ApiResponse<Invoice>>('/invoices', data);
    return normalizeInvoice(response.data.data!);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update invoice
 */
export const updateInvoice = async (id: string, data: UpdateInvoiceData): Promise<Invoice> => {
  try {
    const response = await api.put<ApiResponse<Invoice>>(`/invoices/${id}`, data);
    return normalizeInvoice(response.data.data!);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Delete invoice
 */
export const deleteInvoice = async (id: string): Promise<void> => {
  try {
    await api.delete(`/invoices/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Download invoice PDF
 */
export const downloadInvoicePDF = async (id: string): Promise<Blob> => {
  try {
    const response = await api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

const invoiceService = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  downloadInvoicePDF,
};

export default invoiceService;