// ============================================
// Station Configuration Types
// ============================================

export interface Station {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  logo_url?: string;
  invoice_prefix?: string;
  invoice_counter?: number;
  receipt_prefix?: string;
  receipt_counter?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateStationData {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  logo_url?: string;
  invoice_prefix?: string;
  receipt_prefix?: string;
}