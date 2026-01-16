// ============================================
// Invoices Page - WITH EDIT FUNCTIONALITY
// ============================================

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { CreateInvoiceData, Invoice } from '../types';
import { useModal } from '../hooks/useModal';
import { useNotification } from '../hooks/useNotification';
import { useApi } from '../hooks/useApi';
import invoiceService from '../services/invoiceService';
import clientService from '../services/clientService';
import { downloadFile } from '../utils/helpers';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import InvoiceCard from '../components/invoices/InvoiceCard';
import Modal from '../components/common/Modal';
import InvoiceForm from '../components/invoices/InvoiceForm';
import InvoiceDetails from '../components/invoices/InvoiceDetails';
import ConfirmDialog from '../components/common/ConfirmDialog';

const InvoicesPage: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const createModal = useModal();
  const editModal = useModal();
  const viewModal = useModal();
  const deleteModal = useModal();
  const { success, error: showError } = useNotification();

  // Fetch invoices with filter
  const { data: invoices, loading, error, refetch } = useApi(
    () => invoiceService.getInvoices({ status: statusFilter || undefined }),
    [statusFilter]
  );

  // Fetch clients for form
  const { data: clients, loading: clientsLoading } = useApi(() => clientService.getClients(), []);

  // Debug: Log clients data
  useEffect(() => {
    if (clients) {
      console.log('Clients loaded:', clients.length, 'clients');
      if (clients.length > 0) {
        const firstClient = clients[0];
        const clientId = (firstClient as any)._id || firstClient.id;
        console.log('First client ID:', clientId);
        console.log('First client name:', firstClient.company_name);
      } else {
        console.warn('No clients available. Please add a client first.');
      }
    }
  }, [clients]);

  // Get invoice ID helper
  const getInvoiceId = (invoice: Invoice): string => {
    return (invoice as any)._id || invoice.id;
  };

  // Handle Create Invoice
  const handleCreate = async (data: CreateInvoiceData) => {
    try {
      setIsSubmitting(true);
      console.log('Creating invoice with data:', data);
      await invoiceService.createInvoice(data);
      success('Invoice created successfully!');
      createModal.close();
      refetch();
    } catch (err: any) {
      console.error('Invoice creation error:', err);
      showError(err.message || 'Failed to create invoice');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Invoice
  const handleEdit = async (data: CreateInvoiceData) => {
    if (!invoiceToEdit) return;

    try {
      setIsSubmitting(true);
      const invoiceId = getInvoiceId(invoiceToEdit);
      console.log('Updating invoice with data:', data);
      await invoiceService.updateInvoice(invoiceId, data);
      success('Invoice updated successfully!');
      editModal.close();
      setInvoiceToEdit(null);
      refetch();
    } catch (err: any) {
      console.error('Invoice update error:', err);
      showError(err.message || 'Failed to update invoice');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Invoice
  const handleDelete = async () => {
    if (!invoiceToDelete) return;

    try {
      setIsSubmitting(true);
      const invoiceId = getInvoiceId(invoiceToDelete);
      await invoiceService.deleteInvoice(invoiceId);
      success('Invoice deleted successfully!');
      deleteModal.close();
      setInvoiceToDelete(null);
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to delete invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Download PDF
  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      const invoiceId = getInvoiceId(invoice);
      const blob = await invoiceService.downloadInvoicePDF(invoiceId);
      downloadFile(blob, `invoice-${invoice.invoice_number.replace(/\//g, '-')}.pdf`);
      success('PDF downloaded successfully!');
    } catch (err: any) {
      showError(err.message || 'Failed to download PDF');
    }
  };

  // Open View Modal
  const openViewModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    viewModal.open();
  };

  // Open Edit Modal
  const openEditModal = (invoice: Invoice) => {
    setInvoiceToEdit(invoice);
    editModal.open();
  };

  // Open Delete Dialog
  const openDeleteDialog = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    deleteModal.open();
  };

  // Check if we can create invoices
  const canCreateInvoice = clients && clients.length > 0;

  return (
    <div>
      <Header
        title="Invoices"
        subtitle="Manage invoices and proformas"
        actions={
          <Button 
            variant="primary" 
            onClick={createModal.open}
            disabled={!canCreateInvoice}
            title={!canCreateInvoice ? 'Please add a client first' : ''}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        }
      />

      <div className="p-6">
        {/* Alert if no clients */}
        {!clientsLoading && clients && clients.length === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You need to add at least one client before creating invoices.{' '}
                  <a href="/clients" className="font-medium underline hover:text-yellow-600">
                    Go to Clients page
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <Loading message="Loading invoices..." />
        ) : error ? (
          <ErrorMessage message={error} retry={refetch} />
        ) : invoices && invoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Invoices Yet
              </h3>
              <p className="text-gray-600 mb-6">
                {statusFilter
                  ? 'No invoices found with this status.'
                  : 'Get started by creating your first invoice.'}
              </p>
              {!statusFilter && canCreateInvoice && (
                <Button variant="primary" onClick={createModal.open}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Invoice
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Invoices Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {invoices?.length || 0} invoice{invoices?.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Invoices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invoices?.map((invoice) => (
                <InvoiceCard
                  key={getInvoiceId(invoice)}
                  invoice={invoice}
                  onView={openViewModal}
                  onEdit={openEditModal}
                  onDelete={openDeleteDialog}
                  onDownloadPDF={handleDownloadPDF}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Create New Invoice"
        size="xl"
      >
        {clientsLoading ? (
          <Loading message="Loading clients..." />
        ) : (
          <InvoiceForm
            clients={clients || []}
            onSubmit={handleCreate}
            onCancel={createModal.close}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => {
          editModal.close();
          setInvoiceToEdit(null);
        }}
        title="Edit Invoice"
        size="xl"
      >
        {clientsLoading ? (
          <Loading message="Loading clients..." />
        ) : (
          <InvoiceForm
            clients={clients || []}
            // invoice={invoiceToEdit}
            onSubmit={handleEdit}
            onCancel={() => {
              editModal.close();
              setInvoiceToEdit(null);
            }}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      {/* View Invoice Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => {
          viewModal.close();
          setSelectedInvoice(null);
        }}
        title="Invoice Details"
        size="xl"
      >
        {selectedInvoice && <InvoiceDetails invoice={selectedInvoice} />}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() => {
          deleteModal.close();
          setInvoiceToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice "${invoiceToDelete?.invoice_number}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default InvoicesPage;