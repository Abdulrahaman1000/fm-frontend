// ============================================
// Payment Details Component (View Modal)
// ============================================

import React from 'react';
import type { Payment } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { cn } from '../../utils/helpers';

interface PaymentDetailsProps {
  payment: Payment;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment }) => {
  const getInvoiceInfo = () => {
    if (typeof payment.invoice_id === 'object' && payment.invoice_id !== null) {
      return payment.invoice_id;
    }
    return null;
  };

  const getClientInfo = () => {
    const invoice = getInvoiceInfo();
    if (invoice && typeof invoice.client_id === 'object' && invoice.client_id !== null) {
      return invoice.client_id;
    }
    return null;
  };

  const invoice = getInvoiceInfo();
  const client = getClientInfo();

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{payment.receipt_number}</h2>
          <p className="text-sm text-gray-600 mt-1">
            Received on {formatDate(payment.date_received)}
          </p>
        </div>
        <span
          className={cn(
            'px-4 py-2 text-sm font-semibold rounded-full',
            getPaymentMethodColor(payment.payment_method)
          )}
        >
          {payment.payment_method}
        </span>
      </div>

      {/* Client Info */}
      {client && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">CLIENT:</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-semibold text-gray-900">{client.company_name}</p>
            <p className="text-sm text-gray-600 mt-1">{client.address}</p>
            {client.phone && (
              <p className="text-sm text-gray-600 mt-1">Phone: {client.phone}</p>
            )}
            {client.email && (
              <p className="text-sm text-gray-600 mt-1">Email: {client.email}</p>
            )}
          </div>
        </div>
      )}

      {/* Invoice Reference */}
      {invoice && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">INVOICE REFERENCE:</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Invoice Number:</span>
              <span className="font-semibold text-gray-900">{invoice.invoice_number}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Invoice Date:</span>
              <span className="font-medium text-gray-900">{formatDate(invoice.invoice_date)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Invoice Total:</span>
              <span className="font-bold text-gray-900">{formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">PAYMENT DETAILS:</h3>
        <div className="bg-green-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-green-200">
            <span className="text-lg font-medium text-gray-700">Amount Paid:</span>
            <span className="text-3xl font-bold text-green-600">
              {formatCurrency(payment.amount_paid)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payment Method:</span>
              <span className="font-semibold text-gray-900">{payment.payment_method}</span>
            </div>

            {payment.transaction_ref && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transaction Reference:</span>
                <span className="font-medium text-gray-900">{payment.transaction_ref}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Date Received:</span>
              <span className="font-medium text-gray-900">{formatDate(payment.date_received)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Received By:</span>
              <span className="font-medium text-gray-900">
                {payment.received_by}
                {payment.position && ` (${payment.position})`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Tracking */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">BALANCE TRACKING:</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Balance Before Payment:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(payment.invoice_balance_before)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Payment Amount:</span>
            <span className="font-semibold text-green-600">
              - {formatCurrency(payment.amount_paid)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-sm font-semibold text-gray-700">Balance After Payment:</span>
            <span className={cn(
              'text-xl font-bold',
              payment.invoice_balance_after === 0 ? 'text-green-600' : 'text-orange-600'
            )}>
              {formatCurrency(payment.invoice_balance_after)}
            </span>
          </div>
          {payment.invoice_balance_after === 0 && (
            <p className="text-xs text-green-600 font-medium pt-2">
              ✓ Invoice fully paid
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      {payment.notes && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">NOTES:</h3>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            {payment.notes}
          </p>
        </div>
      )}

      {/* Metadata */}
      <div className="pt-4 border-t">
        <p className="text-xs text-gray-500">
          Created: {formatDate(payment.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default PaymentDetails;