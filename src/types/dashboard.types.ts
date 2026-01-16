


import type { Invoice } from "./invoice.types";
import type { Payment } from "./payment.types";

export interface DashboardStats {
  total_invoiced: number;
  total_paid: number;
  outstanding_balance: number;
  total_clients: number;
  recent_invoices: Invoice[];
  recent_payments: Payment[];
  status_breakdown: StatusBreakdown[];
}

export interface StatusBreakdown {
  _id: string;
  count: number;
  total: number;
}