// ============================================
// Client Management Service - COMPLETE FIXED
// ============================================

import type { ApiResponse, Client, ClientFilters, CreateClientData, UpdateClientData } from '../types';
import api, { handleApiError } from './api';
// import { 
//   Client, 
//   CreateClientData, 
//   UpdateClientData, 
//   ClientFilters,
//   ApiResponse 
// } from '@/types';

// Helper function to normalize MongoDB response
const normalizeClient = (client: any): Client => {
  const id = client._id || client.id;
  return {
    ...client,
    id: id,
    _id: id, // Keep _id for MongoDB compatibility
  };
};

/**
 * Get all clients with optional search
 */
export const getClients = async (filters?: ClientFilters): Promise<Client[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.search) {
      params.append('search', filters.search);
    }
    
    const response = await api.get<ApiResponse<Client[]>>('/clients', { params });
    const clients = response.data.data || [];
    return clients.map(normalizeClient);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get single client by ID
 */
export const getClientById = async (id: string): Promise<Client> => {
  try {
    const response = await api.get<ApiResponse<Client>>(`/clients/${id}`);
    return normalizeClient(response.data.data!);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Create new client
 */
export const createClient = async (data: CreateClientData): Promise<Client> => {
  try {
    const response = await api.post<ApiResponse<Client>>('/clients', data);
    return normalizeClient(response.data.data!);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update client
 */
export const updateClient = async (id: string, data: UpdateClientData): Promise<Client> => {
  try {
    const response = await api.put<ApiResponse<Client>>(`/clients/${id}`, data);
    return normalizeClient(response.data.data!);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Delete client
 */
export const deleteClient = async (id: string): Promise<void> => {
  try {
    await api.delete(`/clients/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

const clientService = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};

export default clientService;

