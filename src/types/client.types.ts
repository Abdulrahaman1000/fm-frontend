// ============================================
// Client Management Types
// ============================================

export interface Client {
  id: string;
  company_name: string;
  address: string;
  phone?: string;
  email?: string;
  total_invoiced: number;
  total_paid: number;
  outstanding_balance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientData {
  company_name: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface UpdateClientData {
  company_name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface ClientFilters {
  search?: string;
}