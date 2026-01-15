// ============================================
// Dashboard Analytics Service
// ============================================

import api, { handleApiError } from './api';
import { type ApiResponse, type DashboardStats } from '../types';

/**
 * Get dashboard summary stats
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard');
    return response.data.data!;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

const dashboardService = {
  getDashboardStats,
};

export default dashboardService;