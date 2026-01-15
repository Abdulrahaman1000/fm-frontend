// ============================================
// Payment Form Component
// ============================================

import React, { useState, useEffect } from 'react';
import type { Invoice, CreatePaymentData } from '../../types';
import { formatCurrency, formatDateForAPI } from '../../utils/formatters';
import Input from '../common/Input';
import Button from '../common/Button';
import { AlertCircle } from 'lucide-react';

interface PaymentFormProps {
  invoices: Invoice[];
  onSubmit: (data: CreatePaymentData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  invoices,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreatePaymentData>({
    invoice_id: '',
    amount_paid: 0,
    payment_method: 'Bank Transfer',
    transaction_ref: '',
    date_received: formatDateForAPI(new Date()),
    received_by: '',
    position: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Helper to get invoice ID
  const getInvoiceId = (invoice: Invoice): string => {
    return (invoice as any)._id || invoice.id;
  };

  // Get client name from invoice
  const getClientName = (invoice: Invoice): string => {
    if (typeof invoice.client_id === 'object' && invoice.client_id !== null) {
      return invoice.client_id.company_name;
    }
    return 'Unknown Client';
  };

  // Filter unpaid invoices
  const unpaidInvoices = invoices.filter(
    (inv) => inv.status !== 'paid' && inv.status !== 'cancelled' && inv.outstanding_balance > 0
  );

  // Handle invoice selection
  useEffect(() => {
    if (formData.invoice_id) {
      const invoice = unpaidInvoices.find((inv) => getInvoiceId(inv) === formData.invoice_id);
      setSelectedInvoice(invoice || null);
      
      // Auto-fill amount with outstanding balance
      if (invoice && formData.amount_paid === 0) {
        setFormData((prev) => ({
          ...prev,
          amount_paid: invoice.outstanding_balance,
        }));
      }
    } else {
      setSelectedInvoice(null);
    }
  }, [formData.invoice_id]);

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.invoice_id) {
      newErrors.invoice_id = 'Please select an invoice';
    }

    if (!formData.amount_paid || formData.amount_paid <= 0) {
      newErrors.amount_paid = 'Amount must be greater than 0';
    }

    if (selectedInvoice && formData.amount_paid > selectedInvoice.outstanding_balance) {
      newErrors.amount_paid = `Amount cannot exceed outstanding balance (${formatCurrency(selectedInvoice.outstanding_balance)})`;
    }

    if (!formData.received_by.trim()) {
      newErrors.received_by = 'Receiver name is required';
    }

    if (formData.payment_method !== 'Cash' && !formData.transaction_ref?.trim()) {
      newErrors.transaction_ref = 'Transaction reference is required for this payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    console.log('Submitting payment data:', formData);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert if no unpaid invoices */}
      {unpaidInvoices.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm text-yellow-700">
                No unpaid invoices available. All invoices are either paid or cancelled.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Invoice <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.invoice_id}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, invoice_id: e.target.value, amount_paid: 0 }));
            if (errors.invoice_id) {
              const newErrors = { ...errors };
              delete newErrors.invoice_id;
              setErrors(newErrors);
            }
          }}
          disabled={isLoading || unpaidInvoices.length === 0}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">Choose an invoice</option>
          {unpaidInvoices.map((invoice) => {
            const invoiceId = getInvoiceId(invoice);
            return (
              <option key={invoiceId} value={invoiceId}>
                {invoice.invoice_number} - {getClientName(invoice)} - Outstanding: {formatCurrency(invoice.outstanding_balance)}
              </option>
            );
          })}
        </select>
        {errors.invoice_id && <p className="mt-1 text-sm text-red-600">{errors.invoice_id}</p>}
      </div>

      {/* Selected Invoice Info */}
      {selectedInvoice && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-3">Invoice Details:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Number:</span>
              <span className="font-medium text-gray-900">{selectedInvoice.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Client:</span>
              <span className="font-medium text-gray-900">{getClientName(selectedInvoice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(selectedInvoice.total_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Already Paid:</span>
              <span className="font-semibold text-green-600">{formatCurrency(selectedInvoice.amount_paid)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-blue-200">
              <span className="text-gray-700 font-medium">Outstanding Balance:</span>
              <span className="font-bold text-orange-600">{formatCurrency(selectedInvoice.outstanding_balance)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Payment Amount */}
      <div>
        <Input
          label="Amount Paid (₦)"
          type="number"
          value={formData.amount_paid}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, amount_paid: parseFloat(e.target.value) || 0 }));
            if (errors.amount_paid) {
              const newErrors = { ...errors };
              delete newErrors.amount_paid;
              setErrors(newErrors);
            }
          }}
          min="0"
          step="0.01"
          required
          disabled={isLoading || !formData.invoice_id}
          error={errors.amount_paid}
        />
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Method <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.payment_method}
          onChange={(e) => setFormData((prev) => ({ ...prev, payment_method: e.target.value as any }))}
          disabled={isLoading}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
          <option value="POS">POS</option>
          <option value="Cheque">Cheque</option>
        </select>
      </div>

      {/* Transaction Reference */}
      <div>
        <Input
          label={`Transaction Reference ${formData.payment_method !== 'Cash' ? '*' : '(Optional)'}`}
          value={formData.transaction_ref}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, transaction_ref: e.target.value }));
            if (errors.transaction_ref) {
              const newErrors = { ...errors };
              delete newErrors.transaction_ref;
              setErrors(newErrors);
            }
          }}
          placeholder="e.g., TRF-20260109-001"
          disabled={isLoading}
          error={errors.transaction_ref}
        />
      </div>

      {/* Date and Receiver */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date Received"
          type="date"
          value={formData.date_received}
          onChange={(e) => setFormData((prev) => ({ ...prev, date_received: e.target.value }))}
          required
          disabled={isLoading}
        />

        <Input
          label="Received By"
          value={formData.received_by}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, received_by: e.target.value }));
            if (errors.received_by) {
              const newErrors = { ...errors };
              delete newErrors.received_by;
              setErrors(newErrors);
            }
          }}
          placeholder="e.g., Aisha Mohammed"
          required
          disabled={isLoading}
          error={errors.received_by}
        />
      </div>

      {/* Position */}
      <div>
        <Input
          label="Position (Optional)"
          value={formData.position}
          onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
          placeholder="e.g., Accounts Officer"
          disabled={isLoading}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          rows={3}
          placeholder="Additional notes about this payment"
          disabled={isLoading}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      {/* Payment Preview */}
      {selectedInvoice && formData.amount_paid > 0 && (
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <h4 className="font-semibold text-gray-900 mb-3">Payment Summary:</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Payment Amount:</span>
              <span className="text-xl font-bold text-green-600">{formatCurrency(formData.amount_paid)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Remaining Balance:</span>
              <span className="text-lg font-bold text-orange-600">
                {formatCurrency(Math.max(0, selectedInvoice.outstanding_balance - formData.amount_paid))}
              </span>
            </div>
            {formData.amount_paid >= selectedInvoice.outstanding_balance && (
              <p className="text-sm text-green-600 font-medium pt-2 border-t border-green-200">
                ✓ This will fully pay the invoice
              </p>
            )}
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={unpaidInvoices.length === 0}
          fullWidth
        >
          Record Payment
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;