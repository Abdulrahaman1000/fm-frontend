// ============================================
// Invoice/Proforma Types with VAT
// ============================================

import type { Client } from "./client.types";

export interface ServiceLine {
  description: string;
  duration?: string;
  daily_slots: number;
  campaign_days: number;
  rate_per_slot: number;
  total_slots?: number;
  line_total?: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string | Client;
  invoice_type: 'proforma' | 'advance_bill';
  invoice_date: Date;
  services: ServiceLine[];
  total_slots: number;
  // NEW VAT FIELDS
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total_amount: number;
  amount_in_words?: string;
  advance_required: number;
  amount_paid: number;
  outstanding_balance: number;
  status: 'draft' | 'pending' | 'partial' | 'paid' | 'cancelled';
  payment_terms?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceData {
  client_id: string;
  invoice_type: 'proforma' | 'advance_bill';
  invoice_date: string;
  services: ServiceLine[];
  vat_rate?: number; // NEW: Optional VAT rate (defaults to 7.5% on backend)
  advance_required?: number;
  payment_terms?: string;
  notes?: string;
}

export interface UpdateInvoiceData {
  client_id?: string;
  invoice_type?: 'proforma' | 'advance_bill';
  invoice_date?: string;
  services?: ServiceLine[];
  vat_rate?: number; // NEW: Optional VAT rate
  advance_required?: number;
  payment_terms?: string;
  notes?: string;
}

export interface InvoiceFilters {
  client_id?: string;
  status?: string;
}