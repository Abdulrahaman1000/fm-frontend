// ============================================
// Rate Card Management Service - FIXED
// ============================================

import type { ApiResponse, CreateRateData, Rate, RateFilters, UpdateRateData } from '../types';
import api, { handleApiError } from './api';


// Helper function to normalize MongoDB response
const normalizeRate = (rate: any): Rate => {
  return {
    ...rate,
    id: rate._id || rate.id,
  };
};

/**
 * Get all rates with optional filters
 */
export const getRates = async (filters?: RateFilters): Promise<Rate[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.category) {
      params.append('category', filters.category);
    }
    
    const response = await api.get<ApiResponse<Rate[]>>('/rates', { params });
    const rates = response.data.data || [];
    return rates.map(normalizeRate);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get single rate by ID
 */
export const getRateById = async (id: string): Promise<Rate> => {
  try {
    const response = await api.get<ApiResponse<Rate>>(`/rates/${id}`);
    return normalizeRate(response.data.data!);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Create new rate
 */
export const createRate = async (data: CreateRateData): Promise<Rate> => {
  try {
    const response = await api.post<ApiResponse<Rate>>('/rates', data);
    return normalizeRate(response.data.data!);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update rate
 */
export const updateRate = async (id: string, data: UpdateRateData): Promise<Rate> => {
  try {
    const response = await api.put<ApiResponse<Rate>>(`/rates/${id}`, data);
    return normalizeRate(response.data.data!);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Delete rate
 */
export const deleteRate = async (id: string): Promise<void> => {
  try {
    await api.delete(`/rates/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

const rateService = {
  getRates,
  getRateById,
  createRate,
  updateRate,
  deleteRate,
};

export default rateService;