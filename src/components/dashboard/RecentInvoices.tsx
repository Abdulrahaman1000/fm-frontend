// ============================================
// Recent Invoices Component
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Eye } from 'lucide-react';
import type { Invoice } from '../../types';
import { STATUS_COLORS } from '../../utils/constants';
import { cn } from '../../utils/helpers';
import { formatCurrency, formatDate } from '../../utils/formatters';
// import { Invoice } from '@/types';
// import { formatCurrency, formatDate } from '@/utils/formatters';
// import { STATUS_COLORS } from '@/utils/constants';
// import { cn } from '@/utils/helpers';

interface RecentInvoicesProps {
  invoices: Invoice[];
  isLoading?: boolean;
}

const RecentInvoices: React.FC<RecentInvoicesProps> = ({ invoices, isLoading }) => {
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

  const getClientName = (invoice: Invoice) => {
    if (typeof invoice.client_id === 'object' && invoice.client_id !== null) {
      return invoice.client_id.company_name;
    }
    return 'Unknown Client';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
        </div>
        <button
          onClick={() => navigate('/invoices')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {invoices.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No invoices yet</p>
          </div>
        ) : (
          invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/invoices/${invoice.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-gray-900">
                      {invoice.invoice_number}
                    </p>
                    <span
                      className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        STATUS_COLORS[invoice.status]
                      )}
                    >
                      {invoice.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {getClientName(invoice)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(invoice.invoice_date)}
                  </p>
                </div>

                <div className="text-right ml-4">
                  <p className="font-bold text-gray-900">
                    {formatCurrency(invoice.total_amount)}
                  </p>
                  {invoice.outstanding_balance > 0 && (
                    <p className="text-xs text-orange-600 mt-1">
                      Bal: {formatCurrency(invoice.outstanding_balance)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentInvoices;