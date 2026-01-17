// ============================================
// Invoice Details Component with VAT Display
// ============================================

import React from 'react';
import type { Invoice } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { STATUS_COLORS } from '../../utils/constants';
import { cn } from '../../utils/helpers';

interface InvoiceDetailsProps {
  invoice: Invoice;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice }) => {
  const getClientInfo = () => {
    if (typeof invoice.client_id === 'object' && invoice.client_id !== null) {
      return invoice.client_id;
    }
    return null;
  };

  const client = getClientInfo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{invoice.invoice_number}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(invoice.invoice_date)}
          </p>
        </div>
        <span
          className={cn(
            'px-4 py-2 text-sm font-semibold rounded-full',
            STATUS_COLORS[invoice.status]
          )}
        >
          {invoice.status.toUpperCase()}
        </span>
      </div>

      {/* Client Info */}
      {client && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">BILL TO:</h3>
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

      {/* Invoice Type */}
      <div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Invoice Type:</span>
          <span className="font-medium text-gray-900">
            {invoice.invoice_type === 'proforma' ? 'Proforma Invoice' : 'Advance Bill'}
          </span>
        </div>
      </div>

      {/* Services Table */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">SERVICES:</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Duration
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Daily Slots
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Days
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Rate
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.services.map((service, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {service.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">
                    {service.duration || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">
                    {service.daily_slots}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">
                    {service.campaign_days}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatCurrency(service.rate_per_slot)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                    {formatCurrency(service.line_total || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals with VAT - UPDATED */}
      <div className="bg-blue-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">Total Slots:</span>
          <span className="font-semibold text-gray-900">{invoice.total_slots}</span>
        </div>
        
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">Subtotal:</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(invoice.subtotal)}
          </span>
        </div>

        {/* VAT */}
        <div className="flex justify-between items-center pb-2 border-b border-blue-200">
          <span className="text-sm text-gray-700">VAT ({invoice.vat_rate}%):</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(invoice.vat_amount)}
          </span>
        </div>

        {/* Total Amount Payable */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-base font-bold text-gray-900">Total Amount Payable:</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatCurrency(invoice.total_amount)}
          </span>
        </div>

        {invoice.amount_in_words && (
          <p className="text-xs text-gray-600 italic pt-2 border-t border-blue-200">
            Amount in Words: {invoice.amount_in_words}
          </p>
        )}
      </div>

      {/* Payment Status */}
      {invoice.amount_paid > 0 && (
        <div className="bg-green-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Amount Paid:</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(invoice.amount_paid)}
            </span>
          </div>
          {invoice.outstanding_balance > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Outstanding Balance:</span>
              <span className="font-bold text-orange-600">
                {formatCurrency(invoice.outstanding_balance)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Payment Terms */}
      {invoice.payment_terms && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">PAYMENT TERMS:</h3>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            {invoice.payment_terms}
          </p>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">NOTES:</h3>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            {invoice.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;