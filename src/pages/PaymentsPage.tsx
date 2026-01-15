// ============================================
// Payments Page - Complete Implementation
// ============================================

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { CreatePaymentData, Payment } from '../types';
import { useModal } from '../hooks/useModal';
import { useNotification } from '../hooks/useNotification';
import { useApi } from '../hooks/useApi';
import paymentService from '../services/paymentService';
import invoiceService from '../services/invoiceService';
import { downloadFile } from '../utils/helpers';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import PaymentCard from '../components/payments/PaymentCard';
import Modal from '../components/common/Modal';
import PaymentForm from '../components/payments/PaymentForm';
import PaymentDetails from '../components/payments/PaymentDetails';

const PaymentsPage: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceFilter, setInvoiceFilter] = useState('');

  const createModal = useModal();
  const viewModal = useModal();
  const { success, error: showError } = useNotification();

  // Fetch payments with filter
  const { data: payments, loading, error, refetch } = useApi(
    () => paymentService.getPayments({ invoice_id: invoiceFilter || undefined }),
    [invoiceFilter]
  );

  // Fetch all invoices for form (unpaid only will be filtered in form)
  const { data: invoices, loading: invoicesLoading } = useApi(
    () => invoiceService.getInvoices(),
    []
  );

  // Get payment ID helper
  const getPaymentId = (payment: Payment): string => {
    return (payment as any)._id || payment.id;
  };

  // Handle Record Payment
  const handleCreate = async (data: CreatePaymentData) => {
    try {
      setIsSubmitting(true);
      console.log('Recording payment with data:', data);
      await paymentService.createPayment(data);
      success('Payment recorded successfully!');
      createModal.close();
      refetch();
    } catch (err: any) {
      console.error('Payment recording error:', err);
      showError(err.message || 'Failed to record payment');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Download Receipt PDF
  const handleDownloadPDF = async (payment: Payment) => {
    try {
      const paymentId = getPaymentId(payment);
      const blob = await paymentService.downloadReceiptPDF(paymentId);
      downloadFile(blob, `receipt-${payment.receipt_number.replace(/\//g, '-')}.pdf`);
      success('Receipt downloaded successfully!');
    } catch (err: any) {
      showError(err.message || 'Failed to download receipt');
    }
  };

  // Open View Modal
  const openViewModal = (payment: Payment) => {
    setSelectedPayment(payment);
    viewModal.open();
  };

  // Check if we can record payments
  const canRecordPayment = invoices && invoices.length > 0;

  // Get unpaid invoices count
  const unpaidInvoicesCount = invoices?.filter(
    (inv) => inv.status !== 'paid' && inv.status !== 'cancelled' && inv.outstanding_balance > 0
  ).length || 0;

  return (
    <div>
      <Header
        title="Payments"
        subtitle="Record and manage payment receipts"
        actions={
          <Button
            variant="primary"
            onClick={createModal.open}
            disabled={!canRecordPayment || unpaidInvoicesCount === 0}
            title={
              !canRecordPayment
                ? 'Please create an invoice first'
                : unpaidInvoicesCount === 0
                ? 'No unpaid invoices available'
                : ''
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        }
      />

      <div className="p-6">
        {/* Alert if no invoices */}
        {!invoicesLoading && invoices && invoices.length === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You need to create invoices before recording payments.{' '}
                  <a href="/invoices" className="font-medium underline hover:text-yellow-600">
                    Go to Invoices page
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Alert if no unpaid invoices */}
        {!invoicesLoading && invoices && invoices.length > 0 && unpaidInvoicesCount === 0 && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  All invoices are fully paid! No pending payments at the moment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter by Invoice */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <select
              value={invoiceFilter}
              onChange={(e) => setInvoiceFilter(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Invoices</option>
              {invoices?.map((invoice) => {
                const invoiceId = (invoice as any)._id || invoice.id;
                const clientName =
                  typeof invoice.client_id === 'object' && invoice.client_id !== null
                    ? invoice.client_id.company_name
                    : 'Unknown Client';
                return (
                  <option key={invoiceId} value={invoiceId}>
                    {invoice.invoice_number} - {clientName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <Loading message="Loading payments..." />
        ) : error ? (
          <ErrorMessage message={error} retry={refetch} />
        ) : payments && payments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Payments Yet
              </h3>
              <p className="text-gray-600 mb-6">
                {invoiceFilter
                  ? 'No payments found for this invoice.'
                  : 'Start recording payments to track your revenue.'}
              </p>
              {!invoiceFilter && canRecordPayment && unpaidInvoicesCount > 0 && (
                <Button variant="primary" onClick={createModal.open}>
                  <Plus className="h-4 w-4 mr-2" />
                  Record Your First Payment
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Payments Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {payments?.length || 0} payment{payments?.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Payments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {payments?.map((payment) => (
                <PaymentCard
                  key={getPaymentId(payment)}
                  payment={payment}
                  onView={openViewModal}
                  onDownloadPDF={handleDownloadPDF}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Record Payment"
        size="xl"
      >
        {invoicesLoading ? (
          <Loading message="Loading invoices..." />
        ) : (
          <PaymentForm
            invoices={invoices || []}
            onSubmit={handleCreate}
            onCancel={createModal.close}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      {/* View Payment Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => {
          viewModal.close();
          setSelectedPayment(null);
        }}
        title="Payment Receipt Details"
        size="xl"
      >
        {selectedPayment && <PaymentDetails payment={selectedPayment} />}
      </Modal>
    </div>
  );
};

export default PaymentsPage;