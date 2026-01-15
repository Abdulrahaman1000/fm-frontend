// ============================================
// Station Configuration Service
// ============================================

import type { ApiResponse, Station, UpdateStationData } from '../types';
import api, { handleApiError } from './api';
// import { Station, UpdateStationData, ApiResponse } from '@/types';

/**
 * Get station details
 */
export const getStation = async (): Promise<Station> => {
  try {
    const response = await api.get<ApiResponse<Station>>('/station');
    return response.data.data!;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update station details
 */
export const updateStation = async (data: UpdateStationData): Promise<Station> => {
  try {
    const response = await api.put<ApiResponse<Station>>('/station', data);
    return response.data.data!;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

const stationService = {
  getStation,
  updateStation,
};

export default stationService;