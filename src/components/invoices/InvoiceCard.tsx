// ============================================
// Invoice Card Component
// ============================================

import React from 'react';
import { FileText, Download, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import type { Invoice } from '../../types';
import { STATUS_COLORS } from '../../utils/constants';
import { formatCurrency, formatDate, formatStatus } from '../../utils/formatters';
import { cn } from '../../utils/helpers';
import Button from '../common/Button';
// import { Invoice } from '@/types';
// import { formatCurrency, formatDate, formatStatus } from '@/utils/formatters';
// import { STATUS_COLORS } from '@/utils/constants';
// import Button from '@/components/common/Button';
// import { cn } from '@/utils/helpers';

interface InvoiceCardProps {
  invoice: Invoice;
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onDownloadPDF: (invoice: Invoice) => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onView,
  onEdit,
  onDelete,
  onDownloadPDF,
}) => {
  const getClientName = () => {
    if (typeof invoice.client_id === 'object' && invoice.client_id !== null) {
      return invoice.client_id.company_name;
    }
    return 'Unknown Client';
  };

  const getInvoiceId = (invoice: Invoice): string => {
    return (invoice as any)._id || invoice.id;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">
              {invoice.invoice_number}
            </h3>
          </div>
          <p className="text-gray-600 font-medium">{getClientName()}</p>
        </div>

        <span
          className={cn(
            'px-3 py-1 text-xs font-semibold rounded-full',
            STATUS_COLORS[invoice.status]
          )}
        >
          {formatStatus(invoice.status)}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Date: {formatDate(invoice.invoice_date)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Type:</span>
          <span className="font-medium text-gray-900">
            {invoice.invoice_type === 'proforma' ? 'Proforma' : 'Advance Bill'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Slots:</span>
          <span className="font-medium text-gray-900">{invoice.total_slots}</span>
        </div>
      </div>

      {/* Financial Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Total Amount:</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(invoice.total_amount)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Amount Paid:</span>
          <span className="text-sm font-semibold text-green-600">
            {formatCurrency(invoice.amount_paid)}
          </span>
        </div>
        {invoice.outstanding_balance > 0 && (
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Outstanding:</span>
            <span className="text-lg font-bold text-orange-600">
              {formatCurrency(invoice.outstanding_balance)}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(invoice)}
          fullWidth
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownloadPDF(invoice)}
          fullWidth
        >
          <Download className="h-4 w-4 mr-1" />
          PDF
        </Button>
        {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(invoice)}
              fullWidth
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(invoice)}
              fullWidth
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceCard;