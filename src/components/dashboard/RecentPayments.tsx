// ============================================
// Recent Payments Component
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import type { Payment } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
// import { Payment } from '@/types';
// import { formatCurrency, formatDate } from '@/utils/formatters';

interface RecentPaymentsProps {
  payments: Payment[];
  isLoading?: boolean;
}

const RecentPayments: React.FC<RecentPaymentsProps> = ({ payments, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded mb-3" />
        ))}
      </div>
    );
  }

  const getInvoiceNumber = (payment: Payment) => {
    if (typeof payment.invoice_id === 'object' && payment.invoice_id !== null) {
      return payment.invoice_id.invoice_number;
    }
    return 'N/A';
  };

  const getClientName = (payment: Payment) => {
    if (
      typeof payment.invoice_id === 'object' &&
      payment.invoice_id !== null &&
      typeof payment.invoice_id.client_id === 'object' &&
      payment.invoice_id.client_id !== null
    ) {
      return payment.invoice_id.client_id.company_name;
    }
    return 'Unknown';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
        </div>
        <button
          onClick={() => navigate('/payments')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {payments.length === 0 ? (
          <div className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No payments yet</p>
          </div>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-gray-900">
                      {payment.receipt_number}
                    </p>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {payment.payment_method}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {getClientName(payment)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Invoice: {getInvoiceNumber(payment)} • {formatDate(payment.date_received)}
                  </p>
                </div>

                <div className="text-right ml-4">
                  <p className="font-bold text-green-600">
                    +{formatCurrency(payment.amount_paid)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    By: {payment.received_by}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentPayments;