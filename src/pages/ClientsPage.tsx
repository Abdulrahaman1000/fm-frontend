// ============================================
// Clients Page - COMPLETE WITH CRUD
// ============================================

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useModal } from '../hooks/useModal';
import { useNotification } from '../hooks/useNotification';
import { useApi } from '../hooks/useApi';
import clientService from '../services/clientService';
import type { Client, CreateClientData } from '../types';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import ClientCard from '../components/clients/ClientCard';
import ErrorMessage from '../components/common/ErrorMessage';
import Modal from '../components/common/Modal';
import ClientForm from '../components/clients/ClientForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
// import Header from '@/components/layout/Header';
// import Button from '@/components/common/Button';
// import Input from '@/components/common/Input';
// import Modal from '@/components/common/Modal';
// import ConfirmDialog from '@/components/common/ConfirmDialog';
// import Loading from '@/components/common/Loading';
// import ErrorMessage from '@/components/common/ErrorMessage';
// import ClientCard from '@/components/clients/ClientCard';
// import ClientForm from '@/components/clients/ClientForm';
// import { useApi } from '@/hooks/useApi';
// import { useModal } from '@/hooks/useModal';
// import { useDebounce } from '@/hooks/useDebounce';
// import { useNotification } from '@/hooks/useNotification';
// import clientService from '@/services/clientService';
// import { Client, CreateClientData } from '@/types';

const ClientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const addModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const { success, error: showError } = useNotification();

  // Fetch clients with search
  const { data: clients, loading, error, refetch } = useApi(
    () => clientService.getClients({ search: debouncedSearch }),
    [debouncedSearch]
  );



  // Handle Create Client
  const handleCreate = async (data: CreateClientData) => {
    try {
      setIsSubmitting(true);
      await clientService.createClient(data);
      success('Client added successfully!');
      addModal.close();
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to create client');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

// Helper function to get correct ID
const getClientId = (client: Client): string => {
  return (client as any)._id || client.id;
};

// Handle Update Client
const handleUpdate = async (data: CreateClientData) => {
  if (!selectedClient) return;

  try {
    setIsSubmitting(true);
    const clientId = getClientId(selectedClient);
    console.log('Updating client with ID:', clientId); // Debug log
    await clientService.updateClient(clientId, data);
    success('Client updated successfully!');
    editModal.close();
    setSelectedClient(null);
    refetch();
  } catch (err: any) {
    showError(err.message || 'Failed to update client');
    throw err;
  } finally {
    setIsSubmitting(false);
  }
};

// Handle Delete Client
const handleDelete = async () => {
  if (!clientToDelete) return;

  try {
    setIsSubmitting(true);
    const clientId = getClientId(clientToDelete);
    console.log('Deleting client with ID:', clientId); // Debug log
    await clientService.deleteClient(clientId);
    success('Client deleted successfully!');
    deleteModal.close();
    setClientToDelete(null);
    refetch();
  } catch (err: any) {
    showError(err.message || 'Failed to delete client');
  } finally {
    setIsSubmitting(false);
  }
};



  // Open Edit Modal
  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    editModal.open();
  };

  // Open Delete Dialog
  const openDeleteDialog = (client: Client) => {
    setClientToDelete(client);
    deleteModal.open();
  };

  return (
    <div>
      <Header
        title="Clients"
        subtitle="Manage your clients and customers"
        actions={
          <Button variant="primary" onClick={addModal.open}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        }
      />

      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search clients by company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-5 w-5" />}
          />
        </div>

        {/* Content */}
        {loading ? (
          <Loading message="Loading clients..." />
        ) : error ? (
          <ErrorMessage message={error} retry={refetch} />
        ) : clients && clients.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Clients Yet
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? 'No clients found matching your search.'
                  : 'Get started by adding your first client.'}
              </p>
              {!searchTerm && (
                <Button variant="primary" onClick={addModal.open}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Client
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Clients Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {clients?.length || 0} client{clients?.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients?.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onEdit={openEditModal}
                  onDelete={openDeleteDialog}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={addModal.isOpen}
        onClose={addModal.close}
        title="Add New Client"
        size="md"
      >
        <ClientForm
          onSubmit={handleCreate}
          onCancel={addModal.close}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => {
          editModal.close();
          setSelectedClient(null);
        }}
        title="Edit Client"
        size="md"
      >
        <ClientForm
          client={selectedClient || undefined}
          onSubmit={handleUpdate}
          onCancel={() => {
            editModal.close();
            setSelectedClient(null);
          }}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() => {
          deleteModal.close();
          setClientToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Client"
        message={`Are you sure you want to delete "${clientToDelete?.company_name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default ClientsPage;