
// import { Invoice } from './invoice.types';

import type { Invoice } from "./invoice.types";

export interface Payment {
  id: string;
  invoice_id: string | Invoice;
  receipt_number: string;
  amount_paid: number;
  payment_method: 'Cash' | 'Bank Transfer' | 'POS' | 'Cheque';
  transaction_ref?: string;
  date_received: Date;
  received_by: string;
  position?: string;
  notes?: string;
  invoice_balance_before: number;
  invoice_balance_after: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentData {
  invoice_id: string;
  amount_paid: number;
  payment_method: 'Cash' | 'Bank Transfer' | 'POS' | 'Cheque';
  transaction_ref?: string;
  date_received: string;
  received_by: string;
  position?: string;
  notes?: string;
}

export interface PaymentFilters {
  invoice_id?: string;
}