// ============================================
// Payment Card Component
// ============================================

import React from 'react';
import { Receipt, Download, Eye, Calendar, CreditCard } from 'lucide-react';
import type { Payment } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { cn } from '../../utils/helpers';
import Button from '../common/Button';

interface PaymentCardProps {
  payment: Payment;
  onView: (payment: Payment) => void;
  onDownloadPDF: (payment: Payment) => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onView,
  onDownloadPDF,
}) => {
  const getInvoiceInfo = () => {
    if (typeof payment.invoice_id === 'object' && payment.invoice_id !== null) {
      return payment.invoice_id;
    }
    return null;
  };

  const getClientName = () => {
    const invoice = getInvoiceInfo();
    if (invoice && typeof invoice.client_id === 'object' && invoice.client_id !== null) {
      return invoice.client_id.company_name;
    }
    return 'Unknown Client';
  };

  const invoice = getInvoiceInfo();

  // Payment method colors
  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'Cash':
        return 'bg-green-100 text-green-800';
      case 'Bank Transfer':
        return 'bg-blue-100 text-blue-800';
      case 'POS':
        return 'bg-purple-100 text-purple-800';
      case 'Cheque':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">
              {payment.receipt_number}
            </h3>
          </div>
          <p className="text-gray-600 font-medium">{getClientName()}</p>
          {invoice && (
            <p className="text-sm text-gray-500 mt-1">
              Invoice: {invoice.invoice_number}
            </p>
          )}
        </div>

        <span
          className={cn(
            'px-3 py-1 text-xs font-semibold rounded-full',
            getPaymentMethodColor(payment.payment_method)
          )}
        >
          {payment.payment_method}
        </span>
      </div>

      {/* Payment Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Received: {formatDate(payment.date_received)}</span>
        </div>
        
        {payment.transaction_ref && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard className="h-4 w-4" />
            <span>Ref: {payment.transaction_ref}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Received By:</span>
          <span className="font-medium text-gray-900">
            {payment.received_by}
            {payment.position && ` (${payment.position})`}
          </span>
        </div>
      </div>

      {/* Financial Info */}
      <div className="bg-green-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600">Amount Paid:</span>
          <span className="text-2xl font-bold text-green-600">
            {formatCurrency(payment.amount_paid)}
          </span>
        </div>
        
        <div className="pt-3 border-t border-green-200 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Balance Before:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(payment.invoice_balance_before)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Balance After:</span>
            <span className={cn(
              'font-bold',
              payment.invoice_balance_after === 0 ? 'text-green-600' : 'text-orange-600'
            )}>
              {formatCurrency(payment.invoice_balance_after)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {payment.notes && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Note:</span> {payment.notes}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(payment)}
          fullWidth
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownloadPDF(payment)}
          fullWidth
        >
          <Download className="h-4 w-4 mr-1" />
          Receipt
        </Button>
      </div>
    </div>
  );
};

export default PaymentCard;